package main

import (
	"log"

	"github.com/ch00z00/kotobalize/handlers"
	"github.com/gin-gonic/gin"
)

/**
 * main is the entry point of the backend server.
 *
 * It creates a new Container with a DB connection, sets up a Gin router,
 * and defines API v1 endpoints for auth, themes, writings, and review.
 *
 * Finally, it starts the server listening on port 8080.
 */

func main() {
	// Initialize container with DB connection
	c, err := handlers.NewContainer()
	if err != nil {
		log.Fatalf("failed to create container: %v", err)
	}

	// Initialize Gin router
	router := gin.Default()

	// API v1 group
	v1 := router.Group("/api/v1")
	{
		// Auth routes
		auth := v1.Group("/auth")
		{
			auth.POST("/signup", c.SignupUser)
			auth.POST("/login", c.LoginUser)
			// This route should be protected by auth middleware in a real app
			auth.GET("/me", c.GetCurrentUser)
		}

		// Theme routes
		themes := v1.Group("/themes")
		{
			themes.GET("", c.ListThemes)
			themes.GET("/:themeId", c.GetThemeByID)
		}

		// Writings routes
		writings := v1.Group("/writings")
		{
			writings.GET("", c.ListUserWritings)
			writings.POST("", c.CreateWriting)
			writings.GET("/:writingId", c.GetWritingByID)
		}

		// Review route
		v1.POST("/review", c.ReviewWriting)
	}

	// Start server
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}
}
