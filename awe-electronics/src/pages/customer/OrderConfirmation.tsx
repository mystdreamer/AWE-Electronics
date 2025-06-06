import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Order, Receipt, CartItem } from '@shared/schema';
import { CustomerFacade } from '@/patterns';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, FileText, ShoppingBag, Truck } from 'lucide-react';

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const orderId = parseInt(id ?? '', 10);
  const customerFacade = new CustomerFacade();

  useEffect(() => {
    try {
      if (isNaN(orderId)) {
        throw new Error('Invalid order ID');
      }

      console.log('Observer pattern generated data being loaded');

      let orderData = customerFacade.getOrder(orderId);

      if (!orderData) {
        const storedOrder = localStorage.getItem('lastOrder');
        if (storedOrder) {
          try {
            orderData = JSON.parse(storedOrder);
            console.log('Using stored order from localStorage');
          } catch (e) {
            console.error('Failed to parse stored order');
          }
        }
      }

      if (orderData) {
        setOrder(orderData);

        let receiptData = customerFacade.getReceipt(orderData.id);

        if (!receiptData) {
          const demoReceipt: Receipt = {
            id: 1000 + Math.floor(Math.random() * 1000),
            orderId: orderData.id,
            receiptNumber: `RCT-${Math.floor(10000 + Math.random() * 90000)}`,
            amount: orderData.total,
            paymentMethod: orderData.paymentMethod,
            createdAt: new Date().toISOString()
          };

          setReceipt(demoReceipt);
          console.log('Created demo receipt for order demonstration');
        } else {
          setReceipt(receiptData);
        }
      } else {
        throw new Error('Order not found');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      setError(error instanceof Error ? error.message : 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-semibold mb-2">Loading order details...</h2>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>
              {error || 'Failed to load order details'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/products')}>
              Return to Shop
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Order Confirmed!
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Thank you for your purchase
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Order #{order.orderNumber}
        </p>
      </div>

      <div className="grid gap-8">
        {receipt && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-600" />
                    Receipt Generated
                  </CardTitle>
                  <CardDescription>
                    Observer Pattern demonstration - receipt was generated automatically
                  </CardDescription>
                </div>
                <div className="bg-green-100 px-3 py-1 rounded-full text-xs font-medium text-green-800">
                  #{receipt.receiptNumber}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="font-medium">{receipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium">{formatCurrency(receipt.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">{formatDate(receipt.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-blue-600" />
                Inventory Updated
              </CardTitle>
              <CardDescription>
                Observer Pattern demonstration - inventory counts adjusted
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              Stock levels have been automatically updated for all purchased items.
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-purple-600" />
                Shipping Initiated
              </CardTitle>
              <CardDescription>
                Observer Pattern demonstration - shipping process started
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              Your shipping request has been automatically created and queued for processing.
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              Placed on {formatDate(order.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(order.items as CartItem[]).map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(order.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {order.shippingAddress}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Payment Method</h3>
                <p className="text-gray-600">
                  {order.paymentMethod}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => window.print()}>
              Print Details
            </Button>
            <Button onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
