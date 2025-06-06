import { useEffect, useState } from 'react';
import { Product } from '@shared/schema';
import { EmployeeOperationFacade } from "@/patterns/facade/EmployeeOperationFacade";
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Edit, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Edit dialog state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [editedStock, setEditedStock] = useState<number>(0);
  
  // Create an instance of the EmployeeFacade (Facade Pattern)
  const employeeFacade = new EmployeeOperationFacade();
  
  // Fetch products using the facade pattern
  useEffect(() => {
    try {
      // Get all products through the facade
      const allProducts = employeeFacade.getAllProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Handle search filtering
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);
  
  // Open edit dialog for a product
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditedDescription(product.description);
    setIsEditDialogOpen(true);
    setUpdateSuccess(false);
    setEditedStock(product.stock);
  };
  
  // Save updated product details
  const handleSaveProduct = async () => {
    if (!selectedProduct) return;

    try {
      setIsUpdating(true);

      console.log('Updating product (Repository Pattern)');
      console.log('Original Description:', selectedProduct.description);
      console.log('Updated Description:', editedDescription);
      console.log('Original Stock:', selectedProduct.stock);
      console.log('Updated Stock:', editedStock);

      // Use facade to update product
      const updatedProduct = employeeFacade.updateProductDetails(
        selectedProduct.id,
        {
          description: editedDescription,
          stock: editedStock,
        }
      );
      
      // Update local state
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === updatedProduct.id ? updatedProduct : p
        )
      );
      
      setUpdateSuccess(true);
      
      // Close dialog after a short delay to show success message
      setTimeout(() => {
        setIsEditDialogOpen(false);
        setSelectedProduct(null);
        setUpdateSuccess(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Loading products...</h1>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Product Management
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Update product descriptions (Repository Pattern Demo)
          </p>
          
          {/* Search */}
          <div className="mt-4 relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              type="text"
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products Catalog</CardTitle>
            <CardDescription>
              Click the edit button to update product descriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell>
                        <Badge className={
                          product.stock > 10 ? "bg-green-100 text-green-800 hover:bg-green-200" : 
                          product.stock > 0 ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : 
                          "bg-red-100 text-red-800 hover:bg-red-200"
                        }>
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {product.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditClick(product)}
                          title="Edit Description"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Edit Description Dialog */}
        <Dialog 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product Description</DialogTitle>
              <DialogDescription>
                Update the description for {selectedProduct?.name}
              </DialogDescription>
            </DialogHeader>
            
            {updateSuccess ? (
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                <h3 className="text-lg font-medium text-gray-900">Description Updated!</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Product description was successfully updated
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      placeholder="Enter product description"
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productStock">Stock</Label>
                    <Input
                      id="productStock"
                      type="number"
                      value={editedStock}
                      onChange={(e) => setEditedStock(Number(e.target.value))}
                      placeholder="Enter stock amount"
                      min={0}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProduct}
                    disabled={
                      isUpdating || 
                      (
                        editedDescription.trim() === selectedProduct?.description.trim() && 
                        editedStock === selectedProduct?.stock
                      )
                    }
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}