import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
};

export default function AdminExport() {
    const [studentQuery, setStudentQuery] = useState("");
    const [paymentsQuery, setPaymentsQuery] = useState("");
    const [paymentsFrom, setPaymentsFrom] = useState("");
    const [paymentsTo, setPaymentsTo] = useState("");
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        document.title = "Export Data - Ivy League Associates";
    }, []);

    const getFilename = (fallback: string, header?: string) => {
        if (!header) return fallback;
        const match = header.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
        if (!match?.[1]) return fallback;
        try {
            return decodeURIComponent(match[1]);
        } catch {
            return match[1];
        }
    };

    const exportStudents = async () => {
        try {
            setErrorMessage("");
            setLoadingStudents(true);
            const response = await api.get("/export-students", {
                params: {
                    query: studentQuery || undefined
                },
                responseType: "blob"
            });
            const filename = getFilename("students-export.xlsx", response.headers?.["content-disposition"]);
            downloadBlob(new Blob([response.data]), filename);
        } catch (error) {
            console.error("Failed to export students:", error);
            setErrorMessage("Failed to export students. Please try again.");
        } finally {
            setLoadingStudents(false);
        }
    };

    const exportPayments = async () => {
        try {
            setErrorMessage("");
            setLoadingPayments(true);
            const response = await api.get("/export-payments", {
                params: {
                    query: paymentsQuery || undefined,
                    from: paymentsFrom || undefined,
                    to: paymentsTo || undefined
                },
                responseType: "blob"
            });
            const filename = getFilename("payments-export.xlsx", response.headers?.["content-disposition"]);
            downloadBlob(new Blob([response.data]), filename);
        } catch (error) {
            console.error("Failed to export payments:", error);
            setErrorMessage("Failed to export payments. Please try again.");
        } finally {
            setLoadingPayments(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Export Data</h1>
                <p className="text-muted-foreground">Export students and payments in CSV.</p>
            </div>

            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
                    {errorMessage}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Students</CardTitle>
                    <CardDescription>Filter by name, registration number, or email.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                        <div className="space-y-2">
                            <Label htmlFor="student-search">Search</Label>
                            <Input
                                id="student-search"
                                placeholder="Search students..."
                                value={studentQuery}
                                onChange={(event) => setStudentQuery(event.target.value)}
                            />
                        </div>
                        <Button variant="outline" onClick={exportStudents} disabled={loadingStudents}>
                            Export CSV
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Export generates a file from the server using the filters above.
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payments</CardTitle>
                    <CardDescription>Filter by search or date range before exporting.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
                        <div className="space-y-2">
                            <Label htmlFor="payments-search">Search</Label>
                            <Input
                                id="payments-search"
                                placeholder="Search by reg no, payment id..."
                                value={paymentsQuery}
                                onChange={(event) => setPaymentsQuery(event.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payments-from">From</Label>
                            <Input
                                id="payments-from"
                                type="date"
                                value={paymentsFrom}
                                onChange={(event) => setPaymentsFrom(event.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payments-to">To</Label>
                            <Input
                                id="payments-to"
                                type="date"
                                value={paymentsTo}
                                onChange={(event) => setPaymentsTo(event.target.value)}
                            />
                        </div>
                        <Button variant="outline" onClick={exportPayments} disabled={loadingPayments}>
                            Export CSV
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Export generates a file from the server using the filters above.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
