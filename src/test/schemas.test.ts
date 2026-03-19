import { describe, it, expect } from 'vitest';
import { 
  budgetSchema, 
  expenseSchema, 
  validateBudget, 
  validateExpense 
} from '../validation/schemas';

describe('Zod Schemas', () => {
  describe('budgetSchema', () => {
    it('should validate valid budget number', () => {
      const result = budgetSchema.safeParse({ budget: 1000 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.budget).toBe(1000);
      }
    });

    it('should reject zero budget', () => {
      const result = budgetSchema.safeParse({ budget: 0 });
      expect(result.success).toBe(false);
    });

    it('should reject negative budget', () => {
      const result = budgetSchema.safeParse({ budget: -100 });
      expect(result.success).toBe(false);
    });
  });

  describe('expenseSchema', () => {
    it('should validate valid expense', () => {
      const expense = {
        expenseName: 'Test Expense',
        amount: 50,
        category: 'food',
        date: new Date(),
        quantity: 1
      };
      const result = expenseSchema.safeParse(expense);
      expect(result.success).toBe(true);
    });

    it('should reject expense without name', () => {
      const expense = {
        expenseName: '',
        amount: 50,
        category: 'food',
        date: new Date(),
        quantity: 1
      };
      const result = expenseSchema.safeParse(expense);
      expect(result.success).toBe(false);
    });

    it('should reject expense with negative amount', () => {
      const expense = {
        expenseName: 'Test',
        amount: -50,
        category: 'food',
        date: new Date(),
        quantity: 1
      };
      const result = expenseSchema.safeParse(expense);
      expect(result.success).toBe(false);
    });

    it('should reject expense without category', () => {
      const expense = {
        expenseName: 'Test',
        amount: 50,
        category: '',
        date: new Date(),
        quantity: 1
      };
      const result = expenseSchema.safeParse(expense);
      expect(result.success).toBe(false);
    });

    it('should reject quantity less than 1', () => {
      const expense = {
        expenseName: 'Test',
        amount: 50,
        category: 'food',
        date: new Date(),
        quantity: 0
      };
      const result = expenseSchema.safeParse(expense);
      expect(result.success).toBe(false);
    });
  });

  describe('validateBudget helper', () => {
    it('should return success for valid budget string', () => {
      const result = validateBudget('500');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(500);
      }
    });

    it('should return error for empty budget', () => {
      const result = validateBudget('');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return error for invalid number', () => {
      const result = validateBudget('abc');
      expect(result.success).toBe(false);
    });
  });

  describe('validateExpense helper', () => {
    it('should return success for valid expense', () => {
      const expense = {
        expenseName: 'Test',
        amount: 50,
        category: 'food',
        date: new Date(),
        quantity: 1
      };
      const result = validateExpense(expense);
      expect(result.success).toBe(true);
    });

    it('should return errors for invalid expense', () => {
      const expense = {
        expenseName: '',
        amount: -1,
        category: '',
        date: null,
        quantity: 0
      };
      const result = validateExpense(expense);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });
});
