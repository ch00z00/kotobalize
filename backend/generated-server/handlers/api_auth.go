package handlers

import (
	"net/http"

	"github.com/ch00z00/kotobalize/models"
	"github.com/gin-gonic/gin"
)

// GetCurrentUser - Get current authenticated user's information
func (c *Container) GetCurrentUser(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, models.HelloWorld{
		Message: "Hello World from GetCurrentUser",
	})
}

// LoginUser - Authenticate user and get a token
func (c *Container) LoginUser(ctx *gin.Context) {
	// In a real implementation, you would validate credentials,
	// generate a JWT, and return it.
	ctx.JSON(http.StatusOK, models.HelloWorld{
		Message: "Hello World from LoginUser",
	})
}

// SignupUser - Sign up a new user
func (c *Container) SignupUser(ctx *gin.Context) {
	// In a real implementation, you would bind the request,
	// hash the password, and create a new user in the DB.
	ctx.JSON(http.StatusCreated, models.HelloWorld{
		Message: "Hello World from SignupUser",
	})
}
