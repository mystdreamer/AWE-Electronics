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
      price: product.price,
      quantity: quantity,
      image: product.image,
    };

    addToCart(cartItem);
    setQuantity(1);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="group relative rounded-lg overflow-hidden border border-border bg-card shadow-sm">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-muted group-hover:opacity-80">
        <img
          src={product.image}
          alt={product.name}
          className="h-60 w-full object-cover object-center"
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
          <p className="text-sm font-medium text-foreground">{formatCurrency(product.price)}</p>
        </div>

        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>

        <div className="mt-3">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-xs text-muted-foreground">Quantity:</span>
            <div className="flex items-center rounded-md bg-background px-2 py-1 border border-border">
              <button
                onClick={decrementQuantity}
                className="p-1 rounded-full hover:bg-muted"
              >
                <Minus className="h-3 w-3 text-foreground" />
              </button>
              <span className="mx-2 text-sm text-foreground">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="p-1 rounded-full hover:bg-muted"
              >
                <Plus className="h-3 w-3 text-foreground" />
              </button>
            </div>
          </div>

          <Button onClick={handleAddToCart} className="w-full" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
