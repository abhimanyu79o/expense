import { Link } from "wouter";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { getExpenses, saveExpenses } from "@/lib/expenseService";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [location] = useLocation();
  const { toast } = useToast();

  const handleManualSave = () => {
    const expenses = getExpenses();
    saveExpenses(expenses);
    toast({
      title: "Expenses saved",
      description: "All your expenses have been saved to local storage.",
    });
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/icons/expense-icon.svg" alt="App Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
              Expense Tracker
            </h1>
          </div>
          
          <div className="flex items-center">
            {location === "/" && (
              <Button 
                onClick={handleManualSave}
                className="bg-primary-600 hover:bg-primary-700 text-white mr-6"
                size="sm"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Expenses
              </Button>
            )}
            
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/">
                    <a className="hover:text-indigo-300 transition-colors">Home</a>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <a className="hover:text-indigo-300 transition-colors">About</a>
                  </Link>
                </li>
                <li>
                  <Link href="/settings">
                    <a className="hover:text-indigo-300 transition-colors">Settings</a>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}