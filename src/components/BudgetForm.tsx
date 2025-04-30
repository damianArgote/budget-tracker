import { ChangeEvent, FormEvent, useMemo, useState } from "react"
import { useBudget } from "../hooks/useBudge";


export default function BudgetForm() {
  const [budget,setBudget] = useState(0);
  const {dispatch} = useBudget();

  const handleChange = (e :ChangeEvent<HTMLInputElement>) => {
    setBudget(e.target.valueAsNumber)
  }

  const isValid = useMemo(() => 
  {
    return isNaN(budget) || budget <= 0
  }
    ,[budget])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({type:'add-budget',payload:{budget}})
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-5">
          <label htmlFor="budget" className="text-4xl text-blue-600 font-bold text-center">
            Definir Presupuesto
          </label>

          <input 
          id="budget"
          name="budget"
          type="number" 
          className="w-full border boder-gray-200 bg-white p-2 rounded-lg"
          placeholder="Define tu presupuesto"
          value={budget}
          onChange={handleChange} />
      </div>

      <input
      value={'Definir Presupuesto'} 
      className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase p-2 w-full cursor-pointer rounded-lg disabled:opacity-10"
      type="submit"
      disabled={isValid} />
    </form>
  )
}
