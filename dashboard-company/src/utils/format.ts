export function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR')
}

export function formatPercent(value: number) {
  return `${value}%`
}
