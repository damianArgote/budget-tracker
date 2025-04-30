import { useReducer, createContext, Dispatch, ReactNode, useMemo } from "react"
import { BudgetActions, budgetReducer, BudgetState, initialState } from "../reducers/budget-reducer"

type BudgetContextProps = {
    state: BudgetState
    dispatch: Dispatch<BudgetActions>,
    totalExpense:number,
    remainingBudget:number
}

type BudgetProviderProps = {
    children: ReactNode
}

export const BudgetContext = createContext<BudgetContextProps>(null!)

export const BudgetProvider = ({children}: BudgetProviderProps) => {

    const [state,dispatch] = useReducer(budgetReducer,initialState)

      const totalExpense = useMemo(() => {
        return state.expenses.reduce((total,expense) => expense.amount + total,0)
      },[state.expenses]);
      const remainingBudget = state.budget - totalExpense;

    return (
        <BudgetContext.Provider
        value={{
            state,
            dispatch,
            totalExpense,
            remainingBudget
        }}>
            {children}
        </BudgetContext.Provider>
    )
}