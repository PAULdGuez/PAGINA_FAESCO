"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product | null; // If null, it's create mode
    onSuccess: () => void;
}

export function ProductForm({ isOpen, onClose, product, onSuccess }: ProductFormProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState(product?.name || "");
    const [description, setDescription] = useState(product?.description || "");
    const [price, setPrice] = useState(product?.price || "");
    const [unit, setUnit] = useState(product?.unit || "por pieza");
    const [imageUrl, setImageUrl] = useState(product?.image || "");
    const [popular, setPopular] = useState(product?.popular || false);

    // Discount State
    const [discountPercent, setDiscountPercent] = useState(product?.discount_percentage || 0);
    const [discountDuration, setDiscountDuration] = useState("0"); // Hours

    // Image Upload State
    const [uploading, setUploading] = useState(false);

    // Sync state with prop
    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description || "");
            setPrice(product.price || "");
            setUnit(product.unit || "por pieza");
            setImageUrl(product.image || "");
            setPopular(product.popular || false);
            setDiscountPercent(product.discount_percentage || 0);
            // Calculate remaining hours if expires_at is present
            if (product.discount_expires_at) {
                const now = new Date();
                const expires = new Date(product.discount_expires_at);
                const diffMs = expires.getTime() - now.getTime();
                const diffHrs = Math.ceil(diffMs / (1000 * 60 * 60));
                setDiscountDuration(diffHrs > 0 ? diffHrs.toString() : "0");
            } else {
                setDiscountDuration("0");
            }
        } else {
            // Reset
            setName("");
            setDescription("");
            setPrice("");
            setUnit("por pieza");
            setImageUrl("");
            setPopular(false);
            setDiscountPercent(0);
            setDiscountDuration("0");
        }
    }, [product, isOpen]); // Sync when product changes or modal opens

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);

            const file = e.target.files?.[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data, error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setImageUrl(publicUrl);
        } catch (error: any) {
            console.error('Error uploading image:', error);
            setError('Error al subir imagen. Asegúrate que el bucket "products" exista y sea público.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Calculate expires_at if duration is set
            let expiresAt = null;
            if (discountPercent > 0 && parseInt(discountDuration) > 0) {
                const date = new Date();
                date.setHours(date.getHours() + parseInt(discountDuration));
                expiresAt = date.toISOString();
            } else if (product?.discount_expires_at && discountPercent > 0) {
                // Keep existing if editing and duration didn't change (simplified logic)
                expiresAt = product.discount_expires_at;
            }

            // Generate a simplified ID/Slug if new
            let id = product?.id;
            if (!id) {
                id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }

            const productData: any = {
                id,
                name,
                description,
                price,
                unit,
                image: imageUrl,
                popular,
                discount_percentage: discountPercent,
                discount_expires_at: expiresAt
            };

            if (product) {
                // Update
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', product.id);
                if (error) throw error;
                toast({ title: "Producto actualizado correctamente" });
            } else {
                // Create
                const { error } = await supabase.from('products').insert([productData]);
                if (error) throw error;
                toast({ title: "Producto creado correctamente" });
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error al guardar producto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
                    <DialogDescription>
                        {product ? `Editando: ${product.name}` : "Ingresa los detalles del nuevo producto."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="name">Nombre del Producto</Label>
                            <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Precio (Texto)</Label>
                            <Input id="price" value={price} onChange={e => setPrice(e.target.value)} placeholder="$00" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unit">Unidad</Label>
                            <Select value={unit} onValueChange={setUnit}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="por pieza">Por Pieza</SelectItem>
                                    <SelectItem value="por kg">Por Kg</SelectItem>
                                    <SelectItem value="paquete">Paquete</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Imagen del Producto</Label>
                        <div className="flex items-center gap-4">
                            {imageUrl && <img src={imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-md border" />}
                            <div className="flex-1">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                                {uploading && <p className="text-xs text-muted-foreground mt-1">Subiendo...</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <Checkbox id="popular" checked={popular || false} onCheckedChange={(checked) => setPopular(checked === true)} />
                        <Label htmlFor="popular" className="cursor-pointer">¿Es un producto popular? (Aparecerá destacado)</Label>
                    </div>

                    <div className="border p-4 rounded-md space-y-4 bg-muted/20">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                            🏷️ Configuración de Descuentos
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="discount">Porcentaje (%)</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={discountPercent || 0}
                                    onChange={e => setDiscountPercent(parseInt(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duración (Horas a partir de hoy)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    min="0"
                                    placeholder="Ej. 24"
                                    value={discountDuration}
                                    onChange={e => setDiscountDuration(e.target.value)}
                                />
                                <p className="text-[10px] text-muted-foreground">Si es 0, no se actualiza la fecha.</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" disabled={loading || uploading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
