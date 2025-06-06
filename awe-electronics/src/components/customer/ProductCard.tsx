import { useState } from 'react';
import { Product, CartItem } from '@shared/schema';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: quantity,
      image: product.image,
    };
    
    addToCart(cartItem);
    setQuantity(1); // Reset quantity after adding to cart
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  return (
    <div className="group relative rounded-lg overflow-hidden border border-gray-200 bg-white">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-100 group-hover:opacity-80">
        <img
          src={product.image}
          alt={product.name}
          className="h-60 w-full object-cover object-center"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm font-medium text-gray-900">{formatCurrency(parseFloat(product.price))}</p>
        </div>
        
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        
        <div className="mt-3">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-xs text-gray-500">Quantity:</span>
            <div className="flex items-center">
              <button
                onClick={decrementQuantity}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="mx-2 text-sm">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}