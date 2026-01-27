import { WidgetType } from "@/types";
import { Plus, Sliders, Type, Square, MonitorPlay } from "lucide-react";

interface ToolbarProps {
    onAdd: (type: WidgetType) => void;
}

export function Toolbar({ onAdd }: ToolbarProps) {
    const tools: { type: WidgetType; label: string; icon: any }[] = [
        { type: 'button', label: 'Button', icon: Square },
        { type: 'slider', label: 'Slider', icon: Sliders },
        { type: 'label', label: 'Label', icon: Type },
        { type: 'led', label: 'LED', icon: MonitorPlay },
    ];

    return (
        <div className="w-64 bg-neutral-800 border-r border-neutral-700 p-4 flex flex-col gap-4">
            <div className="pb-4 border-b border-neutral-700">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    Arduino GUI
                </h1>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Components</p>

                <div className="grid grid-cols-2 gap-2">
                    {tools.map((tool) => (
                        <button
                            key={tool.type}
                            onClick={() => onAdd(tool.type)}
                            className="flex flex-col items-center justify-center gap-2 p-3 bg-neutral-700/50 hover:bg-neutral-700 border border-neutral-600 rounded cursor-pointer transition-colors"
                        >
                            <tool.icon className="w-6 h-6 text-blue-400" />
                            <span className="text-xs text-neutral-300">{tool.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-auto">
                {/* Settings or other links could go here */}
            </div>
        </div>
    );
}
