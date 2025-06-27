package models

import (
	"time"
)

type Theme struct {

	Id int64 `json:"id"`

	Title string `json:"title"`

	Description string `json:"description"`

	Category string `json:"category"`

	CreatedAt time.Time `json:"createdAt"`

	UpdatedAt time.Time `json:"updatedAt"`
}
