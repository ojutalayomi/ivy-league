import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, UploadCloud, Video, FileUp, FileSpreadsheet, FolderOpen, ChevronRight, ChevronDown } from "lucide-react";
import type { AdminResource, Diet } from "@/lib/types";
import { deleteAdminResource, fetchAdminResources, fetchCourseTemplates } from "@/lib/admin-api";
import type { CourseTemplatePayload } from "@/lib/admin-api";

type FolderNode = { name: string; path: string; children: FolderNode[] };

function objectToNodes(obj: Record<string, unknown>, basePath: string): FolderNode[] {
    return Object.entries(obj).map(([key, value]) => {
        const path = basePath ? `${basePath}/${key}` : `/${key}`;
        const childObj = value && typeof value === "object" && !Array.isArray(value) ? value : {};
        const children = objectToNodes(childObj as Record<string, unknown>, path);
        return { name: key, path, children };
    });
}

/** Skip template root key like /$Computer Science$; build tree from its value (e.g. 100, 200). */
function templateToNodes(templateObj: Record<string, unknown>, basePath: string): FolderNode[] {
    const entries = Object.entries(templateObj);
    if (entries.length === 1) {
        const [key, value] = entries[0];
        if (/^\/\$.*\$$/.test(key) && value && typeof value === "object" && !Array.isArray(value)) {
            return objectToNodes(value as Record<string, unknown>, basePath);
        }
    }
    return objectToNodes(templateObj, basePath);
}

function buildTreeFromDietsAndTemplates(
    diets: Diet[] | null,
    templates: CourseTemplatePayload[] | null
): FolderNode[] {
    if (!Array.isArray(diets) || !diets.length) return [];
    const templateMap = new Map<string, CourseTemplatePayload>();
    if (Array.isArray(templates)) {
        for (const t of templates) templateMap.set(t.title, t);
    }
    const dietsWithTemplate = diets.filter(
        (d) => d.diet_name && d.diet_template && templateMap.has(d.diet_template)
    );
    if (!dietsWithTemplate.length) return [];

    const byPaper = new Map<string, Diet[]>();
    for (const diet of dietsWithTemplate) {
        const papers = Array.isArray(diet.papers) ? diet.papers : [];
        for (const code of papers) {
            if (!code || typeof code !== "string") continue;
            const list = byPaper.get(code) ?? [];
            list.push(diet);
            byPaper.set(code, list);
        }
    }

    const result: FolderNode[] = [];
    for (const [paperCode, dietList] of byPaper.entries()) {
        for (const diet of dietList) {
            const dietName = diet.diet_name!;
            const rootPath = `/${paperCode} ${dietName}`;
            const template = templateMap.get(diet.diet_template!);
            const templateChildren =
                template?.template && typeof template.template === "object"
                    ? templateToNodes(template.template as Record<string, unknown>, rootPath)
                    : [];
            result.push({
                name: `${paperCode} ${dietName}`,
                path: rootPath,
                children: templateChildren
            });
        }
    }
    return result;
}

