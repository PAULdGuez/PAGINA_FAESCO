"use client"
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CheckCircle, CreditCard, Building2, Truck, Package, User, MapPin, Phone, Mail, Trash2, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"

const Checkout = () => {
  const { cartItems, clearCart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("delivery");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch or flash
  if (!mounted) return null;

  // If no cart items, redirect back logic (rendered)
  if (cartItems.length === 0 && !isConfirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
            <p className="text-muted-foreground mb-6">
              Selecciona productos de nuestro catálogo para continuar.
            </p>
            <Button onClick={() => router.push("/#productos")} className="bg-primary hover:bg-primary/90">
              Ver Productos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "El nombre es requerido";
    if (!formData.street.trim()) newErrors.street = "La calle es requerida";
    if (!formData.city.trim()) newErrors.city = "La ciudad es requerida";
    if (!formData.state.trim()) newErrors.state = "El estado es requerido";
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Ingresa un teléfono válido de 10 dígitos";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un correo válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Construct order summary string
    const orderSummary = cartItems.map(item => `${item.quantity}x ${item.name}`).join(", ");

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // GUARDADO DATOS EN SUPABASE _---------------
    const { error } = await supabase.from("pedidos").insert([
      {
        nombre_cliente: formData.fullName,
        telefono: formData.phone,
        correo_e: formData.email,
        metodo_pago: paymentMethod,
        cant_producto: orderSummary, // Storing strict summary here for now
        // TODO: In future, use a separate 'order_items' table
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      toast({
        title: "Error al guardar el pedido",
        description: "Intenta nuevamente.",
        variant: "destructive",
      });
      return;
    }
    // -----------------------------------------------

    setIsConfirmed(true);
    clearCart();

    toast({
      title: "¡Pedido confirmado!",
      description: "Recibirás un correo con los detalles de tu orden.",
    });
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">¡Pedido Confirmado!</h2>
            <p className="text-muted-foreground mb-6">
              Gracias por tu compra. Hemos enviado los detalles de tu pedido al correo <strong className="text-foreground">{formData.email}</strong>.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/")}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Volver al Inicio
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/#productos")}
                className="w-full"
              >
                Seguir Comprando
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.push("/#productos")}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Finalizar Compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    Datos Personales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Nombre completo *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Juan Pérez García"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        Teléfono *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="5512345678"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email" className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        Correo electrónico *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    Dirección de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="street">Calle y número *</Label>
                    <Input
                      id="street"
                      name="street"
                      placeholder="Av. Principal #123, Col. Centro"
                      value={formData.street}
                      onChange={handleInputChange}
                      className={errors.street ? "border-destructive" : ""}
                    />
                    {errors.street && <p className="text-sm text-destructive mt-1">{errors.street}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad *</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="Ciudad de México"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state">Estado *</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="CDMX"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={errors.state ? "border-destructive" : ""}
                      />
                      {errors.state && <p className="text-sm text-destructive mt-1">{errors.state}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <CreditCard className="w-5 h-5 mr-2 text-primary" />
                    Método de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${paymentMethod === 'delivery' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex items-center cursor-pointer flex-1">
                        <Truck className="w-5 h-5 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">Pago contra entrega</p>
                          <p className="text-sm text-muted-foreground">Paga en efectivo cuando recibas tu pedido</p>
                        </div>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${paymentMethod === 'transfer' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Label htmlFor="transfer" className="flex items-center cursor-pointer flex-1">
                        <Building2 className="w-5 h-5 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">Transferencia bancaria</p>
                          <p className="text-sm text-muted-foreground">Recibirás los datos bancarios por correo</p>
                        </div>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer flex-1">
                        <CreditCard className="w-5 h-5 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">Tarjeta de crédito/débito</p>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'card' && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground text-center">
                        💳 La pasarela de pago estará disponible próximamente
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="bg-primary/5 rounded-t-lg">
                  <CardTitle className="flex items-center text-lg">
                    <Package className="w-5 h-5 mr-2 text-primary" />
                    Resumen del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Cart Items List */}
                  <div className="max-h-96 overflow-y-auto space-y-4 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.name} className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">{item.price} {item.unit}</p>

                          <div className="flex items-center mt-2 space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.name, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.name, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive ml-auto"
                              onClick={() => removeFromCart(item.name)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío:</span>
                      <span className="text-primary font-medium">Gratis</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-6 bg-primary hover:bg-primary/90"
                    disabled={isSubmitting || cartItems.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Confirmar Pedido
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Al confirmar, aceptas nuestros términos y condiciones
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
