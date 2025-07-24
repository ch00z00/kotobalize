package models

// UpdateThemeRequest is an API model that is used by the frontend to update an existing theme.
type UpdateThemeRequest struct {
	Title              string `json:"title,omitempty"`
	Description        string `json:"description,omitempty"`
	Category           string `json:"category,omitempty"`
	TimeLimitInSeconds int    `json:"timeLimitInSeconds,omitempty"`
}
