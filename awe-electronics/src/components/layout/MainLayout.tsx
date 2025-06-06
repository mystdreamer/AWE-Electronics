import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User as UserIcon, 
  ChevronDown,
  ShoppingBag,
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Cart from '../customer/Cart';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Footer from '@/components/ui/footer';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const { items, toggleCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  type CartItem = { quantity: number; [key: string]: any };
  const isActive = (path: string) => location.pathname === path;
  const cartItemCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  const customerNavItems = [
    { name: 'Products', path: '/products', icon: null, description: 'Browse catalogue and add items to cart' }
  ];

  const employeeNavItems = [
    { name: 'Product Management', path: '/product-management', icon: <ShoppingBag className="h-5 w-5 mr-2" />, description: 'Update product descriptions' }
  ];

  const navItems = user?.role === 'customer' ? customerNavItems : employeeNavItems;

 return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary">AWE Electronics</span>
              </div>
              <nav className="ml-6 flex space-x-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium cursor-pointer transition-colors ${
                      isActive(item.path) 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-border'
                    }`}
                    title={item.description}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center">
              {user?.role === 'customer' && (
                <button 
                  onClick={toggleCart} 
                  className="relative p-2 text-muted-foreground hover:text-primary"
                  title="View shopping cart"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}
              <div className="ml-4 flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-1 outline-none text-foreground">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center p-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium text-foreground">{user?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                      >
                        Log out
                      </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-background text-foreground">
        {children}
      </main>

      <Footer />
      <Cart />
    </div>
  );
}
