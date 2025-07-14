package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/ch00z00/kotobalize/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ThemeWithFavorite is a struct that holds theme information and its favorite status.
type ThemeWithFavorite struct {
	models.GormTheme
	IsFavorited bool `gorm:"column:is_favorited"`
}

// ListThemes - Get a list of all available themes
func (c *Container) ListThemes(ctx *gin.Context) {
	// Get user ID from the context (set by the auth middleware)
	userIDVal, exists := ctx.Get("userId")
	if !exists {
		// This endpoint is protected, so a user should always exist.
		// This is a safeguard.
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User ID not found in token"})
		return
	}
	userID := userIDVal.(uint)

	sortOrder := ctx.DefaultQuery("sort", "newest")
	orderClause := "gorm_themes.creator_id asc, "

	switch sortOrder {
	case "popular":
		orderClause += "gorm_themes.favorites_count desc, gorm_themes.created_at desc"
	default: // "newest"
		orderClause += "gorm_themes.created_at desc"
	}

	var results []ThemeWithFavorite
	// LEFT JOIN を使って、各テーマがお気に入り登録されているかどうかの情報を一度に取得します。
	if err := c.DB.Table("gorm_themes").
		Select("gorm_themes.*, user_favorite_themes.user_id IS NOT NULL as is_favorited").
		Joins("LEFT JOIN user_favorite_themes ON gorm_themes.id = user_favorite_themes.theme_id AND user_favorite_themes.user_id = ?", userID).
		Where("gorm_themes.deleted_at IS NULL AND (gorm_themes.creator_id IS NULL OR gorm_themes.creator_id = ?)", userID).
		Order(orderClause).
		Find(&results).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to fetch themes"})
		return
	}

	// Map GORM themes to API themes
	apiThemes := make([]models.Theme, len(results))
	for i, r := range results {
		apiThemes[i] = mapGormThemeToAPI(r.GormTheme, r.IsFavorited)
	}

	ctx.JSON(http.StatusOK, apiThemes)
}

// GetThemeByID - Get details of a specific theme by ID
func (c *Container) GetThemeByID(ctx *gin.Context) {
	// Get themeId from path parameter
	themeIDStr := ctx.Param("themeId")
	themeID, err := strconv.ParseUint(themeIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: "Invalid theme ID format"})
		return
	}

	// Get user ID from the context (set by the auth middleware)
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User ID not found in token"})
		return
	}

	// Find the theme in the database
	var result ThemeWithFavorite
	// LEFT JOIN を使って、テーマ情報とお気に入り状態を一度に取得します。
	if err := c.DB.Table("gorm_themes").
		Select("gorm_themes.*, user_favorite_themes.user_id IS NOT NULL as is_favorited").
		Joins("LEFT JOIN user_favorite_themes ON gorm_themes.id = user_favorite_themes.theme_id AND user_favorite_themes.user_id = ?", userID).
		Where("gorm_themes.id = ? AND (gorm_themes.creator_id IS NULL OR gorm_themes.creator_id = ?)", themeID, userID).
		First(&result).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, models.APIError{Code: "THEME_NOT_FOUND", Message: "Theme not found or you don't have permission to view it"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to fetch theme"})
		return
	}

	// Map GORM model to API model for the response and return it
	ctx.JSON(http.StatusOK, mapGormThemeToAPI(result.GormTheme, result.IsFavorited))
}

// CreateTheme - Create a new theme record
func (c *Container) CreateTheme(ctx *gin.Context) {
	// Get user ID from the context, which is set by the authentication middleware.
	userIDVal, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User not authenticated"})
		return
	}

	userID, ok := userIDVal.(uint)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "INTERNAL_ERROR", Message: "Invalid user ID type in context"})
		return
	}

	// Bind the incoming JSON to the NewThemeRequest struct (API Model).
	var req models.NewThemeRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "BAD_REQUEST", Message: "Invalid request body: " + err.Error()})
		return
	}

	// Create a new GORM theme record (DB Model).
	gormTheme := models.GormTheme{
		Title:              req.Title,
		Description:        req.Description,
		Category:           req.Category,
		TimeLimitInSeconds: req.TimeLimitInSeconds,
		CreatorID:          &userID,
	}

	// Save the new theme to the database.
	if result := c.DB.Create(&gormTheme); result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to save theme to database"})
		return
	}

	// Return the newly created theme, converting it to the API model for the response.
	// 新規作成したテーマは、デフォルトではお気に入り状態ではない (false)
	ctx.JSON(http.StatusCreated, mapGormThemeToAPI(gormTheme, false))
}

// UpdateTheme - Update an existing theme
func (c *Container) UpdateTheme(ctx *gin.Context) {
	// Get user ID from context
	userIDVal, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User not authenticated"})
		return
	}
	userID, ok := userIDVal.(uint)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "INTERNAL_ERROR", Message: "Invalid user ID type in context"})
		return
	}

	// Get themeId from path parameter
	themeIDStr := ctx.Param("themeId")
	themeID, err := strconv.ParseUint(themeIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: "Invalid theme ID format"})
		return
	}

	// Find the theme
	var gormTheme models.GormTheme
	if err := c.DB.First(&gormTheme, themeID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, models.APIError{Code: "THEME_NOT_FOUND", Message: "Theme not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to fetch theme"})
		return
	}

	// Authorization check:
	// 1. Official themes (CreatorID is nil) cannot be updated.
	if gormTheme.CreatorID == nil {
		ctx.JSON(http.StatusForbidden, models.APIError{Code: "FORBIDDEN", Message: "Official themes cannot be updated."})
		return
	}
	// 2. Only the creator can update their theme.
	if *gormTheme.CreatorID != userID {
		ctx.JSON(http.StatusForbidden, models.APIError{Code: "FORBIDDEN", Message: "You are not authorized to update this theme"})
		return
	}

	// Bind request body
	var req models.UpdateThemeRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "BAD_REQUEST", Message: "Invalid request body: " + err.Error()})
		return
	}

	// Use GORM's Updates to perform a partial update (only non-zero fields from req are updated)
	if err := c.DB.Model(&gormTheme).Updates(req).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to update theme"})
		return
	}

	// 更新後のテーマのお気に入り状態を確認します
	var favorite models.UserFavoriteTheme
	isFavorited := c.DB.Where("user_id = ? AND theme_id = ?", userID, themeID).First(&favorite).Error == nil

	// Return updated theme
	ctx.JSON(http.StatusOK, mapGormThemeToAPI(gormTheme, isFavorited))
}

