/** Formatea un número para mostrar con separador de miles */
export function formatNumberMask(value: number): string {
  if (value === 0 || Number.isNaN(value)) return '';
  return value.toLocaleString('es-AR');
}

/** Parsea un string con máscara (1.234,56) a número */
export function parseNumberMask(str: string): number {
  const cleaned = str.replace(/\./g, '').replace(',', '.');
  const num = Number.parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

export function formatCurrency(amount:number): string {
  const formatted = amount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `$${formatted}`;
}

export function formatDate(dateStr: string): string{
    const dateObj = new Date(dateStr);

    const options: Intl.DateTimeFormatOptions = {
        weekday:'long',
        year:'numeric',
        month:'long',
        day:'numeric'
    }

    return new Intl.DateTimeFormat('es-ES',options).format(dateObj);
}