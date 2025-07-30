'use client';

import { Book, Brain, Target, TrendingUp, Users, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import LinkButton from '@/components/atoms/LinkButton';
import { useEffect, useState } from 'react';
import FeatureCard from '@/components/about/FeatureCard';
import StepCard from '@/components/about/StepCard';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 text-5xl font-bold">Kotobalizeについて</h1>
          <p className="mx-auto max-w-2xl text-xl">
            技術を言葉で語る力を鍛える、エンジニア向け言語化トレーニングプラットフォーム
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              私たちのミッション
            </h2>
            <p className="mb-6 text-lg text-gray-700">
              エンジニアにとって、技術力と同じくらい重要なのが「伝える力」です。
              複雑な技術概念を分かりやすく説明し、チームメンバーやステークホルダーと
              効果的にコミュニケーションを取ることは、キャリアの成功に不可欠です。
            </p>
            <p className="text-lg text-gray-700">
              Kotobalizeは、AIを活用してエンジニアの言語化スキルを
              体系的に向上させることを目指しています。
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Kotobalizeの特徴
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Brain className="h-8 w-8" />}
              title="AI による即時フィードバック"
              description="GPT-4を活用し、説明力・構造化力・語彙力など多角的な観点から文章を分析します。"
            />
            <FeatureCard
              icon={<Target className="h-8 w-8" />}
              title="実践的なテーマ"
              description="技術面接や日常業務で実際に必要となるシチュエーションを想定したテーマを提供します。"
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="成長の可視化"
              description="継続的な練習記録と成長の軌跡をグラフで確認し、モチベーションを維持します。"
            />
            <FeatureCard
              icon={<Book className="h-8 w-8" />}
              title="体系的な学習"
              description="初級から上級まで、段階的にスキルアップできるカリキュラムを用意しています。"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="効率的な練習"
              description="短時間で集中的に練習できる設計により、忙しいエンジニアでも継続可能です。"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="コミュニティ"
              description="他のユーザーの優れた回答から学び、互いに成長できる環境を提供します。"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            使い方
          </h2>
          <div className="mx-auto max-w-4xl">
            <div className="space-y-8">
              <StepCard
                number="1"
                title="テーマを選ぶ"
                description="技術面接、設計説明、障害対応など、様々なシチュエーションから練習したいテーマを選択します。"
              />
              <StepCard
                number="2"
                title="文章を書く"
                description="制限時間内に、与えられたテーマについて分かりやすく説明する文章を作成します。"
              />
              <StepCard
                number="3"
                title="AIレビューを受ける"
                description="提出した文章に対して、AIが詳細なフィードバックとスコアを提供します。"
              />
              <StepCard
                number="4"
                title="改善を重ねる"
                description="フィードバックを参考に、同じテーマや新しいテーマで練習を続けて上達します。"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            今すぐ言語化スキルを向上させよう
          </h2>
          <p className="mb-8 text-xl">
            無料で始められます。クレジットカード不要。
          </p>
          <LinkButton
            href={mounted && isLoggedIn ? '/themes' : '/signup'}
            variant="primary"
            className="px-8 py-3 text-lg"
          >
            {mounted && isLoggedIn ? 'テーマ一覧へ' : '無料で始める'}
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
