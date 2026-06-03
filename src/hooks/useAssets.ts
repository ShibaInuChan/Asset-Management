import { useState, useEffect } from 'react';
import { type Asset } from '../types';
import { sampleAssets } from '../data/sampleData';

const KEY = 'assets';

function load(): Asset[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Asset[];
  } catch {
    // ignore
  }
  // First time: load sample data
  localStorage.setItem(KEY, JSON.stringify(sampleAssets));
  return sampleAssets;
}

function save(assets: Asset[]) {
  localStorage.setItem(KEY, JSON.stringify(assets));
}

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>(load);

  useEffect(() => {
    save(assets);
  }, [assets]);

  function addAsset(asset: Omit<Asset, 'id' | 'updatedAt'>) {
    const newAsset: Asset = {
      ...asset,
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    };
    setAssets(prev => [newAsset, ...prev]);
    return newAsset;
  }

  function updateAsset(id: string, updates: Partial<Omit<Asset, 'id'>>) {
    setAssets(prev =>
      prev.map(a =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      )
    );
  }

  function deleteAsset(id: string) {
    setAssets(prev => prev.filter(a => a.id !== id));
  }

  function reorderAssets(fromId: string, toId: string) {
    setAssets(prev => {
      const list = [...prev];
      const from = list.findIndex(a => a.id === fromId);
      const to = list.findIndex(a => a.id === toId);
      if (from === -1 || to === -1 || from === to) return prev;
      const [item] = list.splice(from, 1);
      list.splice(to, 0, item);
      return list;
    });
  }

  return { assets, addAsset, updateAsset, deleteAsset, reorderAssets };
}
