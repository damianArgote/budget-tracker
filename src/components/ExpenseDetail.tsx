import { useMemo } from "react"
import { formatDate } from "../helpers"
import { Expense } from "../types"
import AmountDisplay from "./AmountDisplay"
import { categories } from "../data/categories"
import {
    LeadingActions,
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
  } from 'react-swipeable-list';
  import 'react-swipeable-list/dist/styles.css';
import { useBudget } from "../hooks/useBudge"
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

type ExpenseDetailProps = {
    expense: Expense
}

export default function ExpenseDetail({ expense }: ExpenseDetailProps) {
    const {dispatch} = useBudget()
    const categoryInfo = useMemo(() =>
        categories.filter(cat => cat.id === expense.category)[0]
        , [expense])

    const leadingActions = () => (
        <LeadingActions>
            <SwipeAction onClick={() => dispatch({type:'get-expense-by-id',payload:{id:expense.id}})}>
                <div className="flex flex-col items-center justify-center h-full bg-blue-600 text-white p-4">
                    <PencilIcon className="w-6 h-6 mb-1" />
                    <span className="text-sm font-medium">Editar</span>
                </div>
            </SwipeAction>
        </LeadingActions>
    )

    const trailingActions = () => (
        <TrailingActions>
            <SwipeAction destructive={true} onClick={() => dispatch({type:'delete-expense', payload:{id: expense.id}})}>
                <div className="flex flex-col items-center justify-center h-full bg-red-600 text-white p-4">
                    <TrashIcon className="w-6 h-6 mb-1" />
                    <span className="text-sm font-medium">Eliminar</span>
                </div>
            </SwipeAction>
        </TrailingActions>
    )

    return (

        <SwipeableList className="touch-manipulation">
            <SwipeableListItem
                maxSwipe={40}
                leadingActions={leadingActions()}
                trailingActions={trailingActions()}
            >
                <div className="bg-white shadow-sm border-b border-gray-100 p-4 md:p-5 flex gap-4 items-center active:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                        <img src={`/icono_${categoryInfo.icon}.svg`} alt={categoryInfo.name} className="w-14 h-14 md:w-16 md:h-16 object-contain" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 font-bold">
                                {categoryInfo.name}
                            </span>
                        </div>
                        <p className="text-base md:text-lg font-extrabold text-gray-900 truncate">
                            {expense.expenseName}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 text-sm font-semibold text-gray-500">
                            {expense.quantity > 1 && (
                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">
                                    x{expense.quantity}
                                </span>
                            )}
                            <span>{formatDate(expense.date!.toString())}</span>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <AmountDisplay amount={expense.amount * expense.quantity} />
                    </div>
                </div>
            </SwipeableListItem>

        </SwipeableList>

    )
}
