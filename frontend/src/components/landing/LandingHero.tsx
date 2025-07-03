'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import localFont from 'next/font/local';

const monumentExtended = localFont({
  src: '../../../public/fonts/MonumentExtended-Ultrabold.otf',
  display: 'swap',
});

export default function LandingHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="container mx-auto flex h-[calc(100vh-68px)] items-center justify-center text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          variants={itemVariants}
          className={`font-bold tracking-wide text-primary text-[10vw] ${monumentExtended.className}`}
        >
          Kotobalize
        </motion.h1>
        <motion.h2
          variants={itemVariants}
          className="mt-4 font-bold tracking-tight text-gray-900 text-[4vw]"
        >
          言語化で、差をつけろ。
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="mt-6 text-gray-600 text-[3vw] sm:text-lg"
        >
          Kotobalizeは、エンジニアの「技術を言葉で語る力」を鍛えるための
          <br />
          言語化トレーニングプラットフォームです。
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="mt-10 flex items-center justify-center gap-x-6"
        >
          <Link
            href="/themes"
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            トレーニングを始める
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            新規登録 <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
