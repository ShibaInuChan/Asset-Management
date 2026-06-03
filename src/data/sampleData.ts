import { type Asset, type Snapshot } from '../types';

const now = new Date().toISOString();

export const sampleAssets: Asset[] = [
  { id: '1', name: '普通預金 三菱UFJ', category: 'cash', amount: 500000, memo: '', updatedAt: now },
  { id: '2', name: '定期預金 ゆうちょ', category: 'cash', amount: 1000000, memo: '', updatedAt: now },
  { id: '3', name: 'トヨタ株', category: 'jp_stock', amount: 300000, memo: '', updatedAt: now },
  { id: '4', name: 'S&P500 ETF', category: 'foreign_stock', amount: 450000, memo: '', updatedAt: now },
  { id: '5', name: 'eMAXIS Slim 全世界株', category: 'fund', amount: 200000, memo: '', updatedAt: now },
  { id: '6', name: 'Bitcoin', category: 'crypto', amount: 2100000, quantity: 0.15, unitPrice: 14000000, memo: 'BTC', updatedAt: now },
  { id: '7', name: 'Ethereum', category: 'crypto', amount: 1000000, quantity: 2, unitPrice: 500000, memo: 'ETH', updatedAt: now },
];

const totalNow = sampleAssets.reduce((s, a) => s + a.amount, 0);

function buildByCategory(assets: Asset[]): Record<string, number> {
  return assets.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + a.amount;
    return acc;
  }, {} as Record<string, number>);
}

function monthOffset(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const growthFactors = [0.82, 0.86, 0.90, 0.94, 0.97, 1.0];
const baseByCategory = buildByCategory(sampleAssets);

export const sampleSnapshots: Snapshot[] = growthFactors.map((f, i) => {
  const monthsAgo = 5 - i;
  const date = monthOffset(monthsAgo);
  const total = Math.round(totalNow * f);
  const byCategory: Record<string, number> = {};
  for (const [k, v] of Object.entries(baseByCategory)) {
    byCategory[k] = Math.round(v * f);
  }
  return {
    id: `snap-${i}`,
    date,
    total,
    byCategory,
    createdAt: new Date().toISOString(),
  };
});
