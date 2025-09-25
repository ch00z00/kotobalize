# 💡 Kotobalize（コトバライズ）

「技術を言葉で語る力」を鍛える、Web エンジニア向け言語化トレーニングアプリケーション

## 🎯 プロジェクト概要

技術面接や日常業務で求められる「技術的な内容を分かりやすく説明する力」を、AI を活用して効率的にトレーニングできる Web アプリケーションです。
ユーザーは様々なテーマに対して文章を書き、OpenAI GPT-4 による即座のフィードバックを受けることで、説明力・構造化力・語彙力を向上させることができます。

### 解決する課題

- エンジニアの技術面接における説明力不足
- 技術的な内容を非エンジニアに伝える際のコミュニケーション課題
- 自己学習における客観的なフィードバックの欠如

## 🏗️ アーキテクチャ & 技術選定

### 技術スタック

#### フロントエンド

- **Next.js 15** (App Router) - 最新の React フレームワーク
- **TypeScript** - 型安全性の確保
- **Tailwind CSS 4** - 効率的なスタイリング
- **Zustand** - 軽量な状態管理
- **React Testing Library & Jest** - コンポーネントテストと単体テスト
- **Storybook** - コンポーネントの可視化とデバッグ

#### バックエンド

- **Go 1.22** - 高性能・並行処理に優れた言語
- **Gin Framework** - 軽量で高速な Web フレームワーク
- **GORM** - Go 向け ORM
- **JWT 認証** - セキュアな認証システム
- **OpenAI API (GPT-4)** - 高度な AI フィードバック機能
- **golangci-lint** - コンパイラによるコード品質管理

#### インフラストラクチャ

- **Google Cloud Run** - サーバーレスコンテナ実行環境
- **Cloud SQL (MySQL)** - マネージドデータベース
- **GitHub Actions** - CI/CD パイプライン
- **Docker & Docker Compose** - コンテナ化と開発環境
- **Google Secret Manager** - セキュアなシークレット管理

### 設計原則

- **OpenAPI First Development** - API スキーマ駆動開発
- **Clean Architecture** - 疎結合で保守性の高い設計
- **Atomic Design** - 再利用可能なコンポーネント設計
- **Infrastructure as Code** - 再現可能なインフラ構成

## 🚀 主な機能

### 1. 認証システム

- JWT 基盤のセキュアな認証
- メール/パスワードによるユーザー登録・ログイン
- プロフィール管理機能

### 2. 言語化トレーニング

- 多様なテーマから選択して文章作成
- リアルタイムでの文字数カウント
- 下書き自動保存機能

### 3. AI レビュー機能

- GPT-4 による多角的な評価
  - 説明力スコア
  - 構造化スコア
  - 具体抽象変換スコア
  - 語彙力スコア
- 具体的な改善提案と詳細なフィードバック

### 4. 学習記録管理

- 過去の投稿と AI フィードバックの一覧表示
- GitHub 風のコントリビューショングラフ
- お気に入りテーマ管理

## 📊 技術的な工夫点

### 1. OpenAPI 駆動開発

```yaml
# APIスキーマからフロントエンド型定義とバックエンドコードを自動生成
openapi: 3.0.0
paths:
 /api/review:
  post:
   summary: AI review for writing
```

### 2. 非同期処理による UX 向上

- Cloud Run 対応の非ブロッキング起動処理
- データベース接続の非同期初期化
- ヘルスチェックエンドポイントの即座の応答

### 3. 型安全性の確保

- TypeScript による厳密な型定義
- OpenAPI から生成された型の共有
- Go 言語の強い静的型付け

### 4. テスト戦略

- バックエンド: テーブルドリブンテスト
- フロントエンド: コンポーネント単体テスト
- CI/CD パイプラインでの自動テスト実行

## 🛠️ 開発環境セットアップ

### 前提条件

- Docker & Docker Compose
- Node.js 20+
- Go 1.22+

### 起動手順

```bash
# リポジトリのクローン
git clone https://github.com/ch00z00/kotobalize.git
cd kotobalize

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してOpenAI APIキーなどを設定

# Docker Composeで起動
docker-compose up -d

# フロントエンド開発サーバー
cd frontend
npm install
npm run dev

# バックエンド開発サーバー
cd backend/generated-server
go run main.go
```

## 📈 今後の展望

- **機能拡張**
  - 音声入力対応
  - 多言語対応
- **技術的改善**
  - ページ遷移速度改善
  - モバイルアプリ版の開発
