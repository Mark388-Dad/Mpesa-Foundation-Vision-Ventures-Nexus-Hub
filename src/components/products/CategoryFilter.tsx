
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (categoryIds: string[]) => void;
}

export function CategoryFilter({ 
  categories, 
  selectedCategories, 
  onCategoryChange 
}: CategoryFilterProps) {
  const [showMobile, setShowMobile] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    let newSelectedCategories: string[];
    
    if (selectedCategories.includes(categoryId)) {
      newSelectedCategories = selectedCategories.filter(id => id !== categoryId);
    } else {
      newSelectedCategories = [...selectedCategories, categoryId];
    }
    
    onCategoryChange(newSelectedCategories);
  };

  const clearFilters = () => {
    onCategoryChange([]);
  };

  const toggleMobileFilters = () => {
    setShowMobile(!showMobile);
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button 
          onClick={toggleMobileFilters} 
          variant="outline" 
          className="w-full"
        >
          {showMobile ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>
      
      {/* Filter Card - Hidden on mobile unless toggled */}
      <Card className={`${showMobile ? 'block' : 'hidden'} md:block sticky top-20`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Categories</h3>
            {selectedCategories.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-start space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                  className="mt-1"
                />
                <div className="grid gap-1">
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="cursor-pointer flex items-center justify-between"
                  >
                    {category.name}
                  </Label>
                </div>
              </div>
            ))}
          </div>
          
          {selectedCategories.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Selected Filters:</p>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map(selectedId => {
                  const category = categories.find(c => c.id === selectedId);
                  return category ? (
                    <Badge
                      key={selectedId}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleCategoryToggle(selectedId)}
                    >
                      {category.name} ✕
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
