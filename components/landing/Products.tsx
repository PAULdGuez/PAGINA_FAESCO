"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

type Product = Database['public']['Tables']['products']['Row'];

const Products = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Static fallback data (used if DB is empty or fails)
  const staticProducts = [
    {
      id: "pollo-entero",
      name: "Pollo Entero",
      description: "Pollo fresco entero, ideal para rostizar o preparar al horno. Entero o por pieza. Peso promedio 2.7 kg.",
      price: "$85",
      unit: "por pieza",
      image: "/img/pollo_entero.png",
      popular: true,
      created_at: new Date().toISOString()
    },
    {
      id: "pechuga",
      name: "Pechuga de Pollo",
      description: "Pechuga con o sin hueso, perfecta para filetes y comidas saludables.",
      price: "$120",
      unit: "por kg",
      image: "/img/pechuga.png",
      popular: false,
      created_at: new Date().toISOString()
    },
    {
      id: "pierna-muslo",
      name: "Pierna y Muslo",
      description: "Pieza con hueso, ideal para guisos, caldos y platillos tradicionales.",
      price: "$75",
      unit: "por kg",
      image: "/img/pierna_muslo.png",
      popular: false,
      created_at: new Date().toISOString()
    },
    {
      id: "alas",
      name: "Alas de Pollo",
      description: "Perfectas para botanear, preparar al carbón o en salsa BBQ.",
      price: "$65",
      unit: "por kg",
      image: "/img/alas.png",
      popular: true,
      created_at: new Date().toISOString()
    },
    {
      id: "menudencias",
      name: "Menudencias",
      description: "Hígado, patas, molleja y corazón frescos para platillos tradicionales.",
      price: "$45",
      unit: "por kg",
      image: "/img/menudencias.png",
      popular: false,
      created_at: new Date().toISOString()
    },
    {
      id: "pollo-pie",
      name: "Pollo en Pie",
      description: "Pollo vivo para quienes prefieren prepararlo a su manera. Peso promedio 2.9 kg.",
      price: "$70",
      unit: "por pieza",
      image: "/img/pollo_pie.png",
      popular: false,
      created_at: new Date().toISOString()
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching products:', error);
          // Fallback to static if error (e.g. table doesn't exist yet)
          setProducts(staticProducts);
        } else if (data && data.length > 0) {
          setProducts(data);
        } else {
          // Fallback if empty
          setProducts(staticProducts);
        }
      } catch (err) {
        console.error("Unexpected error fetching products", err);
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section id="productos" className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground animate-pulse">Cargando productos...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="productos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            Nuestros Productos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Pollo Fresco de
            <span className="text-primary"> Alta Calidad</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Ofrecemos una amplia variedad de productos avícolas, desde pollo entero hasta
            cortes especiales. Todos nuestros productos son frescos y de primera calidad.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 relative overflow-hidden"
            >
              {product.popular && (
                <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Popular
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden">
                  <img
                    src={product.image || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/img/pollo_entero.png'; // Fallback
                    }}
                  />
                </div>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-3xl font-bold text-primary">{product.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">{product.unit}</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-accent"
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        name: product.name,
                        description: product.description || "",
                        price: product.price || "$0",
                        unit: product.unit || "",
                        image: product.image || "",
                      });
                      toast({
                        title: "Producto agregado",
                        description: `${product.name} se agregó al carrito`,
                      });
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 space-x-4">
          <Button size="lg" variant="default" onClick={() => router.push("/checkout")}>
            Ir al carrito
          </Button>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Solicitar Cotización Especial
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;
