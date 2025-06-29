package models

import "time"

// GormWriting represents the writing model for database operations.
type GormWriting struct {
	ID                   uint `gorm:"primarykey"`
	UserID               uint
	ThemeID              uint
	Theme                GormTheme `gorm:"foreignKey:ThemeID"`
	Content              string
	DurationSeconds      int
	AiScore              *int
	AiFeedbackOverall    *string
	AiFeedbackClarity    *string
	AiFeedbackAccuracy   *string
	AiFeedbackCompleteness *string
	AiFeedbackStructure  *string
	AiFeedbackConciseness *string
	CreatedAt            time.Time
	UpdatedAt            time.Time
}