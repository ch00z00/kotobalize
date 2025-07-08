package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/ch00z00/kotobalize/models"
	"github.com/ch00z00/kotobalize/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateWriting - Create a new writing record and trigger AI review
func (c *Container) CreateWriting(ctx *gin.Context) {
	// Get user ID from the context (set by the auth middleware)
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User ID not found in token"})
		return
	}

	// Bind the incoming JSON to the NewWritingRequest struct
	var req models.NewWritingRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: err.Error()})
		return
	}

	// Check if the theme exists
	var theme models.GormTheme
	if err := c.DB.First(&theme, req.ThemeID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, models.APIError{Code: "THEME_NOT_FOUND", Message: "Theme not found"})
		return
	}

	// Create the new writing record
	newWriting := models.GormWriting{
		UserID:          userID.(uint),
		ThemeID:         uint(req.ThemeID),
		Content:         req.Content,
		DurationSeconds: int(req.DurationSeconds),
	}

	if err := c.DB.Create(&newWriting).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to create writing"})
		return
	}

	// Map GORM model to API model for the response
	apiWriting := mapGormWritingToAPI(newWriting)

	ctx.JSON(http.StatusCreated, apiWriting)
}

// ReviewWriting - Trigger AI review for a writing
func (c *Container) ReviewWriting(ctx *gin.Context) {
	// Get user ID from the context (set by the auth middleware)
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User ID not found in token"})
		return
	}

	// Bind the incoming JSON to the NewReviewRequest struct
	var req models.NewReviewRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: err.Error()})
		return
	}

	// Find the writing record in the database
	var gormWriting models.GormWriting
	if err := c.DB.Preload("Theme").First(&gormWriting, req.WritingID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, models.APIError{Code: "WRITING_NOT_FOUND", Message: "Writing not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to fetch writing"})
		return
	}

	// Authorization check: Ensure the writing belongs to the authenticated user
	if gormWriting.UserID != userID.(uint) {
		ctx.JSON(http.StatusForbidden, models.APIError{Code: "FORBIDDEN", Message: "You do not have permission to review this writing"})
		return
	}

	// --- Call OpenAI API for review ---
	openAIService := services.OpenAIService{Client: c.OpenAIClient}
	aiResponse, err := openAIService.GetAIReview(ctx.Request.Context(), gormWriting.Theme.Title, gormWriting.Content)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "AI_SERVICE_ERROR", Message: "Failed to get AI review: " + err.Error()})
		return
	}

	// Update the writing record with the AI's feedback
	feedbackJSON, err := json.Marshal(aiResponse)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "INTERNAL_ERROR", Message: "Failed to serialize AI response"})
		return
	}

	// Update the GORM model with the new score and the full JSON feedback
	gormWriting.AIScore = &aiResponse.TotalScore
	gormWriting.AIFeedback = feedbackJSON

	// Save the updated writing record to the database
	if err := c.DB.Save(&gormWriting).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to save AI review"})
		return
	}

	// Return the updated writing record
	ctx.JSON(http.StatusOK, mapGormWritingToAPI(gormWriting))
}

// GetWritingByID - Get details of a specific writing record by ID
func (c *Container) GetWritingByID(ctx *gin.Context) {
	// Get writingId from path parameter
	writingIDStr := ctx.Param("writingId")
	writingID, err := strconv.ParseUint(writingIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: "Invalid writing ID format"})
		return
	}

	// Get user ID from the context (set by the auth middleware)
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User ID not found in token"})
		return
	}

	// Find the writing record in the database, ensuring it belongs to the authenticated user.
	var gormWriting models.GormWriting
	if err := c.DB.Where("id = ? AND user_id = ?", writingID, userID).First(&gormWriting).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, models.APIError{Code: "WRITING_NOT_FOUND", Message: "Writing not found or you don't have permission to view it"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to fetch writing"})
		return
	}

	// Map GORM model to API model for the response and return it
	ctx.JSON(http.StatusOK, mapGormWritingToAPI(gormWriting))
}

// ListUserWritings - Get a list of all writings for the authenticated user
func (c *Container) ListUserWritings(ctx *gin.Context) {
	// Get user ID from the context (set by the auth middleware)
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User ID not found in token"})
		return
	}

	// Find all writings for the authenticated user, ordered by most recent
	var gormWritings []models.GormWriting
	if err := c.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&gormWritings).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to fetch writings"})
		return
	}

	// Map GORM writings to API writings
	apiWritings := make([]models.Writing, len(gormWritings))
	for i, w := range gormWritings {
		apiWritings[i] = mapGormWritingToAPI(w)
	}

	ctx.JSON(http.StatusOK, apiWritings)
}

// mapGormWritingToAPI converts a GORM writing model to an API writing model.
func mapGormWritingToAPI(gormWriting models.GormWriting) models.Writing {
	apiWriting := models.Writing{
		ID:              int64(gormWriting.ID),
		UserID:          int64(gormWriting.UserID),
		ThemeID:         int64(gormWriting.ThemeID),
		Content:         gormWriting.Content,
		DurationSeconds: int32(gormWriting.DurationSeconds),
		CreatedAt:       gormWriting.CreatedAt,
		UpdatedAt:       gormWriting.UpdatedAt,
	}

	// Safely handle nullable fields. If the DB value is nil, the API model's
	// value will be the zero value (0 for int32, "" for string), and `omitempty`
	// will prevent it from being serialized into the JSON response.
	if gormWriting.AIScore != nil {
		apiWriting.AiScore = int32(*gormWriting.AIScore)
	}
	if gormWriting.AIFeedback != nil {
		apiWriting.AiFeedback = string(gormWriting.AIFeedback)
	}

	return apiWriting
}
