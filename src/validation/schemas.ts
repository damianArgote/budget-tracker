import { z } from 'zod';

export const budgetSchema = z.object({
  budget: z.number()
    .positive('El presupuesto debe ser mayor a 0')
    .min(1, 'El presupuesto debe ser al menos 1')
});

export const expenseSchema = z.object({
  expenseName: z.string()
    .min(1, 'El nombre del gasto es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  amount: z.number()
    .positive('El monto debe ser mayor a 0')
    .min(0.01, 'El monto mínimo es 0.01'),
  category: z.string()
    .min(1, 'La categoría es requerida'),
  date: z.union([z.date(), z.instanceof(Date), z.null()])
    .refine(val => val !== null, { message: 'La fecha es requerida' }),
  quantity: z.number()
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad mínima es 1')
});

export const budgetStringSchema = z.preprocess(
  (val) => {
    if (typeof val !== 'string') return NaN;
    const num = parseFloat(val.replace(/[^\d.-]/g, ''));
    return isNaN(num) ? NaN : num;
  },
  z.number()
    .positive('El presupuesto debe ser mayor a 0')
    .min(1, 'El presupuesto debe ser al menos 1')
);

export type BudgetFormData = z.infer<typeof budgetStringSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;

export function validateBudget(value: string): { success: boolean; data?: number; error?: string } {
  const result = budgetStringSchema.safeParse(value);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const issues = result.error.issues;
  return { success: false, error: issues[0]?.message || 'Error de validación' };
}

export function validateExpense(data: unknown): { success: boolean; data?: ExpenseFormData; errors?: string[] } {
  const result = expenseSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { 
    success: false, 
    errors: result.error.issues.map(e => e.message) 
  };
}
