export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category?: ExpenseCategory;
}

export type ExpenseCategory = 
  | "food"
  | "transportation"
  | "entertainment"
  | "utilities" 
  | "shopping" 
  | "housing" 
  | "healthcare" 
  | "other";

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: "Food & Dining",
  transportation: "Transportation",
  entertainment: "Entertainment",
  utilities: "Utilities",
  shopping: "Shopping",
  housing: "Housing",
  healthcare: "Healthcare",
  other: "Other"
};

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: "bg-blue-100 text-blue-800",
  transportation: "bg-green-100 text-green-800",
  entertainment: "bg-purple-100 text-purple-800",
  utilities: "bg-yellow-100 text-yellow-800",
  shopping: "bg-pink-100 text-pink-800",
  housing: "bg-indigo-100 text-indigo-800",
  healthcare: "bg-red-100 text-red-800",
  other: "bg-gray-100 text-gray-800"
};

export type SortOrder = 'dateDesc' | 'dateAsc' | 'amountDesc' | 'amountAsc';

export interface ExpenseFormData {
  description: string;
  amount: number;
  date: string;
  category?: ExpenseCategory;
}
