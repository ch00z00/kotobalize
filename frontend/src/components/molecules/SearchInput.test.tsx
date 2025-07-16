import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SearchInput from './SearchInput';

describe('SearchInput Component', () => {
  it('ケース1: `value`プロパティの値がインプットに正しく表示される', () => {
    render(<SearchInput value="テスト検索" onChange={() => {}} />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveValue('テスト検索');
  });

  it('ケース2: テキストを入力すると`onChange`コールバックがトリガーされる', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<SearchInput value="" onChange={handleChange} />);

    const inputElement = screen.getByRole('textbox');
    await user.type(inputElement, 'キーワード');

    // 'キーワード'の5文字分、onChangeが呼び出されることを確認
    expect(handleChange).toHaveBeenCalledTimes(5);
  });

  it('ケース3: `value`プロパティが空文字列の場合', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveValue('');
  });

  it('ケース4: `placeholder`プロパティを明示的に指定した場合', () => {
    render(
      <SearchInput value="" onChange={() => {}} placeholder="記事を検索する" />
    );
    expect(screen.getByPlaceholderText('記事を検索する')).toBeInTheDocument();
  });

  it('ケース5: `placeholder`プロパティを省略した場合', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(
      screen.getByPlaceholderText('キーワードで検索...')
    ).toBeInTheDocument();
  });
});
