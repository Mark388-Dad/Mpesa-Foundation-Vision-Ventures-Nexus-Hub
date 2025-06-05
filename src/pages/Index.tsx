
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EnterpriseCategoriesGrid } from "@/components/categories/EnterpriseCategoriesGrid";
import { EnterpriseCategory } from "@/types";

const Index = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['enterprise-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprise_categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as EnterpriseCategory[];
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-academy-blue to-academy-green text-white py-16">
        <div className="academy-container text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Student Enterprise Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover amazing products and services from student-run enterprises
          </p>
          <div className="text-lg opacity-80">
            Browse by category and support student innovation
          </div>
        </div>
      </section>

      {/* Enterprise Categories Section */}
      <section className="py-16">
        <div className="academy-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Enterprise Categories</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore diverse student-run enterprises across different categories. 
              From handmade crafts to tech services, discover what our student entrepreneurs offer.
            </p>
          </div>
          
          <EnterpriseCategoriesGrid 
            categories={categories} 
            isLoading={isLoading}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="academy-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Simple steps to support student enterprises
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-academy-blue/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Categories</h3>
              <p className="text-muted-foreground">
                Explore different enterprise categories to find products and services you need
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-academy-green/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Orders</h3>
              <p className="text-muted-foreground">
                Book products or services directly from student entrepreneurs
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-academy-orange/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Order</h3>
              <p className="text-muted-foreground">
                Receive notifications with pickup codes and collect your orders
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
