package main

import (
	"log"

	"github.com/ch00z00/kotobalize/handlers"
	"github.com/ch00z00/kotobalize/middleware"
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

	// Create auth middleware instance
	authMiddleware := middleware.AuthMiddleware(c.JWTSecret)

	// API v1 group
	v1 := router.Group("/api/v1")
	{
		// Public routes (no authentication required)
		v1.POST("/auth/signup", c.SignupUser)
		v1.POST("/auth/login", c.LoginUser)

		// Protected routes (authentication required)
		protected := v1.Group("/")
		protected.Use(authMiddleware)
		{
			protected.GET("/auth/me", c.GetCurrentUser)

			protected.GET("/themes", c.ListThemes)
			protected.GET("/themes/:themeId", c.GetThemeByID)

			protected.GET("/writings", c.ListUserWritings)
			protected.POST("/writings", c.CreateWriting)
			protected.GET("/writings/:writingId", c.GetWritingByID)

			protected.POST("/review", c.ReviewWriting)
		}
	}

	// Start server
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}
}
