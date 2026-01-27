import { useDraggable } from "@dnd-kit/core";
import { Widget } from "@/types";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { cn } from "@/lib/utils";

interface DraggableWidgetProps {
    widget: Widget;
    isSelected?: boolean;
    onSelect?: () => void;
}

export function DraggableWidget({ widget, isSelected, onSelect }: DraggableWidgetProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: widget.id,
        data: widget
    });

    // Apply transform if dragging, otherwise use widget position
    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            position: 'absolute' as 'absolute', // Typescript weirdness workaround
            left: widget.position.x,
            top: widget.position.y,
            zIndex: 1000,
        }
        : {
            position: 'absolute' as 'absolute',
            left: widget.position.x,
            top: widget.position.y,
        };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={(e) => {
                e.stopPropagation(); // Prevent canvas click
                onSelect?.();
            }}
            className={cn(
                "cursor-move select-none",
                isSelected && "ring-2 ring-blue-500 ring-offset-2 ring-offset-neutral-900 rounded"
            )}
        >
            <WidgetRenderer widget={widget} isBuilder={true} />
        </div>
    );
}
