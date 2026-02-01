import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

type StaffActivity = {
    code: string;
    title: string;
    description: string;
    object: string;
    staff_firstname: string;
    time: string;
};

export default function AdminActivities() {
    const [activities, setActivities] = useState<StaffActivity[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        document.title = "Admin Activities - Ivy League Associates";
    }, []);

    const loadActivities = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const response = await api.get("/staff-activities");
            const data = response.data ?? [];
            setActivities(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch activities:", error);
            setErrorMessage("Failed to fetch activities. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActivities();
    }, []);

    const filteredActivities = useMemo(() => {
        if (!query) return activities;
        const needle = query.toLowerCase();
        return activities.filter((activity) =>
            [activity.code, activity.title, activity.description, activity.object, activity.staff_firstname]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(needle)
        );
    }, [activities, query]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Activities</CardTitle>
                    <CardDescription>Review recent admin actions and logs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                        <div className="space-y-2">
                            <Label htmlFor="activity-search">Search</Label>
                            <Input
                                id="activity-search"
                                placeholder="Search by title, staff, or object..."
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                            />
                        </div>
                        <Button onClick={loadActivities} disabled={loading}>
                            Refresh
                        </Button>
                    </div>

                    {errorMessage && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
                            {errorMessage}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-sm text-muted-foreground">Loading activities...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Object</TableHead>
                                    <TableHead>Staff</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredActivities.map((activity, index) => (
                                    <TableRow key={`${activity.code}-${index}`}>
                                        <TableCell className="font-mono">{activity.code}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{activity.title}</div>
                                            <div className="text-xs text-muted-foreground whitespace-pre-line">
                                                {activity.description}
                                            </div>
                                        </TableCell>
                                        <TableCell>{activity.object}</TableCell>
                                        <TableCell>{activity.staff_firstname}</TableCell>
                                        <TableCell>
                                            {activity.time ? new Date(activity.time).toLocaleString() : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!filteredActivities.length && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No activities found.
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
