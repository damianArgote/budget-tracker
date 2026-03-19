import { useBudget } from "../hooks/useBudge";
import AmountDisplay from "./AmountDisplay";
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar'
import "react-circular-progressbar/dist/styles.css"
import { ExclamationTriangleIcon, CheckCircleIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

export default function BudgetTracker() {

  const{state,totalExpense,remainingBudget, dispatch} = useBudget();
  const percentage = +((totalExpense / state.budget) * 100).toFixed(1)
  
  const isOverBudget = percentage > 100;
  const isWarning = percentage >= 80 && percentage <= 100;
  const progressColor = isOverBudget ? '#DC2626' : isWarning ? '#F59E0B' : '#10B981';
  const getStatusText = () => {
    if (isOverBudget) return '¡Presupuesto excedido!';
    if (isWarning) return 'Casi llegas al límite';
    return 'Presupuesto saludable';
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-5">
        <div className="flex flex-col items-center justify-center">
            <div className="w-40 h-40 md:w-48 md:h-48 relative">
                <CircularProgressbar
                    value={Math.min(percentage, 100)}
                    strokeWidth={12}
                    styles={buildStyles({
                        pathColor: progressColor,
                        trailColor:'#E5E7EB',
                        textSize:0,
                    })}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-gray-800">{Math.round(percentage)}%</span>
                    <span className="text-xs text-gray-500">gastado</span>
                </div>
            </div>
            <div className={`mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                isOverBudget ? 'bg-red-100 text-red-700' : 
                isWarning ? 'bg-amber-100 text-amber-700' : 
                'bg-green-100 text-green-700'
            }`}>
                {isOverBudget ? (
                    <ExclamationTriangleIcon className="w-4 h-4" />
                ) : isWarning ? (
                    <ExclamationTriangleIcon className="w-4 h-4" />
                ) : (
                    <CheckCircleIcon className="w-4 h-4" />
                )}
                {getStatusText()}
            </div>
        </div>

        <div className="flex flex-col justify-center gap-4 md:gap-5">
            <button
            onClick={() => dispatch({type:'reset-app'})}
            type="button"
            className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 active:scale-[0.98] w-full p-3 md:p-2.5 text-white uppercase font-bold rounded-lg touch-manipulation transition-colors"
            >
                <ArrowPathIcon className="w-5 h-5" />
                Resetear App
            </button>

            <AmountDisplay
                label="Presupuesto"
                amount={state.budget}
            />

            <AmountDisplay
                label="Disponible"
                amount={remainingBudget}
                variant={remainingBudget < 0 ? 'danger' : 'success'}
            />

            <AmountDisplay
                label="Gastado"
                amount={totalExpense}
            />
        </div>
    </div>
  )
}
