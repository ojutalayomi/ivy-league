import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CompleteAdminPayload = {
    dob: string;
    phone: string;
    password: string;
    address: string;
    profilePic: string;
};

const initialForm: CompleteAdminPayload = {
    dob: "",
    phone: "",
    password: "",
    address: "",
    profilePic: ""
};

export default function AdminComplete() {
    const location = useLocation();
    const [formData, setFormData] = useState<CompleteAdminPayload>(initialForm);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const token = new URLSearchParams(location.search).get("token") ?? "";

    useEffect(() => {
        document.title = "Complete Admin Account - Ivy League Associates";
    }, []);

    const updateField = (field: keyof CompleteAdminPayload, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
        });

    const handleProfileChange = async (file: File | null) => {
        if (!file) {
            setPreviewUrl(null);
            updateField("profilePic", "");
            return;
        }
        try {
            const base64 = await toBase64(file);
            setPreviewUrl(base64);
            updateField("profilePic", base64);
        } catch (error) {
            console.error(error);
            setPreviewUrl(null);
            updateField("profilePic", "");
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const validate = () => {
        if (!token) {
            setErrorMessage("Missing token. Please use the invite link provided.");
            return false;
        }
        if (!formData.dob || !formData.phone || !formData.password || !formData.address) {
            setErrorMessage("Please complete all required fields before submitting.");
            return false;
        }
        if (!formData.profilePic) {
            setErrorMessage("Please upload a profile picture.");
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
            const payload = {
                token,
                dob: formData.dob,
                phone: formData.phone,
                password: formData.password,
                address: formData.address,
                profile_pic: formData.profilePic
            };

            await api.patch("/complete-admin", payload);
            setSuccessMessage("Account completed successfully. You can now sign in.");
            setFormData(initialForm);
        } catch (error) {
            console.error("Failed to complete admin account:", error);
            setErrorMessage("Failed to complete account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Complete Admin Account</CardTitle>
                    <CardDescription>Fill in your details to finish setup.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={formData.dob}
                                    onChange={(event) => updateField("dob", event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(event) => updateField("phone", event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(event) => updateField("password", event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="profile-pic">Profile Picture</Label>
                                <div className="flex flex-col gap-3 rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border bg-gray-50 text-xs text-muted-foreground dark:bg-gray-900">
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Profile preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                "Preview"
                                            )}
                                        </div>
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <p>Upload a clear headshot (JPG/PNG).</p>
                                            <p>Max 5MB recommended.</p>
                                        </div>
                                    </div>
                                    <Input
                                        id="profile-pic"
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => handleProfileChange(event.target.files?.[0] ?? null)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    rows={4}
                                    value={formData.address}
                                    onChange={(event) => updateField("address", event.target.value)}
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
                                {loading ? "Submitting..." : "Complete Account"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
