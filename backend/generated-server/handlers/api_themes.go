package handlers

import (
	"net/http"

	"github.com/ch00z00/kotobalize/models"
	"github.com/labstack/echo/v4"
)

// GetThemeById - Get details of a specific theme by ID
func (c *Container) GetThemeById(ctx echo.Context) error {
	return ctx.JSON(http.StatusOK, models.HelloWorld {
		Message: "Hello World",
	})
}


// ListThemes - Get a list of all available themes
func (c *Container) ListThemes(ctx echo.Context) error {
	return ctx.JSON(http.StatusOK, models.HelloWorld {
		Message: "Hello World",
	})
}