function FolderPathDialog({
    open,
    onOpenChange,
    onSelect,
    currentPath
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (path: string) => void;
    currentPath: string;
}) {
    const [tree, setTree] = useState<FolderNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!open) return;
        setLoading(true);
        Promise.all([
            api.get<Diet[]>("/all-diets?user_status=staff").then((r) => r.data ?? []),
            fetchCourseTemplates()
        ])
            .then(([diets, templates]) => setTree(buildTreeFromDietsAndTemplates(diets, templates)))
            .catch(() => setTree([]))
            .finally(() => setLoading(false));
    }, [open]);

    const toggle = (path: string) => {
        setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
    };

    const handleSelect = (path: string) => {
        onSelect(path);
        onOpenChange(false);
    };

    const renderNode = (node: FolderNode, depth: number) => {
        const hasChildren = node.children.length > 0;
        const isExpanded = expanded[node.path] ?? false;
        return (
            <div key={node.path} className="space-y-0.5">
                <div
                    className="flex items-center gap-1 rounded-md py-1.5 px-2 hover:bg-muted cursor-pointer"
                    style={{ paddingLeft: depth * 12 + 8 }}
                    onClick={() => handleSelect(node.path)}
                >
                    {hasChildren ? (
                        <button
                            type="button"
                            className="p-0.5 shrink-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggle(node.path);
                            }}
                        >
                            {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                        </button>
                    ) : (
                        <span className="w-5 shrink-0 inline-block" />
                    )}
                    <FolderOpen className="size-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm truncate">{node.name}</span>
                </div>
                {hasChildren && isExpanded && node.children.map((child) => renderNode(child, depth + 1))}
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select folder path</DialogTitle>
                    <DialogDescription>
                        Choose a folder. Path: /paperCode/diet/folder…
                    </DialogDescription>
                </DialogHeader>
                {currentPath && (
                    <div className="text-sm text-muted-foreground truncate" title={currentPath}>
                        Current: {currentPath}
                    </div>
                )}
                <div className="flex-1 min-h-0 overflow-y-auto border rounded-lg p-2">
                    {loading ? (
                        <div className="text-sm text-muted-foreground py-4">Loading folders...</div>
                    ) : tree.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-4">No folders available. Create course templates first.</div>
                    ) : (
                        tree.map((node) => renderNode(node, 0))
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function AdminResources() {
    const [resources, setResources] = useState<AdminResource[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("video");

    const [videoLink, setVideoLink] = useState("");
    const [videoPath, setVideoPath] = useState("");
    const [videoName, setVideoName] = useState("");
    const [videoSubmitting, setVideoSubmitting] = useState(false);
    const [videoMessage, setVideoMessage] = useState("");

    const [filePath, setFilePath] = useState("");
    const [fileUpload, setFileUpload] = useState<File | null>(null);
    const [fileSubmitting, setFileSubmitting] = useState(false);
    const [fileMessage, setFileMessage] = useState("");

    const [testFile, setTestFile] = useState<File | null>(null);
    const [testPath, setTestPath] = useState("");
    const [testName, setTestName] = useState("");
    const [testPaper, setTestPaper] = useState("");
    const [testDiet, setTestDiet] = useState("");
    const [testGateway, setTestGateway] = useState(false);
    const [testHighScore, setTestHighScore] = useState("");
    const [testPassMark, setTestPassMark] = useState("");
    const [testDuration, setTestDuration] = useState("");
    const [testSubmitting, setTestSubmitting] = useState(false);
    const [testMessage, setTestMessage] = useState("");

    const [pathDialogFor, setPathDialogFor] = useState<"video" | "file" | "test" | null>(null);

    const pathDialogOpen = pathDialogFor !== null;
    const pathDialogCurrentPath =
        pathDialogFor === "video" ? videoPath : pathDialogFor === "file" ? filePath : pathDialogFor === "test" ? testPath : "";

    const handlePathSelect = useCallback((path: string) => {
        if (pathDialogFor === "video") setVideoPath(path);
        if (pathDialogFor === "file") setFilePath(path);
        if (pathDialogFor === "test") setTestPath(path);
        setPathDialogFor(null);
    }, [pathDialogFor]);

    useEffect(() => {
        document.title = "Upload Resources - Ivy League Associates";
    }, []);

    const loadResources = async () => {
        try {
            setLoading(true);
            const data = await fetchAdminResources();
            setResources(data);
        } catch (error) {
            console.error("Failed to fetch resources:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadResources();
    }, []);

    const handleVideoUpload = async () => {
        if (!videoLink || !videoPath || !videoName) {
            setVideoMessage("Please complete all video fields.");
            return;
        }
        try {
            setVideoSubmitting(true);
            setVideoMessage("");
            await api.post("/add-video", {
                video_link: videoLink,
                path: videoPath,
                name: videoName
            });
            setVideoLink("");
            setVideoPath("");
            setVideoName("");
            setVideoMessage("Video uploaded successfully.");
            await loadResources();
        } catch (error) {
            console.error("Failed to upload video:", error);
            setVideoMessage("Failed to upload video. Please try again.");
        } finally {
            setVideoSubmitting(false);
        }
    };

    const handleFileUpload = async () => {
        if (!filePath || !fileUpload) {
            setFileMessage("Please provide a file and path.");
            return;
        }
        if (fileUpload.type.startsWith("video/")) {
            setFileMessage("Video files are not allowed here. Use Video upload.");
            return;
        }
        try {
            setFileSubmitting(true);
            setFileMessage("");
            const formData = new FormData();
            formData.append("path", filePath);
            formData.append("file", fileUpload);
            await api.post("/upload-file", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setFilePath("");
            setFileUpload(null);
            setFileMessage("File uploaded successfully.");
            await loadResources();
        } catch (error) {
            console.error("Failed to upload file:", error);
            setFileMessage("Failed to upload file. Please try again.");
        } finally {
            setFileSubmitting(false);
        }
    };

    const handleTestUpload = async () => {
        if (!testFile || !testPath || !testName || !testPaper || !testDiet || !testHighScore || !testPassMark || !testDuration) {
            setTestMessage("Please complete all test fields.");
            return;
        }
        try {
            setTestSubmitting(true);
            setTestMessage("");
            const formData = new FormData();
            formData.append("file", testFile);
            formData.append("path", testPath);
            formData.append("name", testName);
            formData.append("paper", testPaper);
            formData.append("diet", testDiet);
            formData.append("gateway", String(testGateway));
            formData.append("high_score", testHighScore);
            formData.append("pass", testPassMark);
            formData.append("duration", testDuration);
            await api.post("/upload-mcq", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setTestFile(null);
            setTestPath("");
            setTestName("");
            setTestPaper("");
            setTestDiet("");
            setTestGateway(false);
            setTestHighScore("");
            setTestPassMark("");
            setTestDuration("");
            setTestMessage("Test uploaded successfully.");
            await loadResources();
        } catch (error) {
            console.error("Failed to upload test:", error);
            setTestMessage("Failed to upload test. Please try again.");
        } finally {
            setTestSubmitting(false);
        }
    };

    const handleDelete = async (resourceId: string) => {
        if (!window.confirm("Delete this resource?")) return;
        try {
            await deleteAdminResource(resourceId);
            setResources((prev) => prev.filter((item) => item.id !== resourceId));
        } catch (error) {
            console.error("Failed to delete resource:", error);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Resources</CardTitle>
                    <CardDescription>Upload videos, files, or tests into a folder path.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="video">
                                <Video className="mr-2 size-4" /> Video
                            </TabsTrigger>
                            <TabsTrigger value="file">
                                <FileUp className="mr-2 size-4" /> File
                            </TabsTrigger>
                            <TabsTrigger value="test">
                                <FileSpreadsheet className="mr-2 size-4" /> Test
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="video" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="video-name">Video Name</Label>
                                    <Input
                                        id="video-name"
                                        placeholder="e.g. Lecture 1"
                                        value={videoName}
                                        onChange={(event) => setVideoName(event.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Folder Path</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            readOnly
                                            placeholder="e.g. /CSS 2026_JULY/100/First Semester"
                                            value={videoPath}
                                            className="bg-muted/50"
                                        />
                                        <Button type="button" variant="outline" onClick={() => setPathDialogFor("video")}>
                                            <FolderOpen className="mr-1 size-4" /> Select
                                        </Button>
                                        {videoPath && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setVideoPath("")}>
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="video-link">Video URL</Label>
                                    <Input
                                        id="video-link"
                                        placeholder="https://..."
                                        value={videoLink}
                                        onChange={(event) => setVideoLink(event.target.value)}
                                    />
                                </div>
                            </div>
                            {videoMessage && (
                                <div className="text-sm text-muted-foreground">{videoMessage}</div>
                            )}
                            <Button onClick={handleVideoUpload} disabled={videoSubmitting}>
                                <UploadCloud className="mr-2 size-4" />
                                {videoSubmitting ? "Uploading..." : "Upload Video"}
                            </Button>
                        </TabsContent>

                        <TabsContent value="file" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Folder Path</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            readOnly
                                            placeholder="e.g. /CSS 2026_JULY/100/First Semester"
                                            value={filePath}
                                            className="bg-muted/50"
                                        />
                                        <Button type="button" variant="outline" onClick={() => setPathDialogFor("file")}>
                                            <FolderOpen className="mr-1 size-4" /> Select
                                        </Button>
                                        {filePath && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setFilePath("")}>
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="file-upload">File</Label>
                                    <Input
                                        id="file-upload"
                                        type="file"
                                        onChange={(event) => setFileUpload(event.target.files?.[0] ?? null)}
                                    />
                                </div>
                            </div>
                            {fileMessage && (
                                <div className="text-sm text-muted-foreground">{fileMessage}</div>
                            )}
                            <Button onClick={handleFileUpload} disabled={fileSubmitting}>
                                <UploadCloud className="mr-2 size-4" />
                                {fileSubmitting ? "Uploading..." : "Upload File"}
                            </Button>
                        </TabsContent>

                        <TabsContent value="test" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="test-name">Test Name</Label>
                                    <Input
                                        id="test-name"
                                        placeholder="e.g. Mock Test 1"
                                        value={testName}
                                        onChange={(event) => setTestName(event.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Folder Path</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            readOnly
                                            placeholder="e.g. /CSS 2026_JULY/100/First Semester"
                                            value={testPath}
                                            className="bg-muted/50"
                                        />
                                        <Button type="button" variant="outline" onClick={() => setPathDialogFor("test")}>
                                            <FolderOpen className="mr-1 size-4" /> Select
                                        </Button>
                                        {testPath && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setTestPath("")}>
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="test-paper">Paper</Label>
                                    <Input
                                        id="test-paper"
                                        placeholder="e.g. FA"
                                        value={testPaper}
                                        onChange={(event) => setTestPaper(event.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="test-diet">Diet</Label>
                                    <Input
                                        id="test-diet"
                                        placeholder="e.g. 2025_December"
                                        value={testDiet}
                                        onChange={(event) => setTestDiet(event.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="test-high-score">High Score</Label>
                                    <Input
                                        id="test-high-score"
                                        type="number"
                                        value={testHighScore}
                                        onChange={(event) => setTestHighScore(event.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="test-pass-mark">Pass Mark</Label>
                                    <Input
                                        id="test-pass-mark"
                                        type="number"
                                        value={testPassMark}
                                        onChange={(event) => setTestPassMark(event.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="test-duration">Duration (seconds)</Label>
                                    <Input
                                        id="test-duration"
                                        type="number"
                                        value={testDuration}
                                        onChange={(event) => setTestDuration(event.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="test-file">Test File (CSV/XLSX)</Label>
                                    <Input
                                        id="test-file"
                                        type="file"
                                        accept=".csv,.xlsx"
                                        onChange={(event) => setTestFile(event.target.files?.[0] ?? null)}
                                    />
                                </div>
                                <div className="flex items-center gap-2 md:col-span-2">
                                    <Checkbox
                                        id="test-gateway"
                                        checked={testGateway}
                                        onCheckedChange={(value) => setTestGateway(Boolean(value))}
                                    />
                                    <Label htmlFor="test-gateway">Gateway Enabled</Label>
                                </div>
                            </div>
                            {testMessage && (
                                <div className="text-sm text-muted-foreground">{testMessage}</div>
                            )}
                            <Button onClick={handleTestUpload} disabled={testSubmitting}>
                                <UploadCloud className="mr-2 size-4" />
                                {testSubmitting ? "Uploading..." : "Upload Test"}
                            </Button>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Uploaded Resources</CardTitle>
                    <CardDescription>Manage existing resources and downloads.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-sm text-muted-foreground">Loading resources...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>File</TableHead>
                                    <TableHead>Visibility</TableHead>
                                    <TableHead>Uploaded</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resources.map((resource) => (
                                    <TableRow key={resource.id}>
                                        <TableCell>{resource.title}</TableCell>
                                        <TableCell>{resource.course ?? "N/A"}</TableCell>
                                        <TableCell>
                                            {resource.url ? (
                                                <a className="text-cyan-600 hover:underline" href={resource.url} target="_blank" rel="noreferrer">
                                                    {resource.filename}
                                                </a>
                                            ) : (
                                                resource.filename
                                            )}
                                        </TableCell>
                                        <TableCell>{resource.visibility ?? "students"}</TableCell>
                                        <TableCell>
                                            {resource.uploaded_at ? new Date(resource.uploaded_at).toLocaleDateString() : "N/A"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(resource.id)}>
                                                <Trash2 className="size-4 text-red-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!resources.length && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No resources uploaded yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <FolderPathDialog
                open={pathDialogOpen}
                onOpenChange={(open) => !open && setPathDialogFor(null)}
                onSelect={handlePathSelect}
                currentPath={pathDialogCurrentPath}
            />
        </div>
    );
}
