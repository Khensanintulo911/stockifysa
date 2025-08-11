import { Link, useLocation } from "wouter";
import { Package, BarChart3, ClipboardCheck, DollarSign, FileText, Settings } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Products", href: "/products", icon: Package },
  { name: "Inventory", href: "/inventory", icon: ClipboardCheck },
  { name: "Sales", href: "/sales", icon: DollarSign },
  { name: "Reports", href: "/reports", icon: FileText },
];

export default function Sidebar() {
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location === "/" || location === "/dashboard";
    }
    return location === href;
  };

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:shadow-sm">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-dark-gray">StockTracker SA</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link key={item.name} href={item.href}>
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg group transition-colors duration-200 ${
                active 
                  ? "text-primary bg-blue-50" 
                  : "text-gray-600 hover:text-primary hover:bg-blue-50"
              }`}>
                <Icon className={`w-5 h-5 mr-3 ${active ? "text-primary" : "group-hover:text-primary"}`} />
                {item.name}
              </a>
            </Link>
          );
        })}
        
        <div className="border-t border-gray-200 pt-4 mt-6">
          <Link href="/settings">
            <a className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg group transition-colors duration-200">
              <Settings className="w-5 h-5 mr-3 group-hover:text-primary" />
              Settings
            </a>
          </Link>
        </div>
      </nav>
    </div>
  );
}
