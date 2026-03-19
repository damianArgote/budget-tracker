import { Fragment } from 'react'
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { useBudget } from '../hooks/useBudge';
import ExpenseForm from './ExpenseForm';

export default function ExpenseModal() {
  const {state,dispatch} = useBudget();
  return (
    <>
      <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-40">
        <button
        onClick={() => dispatch({type:'show-modal'})}
          type="button"
          className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-full shadow-lg"
          aria-label="Agregar gasto"
        >
          <PlusCircleIcon className='w-10 h-10 md:w-12 md:h-12 text-white' />
        </button>
      </div>

      <Transition appear show={state.modal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => dispatch({type:'hide-modal'})}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="fixed inset-0 flex items-end sm:items-center justify-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="w-full sm:max-w-lg sm:rounded-t-2xl sm:rounded-2xl bg-white h-[85vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">
                      {!state.editingId ? 'Nuevo Gasto' : 'Editar Gasto'}
                    </h2>
                    <button
                      onClick={() => dispatch({type:'hide-modal'})}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors -mr-2"
                      aria-label="Cerrar"
                    >
                      <XMarkIcon className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 py-4 pb-safe">
                    <ExpenseForm/>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}