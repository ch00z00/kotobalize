package models

import (
	"time"
)

// Writing model based on openapi.yml
type Writing struct {

	ID int64 `json:"id"`

	UserID int64 `json:"userId"`

	ThemeID int64 `json:"themeId"`

	Content string `json:"content"`

	DurationSeconds int32 `json:"durationSeconds"`

	AiScore int32 `json:"aiScore,omitempty"`

	AiFeedback string `json:"aiFeedback,omitempty"`

	CreatedAt time.Time `json:"createdAt"`

	UpdatedAt time.Time `json:"updatedAt"`
}
