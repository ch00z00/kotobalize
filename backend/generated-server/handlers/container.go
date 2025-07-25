package handlers

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/ch00z00/kotobalize/models"
	openai "github.com/sashabaranov/go-openai"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// Container will hold all dependencies for your application.
type Container struct {
	DB           *gorm.DB
	JWTSecret    string
	OpenAIClient *openai.Client
	S3Client     *s3.Client
	S3BucketName string
}

// min returns the minimum of two integers
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// NewContainer returns an empty or an initialized container for your handlers.
func NewContainer() (Container, error) {
	log.Println("Starting container initialization...")
	
	// Load environment variables
	jwtSecret := os.Getenv("JWT_SECRET")
	openaiAPIKey := os.Getenv("OPENAI_API_KEY")
	awsRegion := os.Getenv("AWS_REGION")
	s3BucketName := os.Getenv("S3_BUCKET_NAME")

	// Check required environment variables
	if jwtSecret == "" {
		return Container{}, fmt.Errorf("JWT_SECRET environment variable is required")
	}
	if openaiAPIKey == "" {
		return Container{}, fmt.Errorf("OPENAI_API_KEY environment variable is required")
	}

	var dsn string

	// Check for DATABASE_URL first (used in Cloud Run)
	if databaseURL := os.Getenv("DATABASE_URL"); databaseURL != "" {
		log.Println("Using DATABASE_URL for database connection")
		dsn = databaseURL
		
		// Check if we're running on Cloud Run with Cloud SQL
		if instanceConnectionName := os.Getenv("INSTANCE_CONNECTION_NAME"); instanceConnectionName != "" {
			log.Printf("Detected Cloud SQL instance: %s", instanceConnectionName)
			// For Cloud SQL connections from Cloud Run, we might need to adjust the DSN
			// to use Unix socket instead of TCP
			// The socket is typically at /cloudsql/INSTANCE_CONNECTION_NAME
		}
	} else {
		// Fall back to individual environment variables (used in local development)
		user := os.Getenv("DB_USER")
		password := os.Getenv("DB_PASSWORD")
		host := os.Getenv("DB_HOST")
		port := os.Getenv("DB_PORT")
		dbname := os.Getenv("DB_NAME")

		log.Println("Using individual DB environment variables for database connection")
		// Build DSN (Data Source Name)
		dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, password, host, port, dbname)
	}

	// Connect to MySQL with GORM (with retry logic)
	log.Println("Attempting to connect to database...")
	log.Printf("DSN (first 50 chars): %s...", dsn[:min(50, len(dsn))])
	
	var db *gorm.DB
	var err error
	
	// Retry connection up to 5 times with exponential backoff
	for i := 0; i < 5; i++ {
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err == nil {
			// Test the connection
			sqlDB, err := db.DB()
			if err == nil {
				err = sqlDB.Ping()
				if err == nil {
					log.Println("Successfully connected to database")
					break
				}
			}
		}
		
		log.Printf("Database connection attempt %d failed: %v", i+1, err)
		if i < 4 {
			waitTime := time.Duration(1<<uint(i)) * time.Second
			log.Printf("Waiting %v before retry...", waitTime)
			time.Sleep(waitTime)
		}
	}
	
	if err != nil {
		return Container{}, fmt.Errorf("failed to connect to database after 5 attempts: %w", err)
	}

	// Auto migrate the schema
	log.Println("Running database migrations...")
	err = db.AutoMigrate(&models.GormUser{}, &models.GormWriting{}, &models.GormTheme{}, &models.UserFavoriteTheme{})
	if err != nil {
		return Container{}, fmt.Errorf("failed to run migrations: %w", err)
	}
	log.Println("Database migrations completed successfully")

	// Initialize OpenAI client
	log.Println("Initializing OpenAI client...")
	openaiClient := openai.NewClient(openaiAPIKey)

	// Initialize S3 client
	log.Println("Initializing AWS S3 client...")
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(awsRegion))
	if err != nil {
		return Container{}, fmt.Errorf("failed to load AWS configuration: %w", err)
	}
	s3Client := s3.NewFromConfig(cfg)

	log.Println("Container initialization completed successfully")
	c := Container{DB: db,
		JWTSecret:    jwtSecret,
		OpenAIClient: openaiClient,
		S3Client:     s3Client,
		S3BucketName: s3BucketName}
	return c, nil
}
