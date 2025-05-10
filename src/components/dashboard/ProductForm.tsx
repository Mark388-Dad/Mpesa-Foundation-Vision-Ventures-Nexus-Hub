
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Product, ProductFormData, Category } from "@/types";
import { Image, X, Upload, Info } from "lucide-react";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function ProductForm({ 
  product, 
  categories, 
  onSubmit, 
  isSubmitting 
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    quantity: product?.quantity || 0,
    categoryId: product?.categoryId || "",
  });
  
  const [imagePreview, setImagePreview] = useState<string | undefined>(product?.imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    setFormData((prev) => ({ 
      ...prev, 
      [name]: isNaN(numValue) ? 0 : numValue 
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Please upload a valid image (JPEG, PNG, or WebP)",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description || formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields correctly",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.categoryId) {
      toast({
        title: "Category Required",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await onSubmit(formData);
      
      if (!product) {
        // Reset form if it's a new product
        setFormData({
          name: "",
          description: "",
          price: 0,
          quantity: 0,
          categoryId: "",
        });
        setImagePreview(undefined);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
      
    } catch (error) {
      console.error("Error submitting product:", error);
      toast({
        title: "Submission Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Chocolate Bar"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (KES) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleNumberInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.quantity}
                  onChange={handleNumberInputChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              
              <div className="border-2 border-dashed rounded-md border-gray-300 p-6 flex flex-col items-center justify-center space-y-3">
                {imagePreview ? (
                  <div className="relative">
                    <div className="w-40 h-40 overflow-hidden rounded-md border">
                      <img 
                        src={imagePreview} 
                        alt="Product preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                      onClick={() => {
                        setImagePreview(undefined);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                        setFormData(prev => ({ ...prev, image: undefined }));
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="p-3 rounded-full bg-gray-100">
                      <Image className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="mb-2"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        JPEG, PNG, or WebP. Max 5MB.
                      </p>
                    </div>
                  </>
                )}
                <Input
                  ref={fileInputRef}
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              
              <div className="flex items-start mt-2">
                <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Adding a clear, high-quality product image helps increase booking rates.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : product ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
