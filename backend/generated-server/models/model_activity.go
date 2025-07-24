package models

// Activity represents a user's daily activity count for the contribution graph.
type Activity struct {
	Date  string `json:"date"`
	Count int    `json:"count"`
	Level int    `json:"level"`
}
