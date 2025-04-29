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
    <header className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/icons/expense-icon.svg" alt="App Logo" className="h-10 w-10 drop-shadow-md" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 text-transparent bg-clip-text">
              Expense Tracker
            </h1>
          </div>
          
          <div className="flex items-center">
            {location === "/" && (
              <Button 
                onClick={handleManualSave}
                className="bg-accent hover:bg-accent/90 text-white mr-6"
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
                    <a className="font-medium hover:text-blue-200 transition-colors">Home</a>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <a className="font-medium hover:text-blue-200 transition-colors">About</a>
                  </Link>
                </li>
                <li>
                  <Link href="/settings">
                    <a className="font-medium hover:text-blue-200 transition-colors">Settings</a>
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