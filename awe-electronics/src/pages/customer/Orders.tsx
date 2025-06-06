import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UserOperationFacade } from "../patterns/facade/UserOperationFacade";
import { Order } from "@shared/schema";
import { Link } from "react-router-dom";
import { formatDate, formatCurrency } from "../lib/utils";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Truck, CheckCircle } from "lucide-react";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      const facade = new UserOperationFacade(user);
      
      const fetchOrders = async () => {
        try {
          setIsLoading(true);
          const data = await facade.getOrders();
          setOrders(data.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }));
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchOrders();
    }
  }, [user]);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing':
        return <Package className="h-4 w-4" />;
      case 'Shipped':
        return <Truck className="h-4 w-4" />;
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="w-full animate-pulse">
              <CardHeader className="bg-gray-100 h-16"></CardHeader>
              <CardContent className="bg-gray-50 h-40"></CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="w-full overflow-hidden">
              <CardHeader className="border-b border-gray-200 bg-gray-50 py-3">
                <div className="flex flex-wrap justify-between items-center">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Order #</span>
                      <span className="text-sm font-medium">{order.orderNumber}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <Badge className={getStatusColor(order.status)} variant="outline">
                      <span className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                    </Badge>
                    <span className="font-medium text-gray-900">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible>
                  <AccordionItem value="items">
                    <AccordionTrigger className="px-4 py-2 text-sm font-medium">
                      Order Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 px-4 pb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                              <div className="mt-0.5 text-sm text-gray-600">Qty: {item.quantity}</div>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                          <div>
                            <p className="text-sm font-medium">Payment Method</p>
                            <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Shipping Address</p>
                            <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="mt-1 text-gray-600">Your order history will appear here once you make a purchase.</p>
          <Link to="/products"> {/* ✅ changed from href to to */}
            <Button className="mt-4">
              Browse Products
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
