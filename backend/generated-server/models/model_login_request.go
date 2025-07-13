package models

// LoginRequest model based on openapi.yml
type LoginRequest struct {
	Email string `json:"email"`

	Password string `json:"password"`

	// If true, the token will have a longer expiration time.
	RememberMe bool `json:"rememberMe,omitempty"`
}