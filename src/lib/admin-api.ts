import { api } from "@/lib/api";
import type { AdminActivity, AdminResource } from "@/lib/types";
import { AxiosRequestConfig } from "axios";

export type PaymentListItem = {
    amount: number;
    date: string;
    purpose: string;
    reference: string;
    reg_no: string;
    sponsored: boolean;
};

export type ViewPaymentDetail = {
    amount: number;
    date_paid: string;
    medium: string;
    paid_for: string;
    payment_reference: string;
    receipt_no: string;
    student_reg: string;
};

export const fetchAdminPayments = async (params?: {
    from?: string;
    to?: string;
    search?: string;
}) => {
    const response = await api.get("/payments", { params });
    return (response.data?.payments ?? response.data ?? []) as PaymentListItem[];
};

export const fetchViewPayment = async (reference: string) => {
    const response = await api.get("/view-payment", { params: { reference } });
    return response.data as ViewPaymentDetail;
};

export type Review = {
    comment: string;
    created_at: string;
    paper: string;
    rating: number;
};

export const fetchReviews = async (paper: string, diet: string) => {
    const response = await api.get("/reviews", { params: { paper, diet } });
    return (response.data ?? []) as Review[];
};

export const fetchAdminActivities = async (params?: {
    from?: string;
    to?: string;
    type?: string;
}) => {
    const response = await api.get("/staff-activities", { params });
    return (response.data?.activities ?? response.data ?? []) as AdminActivity[];
};

export type CourseTemplatePayload = {
    title: string;
    template: Record<string, unknown>;
};

export const fetchCourseTemplates = async (...params: Parameters<AxiosRequestConfig['params']>) => {
    const response = await api.get("/course-templates", { params });
    return (response.data ?? null) as CourseTemplatePayload[] | null;
};

export const saveCourseTemplates = async (payload: CourseTemplatePayload) => {
    await api.post("/create-template", payload);
};

export const fetchAdminResources = async () => {
    const response = await api.get("/resources");
    return (response.data?.resources ?? response.data ?? []) as AdminResource[];
};

export const uploadAdminResources = async (formData: FormData) => {
    const response = await api.post("/resources", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

export const deleteAdminResource = async (resourceId: string) => {
    await api.delete(`/resources/${resourceId}`);
};

/**
 * Admin dashboard metrics
 */
export type AdminMetric = {
    id: string;
    title: string;
    value: number;
    change?: string;
    changeType?: "positive" | "negative";
};

export const fetchAdminMetrics = async (): Promise<AdminMetric[]> => {
    // Fetch core datasets in parallel using existing endpoints
    const [studentsResponse, coursesResponse, payments, activities] = await Promise.all([
        api.get("/list-students", { params: { criteria: "all" } }),
        api.get("/courses", { params: { reg: false, user_status: "staff" } }),
        fetchAdminPayments(),
        fetchAdminActivities(),
    ]);

    const students = Array.isArray(studentsResponse.data)
        ? studentsResponse.data
        : (studentsResponse.data?.students ?? []);

    const courses = Array.isArray(coursesResponse.data)
        ? coursesResponse.data
        : (coursesResponse.data?.courses ?? []);

    const totalStudents = students.length;
    const activeCourses = courses.length;

    const uniqueInstructors = new Set(
        activities
            .map((activity) => activity.actor)
            .filter((actor) => typeof actor === "string" && actor.trim().length > 0)
    );
    const activeInstructors = uniqueInstructors.size;

    // Compute revenue over the last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const monthlyRevenue = payments.reduce((sum, payment) => {
        const date = new Date(payment.date);
        if (Number.isNaN(date.getTime())) return sum;
        if (date >= thirtyDaysAgo && date <= now) {
            return sum + payment.amount;
        }
        return sum;
    }, 0);

    const metrics: AdminMetric[] = [
        {
            id: "total_students",
            title: "Total Students",
            value: totalStudents,
            change: "All-time total",
            changeType: "positive",
        },
        {
            id: "active_courses",
            title: "Active Courses",
            value: activeCourses,
            change: "All-time active courses",
            changeType: "positive",
        },
        {
            id: "active_instructors",
            title: "Active Instructors",
            value: activeInstructors,
            change: "Distinct instructors with recorded activity",
            changeType: "positive",
        },
        {
            id: "monthly_revenue",
            title: "Monthly Revenue",
            value: monthlyRevenue,
            change: "Revenue from the last 30 days",
            changeType: "positive",
        },
    ];

    return metrics;
};
