import Swal from "sweetalert2";

export const showToast = (type: "success" | "error" | "warning" | "info", message: string) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  Toast.fire({
    customClass: {
      popup: "z-xxxl",
    },
    icon: type,
    title: message
  });
};

export const confirmAction = async (title: string, text: string, confirmButtonText: string) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText,
    cancelButtonText: 'Cancel'
  });

  return result.isConfirmed;
};