# 資産管理アプリ

マネーフォワードライクなブラウザ資産管理アプリ。**暗号資産を現金・預金と分けて管理**できることが特徴です。

🌐 **[asset-management-nu-seven.vercel.app](https://asset-management-nu-seven.vercel.app)**

## 主な機能

- **ダッシュボード** — 総資産・カテゴリ別ドーナツグラフ・割合表示
- **資産一覧** — カテゴリ別グループ表示・追加/編集/削除
- **履歴** — 月次スナップショットの記録・折れ線グラフで推移確認
- **データ永続化** — localStorage（サーバー不要、ブラウザ内に保存）
- **レスポンシブ対応** — デスクトップはサイドバー、スマホはボトムナビ

## 資産カテゴリ

| カテゴリ | 説明 |
|----------|------|
| 現金・預金 | 銀行口座、ゆうちょなど |
| 国内株式 | 日本株 |
| 外国株式 | 米国株・ETFなど |
| 投資信託 | インデックスファンドなど |
| **暗号資産** | BTC・ETHなど（数量×単価で円換算） |
| 不動産 | マンション・土地など |
| 保険 | 解約返戻金など |
| その他 | 上記に当てはまらないもの |

## 技術スタック

- [React](https://react.dev/) + [Vite](https://vite.dev/) + TypeScript
- [Tailwind CSS v3](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)（グラフ）
- [React Router](https://reactrouter.com/)

## ローカル開発

```bash
git clone https://github.com/ShibaInuChan/Asset-Management.git
cd Asset-Management
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開く。

## デプロイ

mainブランチへのプッシュで Vercel が自動デプロイします。
