package models

import "time"

// GormUser represents the user model for database operations with GORM.
// It includes the password hash, which is not exposed in the API model.
type GormUser struct {
	ID        uint   `gorm:"primarykey"`
	Email     string `gorm:"unique"`
	AvatarURL string
	Password  string
	CreatedAt time.Time
	UpdatedAt time.Time
	Writings  []GormWriting `gorm:"foreignKey:UserID"`
}