package models

import (
	"gorm.io/gorm"
)

// GormTheme represents a theme for verbalization exercises in the database.
type GormTheme struct {
	gorm.Model
	Title              string `gorm:"size:255;not null"`
	Description        string `gorm:"type:text;not null"`
	Category           string `gorm:"size:100;not null"`
	TimeLimitInSeconds int    `gorm:"not null"`
	CreatorID          *uint  // FK to the users table. nil for official themes.
	FavoritesCount     int    `gorm:"not null;default:0"`
}
