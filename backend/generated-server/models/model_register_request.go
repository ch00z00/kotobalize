package models

// RegisterRequest model
type RegisterRequest struct {
	Email string `json:"email"`

	Password string `json:"password"`
}
