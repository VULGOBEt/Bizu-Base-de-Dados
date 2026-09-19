export function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
}

export function formatDate(isoStr: string): string {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function generateNextOsNumber(orders: { id?: string }[] = []): string {
  let maxNum = 0;
  for (const o of orders) {
    if (!o || !o.id) continue;
    const match = o.id.match(/\d+/);
    if (match) {
      const parsed = parseInt(match[0], 10);
      if (!isNaN(parsed) && parsed > maxNum) {
        maxNum = parsed;
      }
    }
  }
  const nextNum = maxNum + 1;
  const formatted = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
  return `OS ${formatted}`;
}
