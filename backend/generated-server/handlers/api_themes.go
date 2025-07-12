package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/ch00z00/kotobalize/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ListThemes - Get a list of all available themes
func (c *Container) ListThemes(ctx *gin.Context) {
	var gormThemes []models.GormTheme
	if err := c.DB.Find(&gormThemes).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to fetch themes"})
		return
	}

	// Map GORM themes to API themes
	apiThemes := make([]models.Theme, len(gormThemes))
	for i, t := range gormThemes {
		apiThemes[i] = mapGormThemeToAPI(t)
	}

	ctx.JSON(http.StatusOK, apiThemes)
}

// GetThemeByID - Get details of a specific theme by ID
func (c *Container) GetThemeByID(ctx *gin.Context) {
	// Get themeId from path parameter
	themeIDStr := ctx.Param("themeId")
	themeID, err := strconv.ParseUint(themeIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: "Invalid theme ID format"})
		return
	}

	// Find the theme in the database
	var gormTheme models.GormTheme
	if err := c.DB.First(&gormTheme, themeID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, models.APIError{Code: "THEME_NOT_FOUND", Message: "Theme not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to fetch theme"})
		return
	}

	// Map GORM model to API model for the response and return it
	ctx.JSON(http.StatusOK, mapGormThemeToAPI(gormTheme))
}

// CreateTheme - Create a new theme record
func (c *Container) CreateTheme(ctx *gin.Context) {
	// Get user ID from the context, which is set by the authentication middleware.
	userIDVal, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User not authenticated"})
		return
	}

	userID, ok := userIDVal.(uint)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "INTERNAL_ERROR", Message: "Invalid user ID type in context"})
		return
	}

	// Bind the incoming JSON to the NewThemeRequest struct (API Model).
	var req models.NewThemeRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "BAD_REQUEST", Message: "Invalid request body: " + err.Error()})
		return
	}

	// Create a new GORM theme record (DB Model).
	gormTheme := models.GormTheme{
		Title:              req.Title,
		Description:        req.Description,
		Category:           req.Category,
		TimeLimitInSeconds: req.TimeLimitInSeconds,
		CreatorID:          userID,
	}

	// Save the new theme to the database.
	if result := c.DB.Create(&gormTheme); result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to save theme to database"})
		return
	}

	// Return the newly created theme, converting it to the API model for the response.
	ctx.JSON(http.StatusCreated, mapGormThemeToAPI(gormTheme))
}

// UpdateTheme - Update an existing theme
func (c *Container) UpdateTheme(ctx *gin.Context) {
	// Get user ID from context
	userIDVal, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User not authenticated"})
		return
	}
	userID, _ := userIDVal.(uint)

	// Get themeId from path parameter
	themeIDStr := ctx.Param("themeId")
	themeID, err := strconv.ParseUint(themeIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: "Invalid theme ID format"})
		return
	}

	// Bind request body
	var req models.UpdateThemeRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "BAD_REQUEST", Message: "Invalid request body: " + err.Error()})
		return
	}

	// Find the theme
	var gormTheme models.GormTheme
	if err := c.DB.First(&gormTheme, themeID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, models.APIError{Code: "THEME_NOT_FOUND", Message: "Theme not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to fetch theme"})
		return
	}

	// Authorization check: only the creator can update the theme
	if gormTheme.CreatorID != userID {
		ctx.JSON(http.StatusForbidden, models.APIError{Code: "FORBIDDEN", Message: "You are not authorized to update this theme"})
		return
	}

	// Update fields from request
	gormTheme.Title = req.Title
	gormTheme.Description = req.Description
	gormTheme.Category = req.Category
	gormTheme.TimeLimitInSeconds = req.TimeLimitInSeconds

	// Save updates
	if err := c.DB.Save(&gormTheme).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to update theme"})
		return
	}

	// Return updated theme
	ctx.JSON(http.StatusOK, mapGormThemeToAPI(gormTheme))
}

// DeleteTheme - Delete a theme
func (c *Container) DeleteTheme(ctx *gin.Context) {
	// Get user ID from context
	userIDVal, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User not authenticated"})
		return
	}
	userID, _ := userIDVal.(uint)

	// Get themeId from path parameter
	themeIDStr := ctx.Param("themeId")
	themeID, err := strconv.ParseUint(themeIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: "Invalid theme ID format"})
		return
	}

	// Find the theme
	var gormTheme models.GormTheme
	if err := c.DB.First(&gormTheme, themeID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// If the theme is already gone, we can consider the delete successful.
			ctx.Status(http.StatusNoContent)
			return
		}
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to fetch theme for deletion"})
		return
	}

	// Authorization check: only the creator can delete the theme
	if gormTheme.CreatorID != userID {
		ctx.JSON(http.StatusForbidden, models.APIError{Code: "FORBIDDEN", Message: "You are not authorized to delete this theme"})
		return
	}

	// Delete the theme
	if err := c.DB.Delete(&gormTheme).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to delete theme"})
		return
	}

	// Return success with no content
	ctx.Status(http.StatusNoContent)
}

// mapGormThemeToAPI converts a GORM theme model to an API theme model.
func mapGormThemeToAPI(gormTheme models.GormTheme) models.Theme {
	return models.Theme{
		ID:                 int64(gormTheme.ID),
		Title:              gormTheme.Title,
		Description:        gormTheme.Description,
		Category:           gormTheme.Category,
		TimeLimitInSeconds: gormTheme.TimeLimitInSeconds,
		CreatedAt:          gormTheme.CreatedAt,
		UpdatedAt:          gormTheme.UpdatedAt,
	}
}
