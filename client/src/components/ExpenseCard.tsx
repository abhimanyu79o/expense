import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Expense, 
  CATEGORY_LABELS, 
  CATEGORY_COLORS 
} from "@/types/expense";
import { formatCurrency, formatDate } from "@/lib/expenseService";

interface ExpenseCardProps {
  expense: Expense;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ExpenseCard({
  expense,
  onEdit,
  onDelete
}: ExpenseCardProps) {
  const categoryLabel = CATEGORY_LABELS[expense.category];
  const categoryColorClass = CATEGORY_COLORS[expense.category];
  
  return (
    <div className="expense-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium text-gray-800">{expense.description}</h3>
          <div className="text-sm text-gray-500">{formatDate(expense.date)}</div>
          <div className="mt-1">
            <Badge variant="outline" className={categoryColorClass}>
              {categoryLabel}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-800">{formatCurrency(expense.amount)}</div>
          <div className="mt-2 flex space-x-2 justify-end">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onEdit}
              className="h-8 w-8 text-gray-500 hover:text-primary-600"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onDelete}
              className="h-8 w-8 text-gray-500 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
