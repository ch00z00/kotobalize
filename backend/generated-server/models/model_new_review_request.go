package models

// NewReviewRequest defines the model for the AI review request.
type NewReviewRequest struct {
	WritingID int64 `json:"writingId,omitempty"`
}
