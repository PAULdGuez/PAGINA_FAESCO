import { Settings, Thermometer, LineChart, Cpu, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      icon: Thermometer,
      title: "Control de Temperatura",
      description: "Sistemas automatizados de climatización que mantienen condiciones óptimas para el desarrollo del pollo.",
    },
    {
      icon: Settings,
      title: "Alimentación Automática",
      description: "Comederos y bebederos automatizados que aseguran nutrición constante y reducen el desperdicio.",
    },
    {
      icon: LineChart,
      title: "Monitoreo en Tiempo Real",
      description: "Sensores y dashboards que permiten supervisar tu granja desde cualquier lugar.",
    },
    {
      icon: Cpu,
      title: "Control Inteligente",
      description: "Software de gestión integral que optimiza cada aspecto de la producción avícola.",
    },
    {
      icon: Zap,
      title: "Eficiencia Energética",
      description: "Soluciones que reducen el consumo de energía manteniendo la productividad.",
    },
    {
      icon: Clock,
      title: "Mantenimiento 24/7",
      description: "Soporte técnico continuo para garantizar que tu operación nunca se detenga.",
    },
  ];

  return (
    <section id="servicios" className="py-20 bg-gradient-to-br from-primary to-accent text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4 animate-in slide-in-from-right-8 fade-in duration-700">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-primary-foreground/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            Servicios de Automatización
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Tecnología para
            <span className="text-secondary"> Granjas Modernas</span>
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Ofrecemos soluciones completas de automatización para granjas de pollo de engorda.
            Aumenta tu productividad, reduce costos y mejora el bienestar de tus aves.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-primary-foreground/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-primary-foreground/20 transition-colors group"
            >
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-4">
                <service.icon className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-primary-foreground/70">{service.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Listo para Modernizar tu Granja?
            </h3>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Nuestro equipo de expertos te ayudará a diseñar la solución perfecta
              para las necesidades específicas de tu operación avícola.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Agendar Consulta Gratis
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Ver Casos de Éxito
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
