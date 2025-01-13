import { api } from "@/lib/axios";

export interface ContactFormData {
    type: ContactType;
    fullName: string;
    email: string;
    phone?: string;
    companyName?: string;
    position?: string;
    subject?: string;
    message: string;
    productDetails?: string;
    quantity?: number;
    orderNumber?: string;
    issueType?: string;
    partnershipType?: string;
    attachments?: File[];
}

export const ContactService = {
    submitContact: async (formData: ContactFormData) => {
        const form = new FormData();

        // Add all form fields
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && !(value instanceof File)) {
                form.append(key, value.toString());
            }
        });

        // Add attachments
        if (formData.attachments) {
            formData.attachments.forEach((file) => {
                form.append('attachments', file);
            });
        }

        return api.post('/contact', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    getAllContacts: async (params: {
        page?: number;
        limit?: number;
        status?: string;
        type?: string;
    }) => {
        return api.get('/contact', { params });
    },

    getContactById: async (id: string) => {
        return api.get(`/contact/${id}`);
    },

    updateContactStatus: async (
        id: string,
        data: {
            status: string;
            statusMessage?: string;
        }
    ) => {
        return api.patch(`/contact/${id}/status`, data);
    },
};

// types/contact.ts
export enum ContactType {
    GENERAL = 'general',
    QUOTATION = 'quotation',
    SUPPORT = 'support',
    PARTNERSHIP = 'partnership'

}

export interface Contact {
    _id: string;
    type: ContactType;
    fullName: string;
    email: string;
    phone?: string;
    companyName?: string;
    position?: string;
    subject?: string;
    message: string;
    productDetails?: string;
    quantity?: number;
    orderNumber?: string;
    issueType?: string;
    partnershipType?: string;
    attachments?: Array<{
        filename: string;
        path: string;
        mimetype: string;
    }>;
    status: 'pending' | 'inProgress' | 'resolved' | 'closed';
    createdAt: string;
    updatedAt: string;
    [key: string]: any; // Add this line to allow dynamic keys
}