import { useAssets } from '../hooks/useAssets';
import { useSnapshots } from '../hooks/useSnapshots';
import { CATEGORIES } from '../data/categories';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function formatJPY(amount: number): string {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(2)}億円`;
  if (amount >= 10000) return `${Math.floor(amount / 10000).toLocaleString()}万円`;
  return `${amount.toLocaleString()}円`;
}

export function History() {
  const { assets } = useAssets();
  const { snapshots, recordSnapshot, deleteSnapshot } = useSnapshots();

  const sorted = [...snapshots].sort((a, b) => a.date.localeCompare(b.date));

  const chartData = sorted.map(s => ({
    date: s.date,
    total: s.total,
  }));

  function handleRecord() {
    recordSnapshot(assets);
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">履歴</h1>
          <p className="text-sm text-gray-500 mt-1">月次スナップショット</p>
        </div>
        <button
          onClick={handleRecord}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          今月を記録
        </button>
      </div>

      {/* Line chart */}
      {chartData.length > 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">総資産の推移</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis
                tickFormatter={v => {
                  if (v >= 100000000) return `${(v / 100000000).toFixed(1)}億`;
                  if (v >= 10000) return `${Math.round(v / 10000)}万`;
                  return String(v);
                }}
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                width={60}
              />
              <Tooltip
                formatter={(value) => [formatJPY(Number(value)), '総資産']}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3B82F6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#3B82F6' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Snapshot table */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">📈</p>
          <p>スナップショットがありません。「今月を記録」で記録してください。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...sorted].reverse().map(snap => (
            <div key={snap.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-800">{snap.date}</h3>
                  <p className="text-xl font-bold text-blue-600 mt-0.5">{formatJPY(snap.total)}</p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('このスナップショットを削除しますか？')) deleteSnapshot(snap.id);
                  }}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  削除
                </button>
              </div>
              <div className="space-y-1.5">
                {CATEGORIES.filter(c => (snap.byCategory[c.key] ?? 0) > 0).map(cat => {
                  const amt = snap.byCategory[cat.key] ?? 0;
                  const pct = snap.total > 0 ? Math.round((amt / snap.total) * 100) : 0;
                  return (
                    <div key={cat.key} className="flex items-center gap-3">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${cat.bgColor} ${cat.textColor} w-24 text-center flex-shrink-0`}>
                        {cat.label}
                      </span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 w-24 text-right">{formatJPY(amt)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
