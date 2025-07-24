package models

// NewWritingRequest model
type NewWritingRequest struct {
	ThemeID int64 `json:"themeId"`

	Content string `json:"content"`

	DurationSeconds int32 `json:"durationSeconds"`
}
