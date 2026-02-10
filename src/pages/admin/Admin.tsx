import { useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, FileDown, FolderTree, Shield, UploadCloud, UserPlus } from "lucide-react";
import Error404Page from "@/components/404";
import AdminExport from "./AdminExport";
import AdminCourseTemplates from "./AdminCourseTemplates";
import AdminResources from "./AdminResources";
import AdminActivities from "./AdminActivities";
import AdminCreate from "./AdminCreate";

export function AdminRoutesWithModals() {
    return (
        <>
            <Routes>
                <Route index element={<AdminPage />} />
                <Route path="create-admin" element={<AdminCreate />} />
                <Route path="export" element={<AdminExport />} />
                <Route path="course-templates" element={<AdminCourseTemplates />} />
                <Route path="resources" element={<AdminResources />} />
                <Route path="activities" element={<AdminActivities />} />
                <Route path="*" element={<Error404Page title="Admin page" />} />
            </Routes>
        </>
    );
}

function AdminPage() {
    useEffect(() => {
        document.title = "Admin - Ivy League Associates";
    }, []);

    const cards = [
        {
            title: "Manage Admin Users",
            description: "Manage admin users and their permissions.",
            href: "/admin/users",
            icon: Shield
        },
        {
            title: "Create Admin",
            description: "Add a new admin account and access.",
            href: "/admin/create-admin",
            icon: UserPlus
        },
        {
            title: "Export Data",
            description: "Download students and payments in CSV or XLSX.",
            href: "/admin/export",
            icon: FileDown
        },
        {
            title: "Course Templates",
            description: "Build a custom folder system for courses.",
            href: "/admin/course-templates",
            icon: FolderTree
        },
        {
            title: "Upload Resources",
            description: "Upload course resources and manage files.",
            href: "/admin/resources",
            icon: UploadCloud
        },
        {
            title: "Admin Activities",
            description: "Review recent actions and admin logs.",
            href: "/admin/activities",
            icon: Activity
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
                <p className="text-muted-foreground">Manage exports, templates, resources, and activity logs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.title} to={card.href}>
                            <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <div>
                                        <CardTitle className="text-lg">{card.title}</CardTitle>
                                        <CardDescription>{card.description}</CardDescription>
                                    </div>
                                    <div className="rounded-full bg-cyan-100 text-cyan-600 p-2">
                                        <Icon className="size-5" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <span className="text-sm text-cyan-600">Open →</span>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}