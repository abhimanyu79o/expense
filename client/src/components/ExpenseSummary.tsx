import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/expenseService";

interface ExpenseSummaryProps {
  totalAmount: number;
  budgetPercentage: number;
}

export default function ExpenseSummary({
  totalAmount,
  budgetPercentage
}: ExpenseSummaryProps) {
  const BUDGET_AMOUNT = 1000000; // Budget set to 10 lakh rupees
  
  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-violet-50 shadow-md border-secondary/10">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Total Expenses
          </h2>
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {formatCurrency(totalAmount)}
          </div>
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          Budget Limit: <span className="font-semibold">{formatCurrency(BUDGET_AMOUNT)}</span> (10 Lakh)
        </div>
        
        <div className="mt-4">
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                budgetPercentage > 90 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                budgetPercentage > 75 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 
                'bg-gradient-to-r from-accent to-accent/90'
              }`} 
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span className="font-medium">{Math.round(budgetPercentage)}% used</span>
            <span className={budgetPercentage > 100 ? 'font-medium text-red-500' : 'font-medium'}>
              {budgetPercentage > 100 ? 'Over budget!' : `${(100 - budgetPercentage).toFixed(1)}% remaining`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
