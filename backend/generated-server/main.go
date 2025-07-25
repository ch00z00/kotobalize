package main

import (
	"flag"
	"log"
	"os"
	"time"

	"github.com/ch00z00/kotobalize/handlers"
	"github.com/ch00z00/kotobalize/middleware"
	"github.com/ch00z00/kotobalize/models"
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
	log.Println("Kotobalize backend server starting...")
	
	// --reset-db フラグを定義します。このフラグが指定されると、DBがリセットされます。
	resetDB := flag.Bool("reset-db", false, "Reset the database by dropping all tables before migrating.")
	flag.Parse()

	// Add a small delay to ensure Cloud SQL proxy is ready
	if os.Getenv("GIN_MODE") == "release" {
		log.Println("Running in production mode, waiting for services to be ready...")
		time.Sleep(2 * time.Second)
	}

	// Initialize container with DB connection
	c, err := handlers.NewContainer()
	if err != nil {
		log.Fatalf("failed to create container: %v", err)
	}

	// --reset-db フラグが true の場合、既存のテーブルをすべて削除します。
	// 注意: この操作は元に戻せません。
	if *resetDB {
		log.Println("WARNING: --reset-db flag is set. Dropping all tables...")
		err := c.DB.Migrator().DropTable(
			&models.GormUser{},
			&models.GormTheme{},
			&models.GormWriting{},
			&models.UserFavoriteTheme{}, // 新しいお気に入りモデルも対象に含めます
		)
		if err != nil {
			log.Fatalf("failed to drop tables: %v", err)
		}
		log.Println("All tables dropped successfully.")
	}

	// データベースのマイグレーションを実行します。
	// 必要なテーブルやカラムが自動で作成されます。
	log.Println("Running database migrations...")
	if err := c.DB.AutoMigrate(&models.GormUser{}, &models.GormTheme{}, &models.GormWriting{}, &models.UserFavoriteTheme{}); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	// Seed the database with initial data
	seeder.SeedThemes(c.DB)

	// Initialize Gin router
	router := gin.Default()

	// Add health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "healthy",
			"message": "Server is running",
		})
	})

	// Configure and use CORS middleware
	config := cors.DefaultConfig()
	// Allow requests from the frontend development server and production
	allowedOrigins := []string{"http://localhost:3000"}
	
	// Add production frontend URL if available
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL != "" {
		allowedOrigins = append(allowedOrigins, frontendURL)
	}
	
	// Allow all origins in production for now (to be restricted later)
	if os.Getenv("GIN_MODE") == "release" {
		config.AllowAllOrigins = true
	} else {
		config.AllowOrigins = allowedOrigins
	}
	
	// Allow necessary headers for authentication and content type
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	// Allow all standard HTTP methods
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	// Allow credentials (cookies, authorization headers, etc.)
	config.AllowCredentials = true
	router.Use(cors.New(config))

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

			protected.PUT("/users/me", c.UpdateUserProfile)
			protected.PUT("/users/me/avatar", c.UpdateUserAvatar)
			protected.DELETE("/users/me/avatar", c.DeleteUserAvatar)
			protected.PUT("/users/me/password", c.UpdateUserPassword)
			protected.POST("/users/me/avatar/upload-url", c.GetAvatarUploadURL)
			protected.GET("/users/me/activity", c.GetUserActivity)

			protected.GET("/themes", c.ListThemes)
			protected.GET("/themes/:themeId", c.GetThemeByID)
			protected.POST("/themes", c.CreateTheme)
			protected.PUT("/themes/:themeId", c.UpdateTheme)
			protected.DELETE("/themes/:themeId", c.DeleteTheme)
			protected.POST("/themes/:themeId/favorite", c.FavoriteTheme)
			protected.DELETE("/themes/:themeId/favorite", c.UnfavoriteTheme)

			protected.GET("/writings", c.ListUserWritings)
			protected.POST("/writings", c.CreateWriting)
			protected.GET("/writings/:writingId", c.GetWritingByID)

			protected.POST("/review", c.ReviewWriting)
		}
	}

	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	// Start server
	log.Printf("Starting server on port %s...", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}
}
