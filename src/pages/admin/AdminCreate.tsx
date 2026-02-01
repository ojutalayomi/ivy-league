import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminModeEnum, EmployeeEnum } from "@/providers/user-provider";

type CreateAdminPayload = {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    gender: string;
    role: string;
    type: string;
    hiredate: string;
};

const initialForm: CreateAdminPayload = {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    gender: "",
    role: "",
    type: "",
    hiredate: ""
};

export default function AdminCreate() {
    const [formData, setFormData] = useState<CreateAdminPayload>(initialForm);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        document.title = "Create Admin - Ivy League Associates";
    }, []);

    const updateField = (field: keyof CreateAdminPayload, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        const requiredFields: Array<keyof CreateAdminPayload> = [
            "firstname",
            "lastname",
            "email",
            "phone",
            "gender",
            "role",
            "type",
            "hiredate"
        ];
        const missing = requiredFields.filter((field) => !formData[field].trim());
        if (missing.length) {
            setErrorMessage("Please complete all required fields before submitting.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        if (!validate()) return;

        try {
            setLoading(true);
            await api.post("/create-admin", formData);
            setSuccessMessage("Admin account created successfully.");
            setFormData(initialForm);
        } catch (error) {
            console.error("Failed to create admin:", error);
            setErrorMessage("Failed to create admin. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create Admin</CardTitle>
                    <CardDescription>Add a new admin account and assign access.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstname">First name</Label>
                                <Input
                                    id="firstname"
                                    value={formData.firstname}
                                    onChange={(event) => updateField("firstname", event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastname">Last name</Label>
                                <Input
                                    id="lastname"
                                    value={formData.lastname}
                                    onChange={(event) => updateField("lastname", event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(event) => updateField("email", event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(event) => updateField("phone", event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(value) => updateField("gender", value)}
                                >
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => updateField("role", value)}
                                >
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(AdminModeEnum).map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role.replace(/_/g, " ")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => updateField("type", value)}
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(EmployeeEnum).map((type: string) => (
                                            <SelectItem key={type} value={type}>
                                                {type.replace(/_/g, " ")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hiredate">Hire date</Label>
                                <Input
                                    id="hiredate"
                                    type="date"
                                    value={formData.hiredate}
                                    onChange={(event) => updateField("hiredate", event.target.value)}
                                />
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
                                {errorMessage}
                            </div>
                        )}
                        {successMessage && (
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-200">
                                {successMessage}
                            </div>
                        )}

                        <div className="flex items-center justify-end">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Creating..." : "Create Admin"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
