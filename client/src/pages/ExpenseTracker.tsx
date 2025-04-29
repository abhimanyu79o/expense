import { useState, useEffect } from "react";
import { 
  getExpenses, 
  calculateTotal, 
  sortExpenses, 
  addExpense, 
  updateExpense, 
  deleteExpense, 
  getBudgetPercentage,
  saveExpenses
} from "@/lib/expenseService";
import { Expense, SortOrder } from "@/types/expense";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import ExpenseSummary from "@/components/ExpenseSummary";
import EditExpenseModal from "@/components/EditExpenseModal";
import DeleteExpenseModal from "@/components/DeleteExpenseModal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('dateDesc');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const { toast } = useToast();

  // Load expenses from localStorage on mount
  useEffect(() => {
    const loadedExpenses = getExpenses();
    setExpenses(loadedExpenses);
    setTotalAmount(calculateTotal(loadedExpenses));
  }, []);

  // Sort expenses whenever sort order changes
  useEffect(() => {
    const sortedExpenses = sortExpenses([...expenses], sortOrder);
    setExpenses(sortedExpenses);
  }, [sortOrder]);

  // Handle adding a new expense
  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense = addExpense(expenseData);
    const updatedExpenses = sortExpenses([...expenses, newExpense], sortOrder);
    
    setExpenses(updatedExpenses);
    setTotalAmount(calculateTotal(updatedExpenses));
    
    toast({
      title: "Expense added",
      description: `${expenseData.description} for ₹${expenseData.amount.toFixed(2)} added successfully.`,
    });
  };

  // Handle updating an expense
  const handleUpdateExpense = (updatedExpense: Expense) => {
    const result = updateExpense(updatedExpense);
    
    if (result) {
      const updatedExpenses = expenses.map(exp => 
        exp.id === updatedExpense.id ? updatedExpense : exp
      );
      const sortedExpenses = sortExpenses(updatedExpenses, sortOrder);
      
      setExpenses(sortedExpenses);
      setTotalAmount(calculateTotal(sortedExpenses));
      setIsEditModalOpen(false);
      
      toast({
        title: "Expense updated",
        description: `${updatedExpense.description} has been updated.`,
      });
    }
  };

  // Handle deleting an expense
  const handleDeleteExpense = (id: number) => {
    if (deleteExpense(id)) {
      const updatedExpenses = expenses.filter(exp => exp.id !== id);
      
      setExpenses(updatedExpenses);
      setTotalAmount(calculateTotal(updatedExpenses));
      setIsDeleteModalOpen(false);
      
      toast({
        title: "Expense deleted",
        description: "The expense has been permanently removed.",
      });
    }
  };

  // Open edit modal with selected expense
  const handleEditClick = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsEditModalOpen(true);
  };

  // Open delete modal with selected expense
  const handleDeleteClick = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsDeleteModalOpen(true);
  };

  // Calculate budget percentage
  const budgetPercentage = getBudgetPercentage(totalAmount);

  // Handle manual save
  const handleManualSave = () => {
    saveExpenses(expenses);
    toast({
      title: "Expenses saved",
      description: "All your expenses have been saved to local storage.",
    });
  };

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex justify-end mb-6">
          <Button 
            onClick={handleManualSave}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Expenses
          </Button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Expense Form Section */}
          <div className="lg:col-span-5 mb-8 lg:mb-0">
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>

          {/* Expenses List Section */}
          <div className="lg:col-span-7">
            <ExpenseList 
              expenses={expenses}
              onEditExpense={handleEditClick}
              onDeleteExpense={handleDeleteClick}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
            
            {/* Total Expenses Summary */}
            <ExpenseSummary 
              totalAmount={totalAmount} 
              budgetPercentage={budgetPercentage}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {currentExpense && (
        <>
          <EditExpenseModal
            isOpen={isEditModalOpen}
            expense={currentExpense}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdateExpense}
          />
          
          <DeleteExpenseModal
            isOpen={isDeleteModalOpen}
            expense={currentExpense}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => handleDeleteExpense(currentExpense.id)}
          />
        </>
      )}
    </div>
  );
}
