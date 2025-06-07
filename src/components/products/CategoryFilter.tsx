
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  isLoading?: boolean;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  isLoading = false
}: CategoryFilterProps) {
  const handleCategoryToggle = (categoryId: string, isChecked: boolean) => {
    if (isChecked) {
      onCategoryChange(categoryId);
    } else {
      onCategoryChange(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No categories available
          </p>
        ) : (
          <div className="space-y-3">
            {categories.map(category => (
              <div key={category.id} className="flex items-start space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategory === category.id}
                  onCheckedChange={(checked) => 
                    handleCategoryToggle(category.id, checked === true)
                  }
                />
                <div className="grid gap-0.5 leading-none">
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {category.name}
                  </Label>
                  {category.description && (
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
