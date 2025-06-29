package handlers

import (
	"fmt"
	"os"

	"github.com/ch00z00/kotobalize/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// Container will hold all dependencies for your application.
type Container struct {
	DB        *gorm.DB
	JWTSecret string
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

	// Build DSN (Data Source Name)
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, password, host, port, dbname)

	// Connect to MySQL with GORM
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return Container{}, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Auto migrate the schema
	db.AutoMigrate(&models.GormUser{}, &models.GormTheme{}, &models.GormWriting{})

	c := Container{DB: db, JWTSecret: jwtSecret}
	return c, nil
}
