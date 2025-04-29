import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import ExpenseTracker from "@/pages/ExpenseTracker";
import About from "@/pages/About";
import Settings from "@/pages/Settings";
import Header from "@/components/Header";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-4 pb-8">
        <Switch>
          <Route path="/" component={ExpenseTracker} />
          <Route path="/about" component={About} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <footer className="bg-gray-900 text-white py-4 text-center text-sm">
        <div className="container mx-auto">
          <p>Expense Tracker &copy; {new Date().getFullYear()} - All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
