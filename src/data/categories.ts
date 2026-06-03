export interface Category {
  key: string;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const CATEGORIES: Category[] = [
  { key: 'cash', label: '現金・預金', color: '#3B82F6', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  { key: 'jp_stock', label: '国内株式', color: '#10B981', bgColor: 'bg-emerald-100', textColor: 'text-emerald-700' },
  { key: 'foreign_stock', label: '外国株式', color: '#6366F1', bgColor: 'bg-indigo-100', textColor: 'text-indigo-700' },
  { key: 'fund', label: '投資信託', color: '#F59E0B', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  { key: 'crypto', label: '暗号資産', color: '#F97316', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
  { key: 'real_estate', label: '不動産', color: '#8B5CF6', bgColor: 'bg-violet-100', textColor: 'text-violet-700' },
  { key: 'insurance', label: '保険', color: '#EC4899', bgColor: 'bg-pink-100', textColor: 'text-pink-700' },
  { key: 'pension', label: '年金・iDeCo', color: '#14B8A6', bgColor: 'bg-teal-100', textColor: 'text-teal-700' },
  { key: 'other', label: 'その他', color: '#6B7280', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
];

export const getCategoryByKey = (key: string): Category =>
  CATEGORIES.find(c => c.key === key) ?? CATEGORIES[CATEGORIES.length - 1];
