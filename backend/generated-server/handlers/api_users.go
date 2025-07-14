package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/ch00z00/kotobalize/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// GetAvatarUploadURL generates a presigned URL for uploading a file to S3.
func (c *Container) GetAvatarUploadURL(ctx *gin.Context) {
	var req models.AvatarUploadRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: err.Error()})
		return
	}

	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User ID not found in token"})
		return
	}

	// Organize by user ID for better management
	objectKey := fmt.Sprintf("avatars/%d/%s-%s", userID, uuid.New().String(), req.FileName)

	// Create a presigner client
	presigner := s3.NewPresignClient(c.S3Client)

	// Create the presigned request
	presignedReq, err := presigner.PresignPutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String(c.S3BucketName),
		Key:         aws.String(objectKey),
		ContentType: aws.String(req.FileType),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = time.Duration(15 * time.Minute)
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "S3_ERROR", Message: "Failed to generate presigned URL"})
		return
	}

	ctx.JSON(http.StatusOK, models.AvatarUploadResponse{
		UploadUrl: presignedReq.URL,
		Key:       objectKey,
	})
}

// UpdateUserAvatar updates the user's avatar URL in the database.
func (c *Container) UpdateUserAvatar(ctx *gin.Context) {
	var req models.UpdateAvatarRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: err.Error()})
		return
	}

	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User ID not found in token"})
		return
	}

	// Find the user
	var user models.GormUser
	if err := c.DB.First(&user, userID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, models.APIError{Code: "USER_NOT_FOUND", Message: "User not found"})
		return
	}

	// Update the avatar URL
	user.AvatarURL = &req.AvatarURL
	if err := c.DB.Save(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to update avatar URL"})
		return
	}

	// Return the updated user object
	apiUser := models.User{
		ID:        int64(user.ID),
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
	if user.Name != nil {
		apiUser.Name = user.Name
	}
	if user.AvatarURL != nil {
		apiUser.AvatarURL = *user.AvatarURL
	}
	ctx.JSON(http.StatusOK, apiUser)
}

// UpdateUserPassword updates the authenticated user's password.
func (c *Container) UpdateUserPassword(ctx *gin.Context) {
	// Get user ID from context
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User not authenticated"})
		return
	}

	// Bind request body
	var req models.UpdatePasswordRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: "Invalid request body: " + err.Error()})
		return
	}

	// Basic validation for new password
	if len(req.NewPassword) < 8 {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: "New password must be at least 8 characters long"})
		return
	}

	// Find the user
	var user models.GormUser
	if err := c.DB.First(&user, userID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, models.APIError{Code: "USER_NOT_FOUND", Message: "User not found"})
		return
	}

	// Verify current password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.CurrentPassword)); err != nil {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "INVALID_CREDENTIALS", Message: "Incorrect current password"})
		return
	}

	// Hash the new password
	hashedNewPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "INTERNAL_ERROR", Message: "Failed to hash new password"})
		return
	}

	// Update the password
	if err := c.DB.Model(&user).Update("password", string(hashedNewPassword)).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to update password"})
		return
	}

	// Return success
	ctx.Status(http.StatusNoContent)
}

// UpdateUserProfile updates the authenticated user's profile information (e.g., name).
func (c *Container) UpdateUserProfile(ctx *gin.Context) {
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User not authenticated"})
		return
	}

	var req models.UpdateProfileRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: "Invalid request body: " + err.Error()})
		return
	}

	// Find the user
	var user models.GormUser
	if err := c.DB.First(&user, userID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, models.APIError{Code: "USER_NOT_FOUND", Message: "User not found"})
		return
	}

	// Update the user's name
	user.Name = &req.Name
	if err := c.DB.Save(&user).Error; err != nil {
		// Handle potential unique constraint violation for the name
		if strings.Contains(err.Error(), "Duplicate entry") {
			ctx.JSON(http.StatusConflict, models.APIError{Code: "NAME_TAKEN", Message: "このユーザー名は既に使用されています。"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to update profile"})
		return
	}

	// Return the updated user object
	apiUser := models.User{
		ID:        int64(user.ID),
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
	if user.Name != nil {
		apiUser.Name = user.Name
	}
	if user.AvatarURL != nil {
		apiUser.AvatarURL = *user.AvatarURL
	}
	ctx.JSON(http.StatusOK, apiUser)
}

// DeleteUserAvatar deletes the user's avatar from S3 and the database.
func (c *Container) DeleteUserAvatar(ctx *gin.Context) {
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User ID not found in token"})
		return
	}

	// Find the user
	var user models.GormUser
	if err := c.DB.First(&user, userID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, models.APIError{Code: "USER_NOT_FOUND", Message: "User not found"})
		return
	}

	// If an avatar URL exists, delete the object from S3
	if user.AvatarURL != nil && *user.AvatarURL != "" {
		parsedURL, err := url.Parse(*user.AvatarURL)
		if err == nil {
			objectKey := strings.TrimPrefix(parsedURL.Path, "/")
			_, err := c.S3Client.DeleteObject(context.TODO(), &s3.DeleteObjectInput{
				Bucket: aws.String(c.S3BucketName),
				Key:    aws.String(objectKey),
			})
			if err != nil {
				// Log the error but don't fail the request, as the main goal is to remove the DB reference.
				log.Printf("Failed to delete S3 object %s: %v", objectKey, err)
			}
		}
	}

	// Update the avatar URL to nil in the database
	user.AvatarURL = nil
	if err := c.DB.Save(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to update avatar URL"})
		return
	}

	// Return the updated user object
	apiUser := models.User{
		ID:        int64(user.ID),
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
	// Since user.AvatarURL was just set to nil, this block won't be executed,
	// and apiUser.AvatarURL will correctly remain its zero value ("").
	if user.AvatarURL != nil {
		apiUser.AvatarURL = *user.AvatarURL
	}
	ctx.JSON(http.StatusOK, apiUser)
}