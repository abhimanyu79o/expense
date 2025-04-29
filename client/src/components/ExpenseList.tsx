import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpAZ, ArrowDownUp, ArrowUpDown } from "lucide-react";
import { Expense, SortOrder } from "@/types/expense";
import ExpenseCard from "@/components/ExpenseCard";

interface ExpenseListProps {
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export default function ExpenseList({
  expenses,
  onEditExpense,
  onDeleteExpense,
  sortOrder,
  onSortChange
}: ExpenseListProps) {
  const toggleDateSort = () => {
    onSortChange(sortOrder === 'dateDesc' ? 'dateAsc' : 'dateDesc');
  };

  const toggleAmountSort = () => {
    onSortChange(sortOrder === 'amountDesc' ? 'amountAsc' : 'amountDesc');
  };

  // Determine which sort icons to show based on current sort order
  const dateIcon = sortOrder === 'dateDesc' ? <ArrowDownUp /> : <ArrowUpDown />;
  const amountIcon = sortOrder === 'amountDesc' ? <ArrowDownAZ /> : <ArrowUpAZ />;

  return (
    <Card className="bg-white shadow-md mb-6 border-secondary/20">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Your Expenses</h2>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleDateSort}
              className="text-sm text-gray-600 hover:text-primary"
            >
              Sort by Date {dateIcon}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleAmountSort}
              className="text-sm text-gray-600 hover:text-primary"
            >
              Sort by Amount {amountIcon}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                strokeWidth={2}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="mt-2 text-sm">No expenses yet. Add your first expense above.</p>
            </div>
          ) : (
            expenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onEdit={() => onEditExpense(expense)}
                onDelete={() => onDeleteExpense(expense)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
