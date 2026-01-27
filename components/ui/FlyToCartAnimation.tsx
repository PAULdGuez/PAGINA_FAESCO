"use client";

import { useEffect, useState } from "react";

const FlyToCartAnimation = () => {
    const [flyingItems, setFlyingItems] = useState<{ id: number; src: string; startRect: DOMRect }[]>([]);

    useEffect(() => {
        const handleFly = (e: CustomEvent) => {
            const { src, rect } = e.detail;
            const id = Date.now();
            setFlyingItems(prev => [...prev, { id, src, startRect: rect }]);

            // Total duration: 0.5s (zoom) + 0.2s (pause) + 1.5s (fly) = ~2.2s
            setTimeout(() => {
                setFlyingItems(prev => prev.filter(item => item.id !== id));
            }, 2300);
        };

        window.addEventListener("fly-to-cart" as any, handleFly as any);
        return () => window.removeEventListener("fly-to-cart" as any, handleFly as any);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {flyingItems.map(item => (
                <FlyingItem key={item.id} src={item.src} startRect={item.startRect} />
            ))}
        </div>
    );
};

const FlyingItem = ({ src, startRect }: { src: string; startRect: DOMRect }) => {
    // Phases: 'spawn' -> 'zoom' -> 'fly'
    const [phase, setPhase] = useState<'spawn' | 'zoom' | 'fly'>('spawn');

    const [style, setStyle] = useState<React.CSSProperties>({
        position: 'absolute',
        left: startRect.left,
        top: startRect.top,
        width: startRect.width,
        height: startRect.height,
        objectFit: 'contain',
        transition: 'none',
        opacity: 1,
        zIndex: 9999,
        transform: 'scale(1)',
    });

    useEffect(() => {
        // Trigger Zoom Phase
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setPhase('zoom');
                setStyle(prev => ({
                    ...prev,
                    transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bouncy zoom
                    transform: 'scale(1.5)', // Make it visually pop
                    zIndex: 10000, // Ensure it's on top of everything
                }));
            });
        });

        // Trigger Fly Phase after zoom + small pause
        const flyTimer = setTimeout(() => {
            const targetX = window.innerWidth - 80;
            const targetY = window.innerHeight - 80;

            setPhase('fly');
            setStyle(prev => ({
                ...prev,
                // Slow fly: 1.5s
                transition: 'left 1.5s ease-in-out, top 1.5s ease-in-out, width 1.5s ease, height 1.5s ease, transform 1.5s ease, opacity 1.5s ease',
                left: targetX,
                top: targetY,
                width: 40,
                height: 40,
                transform: 'scale(1) rotate(360deg)', // Simple spin during flight
                opacity: 0.8,
            }));
        }, 700); // 0.5s zoom + 0.2s pause

        return () => clearTimeout(flyTimer);
    }, []);

    return <img src={src} style={style} alt="flying-product" className="rounded-full shadow-2xl border-4 border-primary bg-white" />;
};

export default FlyToCartAnimation;
