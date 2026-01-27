"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Correct import for App Router
import { useProjectStore } from "@/store/useProjectStore";
import { Canvas } from "@/components/builder/Canvas";
import { Toolbar } from "@/components/builder/Toolbar";
import { PropertiesPanel } from "@/components/builder/PropertiesPanel";
import { ArrowLeft, Play, Save } from "lucide-react";
import Link from "next/link";
import { WidgetType } from "@/types";

export default function BuilderPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { currentProject, loadProject, saveProject, addWidget } = useProjectStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        loadProject(id);
    }, [id]);

    if (!currentProject) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
                <p>Loading project or project not found...</p>
                <Link href="/" className="ml-4 text-blue-400 hover:underline">Go Home</Link>
            </div>
        );
    }

    const handleAddWidget = (type: WidgetType) => {
        const newWidget = {
            id: crypto.randomUUID(),
            type,
            position: { x: 100, y: 100 }, // Default position
            properties: {
                label: type,
                pin: "13", // Default pin
                value: 0
            }
        };
        addWidget(newWidget);
    };

    const selectedWidget = currentProject.widgets.find(w => w.id === selectedId) || null;

    return (
        <div className="flex flex-col h-screen bg-neutral-900 text-white overflow-hidden">
            {/* Header */}
            <header className="h-14 border-b border-neutral-700 flex items-center justify-between px-4 bg-neutral-800">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-neutral-700 rounded transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <h1 className="font-medium">{currentProject.name}</h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={saveProject}
                        className="flex items-center gap-2 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded text-sm transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save
                    </button>

                    <Link
                        href={`/runner/${id}`}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition-colors"
                    >
                        <Play className="w-4 h-4" />
                        Run
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                <Toolbar onAdd={handleAddWidget} />

                <Canvas
                    widgets={currentProject.widgets}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                />

                <PropertiesPanel widget={selectedWidget} />
            </div>
        </div>
    );
}
