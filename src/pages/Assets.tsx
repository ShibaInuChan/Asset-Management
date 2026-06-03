import { useState, useRef } from 'react';
import { useAssets } from '../hooks/useAssets';
import { CATEGORIES } from '../data/categories';
import type { Asset } from '../types';
import { formatJPY } from '../utils/format';

const EMPTY_FORM = {
  name: '',
  category: 'cash',
  amount: '',
  quantity: '',
  unitPrice: '',
  memo: '',
};

export function Assets() {
  const { assets, addAsset, updateAsset, deleteAsset, reorderAssets } = useAssets();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [touchDraggingId, setTouchDraggingId] = useState<string | null>(null);
  const [touchOverIdState, setTouchOverIdState] = useState<string | null>(null);
  const dragId = useRef<string | null>(null);
  const touchDragId = useRef<string | null>(null);
  const touchOverId = useRef<string | null>(null);
  const touchStartY = useRef<number>(0);
  const touchDragging = useRef(false);

  const isCrypto = form.category === 'crypto';

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(asset: Asset) {
    setEditing(asset);
    setForm({
      name: asset.name,
      category: asset.category,
      amount: asset.amount.toString(),
      quantity: asset.quantity?.toString() ?? '',
      unitPrice: asset.unitPrice?.toString() ?? '',
      memo: asset.memo ?? '',
    });
    setShowModal(true);
  }

  function handleCryptoCalc(field: 'quantity' | 'unitPrice', value: string) {
    const next = { ...form, [field]: value };
    const q = parseFloat(next.quantity);
    const p = parseFloat(next.unitPrice);
    if (!isNaN(q) && !isNaN(p)) {
      next.amount = Math.round(q * p).toString();
    }
    setForm(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseInt(form.amount, 10);
    if (!form.name || isNaN(amount)) return;

    const data = {
      name: form.name,
      category: form.category,
      amount,
      quantity: isCrypto && form.quantity ? parseFloat(form.quantity) : undefined,
      unitPrice: isCrypto && form.unitPrice ? parseFloat(form.unitPrice) : undefined,
      memo: form.memo,
    };

    if (editing) {
      updateAsset(editing.id, data);
    } else {
      addAsset(data);
    }
    setShowModal(false);
  }

  function handleDelete(id: string) {
    if (confirm('この資産を削除しますか？')) deleteAsset(id);
  }

  // Mouse drag handlers
  function handleDragStart(id: string) { dragId.current = id; }
  function handleDragOver(e: React.DragEvent, id: string) { e.preventDefault(); setDragOverId(id); }
  function handleDrop(toId: string) {
    if (dragId.current) reorderAssets(dragId.current, toId);
    dragId.current = null;
    setDragOverId(null);
  }
  function handleDragEnd() { dragId.current = null; setDragOverId(null); }

  // Touch drag handlers
  function handleTouchStart(e: React.TouchEvent, id: string) {
    touchDragId.current = id;
    touchDragging.current = false;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchMove(e: React.TouchEvent) {
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (!touchDragging.current) {
      if (dy < 10) return; // まだ動いていない、スクロールを妨げない
      touchDragging.current = true;
      setTouchDraggingId(touchDragId.current);
    }
    e.preventDefault();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const li = el?.closest('[data-asset-id]') as HTMLElement | null;
    const overId = li?.dataset.assetId ?? null;
    if (overId !== touchOverId.current) {
      touchOverId.current = overId;
      setTouchOverIdState(overId !== touchDragId.current ? overId : null);
    }
  }

  function handleTouchEnd() {
    if (touchDragging.current && touchDragId.current && touchOverId.current && touchDragId.current !== touchOverId.current) {
      reorderAssets(touchDragId.current, touchOverId.current);
    }
    touchDragId.current = null;
    touchOverId.current = null;
    touchDragging.current = false;
    setTouchDraggingId(null);
    setTouchOverIdState(null);
  }

  // Group assets by category
  const grouped = CATEGORIES.map(cat => ({
    cat,
    items: assets.filter(a => a.category === cat.key),
    total: assets.filter(a => a.category === cat.key).reduce((s, a) => s + a.amount, 0),
  })).filter(g => g.items.length > 0);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">資産一覧</h1>
          <p className="text-sm text-gray-500 mt-1">{assets.length}件の資産</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <span className="text-lg leading-none">+</span> 追加
        </button>
      </div>

      {grouped.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">💰</p>
          <p>資産がありません。追加してください。</p>
        </div>
      )}

      <div className="space-y-6">
        {grouped.map(({ cat, items, total }) => (
          <div key={cat.key} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${cat.bgColor} ${cat.textColor}`}>
                {cat.label}
              </span>
              <span className="text-sm font-bold text-gray-700">{formatJPY(total)}</span>
            </div>
            <ul className="divide-y divide-gray-50">
              {items.map(asset => (
                <li
                  key={asset.id}
                  data-asset-id={asset.id}
                  draggable
                  onDragStart={() => handleDragStart(asset.id)}
                  onDragOver={e => handleDragOver(e, asset.id)}
                  onDrop={() => handleDrop(asset.id)}
                  onDragEnd={handleDragEnd}
                  className={[
                    'flex items-center justify-between px-5 py-4 transition-colors',
                    dragOverId === asset.id || touchOverIdState === asset.id ? 'border-t-2 border-blue-400 bg-blue-50' : '',
                    touchDraggingId === asset.id ? 'opacity-40' : '',
                  ].join(' ')}
                >
                  <div
                    className="text-gray-400 cursor-grab active:cursor-grabbing mr-3 select-none text-xl leading-none touch-none p-1"
                    onTouchStart={e => handleTouchStart(e, asset.id)}
                    onTouchMove={e => handleTouchMove(e)}
                    onTouchEnd={() => handleTouchEnd()}
                  >⠿</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{asset.name}</p>
                    {asset.quantity != null && asset.unitPrice != null && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {asset.quantity} × {formatJPY(asset.unitPrice)}
                      </p>
                    )}
                    {asset.memo && <p className="text-xs text-gray-400 mt-0.5">{asset.memo}</p>}
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <p className="text-sm font-bold text-gray-800">{formatJPY(asset.amount)}</p>
                    <button onClick={() => openEdit(asset)} className="text-xs text-gray-500 hover:text-blue-600 transition-colors">編集</button>
                    <button onClick={() => handleDelete(asset.id)} className="text-xs text-gray-500 hover:text-red-500 transition-colors">削除</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          {/* mb-16 = bottom nav height on mobile */}
          <div className="relative bg-white w-full md:max-w-md rounded-t-3xl md:rounded-2xl shadow-xl p-6 md:m-4 overflow-y-auto mb-16 md:mb-0"
            style={{ maxHeight: 'calc(100dvh - 120px)' }}>
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              {editing ? '資産を編集' : '資産を追加'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">名称</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="例: 三菱UFJ 普通預金"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">カテゴリ</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </div>

              {isCrypto && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">保有数量</label>
                      <input
                        type="number"
                        step="any"
                        value={form.quantity}
                        onChange={e => handleCryptoCalc('quantity', e.target.value)}
                        placeholder="0.00"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">単価（円）</label>
                      <input
                        type="number"
                        step="any"
                        value={form.unitPrice}
                        onChange={e => handleCryptoCalc('unitPrice', e.target.value)}
                        placeholder="0"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 -mt-2">※ 数量×単価で金額が自動計算されます</p>
                </>
              )}

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">金額（円）</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">メモ（任意）</label>
                <input
                  type="text"
                  value={form.memo}
                  onChange={e => setForm({ ...form, memo: e.target.value })}
                  placeholder="メモ"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2 pb-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700"
                >
                  {editing ? '更新' : '追加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
