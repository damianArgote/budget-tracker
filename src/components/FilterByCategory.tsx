import { useState, useRef, useEffect } from "react";
import { categories } from "../data/categories";
import { useBudget } from "../hooks/useBudge";

export default function FilterByCategory() {
    const {state, dispatch} = useBudget()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isScrollable, setIsScrollable] = useState(false)

    const handleSelect = (id: string) => {
        dispatch({type:'filter-category', payload:{id}})
    }   

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -120, behavior: 'smooth' });
        }
    }

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 120, behavior: 'smooth' });
        }
    }

    const checkScrollable = () => {
        if (scrollRef.current) {
            const canScroll = scrollRef.current.scrollWidth > scrollRef.current.clientWidth + 10;
            setIsScrollable(canScroll);
        }
    }

    useEffect(() => {
        checkScrollable();
        window.addEventListener('resize', checkScrollable);
        return () => window.removeEventListener('resize', checkScrollable);
    }, []);

    return (
      <div className="bg-white shadow-md rounded-xl p-3 sm:p-4">
        <div className="flex items-center gap-1 sm:gap-2">
            {isScrollable && (
                <button
                    onClick={scrollLeft}
                    className="flex-shrink-0 w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation z-20 shadow-sm"
                    aria-label="Desplazar izquierda"
                >
                    <svg className="w-5 h-5 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}
            <div className="relative flex-1 min-w-0">
                <div 
                    ref={scrollRef}
                    className="flex gap-2 py-1 overflow-x-auto sm:overflow-x-auto md:overflow-auto scroll-smooth snap-x snap-mandatory scrollbar-thin touch-pan-x"
                    style={{ 
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#CBD5E1 transparent'
                    }}
                    onScroll={checkScrollable}
                    onTouchStart={checkScrollable}
                >
                    <button
                        onClick={() => handleSelect('')}
                        className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-bold transition-all touch-manipulation snap-start ${
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
                            className={`flex-shrink-0 px-3 py-2.5 rounded-full text-sm font-bold transition-all touch-manipulation snap-start flex items-center gap-1.5 whitespace-nowrap ${
                                state.currentCategory === cat.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                            }`}
                        >
                            <img src={`/icono_${cat.icon}.svg`} alt={cat.name} className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate max-w-[100px] sm:max-w-[120px]">{cat.name}</span>
                        </button>
                    ))}
                </div>
                {isScrollable && (
                    <div className="absolute top-0 right-0 bottom-0 w-10 sm:w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
                )}
            </div>
            {isScrollable && (
                <button
                    onClick={scrollRight}
                    className="flex-shrink-0 w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation z-20 shadow-sm"
                    aria-label="Desplazar derecha"
                >
                    <svg className="w-5 h-5 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
      </div>
    )
}
