import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 text-center">About Expense Tracker</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-3">What is Expense Tracker?</h2>
          <p className="text-gray-700 mb-4">
            Expense Tracker is a simple, intuitive application designed to help you manage your
            personal finances. It allows you to track your expenses, set budgets, and keep an eye on your
            spending habits.
          </p>
          <p className="text-gray-700">
            This app works offline and stores all your data locally on your device, ensuring
            your financial information remains private and accessible at all times.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-3">Features</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Add, edit, and delete expenses</li>
            <li>View expenses sorted by date or amount</li>
            <li>Track against a budget of ₹10,00,000</li>
            <li>Works offline with local data storage</li>
            <li>Simple and clean user interface</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-3">Version Information</h2>
          <p className="text-gray-700">
            <strong>Version:</strong> 1.0.0
          </p>
          <p className="text-gray-700">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}