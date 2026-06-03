import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAssets } from '../hooks/useAssets';
import { CATEGORIES, getCategoryByKey } from '../data/categories';
import { formatJPY, formatJPYShort } from '../utils/format';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

export function Dashboard() {
  const { assets } = useAssets();

  const total = assets.reduce((s, a) => s + a.amount, 0);

  // Aggregate by category
  const byCategory: Record<string, number> = {};
  for (const asset of assets) {
    byCategory[asset.category] = (byCategory[asset.category] ?? 0) + asset.amount;
  }

  const chartData = CATEGORIES.filter(c => (byCategory[c.key] ?? 0) > 0).map(c => ({
    name: c.label,
    value: byCategory[c.key] ?? 0,
    color: c.color,
  }));

  const recentAssets = [...assets]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ダッシュボード</h1>
        <p className="text-sm text-gray-500 mt-1">資産の概要</p>
      </div>

      {/* Total net assets */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <p className="text-sm font-medium opacity-80">総資産</p>
        <p className="text-4xl font-bold mt-1">{formatJPY(total)}</p>
      </div>

      {/* Chart + Category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Donut chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">カテゴリ別内訳</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => {
                    const amt = Number(value);
                    const pct = total > 0 ? ((amt / total) * 100).toFixed(1) : '0.0';
                    return [`${formatJPYShort(amt)}（${pct}%）`, name];
                  }}
                  contentStyle={{ fontSize: 12 }}
                />
                <Legend
                  iconSize={10}
                  formatter={(value) => <span style={{ fontSize: 11 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-400 text-sm">
              資産がありません
            </div>
          )}
        </div>

        {/* Category summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">カテゴリ別合計</h2>
          <div className="space-y-4">
            {CATEGORIES.filter(c => (byCategory[c.key] ?? 0) > 0).map(cat => {
              const amt = byCategory[cat.key] ?? 0;
              const pct = total > 0 ? (amt / total) * 100 : 0;
              const pctDisplay = total > 0 ? pct.toFixed(1) : '0.0';
              return (
                <div key={cat.key}>
                  <div className="flex justify-between items-baseline text-sm mb-1.5">
                    <span className={`font-medium ${cat.textColor}`}>{cat.label}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-gray-400">{pctDisplay}%</span>
                      <span className="text-gray-700 font-semibold">{formatJPYShort(amt)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
            {CATEGORIES.every(c => !byCategory[c.key]) && (
              <p className="text-sm text-gray-400 text-center py-4">資産がありません</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent assets */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-600 mb-4">最近の資産</h2>
        {recentAssets.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {recentAssets.map(asset => {
              const cat = getCategoryByKey(asset.category);
              return (
                <div key={asset.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${cat.bgColor} ${cat.textColor}`}>
                      {cat.label}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{asset.name}</p>
                      <p className="text-xs text-gray-400">{formatDate(asset.updatedAt)}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{formatJPY(asset.amount)}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">資産がありません</p>
        )}
      </div>
    </div>
  );
}
