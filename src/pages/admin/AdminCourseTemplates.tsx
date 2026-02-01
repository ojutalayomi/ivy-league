import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Folder, FolderPlus, Pencil, Save, Trash2 } from "lucide-react";
import type { AdminTemplateNode } from "@/lib/types";
import { CourseTemplatePayload, fetchCourseTemplates, saveCourseTemplates } from "@/lib/admin-api";


const templateObjectToNodes = (
    template: Record<string, unknown>,
    templateTitle?: string
): AdminTemplateNode[] => {
    const entries = Object.entries(template);
    if (entries.length === 1 && entries[0][0].startsWith("/")) {
        const [, value] = entries[0];
        const childrenObject = value && typeof value === "object" && !Array.isArray(value) ? value : {};
        const children = templateObjectToNodes(childrenObject as Record<string, unknown>);
        return [
            {
                id: crypto.randomUUID(),
                name: "/",
                type: "folder",
                children
            }
        ];
    }

    return entries.map(([key, value]) => {
        const childrenObject = value && typeof value === "object" && !Array.isArray(value) ? value : {};
        const children = templateObjectToNodes(childrenObject as Record<string, unknown>);
        return {
            id: crypto.randomUUID(),
            name: key === `/$${templateTitle}$` ? "/" : key,
            type: "folder",
            children
        };
    });
};

const createNode = (name: string): AdminTemplateNode => ({
    id: crypto.randomUUID(),
    name,
    type: "folder",
    children: []
});

const updateNode = (
    nodes: AdminTemplateNode[],
    id: string,
    updater: (node: AdminTemplateNode) => AdminTemplateNode
): AdminTemplateNode[] => {
    return nodes.map((node) => {
        if (node.id === id) return updater(node);
        if (node.children) {
            return { ...node, children: updateNode(node.children, id, updater) };
        }
        return node;
    });
};

const removeNode = (nodes: AdminTemplateNode[], id: string): AdminTemplateNode[] => {
    return nodes
        .filter((node) => node.id !== id)
        .map((node) =>
            node.children ? { ...node, children: removeNode(node.children, id) } : node
        );
};

const moveNode = (nodes: AdminTemplateNode[], id: string, direction: "up" | "down") => {
    const moveInList = (list: AdminTemplateNode[]): AdminTemplateNode[] => {
        const index = list.findIndex((node) => node.id === id);
        if (index === -1) {
            return list.map((node) =>
                node.children ? { ...node, children: moveInList(node.children) } : node
            );
        }
        const nextIndex = direction === "up" ? index - 1 : index + 1;
        if (nextIndex < 0 || nextIndex >= list.length) return list;
        const nextList = [...list];
        const [item] = nextList.splice(index, 1);
        nextList.splice(nextIndex, 0, item);
        return nextList;
    };
    return moveInList(nodes);
};

const nodesToTemplateObject = (
    nodes: AdminTemplateNode[],
    templateTitle: string
): Record<string, unknown> => {
    return nodes.reduce<Record<string, unknown>>((acc, node) => {
        const children = node.children ? nodesToTemplateObject(node.children, templateTitle) : {};
        const key = node.name === "/" ? `/$${templateTitle}$` : node.name;
        acc[key] = children;
        return acc;
    }, {});
};

const countTemplateFolders = (template: Record<string, unknown>): number => {
    const entries = Object.entries(template);
    if (!entries.length) return 0;
    return entries.reduce((total, [, value]) => {
        const childrenObject = value && typeof value === "object" && !Array.isArray(value) ? value : {};
        return total + 1 + countTemplateFolders(childrenObject as Record<string, unknown>);
    }, 0);
};


