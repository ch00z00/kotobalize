package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/ch00z00/kotobalize/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GetThemeByID - Get details of a specific theme by ID
func (c *Container) GetThemeByID(ctx *gin.Context) {
	// Get themeId from path parameter
	themeIDStr := ctx.Param("themeId")
	themeID, err := strconv.ParseUint(themeIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"code": "INVALID_INPUT", "message": "Invalid theme ID format"})
		return
	}

	// Find the theme in the database
	var gormTheme models.GormTheme
	if err := c.DB.First(&gormTheme, themeID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"code": "THEME_NOT_FOUND", "message": "Theme not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"code": "DATABASE_ERROR", "message": "Failed to fetch theme"})
		return
	}

	// Map GORM model to API model for the response and return it
	ctx.JSON(http.StatusOK, mapGormThemeToAPI(gormTheme))
}

// ListThemes - Get a list of all available themes
func (c *Container) ListThemes(ctx *gin.Context) {
	var gormThemes []models.GormTheme
	if err := c.DB.Find(&gormThemes).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"code": "DATABASE_ERROR", "message": "Failed to fetch themes"})
		return
	}

	// Map GORM themes to API themes
	apiThemes := make([]models.Theme, len(gormThemes))
	for i, t := range gormThemes {
		apiThemes[i] = mapGormThemeToAPI(t)
	}

	ctx.JSON(http.StatusOK, apiThemes)
}

// mapGormThemeToAPI converts a GORM theme model to an API theme model.
func mapGormThemeToAPI(gormTheme models.GormTheme) models.Theme {
	return models.Theme{
		ID:          int64(gormTheme.ID),
		Title:       gormTheme.Title,
		Description: gormTheme.Description,
		Category:    gormTheme.Category,
		CreatedAt:   gormTheme.CreatedAt,
		UpdatedAt:   gormTheme.UpdatedAt,
	}
}
