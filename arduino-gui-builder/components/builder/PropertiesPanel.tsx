import { Widget } from "@/types";
import { useProjectStore } from "@/store/useProjectStore";

interface PropertiesPanelProps {
    widget: Widget | null;
}

export function PropertiesPanel({ widget }: PropertiesPanelProps) {
    const updateWidget = useProjectStore((state) => state.updateWidget);
    const removeWidget = useProjectStore((state) => state.removeWidget);

    if (!widget) {
        return (
            <div className="w-80 bg-neutral-800 border-l border-neutral-700 p-4 text-neutral-400">
                Select a component to edit properties.
            </div>
        );
    }

    const handleChange = (key: string, value: any) => {
        updateWidget(widget.id, {
            properties: {
                ...widget.properties,
                [key]: value
            }
        });
    };

    return (
        <div className="w-80 bg-neutral-800 border-l border-neutral-700 p-4 flex flex-col gap-6 overflow-y-auto">
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Properties</h2>
                <p className="text-sm text-neutral-400 capitalize">{widget.type}</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase">Label</label>
                    <input
                        type="text"
                        value={widget.properties.label}
                        onChange={(e) => handleChange('label', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase">Pin (Arduino/ESP32)</label>
                    <input
                        type="text"
                        value={widget.properties.pin || ''}
                        onChange={(e) => handleChange('pin', e.target.value)}
                        placeholder="e.g. 13, A0, D2"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                {widget.type === 'slider' && (
                    <>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase">Min</label>
                                <input
                                    type="number"
                                    value={widget.properties.min ?? 0}
                                    onChange={(e) => handleChange('min', Number(e.target.value))}
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase">Max</label>
                                <input
                                    type="number"
                                    value={widget.properties.max ?? 255}
                                    onChange={(e) => handleChange('max', Number(e.target.value))}
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Color picker (basic hex input for now) */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase">Color (Hex/Tailwind class)</label>
                    <input
                        type="text"
                        value={widget.properties.color || ''}
                        onChange={(e) => handleChange('color', e.target.value)}
                        placeholder="e.g. #ff0000"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

            </div>

            <div className="mt-auto pt-6">
                <button
                    onClick={() => removeWidget(widget.id)}
                    className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded transition-colors"
                >
                    Delete Component
                </button>
            </div>
        </div>
    );
}
