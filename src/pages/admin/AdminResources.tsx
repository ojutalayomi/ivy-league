import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, UploadCloud } from "lucide-react";
import type { AdminResource } from "@/lib/types";
import { deleteAdminResource, fetchAdminResources, uploadAdminResources } from "@/lib/admin-api";

export default function AdminResources() {
    const [resources, setResources] = useState<AdminResource[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState("");
    const [course, setCourse] = useState("");
    const [visibility, setVisibility] = useState<AdminResource["visibility"]>("students");
    const [files, setFiles] = useState<FileList | null>(null);

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

    const handleUpload = async () => {
        if (!files || files.length === 0) return;
        try {
            setUploading(true);
            const formData = new FormData();
            Array.from(files).forEach((file) => formData.append("files", file));
            formData.append("title", title);
            formData.append("course", course);
            formData.append("visibility", visibility ?? "students");
            await uploadAdminResources(formData);
            setTitle("");
            setCourse("");
            setVisibility("students");
            setFiles(null);
            await loadResources();
        } catch (error) {
            console.error("Failed to upload resources:", error);
        } finally {
            setUploading(false);
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
                    <CardDescription>Upload files and attach them to courses.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="resource-title">Title</Label>
                            <Input
                                id="resource-title"
                                placeholder="Resource title"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="resource-course">Course</Label>
                            <Input
                                id="resource-course"
                                placeholder="Course name or code"
                                value={course}
                                onChange={(event) => setCourse(event.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Visibility</Label>
                            <Select
                                value={visibility ?? "students"}
                                onValueChange={(value) => setVisibility(value as AdminResource["visibility"])}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select visibility" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="students">Students</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                    <SelectItem value="public">Public</SelectItem>
                                    <SelectItem value="private">Private</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="resource-files">Files</Label>
                            <Input
                                id="resource-files"
                                type="file"
                                multiple
                                onChange={(event) => setFiles(event.target.files)}
                            />
                        </div>
                    </div>
                    <Button onClick={handleUpload} disabled={uploading || !files || files.length === 0}>
                        <UploadCloud className="mr-2 size-4" />
                        Upload Resources
                    </Button>
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
        </div>
    );
}
