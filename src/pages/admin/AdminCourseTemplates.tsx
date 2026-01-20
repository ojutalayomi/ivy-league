import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FolderPlus, FilePlus, ChevronDown, ChevronRight, ArrowUp, ArrowDown, Pencil, Trash2, Save } from "lucide-react";
import type { AdminTemplateNode } from "@/lib/types";
import { fetchCourseTemplates, saveCourseTemplates } from "@/lib/admin-api";

const createNode = (name: string, type: "folder" | "template"): AdminTemplateNode => ({
    id: crypto.randomUUID(),
    name,
    type,
    children: type === "folder" ? [] : undefined
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

export default function AdminCourseTemplates() {
    const [nodes, setNodes] = useState<AdminTemplateNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [filter, setFilter] = useState("");
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        document.title = "Course Templates - Ivy League Associates";
    }, []);

    useEffect(() => {
        const loadTemplates = async () => {
            try {
                setLoading(true);
                const data = await fetchCourseTemplates();
                if (Array.isArray(data) && data.length) {
                    setNodes(data);
                } else {
                    setNodes([
                        createNode("Courses", "folder"),
                        createNode("Templates", "folder")
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch templates:", error);
                setNodes([createNode("Courses", "folder")]);
            } finally {
                setLoading(false);
            }
        };
        loadTemplates();
    }, []);

    const handleAddRoot = (type: "folder" | "template") => {
        const name = window.prompt(`Name the new ${type}`);
        if (!name) return;
        setNodes((prev) => [...prev, createNode(name, type)]);
        setIsDirty(true);
    };

    const handleAddChild = (parentId: string, type: "folder" | "template") => {
        const name = window.prompt(`Name the new ${type}`);
        if (!name) return;
        setNodes((prev) =>
            updateNode(prev, parentId, (node) => ({
                ...node,
                children: [...(node.children ?? []), createNode(name, type)]
            }))
        );
        setExpanded((prev) => ({ ...prev, [parentId]: true }));
        setIsDirty(true);
    };

    const handleRename = (nodeId: string, currentName: string) => {
        const name = window.prompt("Rename item", currentName);
        if (!name || name === currentName) return;
        setNodes((prev) => updateNode(prev, nodeId, (node) => ({ ...node, name })));
        setIsDirty(true);
    };

    const handleDelete = (nodeId: string) => {
        if (!window.confirm("Delete this item and all children?")) return;
        setNodes((prev) => removeNode(prev, nodeId));
        setIsDirty(true);
    };

    const handleMove = (nodeId: string, direction: "up" | "down") => {
        setNodes((prev) => moveNode(prev, nodeId, direction));
        setIsDirty(true);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await saveCourseTemplates(nodes);
            setIsDirty(false);
        } catch (error) {
            console.error("Failed to save templates:", error);
        } finally {
            setSaving(false);
        }
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

    const renderNodes = (items: AdminTemplateNode[], level = 0) => {
        if (!items.length) {
            return (
                <div className="text-sm text-muted-foreground">No templates yet.</div>
            );
        }

        return items.map((node) => {
            const isExpanded = expanded[node.id] ?? true;
            return (
                <div key={node.id} className="space-y-2">
                    <div
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-white dark:bg-gray-900 p-3"
                        style={{ paddingLeft: level * 16 + 12 }}
                    >
                        <div className="flex items-center gap-2">
                            {node.type === "folder" && (
                                <button
                                    type="button"
                                    className="text-muted-foreground"
                                    onClick={() => setExpanded((prev) => ({ ...prev, [node.id]: !isExpanded }))}
                                >
                                    {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                </button>
                            )}
                            <span className="font-medium">{node.name}</span>
                            <span className="text-xs uppercase text-muted-foreground">{node.type}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {node.type === "folder" && (
                                <>
                                    <Button size="sm" variant="outline" onClick={() => handleAddChild(node.id, "folder")}>
                                        <FolderPlus className="mr-1 size-4" /> Folder
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleAddChild(node.id, "template")}>
                                        <FilePlus className="mr-1 size-4" /> Template
                                    </Button>
                                </>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => handleMove(node.id, "up")}>
                                <ArrowUp className="size-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleMove(node.id, "down")}>
                                <ArrowDown className="size-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleRename(node.id, node.name)}>
                                <Pencil className="size-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(node.id)}>
                                <Trash2 className="size-4 text-red-600" />
                            </Button>
                        </div>
                    </div>
                    {node.children && node.children.length > 0 && isExpanded && (
                        <div className="space-y-2">{renderNodes(node.children, level + 1)}</div>
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
                    <div className="flex flex-wrap items-center gap-2">
                        <Button onClick={() => handleAddRoot("folder")}>
                            <FolderPlus className="mr-2 size-4" /> Add Folder
                        </Button>
                        <Button variant="outline" onClick={() => handleAddRoot("template")}>
                            <FilePlus className="mr-2 size-4" /> Add Template
                        </Button>
                        <div className="ml-auto flex items-center gap-2">
                            <Input
                                placeholder="Filter templates..."
                                value={filter}
                                onChange={(event) => setFilter(event.target.value)}
                                className="w-56"
                            />
                            <Button onClick={handleSave} disabled={!isDirty || saving}>
                                <Save className="mr-2 size-4" /> Save Changes
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-sm text-muted-foreground">Loading templates...</div>
                    ) : (
                        <div className="space-y-3">{renderNodes(filteredNodes)}</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
