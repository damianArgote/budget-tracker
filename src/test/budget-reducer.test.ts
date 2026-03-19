import { describe, it, expect } from 'vitest';
import { budgetReducer, initialState } from '../reducers/budget-reducer';

describe('budgetReducer', () => {
  it('should return initial state', () => {
    const state = budgetReducer(initialState, { type: 'add-budget', payload: { budget: 0 } });
    expect(state.budget).toBe(0);
    expect(state.expenses).toEqual([]);
    expect(state.modal).toBe(false);
  });

  it('should add budget', () => {
    const state = budgetReducer(initialState, { type: 'add-budget', payload: { budget: 1000 } });
    expect(state.budget).toBe(1000);
  });

  it('should show modal', () => {
    const state = budgetReducer(initialState, { type: 'show-modal' });
    expect(state.modal).toBe(true);
  });

  it('should hide modal and clear editingId', () => {
    const stateWithModal = { ...initialState, modal: true, editingId: '123' };
    const state = budgetReducer(stateWithModal, { type: 'hide-modal' });
    expect(state.modal).toBe(false);
    expect(state.editingId).toBe('');
  });

  it('should add expense', () => {
    const expense = {
      expenseName: 'Test Expense',
      amount: 50,
      category: 'food',
      date: new Date(),
      quantity: 1
    };
    const state = budgetReducer(initialState, { type: 'add-expense', payload: { expense } });
    expect(state.expenses).toHaveLength(1);
    expect(state.expenses[0].expenseName).toBe('Test Expense');
    expect(state.modal).toBe(false);
  });

  it('should delete expense', () => {
    const expense = {
      id: 'test-id',
      expenseName: 'Test',
      amount: 50,
      category: 'food',
      date: new Date(),
      quantity: 1
    };
    const stateWithExpense = { ...initialState, expenses: [expense] };
    const state = budgetReducer(stateWithExpense, { type: 'delete-expense', payload: { id: 'test-id' } });
    expect(state.expenses).toHaveLength(0);
  });

  it('should update expense', () => {
    const expense = {
      id: 'test-id',
      expenseName: 'Original',
      amount: 50,
      category: 'food',
      date: new Date(),
      quantity: 1
    };
    const stateWithExpense = { ...initialState, expenses: [expense] };
    const updatedExpense = { ...expense, expenseName: 'Updated' };
    const state = budgetReducer(stateWithExpense, { type: 'update-expense', payload: { expense: updatedExpense } });
    expect(state.expenses[0].expenseName).toBe('Updated');
    expect(state.modal).toBe(false);
  });

  it('should reset app', () => {
    const populatedState = {
      budget: 1000,
      modal: true,
      expenses: [{ id: '1', expenseName: 'Test', amount: 50, category: 'food', date: new Date(), quantity: 1 }],
      editingId: '1',
      currentCategory: 'food'
    };
    const state = budgetReducer(populatedState, { type: 'reset-app' });
    expect(state.budget).toBe(0);
    expect(state.expenses).toEqual([]);
    expect(state.modal).toBe(false);
  });

  it('should filter by category', () => {
    const state = budgetReducer(initialState, { type: 'filter-category', payload: { id: 'food' } });
    expect(state.currentCategory).toBe('food');
  });
});
