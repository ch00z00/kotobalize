package models

import (
	"time"
)

// Theme model based on openapi.yml
type Theme struct {

	ID int64 `json:"id"`

	Title string `json:"title"`

	Description string `json:"description"`

	Category string `json:"category"`

	TimeLimitInSeconds int `json:"timeLimitInSeconds"`

	IsFavorited bool `json:"isFavorited"`

	CreatedAt time.Time `json:"createdAt"`

	UpdatedAt time.Time `json:"updatedAt"`

	CreatorID *uint `json:"creatorId"`
}
