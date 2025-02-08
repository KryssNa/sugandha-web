import { api } from "@/lib/axios";
import Cookies from "js-cookie";

export const fetchCSRFToken = async () => {
    const response = await api.get('/auth/csrf-token');
    const { csrfToken } = response.data;

    Cookies.set('csrfToken', csrfToken, {
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    });
};
