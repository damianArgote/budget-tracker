import { useState } from "react";
import { categories } from "../data/categories";
import { useBudget } from "../hooks/useBudge";

export default function FilterByCategory() {
    const {state, dispatch} = useBudget()
    const [isScrollable, setIsScrollable] = useState(false)

    const handleSelect = (id: string) => {
        dispatch({type:'filter-category', payload:{id}})
    }   

    return (
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filtrar:</span>
            <div 
                className="flex-1 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onScroll={(e) => setIsScrollable(e.currentTarget.scrollWidth > e.currentTarget.clientWidth)}
            >
                <div className="flex gap-2 pb-1">
                    <button
                        onClick={() => handleSelect('')}
                        className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all touch-manipulation ${
                            state.currentCategory === ''
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                        }`}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleSelect(cat.id)}
                            className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all touch-manipulation flex items-center gap-1.5 ${
                                state.currentCategory === cat.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                            }`}
                        >
                            <img src={`/icono_${cat.icon}.svg`} alt={cat.name} className="w-4 h-4" />
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
            {isScrollable && (
                <div className="flex-shrink-0 w-6 h-full bg-gradient-to-l from-white to-transparent pointer-events-none absolute right-0" />
            )}
        </div>
      </div>
    )
}
