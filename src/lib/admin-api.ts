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
    const response = await api.get("/activities", { params });
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
