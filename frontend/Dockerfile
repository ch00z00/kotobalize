# Stage 1: Builder
# 依存関係のインストールとアプリケーションのビルドを行います
FROM node:20-alpine AS builder
WORKDIR /app

# package.jsonとlockファイルをコピー
COPY package.json ./
COPY package-lock.json ./
# yarnやpnpmを使用している場合は、yarn.lockやpnpm-lock.yamlをコピーしてください

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# Next.jsアプリケーションをビルド
# 注意: next.config.jsに `output: 'standalone'` を設定してください
RUN npm run build

# Stage 2: Runner
# ビルドされたアプリケーションを実行するための最小限のイメージを作成します
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# ビルダーからスタンドアロンの出力と静的ファイルをコピー
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

# アプリケーションを起動
CMD ["node", "server.js"]