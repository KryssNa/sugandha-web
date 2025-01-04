// import Swal from "sweetalert2";

// const Toast = Swal.mixin({
//     toast: true,
//     position: "top-end",
//     showConfirmButton: false,
//     timer: 3000,
//     timerProgressBar: true,
//     didOpen: (toast) => {
//       toast.onmouseenter = Swal.stopTimer;
//       toast.onmouseleave = Swal.resumeTimer;
//     }
//   });
//   Toast.fire({
//     icon: "success",
//     title: "Signed in successfully"
//   });

"use client";

import Swal from "sweetalert2";

const useSweetAlert = () => {
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

export default useSweetAlert;
