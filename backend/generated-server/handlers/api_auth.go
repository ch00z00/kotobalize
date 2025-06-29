package handlers

import (
	"errors"
	"net/http"
	"time"

	"github.com/ch00z00/kotobalize/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// GetCurrentUser - Get current authenticated user's information
func (c *Container) GetCurrentUser(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, models.HelloWorld{
		Message: "Hello World from GetCurrentUser",
	})
}

// LoginUser - Authenticate user and get a token
func (c *Container) LoginUser(ctx *gin.Context) {
	// In a real implementation, you would validate credentials,
	// generate a JWT, and return it.
	ctx.JSON(http.StatusOK, models.HelloWorld{
		Message: "Hello World from LoginUser",
	})
}

// SignupUser - Sign up a new user
func (c *Container) SignupUser(ctx *gin.Context) {
	var req models.RegisterRequest
	// Bind the incoming JSON to the RegisterRequest struct
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"code": "INVALID_INPUT", "message": err.Error()})
		return
	}

	// Check if user already exists
	var existingUser models.GormUser
	if err := c.DB.Model(&models.GormUser{}).Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		// User found, return conflict
		ctx.JSON(http.StatusConflict, gin.H{"code": "USER_EXISTS", "message": "User with this email already exists"})
		return
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		// Another database error occurred
		ctx.JSON(http.StatusInternalServerError, gin.H{"code": "DATABASE_ERROR", "message": "Failed to check for existing user"})
		return
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"code": "INTERNAL_ERROR", "message": "Failed to hash password"})
		return
	}

	// Create the new user
	newUser := models.GormUser{
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	if err := c.DB.Create(&newUser).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"code": "DATABASE_ERROR", "message": "Failed to create user"})
		return
	}

	// Generate JWT
	token, err := generateJWT(newUser, c.JWTSecret)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"code": "INTERNAL_ERROR", "message": "Failed to generate token"})
		return
	}

	// Return the token and user info
	// Map GORM user model to API user model for the response
	apiUser := models.User{
		ID:        int64(newUser.ID),
		Email:     newUser.Email,
		CreatedAt: newUser.CreatedAt,
		UpdatedAt: newUser.UpdatedAt,
	}

	ctx.JSON(http.StatusCreated, models.AuthResponse{
		Token: token,
		User:  apiUser,
	})
}

// generateJWT creates a new JWT for a given user.
func generateJWT(user models.GormUser, secret string) (string, error) {
	// Create the claims
	claims := jwt.MapClaims{
		"sub":   user.ID,
		"email": user.Email,
		"iat":   time.Now().Unix(),
		"exp":   time.Now().Add(time.Hour * 24 * 7).Unix(), // Token expires in 7 days
	}

	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and return it
	return token.SignedString([]byte(secret))
}
