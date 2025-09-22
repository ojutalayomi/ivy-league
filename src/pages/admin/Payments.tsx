import { papers } from "@/lib/data";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const PaymentsPage = () => {

    const getRandomCourses = () => {
        const shuffled = papers.map(c => `${c.name}(${c.code})`).slice(0,5).sort(() => 0.8 - Math.random());
        return shuffled.slice(0, Math.floor(Math.random() * papers.length) + 1);
    };

    const invoices = [
        {
            registrationNumber: "2024001",
            paymentId: "SNZw8VEPWdp6PZQM",
            totalAmount: 20000,
            registeredCourses: getRandomCourses(),
        },
        {
            registrationNumber: "2024005",
            paymentId: "BtNSUZeXs7Lgfxpv",
            totalAmount: 20000,
            registeredCourses: getRandomCourses(),
        },
        {
            registrationNumber: "2024002",
            paymentId: "mHCUgMuAEia4HQaN",
            totalAmount: 20000,
            registeredCourses: getRandomCourses(),
        },
        {
            registrationNumber: "2024007",
            paymentId: "MSKR7rk0pDl2Giue",
            totalAmount: 20000,
            registeredCourses: getRandomCourses(),
        },
        {
            registrationNumber: "2024008",
            paymentId: "KYAOGzlPn7ps4c7c",
            totalAmount: 20000,
            registeredCourses: getRandomCourses(),
        }
    ];

    return (
        <Table>
            <TableCaption>A list of recent payments.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Reg.No</TableHead>
                <TableHead>Papers/Courses</TableHead>
                <TableHead>Payment Id</TableHead>
                <TableHead className="text-right">Amount(NGN)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((invoice) => (
                    <TableRow key={invoice.registrationNumber}>
                        <TableCell className="font-medium">{invoice.registrationNumber}</TableCell>
                        <TableCell>{invoice.registeredCourses.join(", ")}</TableCell>
                        <TableCell>{invoice.paymentId}</TableCell>
                        <TableCell className="text-right">{invoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total(NGN)</TableCell>
                    <TableCell className="text-right">{invoices.reduce((total, invoice) => total + invoice.totalAmount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}