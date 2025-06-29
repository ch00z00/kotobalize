package main

import (
	"github.com/ch00z00/kotobalize/handlers"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	//todo: handle the error!
	c, _ := handlers.NewContainer()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())


	// GetCurrentUser - Get current authenticated user's information
	e.GET("/api/v1/auth/me", c.GetCurrentUser)

	// LoginUser - Authenticate user and get a token
	e.POST("/api/v1/auth/login", c.LoginUser)

	// SignupUser - Sign up a new user
	e.POST("/api/v1/auth/signup", c.SignupUser)

	// GetThemeById - Get details of a specific theme by ID
	e.GET("/api/v1/themes/:themeId", c.GetThemeById)

	// ListThemes - Get a list of all available themes
	e.GET("/api/v1/themes", c.ListThemes)

	// CreateWriting - Create a new writing record and trigger AI review
	e.POST("/api/v1/writings", c.CreateWriting)

	// GetWritingById - Get details of a specific writing record by ID
	e.GET("/api/v1/writings/:writingId", c.GetWritingById)

	// ListUserWritings - Get a list of all writings for the authenticated user
	e.GET("/api/v1/writings", c.ListUserWritings)

	// ReviewWriting - Trigger AI review for a writing
	e.POST("/api/v1/review", c.ReviewWriting)


	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}
