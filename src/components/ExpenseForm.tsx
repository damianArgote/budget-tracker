import { categories } from "../data/categories";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudge";


export default function ExpenseForm() {

  const [expense,setExpense] = useState<DraftExpense>({
    amount:0,
    expenseName:'',
    category:'',
    date:new Date(),
    quantity:1
  })

  const {state,dispatch, remainingBudget} = useBudget()

  const [error,setError] = useState('')

  const [previousAmount, setPreviousAmount] = useState(0)

  useEffect(() => {
    if(state.editingId){
        const editingExpense = state.expenses.filter(current => current.id === state.editingId)[0];
        setExpense(editingExpense)
        setPreviousAmount(editingExpense.amount * expense.quantity)
    }
  },[state.editingId])

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const {name,value} = e.target;

    const isAmountField = ['amount','quantity'].includes(name);

    setExpense({
        ...expense,
        [name]: isAmountField ? Number(value) : value
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

    setPreviousAmount(0)
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
        <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
            {!state.editingId ?  'Nuevo Gasto' : 'Editando Gasto'}
        </legend>

        {error && 
            <ErrorMessage>
                {error}
            </ErrorMessage>}

        <div className="flex flex-col gap-2">
            <label htmlFor="expenseName" className="text-xl">Nombre de Gasto</label>
            <input
            className="p-2 bg-slate-100"
            id="expenseName" 
            type="text"
            name="expenseName"
            value={expense.expenseName}
            placeholder="Añade el nombre del gasto"
            onChange={handleChange} />
        </div>
        <div className="flex w-full gap-2">
            <div className="flex flex-col gap-2 flex-1/2">
                <label htmlFor="amount" className="text-xl">Precio</label>
                <input
                className="p-2 bg-slate-100"
                id="amount"
                name="amount"
                type="number"
                value={expense.amount}
                placeholder="Añade el precio del gasto"
                onChange={handleChange} />
            </div>

            <div className="flex flex-col gap-2 flex-1/2">
                <label htmlFor="quantity" className="text-xl">Cantidad</label>
                <input
                className="p-2 bg-slate-100"
                id="quantity"
                name="quantity"
                type="number"
                value={expense.quantity}
                placeholder="Añade la cantidad del gasto"
                onChange={handleChange} />
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-xl">Categoria</label>
            <select
            className="p-2 bg-slate-100"
            id="category"
            name="category"
            value={expense.category}
            onChange={handleChange}>
                
                <option value="">-- Seleccione --</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="expenseName" className="text-xl">Fecha Gasto</label>
            <DatePicker
            className="bg-slate-100 p-2 border-0"
            value={expense.date}
            onChange={handleChangeDate}
            />
        </div>

        <input type="submit"
        className="bg-blue-600 cursor-pointer uppercase rounded-lg text-white w-full p-2"
        value={!state.editingId ? 'Registrar Gasto' : 'Editar Gasto'} />
    </form>
  )
}
