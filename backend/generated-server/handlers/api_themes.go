package handlers

import (
	"net/http"

	"github.com/ch00z00/kotobalize/models"
	"github.com/gin-gonic/gin"
)

// GetThemeByID - Get details of a specific theme by ID
func (c *Container) GetThemeByID(ctx *gin.Context) {
	// In a real implementation, you would get themeId from path params
	// and fetch the theme from the database.
	ctx.JSON(http.StatusOK, models.HelloWorld{
		Message: "Hello World from GetThemeByID",
	})
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
