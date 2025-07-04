package models

// NewThemeRequest is a an API model that is used by the frontend to create a new theme.
type NewThemeRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
}