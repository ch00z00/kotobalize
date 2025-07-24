package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// GormWriting represents the writing model for database operations.
type GormWriting struct {
	gorm.Model
	UserID          uint
	ThemeID         uint
	Theme           GormTheme `gorm:"foreignKey:ThemeID"`
	Content         string
	DurationSeconds int
	AIScore         *int
	AIFeedback      datatypes.JSON // JSON形式でフィードバック全体を保存
}
