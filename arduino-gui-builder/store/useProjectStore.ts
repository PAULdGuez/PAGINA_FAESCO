import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Project, Widget } from '@/types';

interface ProjectState {
    currentProject: Project | null;
    savedProjects: Project[];

    // Actions
    createProject: (name: string) => void;
    loadProject: (id: string) => void;
    saveProject: () => void; // Updates lastModified and persists to savedProjects
    deleteProject: (id: string) => void;

    // Widget manipulation (active project)
    addWidget: (widget: Widget) => void;
    updateWidget: (id: string, updates: Partial<Widget>) => void;
    removeWidget: (id: string) => void;
    updateWidgetPosition: (id: string, position: { x: number; y: number }) => void;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            currentProject: null,
            savedProjects: [],

            createProject: (name) => {
                const newProject: Project = {
                    id: crypto.randomUUID(),
                    name,
                    createdAt: Date.now(),
                    lastModified: Date.now(),
                    widgets: []
                };
                set((state) => ({
                    savedProjects: [...state.savedProjects, newProject],
                    currentProject: newProject
                }));
            },

            loadProject: (id) => {
                const project = get().savedProjects.find((p) => p.id === id);
                if (project) {
                    set({ currentProject: JSON.parse(JSON.stringify(project)) }); // Deep copy to avoid mutating saved state directly until save
                }
            },

            saveProject: () => {
                const current = get().currentProject;
                if (!current) return;

                const updated = { ...current, lastModified: Date.now() };
                set((state) => ({
                    currentProject: updated,
                    savedProjects: state.savedProjects.map((p) =>
                        p.id === updated.id ? updated : p
                    )
                }));
            },

            deleteProject: (id) => {
                set((state) => ({
                    savedProjects: state.savedProjects.filter((p) => p.id !== id),
                    currentProject: state.currentProject?.id === id ? null : state.currentProject
                }));
            },

            addWidget: (widget) => {
                set((state) => {
                    if (!state.currentProject) return state;
                    return {
                        currentProject: {
                            ...state.currentProject,
                            widgets: [...state.currentProject.widgets, widget]
                        }
                    };
                });
            },

            updateWidget: (id, updates) => {
                set((state) => {
                    if (!state.currentProject) return state;
                    return {
                        currentProject: {
                            ...state.currentProject,
                            widgets: state.currentProject.widgets.map((w) =>
                                w.id === id ? { ...w, ...updates } : w
                            )
                        }
                    };
                });
            },

            removeWidget: (id) => {
                set((state) => {
                    if (!state.currentProject) return state;
                    return {
                        currentProject: {
                            ...state.currentProject,
                            widgets: state.currentProject.widgets.filter((w) => w.id !== id)
                        }
                    };
                });
            },

            updateWidgetPosition: (id, position) => {
                set((state) => {
                    if (!state.currentProject) return state;
                    return {
                        currentProject: {
                            ...state.currentProject,
                            widgets: state.currentProject.widgets.map((w) =>
                                w.id === id ? { ...w, position } : w
                            )
                        }
                    };
                });
            }
        }),
        {
            name: 'arduino-gui-projects',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
