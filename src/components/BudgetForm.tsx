import { ChangeEvent, FormEvent, useMemo, useState } from "react"
import { useBudget } from "../hooks/useBudge";
import { WalletIcon } from "@heroicons/react/24/solid";

function formatCurrencyInput(value: string): string {
  if (!value) return '';
  
  const isDecimal = value.includes(',');
  if (isDecimal) {
    const parts = value.split(',');
    const intPart = parts[0].replace(/\D/g, '');
    const decPart = parts[1]?.replace(/\D/g, '') || '';
    const formattedInt = intPart ? parseInt(intPart, 10).toLocaleString('es-AR') : '';
    return formattedInt + (decPart ? ',' + decPart.slice(0, 2) : ',');
  }
  
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';
  return parseInt(numbers, 10).toLocaleString('es-AR');
}

function parseCurrencyInput(value: string): number {
  const cleaned = value.replace('$', '').replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export default function BudgetForm() {
  const [budget, setBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState('');
  const { dispatch } = useBudget();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericAmount = parseCurrencyInput(value);
    
    setBudget(numericAmount);
    setBudgetInput(formatCurrencyInput(value));
  }

  const isValid = useMemo(() => {
    return isNaN(budget) || budget <= 0
  }, [budget])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({type:'add-budget',payload:{budget}})
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center space-y-2">
          <WalletIcon className="w-16 h-16 text-blue-600 mb-2" />
          <h2 className="text-2xl md:text-3xl text-blue-600 font-extrabold text-center">
            Definir Presupuesto
          </h2>
          <p className="text-gray-500 text-center text-sm font-semibold">
            ¿Cuánto dinero tienes disponible?
          </p>
      </div>

      <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-extrabold text-blue-600">$</span>
          <input 
          id="budget"
          name="budget"
          type="text"
          inputMode="decimal"
          className="w-full text-center text-3xl font-extrabold border-2 border-gray-200 bg-white py-4 pl-10 pr-4 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-300 placeholder:font-bold"
          placeholder="0,00"
          value={budgetInput}
          onChange={handleChange}
          autoComplete="off"
          />
      </div>

      <button
        type="submit"
        disabled={isValid}
        className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold uppercase tracking-wide py-4 px-6 w-full cursor-pointer rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed text-lg shadow-lg shadow-blue-600/30"
      >
        Continuar
      </button>
    </form>
  )
}
