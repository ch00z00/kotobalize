package handlers

import (
	"net/http"

	"github.com/ch00z00/kotobalize/models"
	"github.com/labstack/echo/v4"
)

// GetCurrentUser - Get current authenticated user's information
func (c *Container) GetCurrentUser(ctx echo.Context) error {
	return ctx.JSON(http.StatusOK, models.HelloWorld {
		Message: "Hello World",
	})
}


// LoginUser - Authenticate user and get a token
func (c *Container) LoginUser(ctx echo.Context) error {
	return ctx.JSON(http.StatusOK, models.HelloWorld {
		Message: "Hello World",
	})
}


// SignupUser - Sign up a new user
func (c *Container) SignupUser(ctx echo.Context) error {
	return ctx.JSON(http.StatusOK, models.HelloWorld {
		Message: "Hello World",
	})
}
