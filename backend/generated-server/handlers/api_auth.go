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
	// Get user ID from the context (set by the auth middleware)
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User ID not found in token"})
		return
	}

	// Find the user in the database
	var user models.GormUser
	if err := c.DB.First(&user, userID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, models.APIError{Code: "USER_NOT_FOUND", Message: "User not found"})
		return
	}

	// Map GORM user to API user model
	apiUser := models.User{
		ID:        int64(user.ID),
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
	if user.AvatarURL != nil {
		apiUser.AvatarURL = *user.AvatarURL
	}

	ctx.JSON(http.StatusOK, apiUser)
}

// LoginUser - Authenticate user and get a token
func (c *Container) LoginUser(ctx *gin.Context) {
	var req models.LoginRequest
	// Bind the incoming JSON to the LoginRequest struct
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: err.Error()})
		return
	}

	// Find the user by email
	var user models.GormUser
	if err := c.DB.Model(&models.GormUser{}).Where("email = ?", req.Email).First(&user).Error; err != nil {
		// To prevent email enumeration attacks, return a generic error for both "not found" and other DB errors.
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "INVALID_CREDENTIALS", Message: "Invalid email or password"})
		return
	}

	// Compare the provided password with the stored hash
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		// If passwords don't match, return unauthorized
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "INVALID_CREDENTIALS", Message: "Invalid email or password"})
		return
	}

	// Set token expiration
	expirationTime := time.Now().Add(time.Hour * 24) // デフォルトは24時間
	if req.RememberMe {
		expirationTime = time.Now().Add(time.Hour * 24 * 30) // rememberMeがtrueなら30日間
	}

	// Generate JWT
	token, err := generateJWT(user, c.JWTSecret, expirationTime)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "INTERNAL_ERROR", Message: "Failed to generate token"})
		return
	}

	// Map GORM user model to API user model for the response
	apiUser := models.User{
		ID:        int64(user.ID),
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
	if user.AvatarURL != nil {
		apiUser.AvatarURL = *user.AvatarURL
	}

	// Return the token and user info
	ctx.JSON(http.StatusOK, models.AuthResponse{
		Token: token,
		User:  apiUser,
	})
}

// SignupUser - Sign up a new user
func (c *Container) SignupUser(ctx *gin.Context) {
	var req models.RegisterRequest
	// Bind the incoming JSON to the RegisterRequest struct
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: err.Error()})
		return
	}

	// Check if user already exists
	var existingUser models.GormUser
	if err := c.DB.Model(&models.GormUser{}).Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		// User found, return conflict
		ctx.JSON(http.StatusConflict, models.APIError{Code: "USER_EXISTS", Message: "User with this email already exists"})
		return
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		// Another database error occurred
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to check for existing user"})
		return
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "INTERNAL_ERROR", Message: "Failed to hash password"})
		return
	}

	// Create the new user
	newUser := models.GormUser{
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	if err := c.DB.Create(&newUser).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to create user"})
		return
	}

	// For signup, the token is valid for the default session duration (24 hours).
	expirationTime := time.Now().Add(time.Hour * 24)
	// Generate JWT
	token, err := generateJWT(newUser, c.JWTSecret, expirationTime)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "INTERNAL_ERROR", Message: "Failed to generate token"})
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
	if newUser.AvatarURL != nil {
		apiUser.AvatarURL = *newUser.AvatarURL
	}

	ctx.JSON(http.StatusCreated, models.AuthResponse{
		Token: token,
		User:  apiUser,
	})
}

// generateJWT creates a new JWT for a given user.
func generateJWT(user models.GormUser, secret string, expirationTime time.Time) (string, error) {
	// Create the claims
	claims := jwt.MapClaims{
		"sub":   user.ID,
		"email": user.Email,
		"iat":   time.Now().Unix(),
		"exp":   expirationTime.Unix(),
	}

	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and return it
	return token.SignedString([]byte(secret))
}
