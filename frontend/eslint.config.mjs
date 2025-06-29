import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // next/core-web-vitals には prettier の設定が含まれていますが、
  // 明示的に最後に prettier を指定することで、
  // 他のルールとの競合を確実に防ぎます。
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
];

export default eslintConfig;
