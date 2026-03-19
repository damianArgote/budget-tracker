import { formatCurrency } from "../helpers"

type AmountDisplayProps = {
    label?:string,
    amount:number,
    variant?: 'default' | 'success' | 'danger'
}
export default function AmountDisplay({label,amount, variant = 'default'} : AmountDisplayProps) {
    const colorClass = variant === 'danger' ? 'text-red-600' : 
                       variant === 'success' ? 'text-green-600' : 
                       'text-blue-600';
  return (
    <p className={`text-xl md:text-2xl ${colorClass} font-bold`}>
        {label && `${label}: `}
        <span className="font-black text-gray-900">
            {formatCurrency(amount)}
        </span>
    </p>
  )
}
