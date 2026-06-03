import { useState, useEffect } from 'react';
import { type Asset } from '../types';
import { CATEGORIES } from '../data/categories';

interface Props {
  asset?: Asset;
  onSave: (data: Omit<Asset, 'id' | 'updatedAt'>) => void;
  onClose: () => void;
}

export function AssetModal({ asset, onSave, onClose }: Props) {
  const [name, setName] = useState(asset?.name ?? '');
  const [category, setCategory] = useState(asset?.category ?? 'cash');
  const [amount, setAmount] = useState(asset?.amount?.toString() ?? '');
  const [quantity, setQuantity] = useState(asset?.quantity?.toString() ?? '');
  const [unitPrice, setUnitPrice] = useState(asset?.unitPrice?.toString() ?? '');
  const [memo, setMemo] = useState(asset?.memo ?? '');

  const isCrypto = category === 'crypto';

  // Auto-calculate amount for crypto
  useEffect(() => {
    if (isCrypto && quantity && unitPrice) {
      const q = parseFloat(quantity);
      const u = parseFloat(unitPrice);
      if (!isNaN(q) && !isNaN(u)) {
        setAmount(String(Math.round(q * u)));
      }
    }
  }, [quantity, unitPrice, isCrypto]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseInt(amount, 10);
    if (!name.trim() || isNaN(amt) || amt < 0) return;
    onSave({
      name: name.trim(),
      category,
      amount: amt,
      quantity: isCrypto && quantity ? parseFloat(quantity) : undefined,
      unitPrice: isCrypto && unitPrice ? parseFloat(unitPrice) : undefined,
      memo: memo.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-white w-full md:w-[480px] md:rounded-2xl rounded-t-2xl shadow-xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-base font-semibold text-gray-800">
            {asset ? '資産を編集' : '資産を追加'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">資産名 *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例: 普通預金 三菱UFJ"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {CATEGORIES.map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Crypto fields */}
          {isCrypto && (
            <div className="bg-orange-50 rounded-xl p-4 space-y-3 border border-orange-100">
              <p className="text-xs font-medium text-orange-600">暗号資産の詳細</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    placeholder="0.00"
                    step="any"
                    min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">単価 (円)</label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={e => setUnitPrice(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              金額 (円) * {isCrypto && <span className="text-xs text-gray-400">(自動計算)</span>}
            </label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              required
              min="0"
              readOnly={isCrypto && !!quantity && !!unitPrice}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
            {amount && !isNaN(parseInt(amount)) && (
              <p className="text-xs text-gray-400 mt-1">
                {parseInt(amount).toLocaleString()}円
              </p>
            )}
          </div>

          {/* Memo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
            <input
              type="text"
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="任意のメモ"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {asset ? '更新する' : '追加する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
