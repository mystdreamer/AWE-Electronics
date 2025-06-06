import { useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { CustomerFacade } from '@/patterns';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, Landmark, CreditCardIcon } from 'lucide-react';

// Payment method icons
const paymentIcons: Record<string, ReactElement> = {
  'Credit Card': <CreditCard className="h-4 w-4" />,
  'PayPal': <CreditCardIcon className="h-4 w-4" />,
  'Bank Transfer': <Landmark className="h-4 w-4" />
};

export default function Checkout() {
  const { items, subtotal, tax, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();
  const customerFacade = new CustomerFacade();
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get available payment methods from the Strategy pattern
  const paymentMethods = customerFacade.getPaymentMethods();
  
  // Submit order
  const handleCheckout = async () => {
    if (!shippingAddress) {
      setError('Please enter a shipping address');
      return;
    }
    
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log('Processing order with payment method:', paymentMethod);
      console.log('This demonstrates the Strategy Pattern for payment processing');
      
      // Process purchase using the Facade pattern (which uses Strategy pattern internally)
      const order = customerFacade.processPurchase(items, paymentMethod, shippingAddress);
      
      console.log('Order created:', order);
      
      // Clear the cart
      clearCart();
      
      // Store the order in localStorage so we can access it on the confirmation page
      localStorage.setItem('lastOrder', JSON.stringify(order));
      
      // Redirect to order confirmation page using React Router
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during checkout');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check if cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Your cart is empty</CardTitle>
            <CardDescription>
              Add some products to your cart before proceeding to checkout
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-foreground mb-8 text-center">
          Checkout
        </h1>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {items.length} item{items.length !== 1 ? 's' : ''} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-semibold border-t pt-4 text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Checkout Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Payment</CardTitle>
              <CardDescription>
                Enter your details to complete your order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 p-4 rounded-md text-red-500 text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="shippingAddress">Shipping Address</Label>
                <Textarea
                  id="shippingAddress"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your full address"
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-4">
                <Label>Payment Method</Label>
                <p className="text-sm text-gray-500 mt-1 mb-2">
                  Select a payment method (Strategy Pattern Demo)
                </p>
                
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <RadioGroupItem value={method} id={`payment-${method}`} />
                      <Label
                        htmlFor={`payment-${method}`}
                        className="flex items-center cursor-pointer"
                      >
                        <span className="mr-2">{paymentIcons[method] || null}</span>
                        {method}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="default"
                onClick={() => navigate('/products')}
              >
                Back to Shopping
              </Button>
              <Button
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}