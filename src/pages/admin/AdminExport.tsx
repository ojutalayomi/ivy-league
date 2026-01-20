import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminPayment } from "@/lib/types";
import type { UserState } from "@/redux/userSlice";

const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
};

const toCsv = (rows: Array<Record<string, string | number | null>>) => {
    if (!rows.length) return "";
    const headers = Object.keys(rows[0]);
    const escape = (value: string | number | null) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;
    const lines = [
        headers.join(","),
        ...rows.map((row) => headers.map((key) => escape(row[key])).join(","))
    ];
    return lines.join("\n");
};

export default function AdminExport() {
    const [students, setStudents] = useState<UserState[]>([]);
    const [payments, setPayments] = useState<AdminPayment[]>([]);
    const [studentQuery, setStudentQuery] = useState("");
    const [paymentsFrom, setPaymentsFrom] = useState("");
    const [paymentsTo, setPaymentsTo] = useState("");
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [loadingPayments, setLoadingPayments] = useState(false);

    useEffect(() => {
        document.title = "Export Data - Ivy League Associates";
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoadingStudents(true);
                const response = await api.get("/list-students?criteria=all");
                const data = response.data ?? [];
                const mapped: UserState[] = data.map((item: UserState) => ({
                    title: item.title,
                    firstname: item.firstname,
                    lastname: item.lastname,
                    profile_pic: item.profile_pic,
                    email: item.email,
                    reg_no: item.reg_no,
                    gender: item.gender,
                    user_status: item.user_status,
                    acca_reg: item.acca_reg,
                    dob: item.dob,
                    phone_no: item.phone_no,
                    address: item.address,
                    signed_in: item.signed_in,
                    email_verified: item.email_verified,
                    fee: item.fee ?? [],
                    scholarship: item.scholarship ?? [],
                    papers: item.papers ?? []
                }));
                setStudents(mapped);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setLoadingStudents(false);
            }
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoadingPayments(true);
                const response = await api.get("/admin/payments");
                const data = response.data?.payments ?? response.data ?? [];
                setPayments(data as AdminPayment[]);
            } catch (error) {
                console.error("Failed to fetch payments:", error);
            } finally {
                setLoadingPayments(false);
            }
        };
        fetchPayments();
    }, []);

    const filteredStudents = useMemo(() => {
        if (!studentQuery) return students;
        const query = studentQuery.toLowerCase();
        return students.filter((student) => {
            return (
                (student.firstname || "").toLowerCase().includes(query) ||
                (student.lastname || "").toLowerCase().includes(query) ||
                (student.email || "").toLowerCase().includes(query) ||
                (student.reg_no || "").toLowerCase().includes(query)
            );
        });
    }, [students, studentQuery]);

    const filteredPayments = useMemo(() => {
        if (!paymentsFrom && !paymentsTo) return payments;
        const from = paymentsFrom ? new Date(paymentsFrom) : null;
        const to = paymentsTo ? new Date(paymentsTo) : null;
        return payments.filter((payment) => {
            const paidAt = payment.paid_at ? new Date(payment.paid_at) : null;
            if (!paidAt) return false;
            if (from && paidAt < from) return false;
            if (to) {
                const endOfDay = new Date(to);
                endOfDay.setHours(23, 59, 59, 999);
                if (paidAt > endOfDay) return false;
            }
            return true;
        });
    }, [payments, paymentsFrom, paymentsTo]);

    const exportStudents = () => {
        const rows = filteredStudents.map((student) => ({
            RegistrationNo: student.reg_no,
            Name: `${student.firstname || ""} ${student.lastname || ""}`.trim(),
            Email: student.email,
            Gender: student.gender,
            Status: student.user_status,
            Papers: student.papers?.map((paper) => Object.values(paper).join(" ")).join("; ")
        }));
        const csv = toCsv(rows);
        downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), "students-export.csv");
    };

    const exportPayments = () => {
        const rows = filteredPayments.map((payment) => ({
            PaymentId: payment.id,
            RegistrationNo: payment.reg_no,
            Amount: payment.amount,
            Currency: payment.currency,
            PaidAt: payment.paid_at,
            Courses: payment.courses?.join("; ") ?? ""
        }));
        const csv = toCsv(rows);
        downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), "payments-export.csv");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Export Data</h1>
                <p className="text-muted-foreground">Export students and payments in CSV.</p>
            </div>

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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reg. No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.slice(0, 5).map((student) => (
                                <TableRow key={student.reg_no}>
                                    <TableCell className="font-mono">{student.reg_no}</TableCell>
                                    <TableCell>{student.firstname} {student.lastname}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>{student.user_status || "N/A"}</TableCell>
                                </TableRow>
                            ))}
                            {!loadingStudents && filteredStudents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No students found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payments</CardTitle>
                    <CardDescription>Filter by date range before exporting.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Payment ID</TableHead>
                                <TableHead>Reg. No</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Paid At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPayments.slice(0, 5).map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-mono">{payment.id}</TableCell>
                                    <TableCell>{payment.reg_no}</TableCell>
                                    <TableCell>{formatCurrency(payment.amount, payment.currency || "NGN")}</TableCell>
                                    <TableCell>{payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : "N/A"}</TableCell>
                                </TableRow>
                            ))}
                            {!loadingPayments && filteredPayments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No payments found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
