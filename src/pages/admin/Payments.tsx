import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { fetchAdminPayments, fetchViewPayment, type PaymentListItem, type ViewPaymentDetail } from "@/lib/admin-api";

export const PaymentsPage = () => {
    const [payments, setPayments] = useState<PaymentListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewReference, setViewReference] = useState<string | null>(null);
    const [viewDetail, setViewDetail] = useState<ViewPaymentDetail | null>(null);
    const [viewLoading, setViewLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetchAdminPayments()
            .then((data) => {
                if (!cancelled) setPayments(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!cancelled) setPayments([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (!viewReference) {
            setViewDetail(null);
            return;
        }
        setViewLoading(true);
        setViewDetail(null);
        fetchViewPayment(viewReference)
            .then((data) => setViewDetail(data))
            .catch(() => setViewDetail(null))
            .finally(() => setViewLoading(false));
    }, [viewReference]);

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
        } catch {
            return dateStr;
        }
    };

    return (
        <>
            <Table>
                <TableCaption>A list of recent payments.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Reg. No</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Sponsored</TableHead>
                        <TableHead className="text-right">Amount (NGN)</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                            </TableCell>
                        </TableRow>
                    ) : payments.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                No payments found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        payments.map((p) => (
                            <TableRow key={p.reference}>
                                <TableCell className="font-medium">{p.reg_no}</TableCell>
                                <TableCell className="font-mono text-xs">{p.reference}</TableCell>
                                <TableCell>{p.purpose}</TableCell>
                                <TableCell>{formatDate(p.date)}</TableCell>
                                <TableCell>{p.sponsored ? "Yes" : "No"}</TableCell>
                                <TableCell className="text-right">{p.amount.toLocaleString("en-NG")}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm" onClick={() => setViewReference(p.reference)}>
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>Total (NGN)</TableCell>
                        <TableCell className="text-right">
                            {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString("en-NG")}
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableFooter>
            </Table>

            <Dialog open={viewReference !== null} onOpenChange={(open) => !open && setViewReference(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Payment details</DialogTitle>
                    </DialogHeader>
                    {viewLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : viewDetail ? (
                        <dl className="grid gap-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Reference</dt>
                                <dd className="font-mono">{viewDetail.payment_reference}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Receipt No</dt>
                                <dd>{viewDetail.receipt_no}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Student Reg.</dt>
                                <dd>{viewDetail.student_reg}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Amount (NGN)</dt>
                                <dd className="font-medium">{viewDetail.amount.toLocaleString("en-NG")}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Paid for</dt>
                                <dd>{viewDetail.paid_for}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Date paid</dt>
                                <dd>{formatDate(viewDetail.date_paid)}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Medium</dt>
                                <dd>{viewDetail.medium}</dd>
                            </div>
                        </dl>
                    ) : viewReference && !viewLoading ? (
                        <p className="text-muted-foreground py-4">Could not load payment details.</p>
                    ) : null}
                </DialogContent>
            </Dialog>
        </>
    );
};
