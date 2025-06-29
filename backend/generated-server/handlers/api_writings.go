package handlers

import (
	"net/http"

	"github.com/ch00z00/kotobalize/models"
	"github.com/gin-gonic/gin"
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
func (c *Container) ReviewWriting(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, models.HelloWorld{
		Message: "Hello World from ReviewWriting",
	})
}

// GetWritingByID - Get details of a specific writing record by ID
func (c *Container) GetWritingByID(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, models.HelloWorld{
		Message: "Hello World from GetWritingByID",
	})
}

// ListUserWritings - Get a list of all writings for the authenticated user
func (c *Container) ListUserWritings(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, models.HelloWorld{
		Message: "Hello World from ListUserWritings",
	})
}

// mapGormWritingToAPI converts a GORM writing model to an API writing model.
func mapGormWritingToAPI(gormWriting models.GormWriting) models.Writing {
	// Helper function to convert *int to *int32 for nullable fields
	toInt32Ptr := func(i *int) *int32 {
		if i == nil {
			return nil
		}
		v := int32(*i)
		return &v
	}

	return models.Writing{
		ID:                     int64(gormWriting.ID),
		UserID:                 int64(gormWriting.UserID),
		ThemeID:                int64(gormWriting.ThemeID),
		Content:                gormWriting.Content,
		DurationSeconds:        int32(gormWriting.DurationSeconds),
		AiScore:                *toInt32Ptr(gormWriting.AiScore),
		AiFeedbackOverall:      *gormWriting.AiFeedbackOverall,
		AiFeedbackClarity:      *gormWriting.AiFeedbackClarity,
		AiFeedbackAccuracy:     *gormWriting.AiFeedbackAccuracy,
		AiFeedbackCompleteness: *gormWriting.AiFeedbackCompleteness,
		AiFeedbackStructure:    *gormWriting.AiFeedbackStructure,
		AiFeedbackConciseness:  *gormWriting.AiFeedbackConciseness,
		CreatedAt:              gormWriting.CreatedAt,
		UpdatedAt:              gormWriting.UpdatedAt,
	}
}
