
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnterpriseCategory } from "@/types";
import { Link } from "react-router-dom";

interface EnterpriseCategoriesGridProps {
  categories: EnterpriseCategory[];
  isLoading?: boolean;
}

export function EnterpriseCategoriesGrid({ categories, isLoading }: EnterpriseCategoriesGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(9).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link 
          key={category.id} 
          to={`/categories/${category.id}`}
          className="block hover:transform hover:scale-105 transition-transform duration-200"
        >
          <Card className="h-full border-2 hover:border-academy-blue/50 transition-colors">
            <CardHeader className="text-center">
              <div 
                className="text-4xl mb-2"
                style={{ color: category.color }}
              >
                {category.icon}
              </div>
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm text-center line-clamp-3">
                {category.description}
              </p>
              <div className="mt-4 flex justify-center">
                <Badge 
                  variant="outline" 
                  style={{ 
                    borderColor: category.color,
                    color: category.color 
                  }}
                >
                  Browse Products
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
