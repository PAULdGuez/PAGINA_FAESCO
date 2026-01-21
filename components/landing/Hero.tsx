import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const benefits = [
    "Pollo fresco y de calidad",
    "Entregas a domicilio",
    "Precios competitivos",
  ];

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream to-background" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
              Calidad y Frescura Garantizada
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Pollo de
              <span className="text-primary"> Primera Calidad</span>
              <br />
              Para Tu Negocio y Hogar
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Somos especialistas en la venta de pollo destazado y en pie, además de ofrecer
              servicios de automatización para granjas de engorda. Calidad, frescura y
              tecnología al servicio de tu negocio.
            </p>

            {/* Benefits */}
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-accent text-primary-foreground"
              >
                Ver Productos
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Conocer Servicios
              </Button>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-[500px] bg-gradient-to-br from-primary/10 to-secondary/20 rounded-3xl flex items-center justify-center overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-secondary rounded-full opacity-60" />
              <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-primary/30 rounded-full" />
              
              {/* Central Icon */}
              <div className="relative z-10 text-center">
                <div className="w-40 h-40 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <span className="text-7xl">🐔</span>
                </div>
                <div className="bg-background/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <p className="text-lg font-semibold text-foreground">
                    +10 Años de Experiencia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
