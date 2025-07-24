package models

// AvatarUploadRequest model
type AvatarUploadRequest struct {
	FileName string `json:"fileName"`
	FileType string `json:"fileType"`
}