export default function AdminCourseTemplates() {
    const [nodes, setNodes] = useState<AdminTemplateNode[]>([]);
    const [templates, setTemplates] = useState<CourseTemplatePayload[]>([]);
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [filter, setFilter] = useState("");
    const [isDirty, setIsDirty] = useState(false);
    const [isEditingNewTemplate, setIsEditingNewTemplate] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogName, setDialogName] = useState("");
    const [dialogMode, setDialogMode] = useState<"add-child" | "rename">("add-child");
    const [dialogTargetId, setDialogTargetId] = useState<string | null>(null);
    const hasRoot = nodes.length > 0;

    useEffect(() => {
        document.title = "Course Templates - Ivy League Associates";
    }, []);

    useEffect(() => {
        const loadTemplates = async () => {
            try {
                setLoading(true);
                const data = await fetchCourseTemplates();
                if (Array.isArray(data) && data.length) {
                    setTemplates(data);
                    setSelectedTemplateIndex(0);
                    const initial = data[0];
                    setTitle(initial.title ?? "");
                    const template = initial.template && typeof initial.template === "object" ? initial.template : {};
                    const mapped = templateObjectToNodes(template as Record<string, unknown>, initial.title ?? "");
                    setNodes(mapped);
                    setIsEditingNewTemplate(false);
                    setIsDirty(false);
                } else {
                    setTemplates([]);
                    setSelectedTemplateIndex(null);
                    setTitle("");
                    setNodes([]);
                    setIsEditingNewTemplate(false);
                    setIsDirty(false);
                }
            } catch (error) {
                console.error("Failed to fetch templates:", error);
                setTemplates([]);
                setSelectedTemplateIndex(null);
                setTitle("");
                setNodes([]);
                setIsEditingNewTemplate(false);
                setIsDirty(false);
            } finally {
                setLoading(false);
            }
        };
        loadTemplates();
    }, []);

    const handleCreateTemplate = () => {
        setSelectedTemplateIndex(null);
        setTitle("");
        setNodes([createNode("/")]);
        setExpanded({});
        setFilter("");
        setIsDirty(true);
        setIsEditingNewTemplate(true);
    };

    const openAddChild = (parentId: string) => {
        if (!isEditingNewTemplate) return;
        setDialogMode("add-child");
        setDialogName("");
        setDialogTargetId(parentId);
        setDialogOpen(true);
    };

    const openRename = (nodeId: string, currentName: string) => {
        if (!isEditingNewTemplate) return;
        setDialogMode("rename");
        setDialogName(currentName);
        setDialogTargetId(nodeId);
        setDialogOpen(true);
    };

    const handleDialogSave = () => {
        const name = dialogName.trim();
        if (!name || !dialogTargetId) return;
        if (dialogMode === "add-child") {
            setNodes((prev) =>
                updateNode(prev, dialogTargetId, (node) => ({
                    ...node,
                    children: [...(node.children ?? []), createNode(name)]
                }))
            );
            setExpanded((prev) => ({ ...prev, [dialogTargetId]: true }));
        }
        if (dialogMode === "rename") {
            setNodes((prev) => updateNode(prev, dialogTargetId, (node) => ({ ...node, name })));
        }
        setIsDirty(true);
        setDialogOpen(false);
    };

    const handleDelete = (nodeId: string) => {
        if (!isEditingNewTemplate) return;
        if (!window.confirm("Delete this item and all children?")) return;
        setNodes((prev) => removeNode(prev, nodeId));
        setIsDirty(true);
    };

    const handleMove = (nodeId: string, direction: "up" | "down") => {
        if (!isEditingNewTemplate) return;
        setNodes((prev) => moveNode(prev, nodeId, direction));
        setIsDirty(true);
    };

    const handleSave = async () => {
        if (!isEditingNewTemplate) return;
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;
        if (!nodes.length) return;
        try {
            setSaving(true);
            const payload: CourseTemplatePayload = {
                title: trimmedTitle,
                template: nodesToTemplateObject(nodes, trimmedTitle)
            };
            await saveCourseTemplates(payload);
            setTemplates((prev) => {
                const next = [...prev, payload];
                setSelectedTemplateIndex(next.length - 1);
                return next;
            });
            setTitle(trimmedTitle);
            setIsDirty(false);
            setIsEditingNewTemplate(false);
        } catch (error) {
            console.error("Failed to save templates:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleSelectTemplate = (value: string) => {
        const index = templates.findIndex((item) => item.title === value);
        if (index === -1) return;
        setSelectedTemplateIndex(index);
        setIsEditingNewTemplate(false);
        setIsDirty(false);
        const selected = templates[index];
        setTitle(selected.title ?? "");
        const template = selected.template && typeof selected.template === "object" ? selected.template : {};
        setNodes(templateObjectToNodes(template as Record<string, unknown>, selected.title ?? ""));
    };

    const filteredNodes = useMemo(() => {
        if (!filter) return nodes;
        const query = filter.toLowerCase();
        const filterTree = (items: AdminTemplateNode[]): AdminTemplateNode[] => {
            return items
                .map((node) => {
                    const matches = node.name.toLowerCase().includes(query);
                    if (node.children) {
                        const filteredChildren = filterTree(node.children);
                        if (matches || filteredChildren.length) {
                            return { ...node, children: filteredChildren };
                        }
                    }
                    return matches ? node : null;
                })
                .filter((node): node is AdminTemplateNode => Boolean(node));
        };
        return filterTree(nodes);
    }, [filter, nodes]);

    const renderNodes = (items: AdminTemplateNode[]) => {
        if (!items.length) {
            return (
                <div className="text-sm text-muted-foreground">No templates yet.</div>
            );
        }

        return items.map((node) => {
            const isExpanded = expanded[node.id] ?? true;
            const isRoot = node.name === "/";
            return (
                <div key={node.id} className="rounded-xl border bg-muted/20 p-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-background p-3">
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                                <Folder className="size-4" />
                            </span>
                            <button
                                type="button"
                                className="text-muted-foreground"
                                onClick={() => setExpanded((prev) => ({ ...prev, [node.id]: !isExpanded }))}
                            >
                                {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                            </button>
                            <div>
                                <div className="text-sm font-semibold">{node.name}</div>
                                <div className="text-[10px] uppercase text-muted-foreground">Folder</div>
                            </div>
                        </div>
                        {isEditingNewTemplate ? (
                            <div className="flex flex-wrap items-center gap-1">
                                <Button size="sm" variant="outline" onClick={() => openAddChild(node.id)}>
                                    <FolderPlus className="mr-1 size-4" /> Folder
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleMove(node.id, "up")}>
                                    <ArrowUp className="size-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleMove(node.id, "down")}>
                                    <ArrowDown className="size-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => openRename(node.id, node.name)} disabled={isRoot}>
                                    <Pencil className="size-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleDelete(node.id)} disabled={isRoot}>
                                    <Trash2 className="size-4 text-red-600" />
                                </Button>
                            </div>
                        ) : (
                            <div className="text-xs text-muted-foreground">Read-only</div>
                        )}
                    </div>
                    {node.children && node.children.length > 0 && isExpanded && (
                        <div className="mt-3 space-y-3 border-l border-dashed border-cyan-200/70 pl-4">
                            {renderNodes(node.children)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Course Templates</CardTitle>
                    <CardDescription>Create custom folder structures for courses and templates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">Available Templates</div>
                                <Button size="sm" onClick={handleCreateTemplate} disabled={isEditingNewTemplate}>
                                    <FolderPlus className="mr-2 size-4" /> Create
                                </Button>
                            </div>
                            {templates.length || isEditingNewTemplate ? (
                                <div className="space-y-2">
                                    {templates.map((template) => {
                                        const isSelected = selectedTemplateIndex !== null
                                            && templates[selectedTemplateIndex]?.title === template.title;
                                        const folderCount = countTemplateFolders(
                                            (template.template ?? {}) as Record<string, unknown>
                                        );
                                        return (
                                            <button
                                                key={template.title}
                                                type="button"
                                                onClick={() => handleSelectTemplate(template.title)}
                                                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                                                    isSelected
                                                        ? "border-cyan-400 bg-cyan-50 text-cyan-900"
                                                        : "border-border bg-background hover:bg-muted"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <div>
                                                        <div className="text-sm font-semibold">{template.title}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {folderCount} folder{folderCount === 1 ? "" : "s"}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <span className="rounded-full bg-cyan-100 px-2 py-1 text-[10px] uppercase text-cyan-700">
                                                            Selected
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                    {isEditingNewTemplate && selectedTemplateIndex === null && (
                                        <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                                            New template (unsaved)
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                    No templates available yet.
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <Input
                                    placeholder="Template title"
                                    value={title}
                                    onChange={(event) => {
                                        if (!isEditingNewTemplate) return;
                                        setTitle(event.target.value);
                                        setIsDirty(true);
                                    }}
                                    readOnly={!isEditingNewTemplate}
                                    disabled={!isEditingNewTemplate}
                                    className="w-64"
                                />
                                <Button
                                    onClick={handleSave}
                                    disabled={!isEditingNewTemplate || !isDirty || saving || !title.trim()}
                                >
                                    <Save className="mr-2 size-4" /> Save Template
                                </Button>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="text-xs text-muted-foreground">
                                    {isEditingNewTemplate
                                        ? "Editing a new template. Save to lock it."
                                        : "Templates are read-only after creation."}
                                </div>
                                <Input
                                    placeholder="Filter templates..."
                                    value={filter}
                                    onChange={(event) => setFilter(event.target.value)}
                                    className="w-56"
                                />
                            </div>
                            {loading ? (
                                <div className="text-sm text-muted-foreground">Loading templates...</div>
                            ) : (
                                <div className="space-y-3">
                                    {hasRoot ? renderNodes(filteredNodes) : (
                                        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                            {isEditingNewTemplate
                                                ? "Add folders to build the template structure."
                                                : "Select a template to view its folders."}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {dialogMode === "rename" ? "Rename folder" : "Add folder"}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogMode === "rename"
                                ? "Update the folder name."
                                : "Create a new folder inside the selected folder."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="template-folder-name">Name</Label>
                        <Input
                            id="template-folder-name"
                            value={dialogName}
                            onChange={(event) => setDialogName(event.target.value)}
                            placeholder="Enter name"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleDialogSave} disabled={!dialogName.trim()}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
