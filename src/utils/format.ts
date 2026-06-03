// Short format: 150.9万 / 1.2億  (for charts and category summaries)
export function formatJPYShort(amount: number): string {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}億`;
  if (amount >= 10000) return `${(amount / 10000).toFixed(1)}万`;
  return `${amount.toLocaleString()}円`;
}

// Full format: 1,509,300円  (for individual asset amounts)
export function formatJPY(amount: number): string {
  return `${amount.toLocaleString()}円`;
}
