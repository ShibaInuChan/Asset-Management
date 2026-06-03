import { useState, useEffect } from 'react';
import { type Snapshot, type Asset } from '../types';
import { sampleSnapshots } from '../data/sampleData';
import { normalizeKey } from '../data/categories';

const KEY = 'snapshots';

function migrateSnapshot(snap: Snapshot): Snapshot {
  const byCategory: Record<string, number> = {};
  for (const [k, v] of Object.entries(snap.byCategory)) {
    const key = normalizeKey(k);
    byCategory[key] = (byCategory[key] ?? 0) + v;
  }
  return { ...snap, byCategory };
}

function load(): Snapshot[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Snapshot[];
      const migrated = parsed.map(migrateSnapshot);
      localStorage.setItem(KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch {
    // ignore
  }
  localStorage.setItem(KEY, JSON.stringify(sampleSnapshots));
  return sampleSnapshots;
}

function save(snapshots: Snapshot[]) {
  localStorage.setItem(KEY, JSON.stringify(snapshots));
}

export function useSnapshots() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>(load);

  useEffect(() => {
    save(snapshots);
  }, [snapshots]);

  function recordSnapshot(assets: Asset[]) {
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const byCategory: Record<string, number> = {};
    let total = 0;
    for (const asset of assets) {
      byCategory[asset.category] = (byCategory[asset.category] ?? 0) + asset.amount;
      total += asset.amount;
    }
    const snap: Snapshot = {
      id: crypto.randomUUID(),
      date,
      total,
      byCategory,
      createdAt: now.toISOString(),
    };
    setSnapshots(prev => {
      // Replace if same month exists
      const filtered = prev.filter(s => s.date !== date);
      return [...filtered, snap].sort((a, b) => a.date.localeCompare(b.date));
    });
    return snap;
  }

  function deleteSnapshot(id: string) {
    setSnapshots(prev => prev.filter(s => s.id !== id));
  }

  return { snapshots, recordSnapshot, deleteSnapshot };
}
