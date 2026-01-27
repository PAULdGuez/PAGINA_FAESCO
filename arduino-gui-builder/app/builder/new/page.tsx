"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/store/useProjectStore";

export default function NewProjectPage() {
    const router = useRouter();
    const createProject = useProjectStore((state) => state.createProject);
    const currentProject = useProjectStore((state) => state.currentProject);

    useEffect(() => {
        // Create a new project with a default name
        const name = `Project ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
        createProject(name);
    }, []); // Run once on mount

    useEffect(() => {
        // Once created (synced to store), redirect
        if (currentProject) {
            router.replace(`/builder/${currentProject.id}`);
        }
    }, [currentProject, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
            <p>Creating project...</p>
        </div>
    );
}
