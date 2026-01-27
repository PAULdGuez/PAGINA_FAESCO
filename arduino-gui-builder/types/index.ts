export type WidgetType = 'button' | 'slider' | 'label' | 'led';

export interface Widget {
    id: string;
    type: WidgetType;
    position: { x: number; y: number };
    properties: {
        label: string;
        pin: string; // Keep as string to allow "A0", "D2", or simple numbers
        value?: string | number; // Initial or current value
        min?: number; // For slider
        max?: number; // For slider
        color?: string;
        sendStrategy?: 'onRelease' | 'onChange' | 'onPress';
    };
}

export interface Project {
    id: string;
    name: string;
    createdAt: number;
    lastModified: number;
    widgets: Widget[];
}
