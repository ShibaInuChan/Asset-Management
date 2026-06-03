# 資産管理アプリ

マネーフォワードライクなブラウザ資産管理アプリ。**暗号資産・金などのオルタナティブ資産を伝統的資産と分けて管理**できることが特徴です。

🌐 **[asset-management-nu-seven.vercel.app](https://asset-management-nu-seven.vercel.app)**

## 主な機能

- **ダッシュボード** — 総資産・伝統的資産/オルタナティブ資産/運用資産合計の内訳・カテゴリ別ドーナツグラフ（割合表示）
- **資産一覧** — カテゴリ別グループ表示・追加/編集/削除・ドラッグ&ドロップで並び替え
- **履歴** — 月次スナップショットの記録・折れ線グラフで推移確認
- **データ永続化** — localStorage（サーバー不要、ブラウザ内に保存）
- **レスポンシブ対応** — デスクトップはサイドバー、スマホはボトムナビ

## 資産カテゴリ

| カテゴリ | 分類 | 説明 |
|----------|------|------|
| 現金・預金 | — | 銀行口座、ゆうちょなど |
| 株式 | 伝統的資産 | 国内株・外国株・ETFなど |
| 投資信託・ロボアド | 伝統的資産 | インデックスファンド、ロボアドバイザーなど |
| 年金・確定拠出年金（iDeCo） | 伝統的資産 | 企業型DC・iDeCoなど |
| **暗号資産** | オルタナティブ | BTC・ETHなど（数量×単価で円換算） |
| 金・貴金属 | オルタナティブ | 金・プラチナなど |
| その他 | — | 上記に当てはまらないもの |

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
