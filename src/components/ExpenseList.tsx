import { useMemo } from "react";
import { useBudget } from "../hooks/useBudge"
import ExpenseDetail from "./ExpenseDetail";
import { InboxIcon } from "@heroicons/react/24/solid";

export default function ExpenseList() {
    const {state} = useBudget();

    const filterExpenses = state.currentCategory ? 
    state.expenses.filter(ex => ex.category === state.currentCategory)
    : state.expenses;

    const isEmpty = useMemo(() => filterExpenses.length === 0 ,[filterExpenses]);

  return (
   <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {isEmpty ? (
            <div className="p-8 md:p-10 text-center">
                <InboxIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-medium">No hay gastos registrados</p>
                <p className="text-gray-400 text-sm mt-1">Toca el botón + para agregar tu primer gasto</p>
            </div>
        ) : (
            <>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-gray-700 font-semibold text-sm md:text-base">
                    {filterExpenses.length} {filterExpenses.length === 1 ? 'gasto' : 'gastos'}
                </p>
            </div>
            <div className="divide-y divide-gray-100">
                {filterExpenses.map(expense => (
                    <ExpenseDetail key={expense.id} expense={expense}/>
                ))}
            </div>
            </>
        )}
   </div>
  )
}