// DeleteTheme - Delete a theme
func (c *Container) DeleteTheme(ctx *gin.Context) {
	// Get user ID from context
	userIDVal, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User not authenticated"})
		return
	}
	userID, ok := userIDVal.(uint)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "INTERNAL_ERROR", Message: "Invalid user ID type in context"})
		return
	}

	// Get themeId from path parameter
	themeIDStr := ctx.Param("themeId")
	themeID, err := strconv.ParseUint(themeIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: "Invalid theme ID format"})
		return
	}

	// Find the theme
	var gormTheme models.GormTheme
	if err := c.DB.First(&gormTheme, themeID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// If the theme is already gone, we can consider the delete successful.
			ctx.Status(http.StatusNoContent)
			return
		}
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to fetch theme for deletion"})
		return
	}

	// Authorization check:
	// 1. Official themes (CreatorID is nil) cannot be deleted.
	if gormTheme.CreatorID == nil {
		ctx.JSON(http.StatusForbidden, models.APIError{Code: "FORBIDDEN", Message: "Official themes cannot be deleted."})
		return
	}
	// 2. Only the creator can delete their theme.
	if *gormTheme.CreatorID != userID {
		ctx.JSON(http.StatusForbidden, models.APIError{Code: "FORBIDDEN", Message: "You are not authorized to delete this theme"})
		return
	}

	// Delete the theme
	if err := c.DB.Delete(&gormTheme).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to delete theme"})
		return
	}

	// Return success with no content
	ctx.Status(http.StatusNoContent)
}

// FavoriteTheme - Favorite a theme for the current user
func (c *Container) FavoriteTheme(ctx *gin.Context) {
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User not authenticated"})
		return
	}

	themeIDStr := ctx.Param("themeId")
	themeID, err := strconv.ParseUint(themeIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: "Invalid theme ID format"})
		return
	}

	// Check if the theme exists
	var theme models.GormTheme
	if err := c.DB.First(&theme, themeID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, models.APIError{Code: "THEME_NOT_FOUND", Message: "Theme not found"})
		return
	}

	// Use a transaction to ensure atomicity
	err = c.DB.Transaction(func(tx *gorm.DB) error {
		favorite := models.UserFavoriteTheme{
			UserID:  userID.(uint),
			ThemeID: uint(themeID),
		}

		// Use FirstOrCreate to avoid duplicate entries.
		result := tx.FirstOrCreate(&favorite)
		if result.Error != nil {
			return result.Error
		}

		// Only increment if a new record was created
		if result.RowsAffected > 0 {
			if err := tx.Model(&models.GormTheme{}).Where("id = ?", themeID).UpdateColumn("favorites_count", gorm.Expr("favorites_count + 1")).Error; err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to update favorite status"})
		return
	}

	ctx.Status(http.StatusNoContent)
}

// UnfavoriteTheme - Unfavorite a theme for the current user
func (c *Container) UnfavoriteTheme(ctx *gin.Context) {
	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, models.APIError{Code: "UNAUTHORIZED", Message: "User not authenticated"})
		return
	}

	themeIDStr := ctx.Param("themeId")
	themeID, err := strconv.ParseUint(themeIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIError{Code: "INVALID_INPUT", Message: "Invalid theme ID format"})
		return
	}

	err = c.DB.Transaction(func(tx *gorm.DB) error {
		favorite := models.UserFavoriteTheme{
			UserID:  userID.(uint),
			ThemeID: uint(themeID),
		}
		result := tx.Delete(&favorite)
		if result.RowsAffected > 0 {
			if err := tx.Model(&models.GormTheme{}).Where("id = ? AND favorites_count > 0", themeID).UpdateColumn("favorites_count", gorm.Expr("favorites_count - 1")).Error; err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIError{Code: "DATABASE_ERROR", Message: "Failed to update favorite status"})
		return
	}

	ctx.Status(http.StatusNoContent)
}

// mapGormThemeToAPI converts a GORM theme model and its favorite status to an API theme model.
func mapGormThemeToAPI(gormTheme models.GormTheme, isFavorited bool) models.Theme {
	return models.Theme{
		ID:                 int64(gormTheme.ID),
		Title:              gormTheme.Title,
		Description:        gormTheme.Description,
		Category:           gormTheme.Category,
		TimeLimitInSeconds: gormTheme.TimeLimitInSeconds,
		FavoritesCount:     gormTheme.FavoritesCount,
		IsFavorited:        isFavorited,
		CreatedAt:          gormTheme.CreatedAt,
		UpdatedAt:          gormTheme.UpdatedAt,
		CreatorID:          gormTheme.CreatorID,
	}
}
