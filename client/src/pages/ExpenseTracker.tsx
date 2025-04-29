import { useState, useEffect } from "react";
import { 
  getExpenses, 
  calculateTotal, 
  sortExpenses, 
  addExpense, 
  updateExpense, 
  deleteExpense, 
  getBudgetPercentage
} from "@/lib/expenseService";
import { Expense, SortOrder } from "@/types/expense";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import ExpenseSummary from "@/components/ExpenseSummary";
import EditExpenseModal from "@/components/EditExpenseModal";
import DeleteExpenseModal from "@/components/DeleteExpenseModal";
import { useToast } from "@/hooks/use-toast";

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
      description: `${expenseData.description} for $${expenseData.amount.toFixed(2)} added successfully.`,
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Expense Tracker</h1>
          <p className="text-gray-600">Track and manage your expenses easily</p>
        </header>

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
