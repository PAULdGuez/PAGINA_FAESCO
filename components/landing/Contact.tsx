"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensaje Enviado",
      description: "Nos pondremos en contacto contigo pronto.",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Ubicación",
<<<<<<< HEAD
      details: ["Av. Principal #123", "Col. Centro, CP 12345"],
=======
      details: ["Av. Vía Lago #120 San Felipe", "Texcoco, Edo. de México, CP 56256"],
>>>>>>> feature/rediseño
    },
    {
      icon: Phone,
      title: "Teléfono",
<<<<<<< HEAD
      details: ["+52 (123) 456-7890", "+52 (123) 456-7891"],
=======
      details: ["+52 (56) 3536-3697", "+52 (56) 2832-5110"],
>>>>>>> feature/rediseño
    },
    {
      icon: Mail,
      title: "Correo",
<<<<<<< HEAD
      details: ["ventas@avicolapro.com", "info@avicolapro.com"],
=======
      details: ["al19106129@chapingo.mx", "alfredo@itgreen.com", "paul@itgreen.com"],
>>>>>>> feature/rediseño
    },
    {
      icon: Clock,
      title: "Horario",
      details: ["Lun - Vie: 7:00 AM - 6:00 PM", "Sáb: 8:00 AM - 2:00 PM"],
    },
  ];

  return (
    <section id="contacto" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            Contacto
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            ¿Tienes Preguntas?
            <span className="text-primary"> Contáctanos</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Estamos aquí para ayudarte. Envíanos un mensaje o visítanos en nuestra ubicación.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-background p-8 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-semibold text-foreground mb-6">
              Envíanos un Mensaje
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nombre Completo
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Teléfono
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Correo Electrónico
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mensaje
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="¿En qué podemos ayudarte?"
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-accent">
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-background p-6 rounded-xl shadow-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <info.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{info.title}</h4>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* Map Placeholder */}
            <div className="bg-background p-4 rounded-xl shadow-sm">
              <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground">Mapa de ubicación</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
