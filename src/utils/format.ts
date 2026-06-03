export function formatJPY(amount: number): string {
  if (amount >= 100000000) {
    const oku = Math.floor(amount / 100000000);
    const remainder = amount % 100000000;
    if (remainder === 0) return `${oku.toLocaleString()}億円`;
    const man = Math.floor(remainder / 10000);
    const yen = remainder % 10000;
    if (yen === 0) return `${oku.toLocaleString()}億${man.toLocaleString()}万円`;
    return `${oku.toLocaleString()}億${man.toLocaleString()}万${yen.toLocaleString()}円`;
  }
  if (amount >= 10000) {
    const man = Math.floor(amount / 10000);
    const yen = amount % 10000;
    if (yen === 0) return `${man.toLocaleString()}万円`;
    return `${man.toLocaleString()}万${yen.toLocaleString()}円`;
  }
  return `${amount.toLocaleString()}円`;
}
