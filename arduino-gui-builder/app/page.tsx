"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { Plus, Trash2, Edit } from "lucide-react";

export default function Home() {
  const { savedProjects, deleteProject } = useProjectStore();

  // Hydration fix: ensure stored projects are loaded on client
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Arduino GUI Builder</h1>
            <p className="text-gray-400">Build web interfaces for your ESP32/Arduino projects visually.</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/docs"
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-medium transition-colors border border-neutral-700"
            >
              Docs
            </Link>
            <Link
              href="/builder/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProjects.length === 0 ? (
            <div className="col-span-full border border-dashed border-neutral-700 rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <p className="text-gray-500 mb-4">No projects yet. Create one to get started!</p>
              <Link
                href="/builder/new"
                className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors"
              >
                Create Project
              </Link>
            </div>
          ) : (
            savedProjects.map((project) => (
              <div key={project.id} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-neutral-500 transition-colors group">
                <h3 className="text-xl font-bold mb-2 truncate">{project.name}</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Last modified: {new Date(project.lastModified).toLocaleDateString()}
                </p>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/builder/${project.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Link>
                  <Link
                    href={`/runner/${project.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-900/30 text-green-400 hover:bg-green-900/50 border border-green-900 rounded text-sm transition-colors"
                  >
                    Run
                  </Link>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-2 bg-red-900/20 text-red-500 hover:bg-red-900/40 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
