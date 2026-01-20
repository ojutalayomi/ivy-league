import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AdminActivity } from "@/lib/types";
import { fetchAdminActivities } from "@/lib/admin-api";

const activityTypes = ["all", "export", "resource", "template", "payment", "student", "auth"];

export default function AdminActivities() {
    const [activities, setActivities] = useState<AdminActivity[]>([]);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [type, setType] = useState("all");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Admin Activities - Ivy League Associates";
    }, []);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const data = await fetchAdminActivities({
                from: from || undefined,
                to: to || undefined,
                type: type === "all" ? undefined : type
            });
            setActivities(data);
        } catch (error) {
            console.error("Failed to fetch activities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActivities();
    }, []);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Activities</CardTitle>
                    <CardDescription>Review recent admin actions and logs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
                        <div className="space-y-2">
                            <Label htmlFor="activity-from">From</Label>
                            <Input
                                id="activity-from"
                                type="date"
                                value={from}
                                onChange={(event) => setFrom(event.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="activity-to">To</Label>
                            <Input
                                id="activity-to"
                                type="date"
                                value={to}
                                onChange={(event) => setTo(event.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {activityTypes.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item === "all" ? "All Types" : item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={loadActivities} disabled={loading}>
                            Refresh
                        </Button>
                    </div>

                    {loading ? (
                        <div className="text-sm text-muted-foreground">Loading activities...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Actor</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activities.map((activity) => (
                                    <TableRow key={activity.id}>
                                        <TableCell>{activity.actor}</TableCell>
                                        <TableCell>{activity.action}</TableCell>
                                        <TableCell>{activity.target ?? "N/A"}</TableCell>
                                        <TableCell>{activity.type ?? "general"}</TableCell>
                                        <TableCell>
                                            {activity.created_at ? new Date(activity.created_at).toLocaleString() : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!activities.length && (
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
