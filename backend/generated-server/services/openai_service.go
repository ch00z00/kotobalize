package services

import (
	"context"
	"encoding/json"
	"fmt"

	openai "github.com/sashabaranov/go-openai"
)

// AIReviewResponse defines the structure for the JSON response from the AI.
type AIReviewResponse struct {
	Score                int    `json:"score"`
	FeedbackOverall      string `json:"feedback_overall"`
	FeedbackClarity      string `json:"feedback_clarity"`
	FeedbackAccuracy     string `json:"feedback_accuracy"`
	FeedbackCompleteness string `json:"feedback_completeness"`
	FeedbackStructure    string `json:"feedback_structure"`
	FeedbackConciseness  string `json:"feedback_conciseness"`
}

// OpenAIService handles interactions with the OpenAI API.
type OpenAIService struct {
	Client *openai.Client
}

// GetAIReview sends the user's writing to the OpenAI API and gets structured feedback.
func (s *OpenAIService) GetAIReview(ctx context.Context, themeTitle, userContent string) (*AIReviewResponse, error) {
	systemPrompt := `
あなたは優秀なソフトウェアエンジニアの面接官です。
ユーザーが入力した技術的な説明文をレビューし、以下の6つの観点で評価してください。
評価結果は必ず下記のJSON形式で返却してください。

{
  "score": <0-100の整数値>,
  "feedback_overall": "<全体的なフィードバック>",
  "feedback_clarity": "<明確さに関するフィードバック>",
  "feedback_accuracy": "<正確さに関するフィードバック>",
  "feedback_completeness": "<網羅性に関するフィードバック>",
  "feedback_structure": "<構造化に関するフィードバック>",
  "feedback_conciseness": "<簡潔さに関するフィードバック>"
}
`

	userPrompt := fmt.Sprintf(`
以下のテーマについて、下記の文章をレビューしてください。

## テーマ
%s

## 文章
%s
`, themeTitle, userContent)

	resp, err := s.Client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT4o,
			ResponseFormat: &openai.ChatCompletionResponseFormat{
				Type: openai.ChatCompletionResponseFormatTypeJSONObject,
			},
			Messages: []openai.ChatCompletionMessage{
				{Role: openai.ChatMessageRoleSystem, Content: systemPrompt},
				{Role: openai.ChatMessageRoleUser, Content: userPrompt},
			},
		},
	)

	if err != nil {
		return nil, fmt.Errorf("OpenAI API request failed: %w", err)
	}

	var reviewResponse AIReviewResponse
	if err := json.Unmarshal([]byte(resp.Choices[0].Message.Content), &reviewResponse); err != nil {
		return nil, fmt.Errorf("failed to parse AI response: %w", err)
	}

	return &reviewResponse, nil
}