import { Award, Users, Truck, Shield } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Award,
      title: "Calidad Premium",
      description: "Pollo criado con los más altos estándares de calidad y respetando las normas de bienestar animal.",
    },
    {
      icon: Users,
      title: "Equipo Experto",
      description: "Personal capacitado con especialización en la industria avícola y soluciones de automatización.",
    },
    {
      icon: Truck,
      title: "Entregas Puntuales",
      description: "Sistema de distribución eficiente que garantiza frescura en cada entrega.",
    },
    {
      icon: Shield,
      title: "Garantía Total",
      description: "Respaldamos nuestros productos con garantía de satisfacción completa.",
    },
  ];

  return (
    <section id="nosotros" className="py-20 bg-muted overflow-hidden">
      <div className="container mx-auto px-4 animate-in fade-in zoom-in duration-700">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            Sobre Nosotros
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Productos de calidad
            <span className="text-primary"> en tu mesa</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Somos una empresa comprometida con ofrecer productos avícolas de la más alta calidad, un atributo muy valorado por el mercado.
            Nuestra pasión por la excelencia nos ha convertido en líderes del mercado, garantiza un producto fresco
            a nuestros clientes y servicios de automatización de vanguardia.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow group"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10+", label: "Años de Experiencia" },
            { value: "500+", label: "Clientes Satisfechos" },
            { value: "50K+", label: "Pollos Vendidos" },
            { value: "100%", label: "Satisfacción" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
