/*
 * Kotobalize API
 *
 * API for the Kotobalize technical interview preparation app.
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package openapi

type Activity struct {

	// The date of the activity in YYYY-MM-DD format.
	Date string `json:"date"`

	// The number of writings on that day.
	Count int32 `json:"count"`

	// The contribution level from 0 to 4.
	Level int32 `json:"level"`
}
