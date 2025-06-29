package handlers

import (
	"errors"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/ch00z00/kotobalize/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateWriting - Create a new writing record and trigger AI review
func (c *Container) CreateWriting(ctx *gin.Context) {
	// Get user ID from the context (set by the auth middleware)
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"code": "UNAUTHORIZED", "message": "User ID not found in token"})
		return
	}

	// Bind the incoming JSON to the NewWritingRequest struct
	var req models.NewWritingRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"code": "INVALID_INPUT", "message": err.Error()})
		return
	}

	// Check if the theme exists
	var theme models.GormTheme
	if err := c.DB.First(&theme, req.ThemeID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"code": "THEME_NOT_FOUND", "message": "Theme not found"})
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
		ctx.JSON(http.StatusInternalServerError, gin.H{"code": "DATABASE_ERROR", "message": "Failed to create writing"})
		return
	}

	// Map GORM model to API model for the response
	apiWriting := mapGormWritingToAPI(newWriting)

	ctx.JSON(http.StatusCreated, apiWriting)
}

// ReviewWriting - Trigger AI review for a writing
// TODO: Fix this function using OpenAI API
func (c *Container) ReviewWriting(ctx *gin.Context) {
	// Get user ID from the context (set by the auth middleware)
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"code": "UNAUTHORIZED", "message": "User ID not found in token"})
		return
	}

	// Bind the incoming JSON to the NewReviewRequest struct
	var req models.NewReviewRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"code": "INVALID_INPUT", "message": err.Error()})
		return
	}

	// Find the writing record in the database
	var gormWriting models.GormWriting
	if err := c.DB.First(&gormWriting, req.WritingID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"code": "WRITING_NOT_FOUND", "message": "Writing not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"code": "DATABASE_ERROR", "message": "Failed to fetch writing"})
		return
	}

	// Authorization check: Ensure the writing belongs to the authenticated user
	if gormWriting.UserID != userID.(uint) {
		ctx.JSON(http.StatusForbidden, gin.H{"code": "FORBIDDEN", "message": "You do not have permission to review this writing"})
		return
	}

	// --- Simulate AI Review Process ---
	// In a real application, this would be an asynchronous call to an AI service (e.g., OpenAI API).
	// For this simulation, we'll generate random feedback and a score.
	rand.New(rand.NewSource(time.Now().UnixNano()))
	score := rand.Intn(51) + 50 // Random score between 50 and 100
	overallFeedback := "全体的によく書けていますが、結論をもう少し明確にすると、より説得力が増すでしょう。"
	clarityFeedback := "専門用語の使い方が的確で、非常に分かりやすいです。"
	accuracyFeedback := "技術的な記述に誤りは見られません。正確性が高いです。"
	completenessFeedback := "背景の説明が少し不足しています。前提知識がない読者にも伝わるよう、補足すると良いでしょう。"
	structureFeedback := "序論、本論、結論の構成がしっかりしており、論理的な流れが作れています。"
	concisenessFeedback := "冗長な表現がなく、簡潔にまとめられています。"

	gormWriting.AiScore = &score
	gormWriting.AiFeedbackOverall = &overallFeedback
	gormWriting.AiFeedbackClarity = &clarityFeedback
	gormWriting.AiFeedbackAccuracy = &accuracyFeedback
	gormWriting.AiFeedbackCompleteness = &completenessFeedback
	gormWriting.AiFeedbackStructure = &structureFeedback
	gormWriting.AiFeedbackConciseness = &concisenessFeedback

	// Save the updated writing record to the database
	if err := c.DB.Save(&gormWriting).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"code": "DATABASE_ERROR", "message": "Failed to save AI review"})
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
		ctx.JSON(http.StatusBadRequest, gin.H{"code": "INVALID_INPUT", "message": "Invalid writing ID format"})
		return
	}

	// Get user ID from the context (set by the auth middleware)
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"code": "UNAUTHORIZED", "message": "User ID not found in token"})
		return
	}

	// Find the writing record in the database, ensuring it belongs to the authenticated user.
	var gormWriting models.GormWriting
	if err := c.DB.Where("id = ? AND user_id = ?", writingID, userID).First(&gormWriting).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"code": "WRITING_NOT_FOUND", "message": "Writing not found or you don't have permission to view it"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"code": "DATABASE_ERROR", "message": "Failed to fetch writing"})
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
		ctx.JSON(http.StatusUnauthorized, gin.H{"code": "UNAUTHORIZED", "message": "User ID not found in token"})
		return
	}

	// Find all writings for the authenticated user, ordered by most recent
	var gormWritings []models.GormWriting
	if err := c.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&gormWritings).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"code": "DATABASE_ERROR", "message": "Failed to fetch writings"})
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
	if gormWriting.AiScore != nil {
		apiWriting.AiScore = int32(*gormWriting.AiScore)
	}
	if gormWriting.AiFeedbackOverall != nil {
		apiWriting.AiFeedbackOverall = *gormWriting.AiFeedbackOverall
	}
	if gormWriting.AiFeedbackClarity != nil {
		apiWriting.AiFeedbackClarity = *gormWriting.AiFeedbackClarity
	}
	if gormWriting.AiFeedbackAccuracy != nil {
		apiWriting.AiFeedbackAccuracy = *gormWriting.AiFeedbackAccuracy
	}
	if gormWriting.AiFeedbackCompleteness != nil {
		apiWriting.AiFeedbackCompleteness = *gormWriting.AiFeedbackCompleteness
	}
	if gormWriting.AiFeedbackStructure != nil {
		apiWriting.AiFeedbackStructure = *gormWriting.AiFeedbackStructure
	}
	if gormWriting.AiFeedbackConciseness != nil {
		apiWriting.AiFeedbackConciseness = *gormWriting.AiFeedbackConciseness
	}

	return apiWriting
}
