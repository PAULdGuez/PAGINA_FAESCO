import { Widget } from "@/types";
import { cn } from "@/lib/utils";

interface WidgetRendererProps {
    widget: Widget;
    isBuilder?: boolean; // If true, disable interactions that conflict with drag
    onInteract?: (value: any) => void;
}

export function WidgetRenderer({ widget, isBuilder = false, onInteract }: WidgetRendererProps) {
    const { type, properties } = widget;

    switch (type) {
        case 'button':
            return (
                <button
                    className={cn(
                        "px-4 py-2 rounded shadow-sm font-medium transition-colors",
                        properties.color ? `bg-[${properties.color}]` : "bg-blue-500 text-white",
                        "active:scale-95"
                    )}
                    onClick={() => !isBuilder && onInteract?.('PRESSED')}
                >
                    {properties.label || "Button"}
                </button>
            );

        case 'slider':
            return (
                <div className="flex flex-col gap-1 w-48 p-2 bg-neutral-800 rounded border border-neutral-700">
                    <label className="text-xs text-neutral-400">{properties.label || "Slider"}</label>
                    <input
                        type="range"
                        min={properties.min || 0}
                        max={properties.max || 255}
                        defaultValue={properties.value || 0}
                        className="w-full accent-blue-500"
                        disabled={isBuilder}
                        onChange={(e) => onInteract?.(e.target.value)}
                    />
                </div>
            );

        case 'label':
            return (
                <div className={cn("text-lg font-medium", properties.color ? `text-[${properties.color}]` : "text-white")}>
                    {properties.label || "Label Text"}
                </div>
            );

        case 'led':
            return (
                <div className="flex flex-col items-center gap-1">
                    <div
                        className={cn(
                            "w-8 h-8 rounded-full border-2 border-neutral-600 transition-colors",
                            properties.value === '1' || properties.value === 1 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]" : "bg-neutral-900"
                        )}
                    />
                    <span className="text-xs text-neutral-400">{properties.label}</span>
                </div>
            );

        default:
            return <div className="p-2 border border-red-500 text-red-500">Unknown Widget</div>;
    }
}
