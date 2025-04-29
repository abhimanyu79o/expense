import { Expense, ExpenseFormData, SortOrder } from "@/types/expense";

const STORAGE_KEY = "expenses";
const BUDGET_AMOUNT = 1000000; // Budget amount set to 10 lakh rupees

export function getExpenses(): Expense[] {
  const storedExpenses = localStorage.getItem(STORAGE_KEY);
  return storedExpenses ? JSON.parse(storedExpenses) : [];
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export function addExpense(expenseData: ExpenseFormData): Expense {
  const expenses = getExpenses();
  const newExpense: Expense = {
    ...expenseData,
    id: Date.now(),
  };
  
  expenses.push(newExpense);
  saveExpenses(expenses);
  return newExpense;
}

export function updateExpense(updatedExpense: Expense): Expense | null {
  const expenses = getExpenses();
  const index = expenses.findIndex(exp => exp.id === updatedExpense.id);
  
  if (index !== -1) {
    expenses[index] = updatedExpense;
    saveExpenses(expenses);
    return updatedExpense;
  }
  
  return null;
}

export function deleteExpense(id: number): boolean {
  const expenses = getExpenses();
  const filteredExpenses = expenses.filter(expense => expense.id !== id);
  
  if (filteredExpenses.length !== expenses.length) {
    saveExpenses(filteredExpenses);
    return true;
  }
  
  return false;
}

export function calculateTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function getBudgetPercentage(totalAmount: number): number {
  return Math.min(100, (totalAmount / BUDGET_AMOUNT) * 100);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export function sortExpenses(expenses: Expense[], sortOrder: SortOrder): Expense[] {
  const sortedExpenses = [...expenses];
  
  switch(sortOrder) {
    case 'dateAsc':
      return sortedExpenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'dateDesc':
      return sortedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'amountAsc':
      return sortedExpenses.sort((a, b) => a.amount - b.amount);
    case 'amountDesc':
      return sortedExpenses.sort((a, b) => b.amount - a.amount);
    default:
      return sortedExpenses;
  }
}

export function getTodayFormatted(): string {
  return new Date().toISOString().split('T')[0];
}
