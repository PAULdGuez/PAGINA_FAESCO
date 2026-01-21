import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";

const Products = () => {
  const products = [
    {
      name: "Pollo Entero",
      description: "Pollo fresco entero, ideal para rostizar o preparar al horno. Peso promedio 2.5kg.",
      price: "$85",
      unit: "por pieza",
      image: "🍗",
      popular: true,
    },
    {
      name: "Pechuga de Pollo",
      description: "Pechuga sin hueso, perfecta para filetes y comidas saludables.",
      price: "$120",
      unit: "por kg",
      image: "🥩",
      popular: false,
    },
    {
      name: "Pierna y Muslo",
      description: "Pieza con hueso, ideal para guisos, caldos y platillos tradicionales.",
      price: "$75",
      unit: "por kg",
      image: "🍖",
      popular: false,
    },
    {
      name: "Alas de Pollo",
      description: "Perfectas para botanear, preparar al carbón o en salsa BBQ.",
      price: "$65",
      unit: "por kg",
      image: "🍗",
      popular: true,
    },
    {
      name: "Menudencias",
      description: "Hígado, molleja y corazón frescos para platillos tradicionales.",
      price: "$45",
      unit: "por kg",
      image: "🥘",
      popular: false,
    },
    {
      name: "Pollo en Pie",
      description: "Pollo vivo para quienes prefieren prepararlo a su manera. Peso promedio 2.8kg.",
      price: "$70",
      unit: "por pieza",
      image: "🐔",
      popular: false,
    },
  ];

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
          {products.map((product, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 relative overflow-hidden"
            >
              {product.popular && (
                <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Popular
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">{product.image}</span>
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
                  <Button size="sm" className="bg-primary hover:bg-accent">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Ordenar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            ¿Necesitas un pedido mayorista o personalizado?
          </p>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Solicitar Cotización Especial
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;
