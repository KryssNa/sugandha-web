import Swal from "sweetalert2";

export const showAlert = (title: string, text: string, icon: 'error' | 'success' | 'warning' | 'info') => {
    Swal.fire({
        title,
        text,
        icon,
        confirmButtonColor: '#9333ea',
        confirmButtonText: 'OK',
        customClass: {
            popup: 'rounded-lg',
            title: 'text-xl font-bold',
            confirmButton: 'rounded-lg text-white px-4 py-2'
        }
    });
};