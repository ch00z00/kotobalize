package handlers

import (
	"net/http"

	"github.com/ch00z00/kotobalize/models"
	"github.com/gin-gonic/gin"
)

// CreateWriting - Create a new writing record and trigger AI review
func (c *Container) CreateWriting(ctx *gin.Context) {
	ctx.JSON(http.StatusCreated, models.HelloWorld{
		Message: "Hello World from CreateWriting",
	})
}

// ReviewWriting - Trigger AI review for a writing
func (c *Container) ReviewWriting(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, models.HelloWorld{
		Message: "Hello World from ReviewWriting",
	})
}

// GetWritingByID - Get details of a specific writing record by ID
func (c *Container) GetWritingByID(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, models.HelloWorld{
		Message: "Hello World from GetWritingByID",
	})
}

// ListUserWritings - Get a list of all writings for the authenticated user
func (c *Container) ListUserWritings(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, models.HelloWorld{
		Message: "Hello World from ListUserWritings",
	})
}
