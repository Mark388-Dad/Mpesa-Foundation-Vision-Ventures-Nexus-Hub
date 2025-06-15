
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('enterprise_categories')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      console.log('Categories fetched:', data);
      return (data || []).map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color
      })) as Category[];
    }
  });

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
                    className="text-sm font-medium cursor-pointer flex items-center"
                  >
                    {category.icon && <span className="mr-2">{category.icon}</span>}
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
