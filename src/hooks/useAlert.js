// hooks/useAlert.js
import { useCallback } from 'react';
import Swal from 'sweetalert2';

export const useAlert = () => {
  // Success alert
  const showSuccess = useCallback((message, options = {}) => {
    return Swal.fire({
      icon: 'success',
      title: options.title || 'Success!',
      text: message,
      confirmButtonColor: '#3b82f6',
      timer: options.timer || 2000,
      showConfirmButton: options.showConfirmButton ?? true,
      ...options,
    });
  }, []);

  // Error alert
  const showError = useCallback((message, options = {}) => {
    return Swal.fire({
      icon: 'error',
      title: options.title || 'Error!',
      text: message,
      confirmButtonColor: '#ef4444',
      ...options,
    });
  }, []);

  // Warning alert
  const showWarning = useCallback((message, options = {}) => {
    return Swal.fire({
      icon: 'warning',
      title: options.title || 'Warning!',
      text: message,
      confirmButtonColor: '#f59e0b',
      ...options,
    });
  }, []);

  // Info alert
  const showInfo = useCallback((message, options = {}) => {
    return Swal.fire({
      icon: 'info',
      title: options.title || 'Info',
      text: message,
      confirmButtonColor: '#3b82f6',
      ...options,
    });
  }, []);

  // Confirmation dialog
  const showConfirm = useCallback((message, options = {}) => {
    return Swal.fire({
      title: options.title || 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: options.confirmText || 'Yes',
      cancelButtonText: options.cancelText || 'Cancel',
      ...options,
    });
  }, []);

  // Loading alert
  const showLoading = useCallback((message = 'Please wait...') => {
    return Swal.fire({
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }, []);

  // Close alert
  const closeAlert = useCallback(() => {
    Swal.close();
  }, []);

  // Toast notification (small popup)
  const showToast = useCallback((message, type = 'success', options = {}) => {
    const Toast = Swal.mixin({
      toast: true,
      position: options.position || 'top-end',
      showConfirmButton: false,
      timer: options.timer || 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    return Toast.fire({
      icon: type,
      title: message,
      ...options,
    });
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    showLoading,
    closeAlert,
    showToast,
  };
};