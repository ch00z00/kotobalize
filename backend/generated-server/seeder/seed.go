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
			Title:       "RESTful APIの設計原則について説明してください。",
			Description: "ステートレス性、統一インターフェースなどの主要な原則を含めて、RESTful APIがなぜ広く使われているのかを説明してください。",
			Category:    "バックエンド",
		},
		{
			Title:       "Reactの仮想DOMについて説明してください。",
			Description: "仮想DOMがなぜパフォーマンス向上に寄与するのか、実際のDOMとの差分検出アルゴリズム（Reconciliation）の概要と合わせて説明してください。",
			Category:    "フロントエンド",
		},
		{
			Title:       "Dockerコンテナと仮想マシンの違いを説明してください。",
			Description: "アーキテクチャ、リソース効率、起動速度の観点から、それぞれのメリット・デメリットを比較して説明してください。",
			Category:    "インフラ",
		},
	}

	if err := db.Create(&themes).Error; err != nil {
		log.Fatalf("Failed to seed themes: %v", err)
	}

	log.Println("Database seeded with initial themes.")
}