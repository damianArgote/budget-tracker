import { categories } from "../data/categories";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudge";
import { formatNumberMask } from "../helpers";

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
  const cleaned = value.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export default function ExpenseForm() {

  const [expense,setExpense] = useState<DraftExpense>({
    amount:0,
    expenseName:'',
    category:'',
    date:new Date(),
    quantity:1
  })

  const [amountInput, setAmountInput] = useState('');
  const [quantityInput, setQuantityInput] = useState(formatNumberMask(1));

  const {state,dispatch, remainingBudget} = useBudget()

  const [error,setError] = useState('')

  const [previousAmount, setPreviousAmount] = useState(0)

  useEffect(() => {
    if(state.editingId){
        const editingExpense = state.expenses.filter(current => current.id === state.editingId)[0];
        setExpense(editingExpense)
        setAmountInput(editingExpense.amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ','));
        setQuantityInput(formatNumberMask(editingExpense.quantity));
        setPreviousAmount(editingExpense.amount * editingExpense.quantity)
    }
  },[state.editingId, state.expenses])

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      const numericAmount = parseCurrencyInput(value);
      setExpense(prev => ({ ...prev, amount: numericAmount }));
      setAmountInput(formatCurrencyInput(value));
      return;
    }

    if (name === 'quantity') {
      const numbersOnly = value.replace(/\D/g, '');
      const numericAmount = numbersOnly ? parseInt(numbersOnly, 10) : 0;
      setExpense(prev => ({ ...prev, quantity: numericAmount }));
      setQuantityInput(numbersOnly ? formatNumberMask(numericAmount) : '');
      return;
    }

    setExpense({
        ...expense,
        [name]: value
    })
  }

  const handleChangeDate = (value: Value) => {
    setExpense({
        ...expense,
        date:value
    })
  } 

  const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(Object.values(expense).includes('')) {
        setError('Todos los campos son obligatorios')
        return
    }

    if((expense.amount - previousAmount) > remainingBudget) {
        setError('El gasto se sale del presupuesto!')
        return
    }

    if(state.editingId){
        dispatch({type:'update-expense', payload:{expense: {id:state.editingId, ...expense}}})
    }else{
        dispatch({type:'add-expense', payload:{expense}})
    }
   

    setExpense({
        amount:0,
        expenseName:'',
        category:'',
        date:new Date(),
        quantity:1
    })

    setAmountInput('');
    setQuantityInput(formatNumberMask(1));

    setPreviousAmount(0)
  }

  return (
    <form className="space-y-5 pb-2" onSubmit={handleSubmit}>
        {error && 
            <ErrorMessage>
                {error}
            </ErrorMessage>}

        <div className="flex flex-col gap-2">
            <label htmlFor="expenseName" className="text-base font-bold text-gray-700">Nombre del Gasto</label>
            <input
            className="p-3 md:p-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:font-normal"
            id="expenseName" 
            type="text"
            name="expenseName"
            value={expense.expenseName}
            placeholder="Ej: Compras del supermercado"
            onChange={handleChange} />
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="amount" className="text-base font-bold text-gray-700">Precio</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                    <input
                    className="w-full p-3 pl-6 md:p-2.5 md:pl-6 bg-gray-50 border-2 border-gray-200 rounded-xl text-base font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:font-normal"
                    id="amount"
                    name="amount"
                    type="text"
                    inputMode="decimal"
                    value={amountInput}
                    placeholder="0,00"
                    onChange={handleChange} />
                </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="quantity" className="text-base font-bold text-gray-700">Cantidad</label>
                <input
                className="w-full p-3 md:p-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:font-normal"
                id="quantity"
                name="quantity"
                type="text"
                inputMode="numeric"
                value={quantityInput}
                placeholder="1"
                onChange={handleChange} />
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-base font-bold text-gray-700">Categoría</label>
            <div className="relative">
                <select
                className="w-full p-3 md:p-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                id="category"
                name="category"
                value={expense.category}
                onChange={handleChange}>
                    
                    <option value="">-- Seleccione --</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="date" className="text-base font-bold text-gray-700">Fecha</label>
            <DatePicker
            className="w-full p-3 md:p-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base font-semibold"
            id="date"
            value={expense.date}
            onChange={handleChangeDate}
            />
        </div>

        <button type="submit"
        className="bg-blue-600 cursor-pointer uppercase rounded-xl text-white w-full py-3.5 md:py-2.5 text-base font-extrabold hover:bg-blue-700 active:scale-[0.98] transition-all touch-manipulation shadow-lg shadow-blue-600/30">
            {!state.editingId ? 'Registrar Gasto' : 'Guardar Cambios'} 
        </button>
    </form>
  )
}
