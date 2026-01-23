"use client"

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const FloatingCart = () => {
    const { cartCount } = useCart();
    const router = useRouter();
    const [isBouncing, setIsBouncing] = useState(false);

    // Trigger bounce animation when cart count changes
    useEffect(() => {
        if (cartCount > 0) {
            setIsBouncing(true);
            const timer = setTimeout(() => setIsBouncing(false), 300);
            return () => clearTimeout(timer);
        }
    }, [cartCount]);

    // Only show if there are items
    if (cartCount === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Button
                size="icon"
                className={cn(
                    "w-16 h-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 transition-transform duration-300 relative",
                    isBouncing && "scale-110",
                    // "animate-bounce" is a bit too much for continuous bouncing, just scale on update is better
                )}
                onClick={() => router.push("/checkout")}
            >
                <ShoppingCart className="w-8 h-8 text-white" />

                {/* Badge */}
                <div className="absolute -top-2 -right-2 bg-destructive text-white text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full border-2 border-background animate-in fade-in zoom-in duration-300">
                    {cartCount}
                </div>
            </Button>
        </div>
    );
};

export default FloatingCart;
