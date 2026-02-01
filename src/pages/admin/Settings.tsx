import { useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/providers/user-provider";

type StaffProfile = {
    staff_code?: string;
    role?: string;
    user_status?: string;
};

export default function SettingsPage() {
    const { user } = useUser();
    const staffProfile = user as typeof user & StaffProfile;

    useEffect(() => {
        document.title = "Settings - Ivy League Associates";
    }, []);

    const initials = `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase();
    const dob = user.dob ? format(new Date(user.dob), "dd MMM yyyy") : "N/A";
    const address = user.address || "N/A";
    const status = staffProfile.user_status || "staff";

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Review your admin profile information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={user.profile_pic} alt={`${user.firstname} ${user.lastname}`} />
                                <AvatarFallback>{initials || "AD"}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="text-xl font-semibold">
                                    {user.title ? `${user.title} ` : ""}{user.firstname} {user.lastname}
                                </div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                    <Badge variant="secondary">{staffProfile.role ?? "Admin"}</Badge>
                                    <Badge variant="outline">{status}</Badge>
                                    {staffProfile.staff_code && (
                                        <Badge variant="outline">{staffProfile.staff_code}</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Badge variant={user.email_verified ? "default" : "destructive"}>
                            {user.email_verified ? "Email Verified" : "Email Not Verified"}
                        </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border p-4">
                            <div className="text-xs uppercase text-muted-foreground">Personal</div>
                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Date of Birth</span>
                                    <span className="font-medium">{dob}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Gender</span>
                                    <span className="font-medium">{user.gender || "N/A"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Phone</span>
                                    <span className="font-medium">{user.phone_no || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg border p-4">
                            <div className="text-xs uppercase text-muted-foreground">Contact</div>
                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Email</span>
                                    <span className="font-medium">{user.email}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Address</span>
                                    <span className="font-medium">{address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
