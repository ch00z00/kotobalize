package services

import (
	"context"
	"encoding/json"
	"fmt"

	openai "github.com/sashabaranov/go-openai"
)

// FeedbackDetail represents the feedback for a single viewpoint.
type FeedbackDetail struct {
	Viewpoint string `json:"viewpoint"`
	Score     int    `json:"score"`
	GoodPoint string `json:"goodPoint"`
	BadPoint  string `json:"badPoint"`
}

// AIReviewResponse defines the structure for the JSON response from the AI.
type AIReviewResponse struct {
	TotalScore int              `json:"totalScore"`
	Scores     map[string]int   `json:"scores"`
	Feedbacks  []FeedbackDetail `json:"feedbacks"`
}

// OpenAIService handles interactions with the OpenAI API.
type OpenAIService struct {
	Client *openai.Client
}

// GetAIReview sends the user's writing to the OpenAI API and gets structured feedback.
func (s *OpenAIService) GetAIReview(ctx context.Context, themeTitle, userContent string) (*AIReviewResponse, error) {
	systemPrompt := `
あなたは、ユーザーが技術的な事柄を言語化する能力を向上させるための、世界クラスのソフトウェアエンジニアリングコーチです。
ユーザーが入力した文章をレビューし、以下の5つの観点で評価してください。
評価結果は必ず下記のJSON形式で返却してください。各観点のスコアと全体スコアは0-100の整数値です。フィードバックは具体的で、学習者が次何をすべきかわかるように記述してください。

## 評価観点
1. 観察・内省力：自身の経験や、その時の思考プロセスを深く掘り下げて語れているか？
2. 具体⇄抽象力：技術的な概念と、それを説明するための具体的な実例のバランスは取れているか？
3. 語彙・用語力：技術用語や比喩を正確かつ効果的に使えているか？
4. 構造化力：PREP法やSDS法など、論理的で分かりやすい構造で文章が展開されているか？
5. 他者視点力：読み手（例：面接官）が持つであろう疑問を予測し、それに答える形で説明できているか？

## 出力形式 (JSON)
{
  "totalScore": <0-100の全体スコア>,
  "scores": {
    "observation": <観察・内省力のスコア>,
    "abstraction": <具体⇄抽象力のスコア>,
    "vocabulary": <語彙・用語力のスコア>,
    "structure": <構造化力のスコア>,
    "perspective": <他者視点力のスコア>
  },
  "feedbacks": [
    {
      "viewpoint": "観察・内省力",
      "score": <スコア>,
      "goodPoint": "<良かった点>",
      "badPoint": "<改善点>"
    },
    // ... 他の4観点も同様に記述
  ]
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