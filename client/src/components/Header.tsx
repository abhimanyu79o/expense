import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/assets/logo.svg" alt="App Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
              Expense Tracker
            </h1>
          </div>
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
    </header>
  );
}