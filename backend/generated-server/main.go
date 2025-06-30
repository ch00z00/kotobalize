package main

import (
	"log"

	"github.com/ch00z00/kotobalize/handlers"
	"github.com/ch00z00/kotobalize/middleware"
	"github.com/ch00z00/kotobalize/seeder"
	"github.com/gin-contrib/cors"
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

	// Seed the database with initial data
	seeder.SeedThemes(c.DB)

	// Initialize Gin router
	router := gin.Default()

	// Configure and use CORS middleware
	config := cors.DefaultConfig()
	// Allow requests from the frontend development server
	config.AllowOrigins = []string{"http://localhost:3000"}
	// Allow necessary headers for authentication and content type
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	// Allow all standard HTTP methods
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	router.Use(cors.New(config))

	// Create auth middleware instance
	authMiddleware := middleware.AuthMiddleware(c.JWTSecret)

	// API v1 group
	v1 := router.Group("/api/v1")
	{
		// Public routes (no authentication required)
		v1.POST("/auth/signup", c.SignupUser)
		v1.POST("/auth/login", c.LoginUser)

		v1.GET("/themes", c.ListThemes)
		v1.GET("/themes/:themeId", c.GetThemeByID)

		// Protected routes (authentication required)
		protected := v1.Group("/")
		protected.Use(authMiddleware)
		{
			protected.GET("/auth/me", c.GetCurrentUser)

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
