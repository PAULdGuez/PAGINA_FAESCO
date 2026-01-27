"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useProjectStore } from "@/store/useProjectStore";
import { useSerialPort } from "@/hooks/useSerialPort";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { ArrowLeft, Monitor, WifiOff } from "lucide-react";

export default function RunnerPage() {
    const params = useParams();
    const id = params.id as string;
    const { loadProject, currentProject } = useProjectStore();
    const { connect, disconnect, isConnected, sendData, lastData } = useSerialPort();
    const [logs, setLogs] = useState<string[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadProject(id);
    }, [id]);

    useEffect(() => {
        if (lastData) {
            setLogs(prev => [...prev.slice(-19), lastData]); // Keep last 20 lines
        }
    }, [lastData]);

    // Scroll logs to bottom
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    if (!currentProject) {
        return <div className="p-8 text-white">Project not found</div>;
    }

    const handleInteract = (widgetId: string, value: any) => {
        const widget = currentProject.widgets.find(w => w.id === widgetId);
        if (!widget || !isConnected) return;

        // Protocol: PIN:VALUE
        // Example: 13:1 (for button press) or 6:128 (for slider PWM)
        const pin = widget.properties.pin;
        if (!pin) return;

        let payload = "";

        if (widget.type === 'button') {
            // Button: momentary logic could be complex, for now send 1 on press
            // If we supported "onRelease", we'd send 0.
            // Assuming toggle or one-shot for now.
            // Let's assume standard interaction sends '1'.
            // Wait, 'WidgetRenderer' sends 'PRESSED' string for button.
            payload = `${pin}:1\n`;
        } else if (widget.type === 'slider') {
            payload = `${pin}:${value}\n`;
        }

        if (payload) {
            sendData(payload);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-neutral-900 text-white">
            {/* Header */}
            <header className="h-14 border-b border-neutral-700 flex items-center justify-between px-4 bg-neutral-800">
                <div className="flex items-center gap-4">
                    <Link href={`/builder/${id}`} className="p-2 hover:bg-neutral-700 rounded transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <h1 className="font-medium">{currentProject.name} <span className="text-gray-500 text-sm">(Running)</span></h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-sm text-gray-300">{isConnected ? 'Connected' : 'Disconnected'}</span>
                    </div>

                    {!isConnected ? (
                        <button
                            onClick={() => connect()}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
                        >
                            <Monitor className="w-4 h-4" />
                            Connect Device
                        </button>
                    ) : (
                        <button
                            onClick={() => disconnect()}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
                        >
                            <WifiOff className="w-4 h-4" />
                            Disconnect
                        </button>
                    )}
                </div>
            </header>

            {/* Main Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Runner Canvas (Centered, relative) */}
                <div className="flex-1 bg-neutral-900 overflow-auto relative flex items-center justify-center">
                    {/* 
              We need a container that matches the "Builder" coordinate space.
              For simplicity, we'll try to center the widgets relative to the viewport or just use absolute 
              positioning relative to a fixed container.
              Ideally, the store would save canvas dimensions.
              For now, we just abuse absolute positioning on the full screen.
             */}
                    <div className="relative w-full h-full">
                        {currentProject.widgets.map((widget) => (
                            <div
                                key={widget.id}
                                style={{
                                    position: 'absolute',
                                    left: widget.position.x,
                                    top: widget.position.y,
                                }}
                            >
                                <WidgetRenderer
                                    widget={widget}
                                    onInteract={(val) => handleInteract(widget.id, val)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Serial Monitor Sidebar */}
                <div className="w-80 bg-black border-l border-neutral-700 p-4 font-mono text-xs text-green-400 flex flex-col">
                    <div className="border-b border-neutral-800 pb-2 mb-2 font-bold text-gray-400 uppercase">
                        Serial Monitor
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1">
                        {logs.length === 0 && <span className="text-gray-600 italic">Waiting for data...</span>}
                        {logs.map((log, i) => (
                            <div key={i} className="break-all">{log}</div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}
