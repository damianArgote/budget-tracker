/** Formatea un número para mostrar: miles con . y decimales con ,. decimals=0 para enteros */
export function formatNumberMask(value: number, decimals = 2): string {
  if (value === 0 || Number.isNaN(value)) return '';
  const fixed = decimals === 0
    ? Math.round(value).toString()
    : value.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const thousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return decPart ? `${thousands},${decPart}` : thousands;
}

/** Parsea un string con máscara (1.234,56) a número */
export function parseNumberMask(str: string): number {
  const cleaned = str.replace(/\./g, '').replace(',', '.');
  const num = Number.parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

export function formatCurrency(amount:number) {


    return new Intl.NumberFormat('en-US',{style:'currency', currency:'USD'})
    .format(amount)
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