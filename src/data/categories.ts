export interface Category {
  key: string;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const CATEGORIES: Category[] = [
  { key: 'cash',    label: '現金・預金',             color: '#3B82F6', bgColor: 'bg-blue-100',   textColor: 'text-blue-700' },
  { key: 'stock',   label: '株式',                   color: '#10B981', bgColor: 'bg-emerald-100', textColor: 'text-emerald-700' },
  { key: 'fund',    label: '投資信託・ロボアド',      color: '#F59E0B', bgColor: 'bg-amber-100',  textColor: 'text-amber-700' },
  { key: 'crypto',  label: '暗号資産',               color: '#F97316', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
  { key: 'gold',    label: '金・貴金属',             color: '#EAB308', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
  { key: 'pension', label: '年金・確定拠出年金（iDeCo）', color: '#14B8A6', bgColor: 'bg-teal-100', textColor: 'text-teal-700' },
  { key: 'other',   label: 'その他',                 color: '#6B7280', bgColor: 'bg-gray-100',   textColor: 'text-gray-700' },
];

// 旧キーを新キーにマッピング（localStorage の既存データ互換）
const KEY_ALIASES: Record<string, string> = {
  jp_stock:     'stock',
  foreign_stock: 'stock',
  robo_advisor: 'fund',
  real_estate:  'other',
  insurance:    'other',
};

export const normalizeKey = (key: string): string => KEY_ALIASES[key] ?? key;

export const getCategoryByKey = (key: string): Category => {
  const normalized = normalizeKey(key);
  return CATEGORIES.find(c => c.key === normalized) ?? CATEGORIES[CATEGORIES.length - 1];
};
