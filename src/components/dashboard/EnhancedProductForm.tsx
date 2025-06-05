
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormData, Category } from "@/types";
import { Upload, Image, Video, FileText, Sticker } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  categoryId: z.string().min(1, "Category is required"),
});

interface EnhancedProductFormProps {
  categories: Category[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function EnhancedProductForm({ categories, onSubmit, isSubmitting }: EnhancedProductFormProps) {
  const [files, setFiles] = useState<{
    image?: File;
    video?: File;
    file?: File;
    sticker?: File;
  }>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
  });

  const selectedCategoryId = watch("categoryId");

  const handleFileChange = (type: 'image' | 'video' | 'file' | 'sticker', file: File | null) => {
    setFiles(prev => ({
      ...prev,
      [type]: file || undefined
    }));
  };

  const FileUploadSection = ({ 
    type, 
    icon: Icon, 
    title, 
    acceptedTypes, 
    description 
  }: {
    type: 'image' | 'video' | 'file' | 'sticker';
    icon: any;
    title: string;
    acceptedTypes: string[];
    description: string;
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Input
            type="file"
            accept={acceptedTypes.join(",")}
            onChange={(e) => handleFileChange(type, e.target.files?.[0] || null)}
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground">{description}</p>
          {files[type] && (
            <p className="text-xs text-green-600">
              Selected: {files[type]?.name}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const onFormSubmit = async (data: z.infer<typeof productSchema>) => {
    try {
      const formData: ProductFormData = {
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        categoryId: data.categoryId,
        ...files
      };
      await onSubmit(formData);
      reset();
      setFiles({});
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Product Information */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your product..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (KES)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                {...register("quantity", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.quantity && (
                <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Select
                value={selectedCategoryId}
                onValueChange={(value) => setValue("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Upload Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Media Files (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadSection
            type="image"
            icon={Image}
            title="Product Image"
            acceptedTypes={ACCEPTED_IMAGE_TYPES}
            description="Upload a product image (JPEG, PNG, WebP, max 10MB)"
          />
          
          <FileUploadSection
            type="video"
            icon={Video}
            title="Product Video"
            acceptedTypes={ACCEPTED_VIDEO_TYPES}
            description="Upload a product video (MP4, WebM, max 10MB)"
          />
          
          <FileUploadSection
            type="file"
            icon={FileText}
            title="Product File"
            acceptedTypes={ACCEPTED_FILE_TYPES}
            description="Upload product documents (PDF, DOC, max 10MB)"
          />
          
          <FileUploadSection
            type="sticker"
            icon={Sticker}
            title="Sticker Design"
            acceptedTypes={ACCEPTED_IMAGE_TYPES}
            description="Upload sticker design (JPEG, PNG, WebP, max 10MB)"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full btn-primary" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding Product..." : "Add Product"}
      </Button>
    </form>
  );
}
