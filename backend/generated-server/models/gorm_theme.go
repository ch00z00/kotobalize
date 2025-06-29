package models

import "time"

// GormTheme represents the theme model for database operations.
type GormTheme struct {
	ID          uint `gorm:"primarykey"`
	Title       string
	Description string
	Category    string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}