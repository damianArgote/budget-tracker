import { useEffect, useMemo } from "react";
import BudgetForm from "./components/BudgetForm"
import { useBudget } from "./hooks/useBudge"
import BudgetTracker from "./components/BudgetTracker";
import ExpenseModal from "./components/ExpenseModal";
import ExpenseList from "./components/ExpenseList";
import FilterByCategory from "./components/FilterByCategory";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { StorageKeys, setStorageItem } from "./utils/storage";

function App() {
  const {state} = useBudget();

  const isValidBudget = useMemo(() => {
    return state.budget > 0
  } ,[state.budget])

  useEffect(() => {
    setStorageItem(StorageKeys.BUDGET, state.budget);
    setStorageItem(StorageKeys.EXPENSES, state.expenses);
  },[state.budget, state.expenses])

  return (
    <ErrorBoundary>
      <header className="bg-blue-600 py-5 md:py-8 px-4 shadow-lg">
        <h1 className="uppercase text-center font-extrabold text-2xl md:text-4xl text-white tracking-tight">
            Planificador de Gastos
        </h1>
      </header>

      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl mt-4 md:mt-10 mx-4 md:mx-auto p-6 md:p-10">
        {isValidBudget ? <BudgetTracker/> : <BudgetForm/>}
      </div>
      {
        isValidBudget && (
          <main className="max-w-3xl mx-auto px-4 py-5 md:py-10 pb-24">
              <div className="mb-4">
                <FilterByCategory/>
              </div>
              <ExpenseList/>
              <ExpenseModal/>
          </main>
        
        )
      }
    </ErrorBoundary>
  )
}

export default App
