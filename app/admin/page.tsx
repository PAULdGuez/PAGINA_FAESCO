"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, LogOut, Loader2, ImageOff } from "lucide-react";
import { Database } from "@/lib/database.types";
import { ProductForm } from "@/components/admin/ProductForm";
import { useToast } from "@/hooks/use-toast";

type Product = Database['public']['Tables']['products']['Row'];

export default function AdminPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [sessionLoading, setSessionLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Check Session
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push("/login");
            } else {
                setSessionLoading(false);
                fetchProducts();
            }
        });
    }, [router]);

    const fetchProducts = async () => {
        setProductsLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setProducts(data);
        setProductsLoading(false);
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            toast({ title: "Error al eliminar", variant: "destructive" });
        } else {
            toast({ title: "Producto eliminado" });
            fetchProducts();
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (sessionLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="min-h-screen bg-muted/30 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
                        <p className="text-muted-foreground">Gestiona tu catálogo de productos y descuentos.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Producto
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Salir
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Productos ({products.length})</CardTitle>
                        <CardDescription>Lista completa de productos activos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {productsLoading ? (
                            <div className="py-8 text-center text-muted-foreground animate-pulse">Cargando catálogo...</div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">Img</TableHead>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Precio</TableHead>
                                            <TableHead>Descuento</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                                                        {product.image ? (
                                                            <img src={product.image} className="w-full h-full object-cover" />
                                                        ) : <ImageOff className="w-4 h-4 text-muted-foreground" />}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell>{product.price}</TableCell>
                                                <TableCell>
                                                    {product.discount_percentage ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {product.discount_percentage}%
                                                        </span>
                                                    ) : <span className="text-muted-foreground text-xs">-</span>}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                                            <Edit className="w-4 h-4 text-blue-500" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {products.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                    No hay productos registrados.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ProductForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                onSuccess={fetchProducts}
            />
        </div>
    );
}
