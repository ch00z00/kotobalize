## 💡 kotobalize（コトバライズ）

言語化で差をつけろ！

## 🧠 コンセプト

「技術を言葉で語る力」を鍛える Web エンジニア向け言語化トレーニングアプリ

- 技術面接で必要な説明力・構造化力・具体抽象変換力・語彙力をトレーニング
- 書いて → AI に添削してもらって → 自分の弱点を自覚して鍛えるサイクルを支援

## 技術スタック

- フロントエンド: Next.js, TypeScript, Tailwind CSS
- バックエンド: Golang, Gin
- スキーマ定義: OpenAPI
- DB: MySQL
- インフラ: Docker（Docker Compose）, openapi-generator
- テスト: Go 標準テスト機能 (バックエンド), Jest/React Testing Library (フロントエンド)
- AI レビュー: OpenAI API（GPT-4）
- 認証（任意）: email ＋ password ＋ JWT ベースのシンプルな認証で OK

## 実装概要

### 認証/プロフィール

| Pages                          | Paths     | API Endpoints           | Description                                      |
| ------------------------------ | --------- | ----------------------- | ------------------------------------------------ |
| **ログインページ**             | `/login`  | `POST /api/auth/login`  | ユーザー認証（JWT などの発行）                   |
| **サインアップページ**         | `/signup` | `POST /api/auth/signup` | 新規ユーザー登録                                 |
| **マイページ情報取得（内部）** | -         | `GET /api/auth/me`      | 認証中のユーザー情報取得（ログインチェックなど） |

### テーマ

| Pages                | Paths     | API Endpoints         | Description                            |
| -------------------- | --------- | --------------------- | -------------------------------------- |
| **テーマ選択ページ** | `/themes` | `GET /api/themes`     | テーマの一覧を取得して選択肢として表示 |
| **テーマ選択ページ** | `/themes` | `GET /api/themes/:id` | テーマ詳細の確認（補足説明など）       |

### テキストエディタ・AI レビュー

| Pages                    | Paths                | API Endpoints        | Description     |
| ------------------------ | -------------------- | -------------------- | --------------- |
| **言語化エディタページ** | `/themes/:id/write`  | `POST /api/writings` | 言語化する      |
| **AI レビューページ**    | `/themes/:id/review` | `POST /api/review`   | AI レビュー実行 |

### レビュー履歴

| Pages                          | Paths                      | API Endpoints           | Description                            |
| ------------------------------ | -------------------------- | ----------------------- | -------------------------------------- |
| **ダッシュボード（記録一覧）** | `/dashboard`               | `GET /api/writings`     | ユーザーの記録（文章＋スコア）一覧表示 |
| **言語化記録の詳細ページ**     | `/dashboard/writings/[id]` | `GET /api/writings/:id` | 書いた文章＋ AI フィードバックの表示   |
