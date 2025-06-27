package models

type NewWritingRequest struct {

	ThemeId int64 `json:"themeId"`

	Content string `json:"content"`

	DurationSeconds int32 `json:"durationSeconds"`
}
