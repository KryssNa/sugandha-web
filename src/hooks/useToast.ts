
"use client";

import Swal from "sweetalert2";

const useToast = () => {
    interface SweetAlertOptions {
        type: "success" | "error" | "warning" | "info" | "question";
        message: string;
    }

    const creteAlert = (type: SweetAlertOptions["type"], message: SweetAlertOptions["message"]) => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast: HTMLElement) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            },
        });
        Toast.fire({
            customClass: {
                popup: "z-xxxl",
            },
            icon: type,
            title: message,
        });
    };
    return creteAlert;
};

export default useToast;
