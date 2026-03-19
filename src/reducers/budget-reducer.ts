import { Category, DraftExpense, Expense } from "../types"
import { StorageKeys, getStorageItem } from "../utils/storage"

const generateId = (): string => crypto.randomUUID()

export type BudgetActions =
{type:'add-budget', payload: {budget:number}} |
{type:'show-modal'} |
{type:'hide-modal'} |
{type: 'add-expense', payload: {expense: DraftExpense}} |
{type:'delete-expense', payload: {id: string}} |
{type: 'get-expense-by-id', payload:{id:Expense['id']}} |
{type:'update-expense', payload:{expense:Expense}} |
{type:'reset-app'} |
{type:'filter-category', payload:{id: Category['id']}}



export type BudgetState = {
    budget:number,
    modal:boolean,
    expenses:Expense[],
    editingId: Expense['id'],
    currentCategory: Category['id']
}

const initialBudget = (): number => {
    return getStorageItem<number>(StorageKeys.BUDGET, 0)
}

const localStorageExpense = (): Expense[] => {
    return getStorageItem<Expense[]>(StorageKeys.EXPENSES, [])
}

export const initialState: BudgetState = {
    budget:initialBudget(),
    modal:false,
    expenses:localStorageExpense(),
    editingId:'',
    currentCategory:''
}

const createExpense = (draftExpense: DraftExpense): Expense => {
    return {
        ...draftExpense,
        id: generateId()
    }
}

export const budgetReducer = (
    state: BudgetState = initialState,
    action: BudgetActions
):BudgetState => {

    if(action.type === 'add-budget'){
        return {
            ...state,
            budget: action.payload.budget
        }
    }

    if(action.type === 'show-modal'){
        return {
            ...state,
            modal:true
        }
    }

    if(action.type === 'hide-modal'){
        return {
            ...state,
            modal:false,
            editingId:''
        }
    }

    if(action.type === 'add-expense'){
        const expense = createExpense(action.payload.expense)
        return{
            ...state,
            expenses:[...state.expenses, expense],
            modal:false
        }
    }

    if(action.type === 'delete-expense'){
        return {
            ...state,
            expenses: state.expenses.filter(ex => ex.id !== action.payload.id)
        }
    }

    if(action.type === 'get-expense-by-id'){
        return {
            ...state,
            editingId: action.payload.id,
            modal:true
        }
    }

    if(action.type === 'update-expense'){

        return{
            ...state,
            expenses: state.expenses.map( ex => ex.id === action.payload.expense.id ? 
                action.payload.expense : ex
            ),
            editingId:'',
            modal:false
        }
    }

    if(action.type === 'reset-app'){
        return{
            ...state,
            budget:0,
            expenses:[],
            modal:false,
            editingId:'',
            currentCategory:''
        }
    }

    if(action.type === 'filter-category'){

        return{
            ...state,
            currentCategory: action.payload.id
        }
    }

    return state;
}