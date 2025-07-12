package seeder

import (
	"log"

	"github.com/ch00z00/kotobalize/models"
	"gorm.io/gorm"
)

// SeedThemes populates the database with initial theme data.
// It checks if themes already exist to avoid creating duplicates on restart.
func SeedThemes(db *gorm.DB) {
	var count int64
	db.Model(&models.GormTheme{}).Count(&count)
	if count > 0 {
		// If themes exist, do not seed again.
		return
	}

	themes := []models.GormTheme{
		{
			// --- バックエンド ---
			Title:              "RESTful APIの設計原則について説明してください。",
			Description:        "ステートレス性、統一インターフェースなどの主要な原則を含めて、RESTful APIがなぜ広く使われているのかを説明してください。",
			Category:           "バックエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "マイクロサービスアーキテクチャのメリット・デメリットを説明してください。",
			Description:        "モノリシックアーキテクチャと比較し、スケーラビリティ、開発効率、運用の複雑さなどの観点から説明してください。",
			Category:           "バックエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "JWT (JSON Web Token) を用いた認証の仕組みを説明してください。",
			Description:        "ヘッダー、ペイロード、署名の構造と、セッションベース認証との違いについて説明してください。",
			Category:           "バックエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "データベースのトランザクションとACID特性について説明してください。",
			Description:        "原子性(Atomicity)、一貫性(Consistency)、独立性(Isolation)、永続性(Durability)の4つの特性がなぜ重要なのかを説明してください。",
			Category:           "バックエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "N+1問題とは何か、そしてそれをどのように解決しますか？",
			Description:        "具体的なコード例を交えながら、N+1問題が発生するシナリオと、Eager Loadingなどの解決策を説明してください。",
			Category:           "バックエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "キャッシュ戦略について説明してください。",
			Description:        "Write-Through, Write-Back, Read-Aroundなどの代表的なキャッシュ戦略を挙げ、それぞれのユースケースを説明してください。",
			Category:           "バックエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "gRPCとREST APIの違いについて説明してください。",
			Description:        "通信プロトコル、データフォーマット、パフォーマンスなどの観点から両者を比較してください。",
			Category:           "バックエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "サーバーサイドのセキュリティ対策として、どのようなことを考慮しますか？",
			Description:        "SQLインジェクション、クロスサイトスクリプティング(XSS)、CSRFなどの代表的な脆弱性と、その対策について説明してください。",
			Category:           "バックエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "オブジェクト指向プログラミングのSOLID原則について説明してください。",
			Description:        "単一責任、オープン/クローズド、リスコフの置換、インターフェース分離、依存性逆転の各原則を説明してください。",
			Category:           "バックエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "インデックスがデータベースのパフォーマンスにどのように影響するか説明してください。",
			Description:        "インデックスの基本的な仕組みと、SELECTクエリの高速化における役割、そしてINSERT/UPDATE時のオーバーヘッドについて説明してください。",
			Category:           "バックエンド",
			TimeLimitInSeconds: 300,
		},

		// --- フロントエンド ---
		{
			Title:              "Reactの仮想DOMについて説明してください。",
			Description:        "仮想DOMがなぜパフォーマンス向上に寄与するのか、実際のDOMとの差分検出アルゴリズム（Reconciliation）の概要と合わせて説明してください。",
			Category:           "フロントエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "State Management in Frontend の必要性について説明してください。",
			Description:        "コンポーネント間の状態の受け渡し（Prop Drilling）の問題点と、状態管理ライブラリ(Redux, Zustandなど)がそれをどのように解決するのかを説明してください。",
			Category:           "フロントエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "SSR, SSG, ISRの違いについて説明してください。",
			Description:        "それぞれのレンダリング戦略がどのようなユースケースに適しているか、パフォーマンスやSEOの観点から説明してください。",
			Category:           "フロントエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "ブラウザのレンダリングプロセス（クリティカルレンダリングパス）について説明してください。",
			Description:        "HTMLのパースからDOMツリー構築、レンダツリー構築、レイアウト、ペイントまでの一連の流れを説明してください。",
			Category:           "フロントエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "CORS（Cross-Origin Resource Sharing）とは何か、なぜ必要なのか説明してください。",
			Description:        "同一オリジンポリシーの制約と、CORSがどのようにして安全なクロスオリジンリクエストを可能にするのかを説明してください。",
			Category:           "フロントエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "WebpackやViteのようなモジュールバンドラーの役割について説明してください。",
			Description:        "複数のJavaScriptファイルやCSS、画像を一つにまとめ、最適化する目的と、そのプロセスを説明してください。",
			Category:           "フロントエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "パフォーマンス最適化のためにフロントエンドでできることは何ですか？",
			Description:        "コード分割、遅延読み込み、画像最適化、ブラウザキャッシュの活用など、具体的な手法をいくつか挙げてください。",
			Category:           "フロントエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "アクセシビリティ（a11y）を向上させるために、どのような実装を心がけますか？",
			Description:        "セマンティックHTMLの使用、適切なalt属性の設定、キーボード操作の担保など、具体的な実践方法を説明してください。",
			Category:           "フロントエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "TypeScriptを導入するメリットとデメリットについて説明してください。",
			Description:        "静的型付けによるコードの堅牢性向上や開発者体験の向上といったメリットと、学習コストやコンパイル時間などのデメリットを比較してください。",
			Category:           "フロントエンド",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "React Hooks（useState, useEffectなど）の基本的な使い方と注意点を説明してください。",
			Description:        "代表的なフックをいくつか挙げ、それぞれの役割と、フックのルール（トップレベルで呼び出すなど）について説明してください。",
			Category:           "フロントエンド",
			TimeLimitInSeconds: 300,
		},

		// --- インフラ ---
		{
			Title:              "Dockerコンテナと仮想マシンの違いを説明してください。",
			Description:        "アーキテクチャ、リソース効率、起動速度の観点から、それぞれのメリット・デメリットを比較して説明してください。",
			Category:           "インフラ",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "CI/CDパイプラインの目的と主要なステージについて説明してください。",
			Description:        "継続的インテグレーションと継続的デリバリー/デプロイメントの違いを含め、自動化がもたらすメリットについて説明してください。",
			Category:           "インフラ",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "Infrastructure as Code (IaC) とは何か、そのメリットを説明してください。",
			Description:        "手動でのインフラ管理と比較し、IaC（例: Terraform）がもたらす再現性、バージョン管理、効率性の利点を説明してください。",
			Category:           "インフラ",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "Kubernetesの主要なコンポーネントの役割を説明してください。",
			Description:        "Pod, Service, Deployment, ReplicaSetなどの基本的なリソースが、コンテナオーケストレーションにおいてどのような役割を果たすかを説明してください。",
			Category:           "インフラ",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "サーバーレスアーキテクチャの利点と欠点を説明してください。",
			Description:        "コスト、スケーラビリティ、運用負荷の観点からメリットを、そしてベンダーロックインやコールドスタートなどのデメリットを説明してください。",
			Category:           "インフラ",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "ロードバランサーの役割と、代表的なアルゴリズムについて説明してください。",
			Description:        "トラフィックを分散させる目的と、ラウンドロビンやリーストコネクションなどの分散アルゴリズムを説明してください。",
			Category:           "インフラ",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "監視（モニタリング）の重要性と、監視するべき主要なメトリクスについて説明してください。",
			Description:        "システムの健全性を保つための監視の目的と、CPU使用率、メモリ使用率、レイテンシ、エラーレートなどのメトリクスを説明してください。",
			Category:           "インフラ",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "ブルー/グリーンデプロイメントとカナリアリリースの違いを説明してください。",
			Description:        "それぞれのデプロイ戦略のプロセスと、リスク管理やダウンタイムの観点からの違いを比較してください。",
			Category:           "インフラ",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "DNSがどのように名前解決を行うか、そのプロセスを説明してください。",
			Description:        "ブラウザにURLが入力されてから、対応するIPアドレスが返されるまでの、再帰的クエリと権威DNSサーバーの役割を含めた流れを説明してください。",
			Category:           "インフラ",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "パブリッククラウド（AWS, GCP, Azure）の主なサービスを比較してください。",
			Description:        "コンピューティング、ストレージ、データベースの各カテゴリで代表的なサービスを挙げ、それぞれの特徴や違いを説明してください。",
			Category:           "インフラ",
			TimeLimitInSeconds: 300,
		},

		// --- データベース ---
		{
			Title:              "SQLとNoSQLデータベースの主な違いを説明してください。",
			Description:        "データモデル、スケーラビリティ、一貫性の観点から両者を比較し、それぞれの代表的なユースケースを挙げてください。",
			Category:           "データベース",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "データベースの正規化について、第3正規形まで説明してください。",
			Description:        "データの冗長性を排除し、一貫性を保つための正規化の目的と、各正規形の定義を説明してください。",
			Category:           "データベース",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "B-Treeインデックスとハッシュインデックスの違いについて説明してください。",
			Description:        "それぞれのデータ構造、検索性能（範囲検索、等価検索）、そしてどのようなクエリに適しているかを比較してください。",
			Category:           "データベース",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "デッドロックとは何か、その発生原因と対策について説明してください。",
			Description:        "複数のトランザクションが互いのロック解放を待ち、処理が進まなくなる現象について、その発生条件と回避策を説明してください。",
			Category:           "データベース",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "レプリケーションとシャーディングの違いと、それぞれの目的を説明してください。",
			Description:        "可用性向上のためのレプリケーションと、スケーラビリティ向上のためのシャーディングについて、仕組みと目的の違いを説明してください。",
			Category:           "データベース",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "CAP定理について説明してください。",
			Description:        "分散システムにおける一貫性(Consistency)、可用性(Availability)、分断耐性(Partition tolerance)のトレードオフを説明してください。",
			Category:           "データベース",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "ORM（Object-Relational Mapping）を使用するメリットとデメリットについて説明してください。",
			Description:        "開発効率の向上などのメリットと、複雑なクエリのパフォーマンス問題などのデメリットを説明してください。",
			Category:           "データベース",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "クエリオプティマイザの役割と、実行計画の重要性について説明してください。",
			Description:        "SQLクエリを効率的に実行するための最適なアクセスパスを決定する仕組みと、その確認方法の重要性を説明してください。",
			Category:           "データベース",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "データベースのバックアップとリカバリ戦略について、どのような点を考慮しますか？",
			Description:        "RPO（目標復旧時点）とRTO（目標復旧時間）、バックアップの種類（フル、差分、増分）などの観点から説明してください。",
			Category:           "データベース",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "マテリアライズドビューとは何か、どのような場合に有効か説明してください。",
			Description:        "クエリ結果を実体として保存する仕組みと、集計など重いクエリのパフォーマンスを向上させるユースケースを説明してください。",
			Category:           "データベース",
			TimeLimitInSeconds: 300,
		},

		// --- アルゴリズム・データ構造 ---
		{
			Title:              "配列と連結リストの違いについて、計算量の観点から説明してください。",
			Description:        "要素へのアクセス、挿入、削除における計算量の違いと、それぞれのデータ構造が適したユースケースを説明してください。",
			Category:           "アルゴリズム・データ構造",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "スタックとキューのデータ構造と、それぞれのユースケースを説明してください。",
			Description:        "LIFO（後入れ先出し）のスタックとFIFO（先入れ先出し）のキューの特性と、具体的な使用例（関数呼び出し、タスク処理など）を挙げてください。",
			Category:           "アルゴリズム・データ構造",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "ハッシュテーブルがどのように機能し、ハッシュの衝突をどのように解決するか説明してください。",
			Description:        "キーからハッシュ値を計算してデータを格納する仕組みと、チェイン法やオープンアドレス法などの衝突解決戦略を説明してください。",
			Category:           "アルゴリズム・データ構造",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "二分探索木の探索、挿入、削除のアルゴリズムを説明してください。",
			Description:        "大小関係に基づいてデータを格納する二分探索木の特性と、各操作の基本的なアルゴリズムを説明してください。",
			Category:           "アルゴリズム・データ構造",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "代表的なソートアルゴリズムを比較してください。",
			Description:        "バブルソート、クイックソート、マージソートなどを挙げ、それぞれの平均計算量、最悪計算量、安定性について比較してください。",
			Category:           "アルゴリズム・データ構造",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "計算量（オーダー）の概念を説明してください。",
			Description:        "O(1), O(n), O(log n), O(n^2)などの記法を用いて、アルゴリズムの効率を評価する考え方を説明してください。",
			Category:           "アルゴリズム・データ構造",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "動的計画法（Dynamic Programming）とは何か、具体的な例を挙げて説明してください。",
			Description:        "部分問題を解いてその結果を再利用することで、より大きな問題を解くアプローチについて、フィボナッチ数列やナップサック問題を例に説明してください。",
			Category:           "アルゴリズム・データ構造",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "グラフデータ構造における深さ優先探索（DFS）と幅優先探索（BFS）の違いを説明してください。",
			Description:        "それぞれの探索アルゴリズムの進め方と、どのような問題（最短経路探索、連結成分の検出など）に適しているかを説明してください。",
			Category:           "アルゴリズム・データ構造",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "再帰的なアルゴリズムのメリットとデメリットを説明してください。",
			Description:        "コードの可読性の高さなどのメリットと、スタックオーバーフローのリスクやパフォーマンスのオーバーヘッドなどのデメリットを説明してください。",
			Category:           "アルゴリズム・データ構造",
			TimeLimitInSeconds: 300,
		},
		{
			Title:              "木構造（Tree）とグラフ（Graph）の違いについて説明してください。",
			Description:        "ノードとエッジから構成される点での共通点と、閉路の有無や親子関係などの構造的な違いを説明してください。",
			Category:           "アルゴリズム・データ構造",
			TimeLimitInSeconds: 300,
		},
	}

	if err := db.Create(&themes).Error; err != nil {
		log.Fatalf("Failed to seed themes: %v", err)
	}

	log.Println("Database seeded with initial themes.")
}