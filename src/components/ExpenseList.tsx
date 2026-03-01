import { useMemo } from "react";
import { useBudget } from "../hooks/useBudge"
import ExpenseDetail from "./ExpenseDetail";

export default function ExpenseList() {
    const {state} = useBudget();

    const filterExpenses = state.currentCategory ? 
    state.expenses.filter(ex => ex.category === state.currentCategory)
    : state.expenses;

    const isEmpty = useMemo(() => filterExpenses.length === 0 ,[state.expenses]);

  return (
   <div className="mt-10 bg-white shadow-lg rounded-lg p-6 md:p-10">
        {isEmpty ? <p className="text-gray-600 text-2xl font-bold">No hay Gastos.</p>
        : (
            <>
            <p className="text-gray-600 font-bold text-2xl my-5">
                Listado de Gastos
            </p>

            {filterExpenses.map(expense => (
                <ExpenseDetail key={expense.id} expense={expense}/>
            ))}
            </>
        )}
   </div>
  )
}
