package handlers

import (
	"context"
	"fmt"
	"os"

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

// NewContainer returns an empty or an initialized container for your handlers.
func NewContainer() (Container, error) {
	// Load environment variables from docker-compose.yml
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	dbname := os.Getenv("DB_NAME")
	jwtSecret := os.Getenv("JWT_SECRET")
	openaiAPIKey := os.Getenv("OPENAI_API_KEY")
	awsRegion := os.Getenv("AWS_REGION")
	s3BucketName := os.Getenv("S3_BUCKET_NAME")

	// Build DSN (Data Source Name)
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, password, host, port, dbname)

	// Connect to MySQL with GORM
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return Container{}, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Auto migrate the schema
	db.AutoMigrate(&models.GormUser{}, &models.GormWriting{}, &models.GormTheme{})

	// Initialize OpenAI client
	openaiClient := openai.NewClient(openaiAPIKey)

	// Initialize S3 client
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(awsRegion))
	if err != nil {
		return Container{}, fmt.Errorf("failed to load AWS configuration: %w", err)
	}
	s3Client := s3.NewFromConfig(cfg)

	c := Container{DB: db,
		JWTSecret:    jwtSecret,
		OpenAIClient: openaiClient,
		S3Client:     s3Client,
		S3BucketName: s3BucketName}
	return c, nil
}
