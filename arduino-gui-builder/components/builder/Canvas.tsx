import { DndContext, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { Widget } from '@/types';
import { DraggableWidget } from './DraggableWidget';
import { useProjectStore } from '@/store/useProjectStore';

interface CanvasProps {
    widgets: Widget[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
}

export function Canvas({ widgets, selectedId, onSelect }: CanvasProps) {
    const updateWidgetPosition = useProjectStore((state) => state.updateWidgetPosition);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        const widget = active.data.current as Widget;

        if (widget) {
            updateWidgetPosition(widget.id, {
                x: widget.position.x + delta.x,
                y: widget.position.y + delta.y
            });
        }
    };

    return (
        <div
            className="flex-1 bg-neutral-900 overflow-hidden relative"
            onClick={() => onSelect(null)} // Deselect on background click
        >
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                {widgets.map((widget) => (
                    <DraggableWidget
                        key={widget.id}
                        widget={widget}
                        isSelected={widget.id === selectedId}
                        onSelect={() => onSelect(widget.id)}
                    />
                ))}
            </DndContext>
        </div>
    );
}
