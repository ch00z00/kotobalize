package models

import "time"

// UserFavoriteTheme represents the many-to-many relationship
// between a user and a theme they have favorited.
type UserFavoriteTheme struct {
	UserID    uint `gorm:"primaryKey"`
	ThemeID   uint `gorm:"primaryKey"`
	CreatedAt time.Time
	// Optional: Add GormUser and GormTheme for preloading if needed
	// User  GormUser  `gorm:"foreignKey:UserID"`
	// Theme GormTheme `gorm:"foreignKey:ThemeID"`
}
