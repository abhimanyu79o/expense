import { AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Expense } from "@/types/expense";
import { formatCurrency } from "@/lib/expenseService";

interface DeleteExpenseModalProps {
  isOpen: boolean;
  expense: Expense;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteExpenseModal({
  isOpen,
  expense,
  onClose,
  onConfirm
}: DeleteExpenseModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Expense</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this expense? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="bg-gray-50 p-4 rounded-md my-4">
          <p className="font-medium text-gray-800">{expense.description}</p>
          <p className="text-primary-600 font-semibold">{formatCurrency(expense.amount)}</p>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
