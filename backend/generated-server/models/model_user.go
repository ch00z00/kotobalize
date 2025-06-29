package models

import (
	"time"
)

// User model based on openapi.yml
type User struct {

	ID int64 `json:"id"`

	Email string `json:"email"`

	CreatedAt time.Time `json:"createdAt"`

	UpdatedAt time.Time `json:"updatedAt"`
}
