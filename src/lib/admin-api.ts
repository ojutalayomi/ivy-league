import { api } from "@/lib/api";
import type { AdminActivity, AdminPayment, AdminResource, AdminTemplateNode } from "@/lib/types";

export const fetchAdminPayments = async (params?: {
    from?: string;
    to?: string;
    search?: string;
}) => {
    const response = await api.get("/admin/payments", { params });
    return (response.data?.payments ?? response.data ?? []) as AdminPayment[];
};

export const fetchAdminActivities = async (params?: {
    from?: string;
    to?: string;
    type?: string;
}) => {
    const response = await api.get("/admin/activities", { params });
    return (response.data?.activities ?? response.data ?? []) as AdminActivity[];
};

export const fetchCourseTemplates = async () => {
    const response = await api.get("/admin/course-templates");
    return (response.data?.nodes ?? response.data ?? []) as AdminTemplateNode[];
};

export const saveCourseTemplates = async (nodes: AdminTemplateNode[]) => {
    await api.put("/admin/course-templates", { nodes });
};

export const fetchAdminResources = async () => {
    const response = await api.get("/admin/resources");
    return (response.data?.resources ?? response.data ?? []) as AdminResource[];
};

export const uploadAdminResources = async (formData: FormData) => {
    const response = await api.post("/admin/resources", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

export const deleteAdminResource = async (resourceId: string) => {
    await api.delete(`/admin/resources/${resourceId}`);
};
