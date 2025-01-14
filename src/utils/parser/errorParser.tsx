// utils/errorParser.ts

interface ErrorItem {
    code?: string;
    field?: string;
    message: string;
  }
  
  interface APIError {
    errors?: ErrorItem[];
    message: string;
    status?: string;
    success: boolean;
  }
  
  /**
   * Formats a field name into a readable label
   * @param field - The field name from the API error
   */
  const formatFieldName = (field: string): string => {
    // Handle nested fields (e.g., orderData.items -> Items)
    const lastPart = field.split('.').pop() || field;
    
    // Convert camelCase to Title Case
    return lastPart
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };
  
  /**
   * Parses API error response and returns a formatted message for toast
   * @param error - The API error response
   * @returns { message: string } Formatted error message
   */
  export const parseError = (error: APIError): { message: string } => {
    // Default error message
    if (!error) {
      return { message: 'An unexpected error occurred. Please try again.' };
    }
  
    // If there's no errors array but there's a message, return simple error
    if (!error.errors?.length && error.message) {
      return { message: error.message };
    }
  
    // Handle validation errors
    if (error.errors?.length) {
      const errorMessages: string[] = [];
  
      error.errors.forEach(err => {
        if (err.field) {
          const fieldName = formatFieldName(err.field);
          errorMessages.push(`${fieldName}: ${err.message}`);
        } else if (err.message) {
          errorMessages.push(err.message);
        }
      });
  
      // For single error, return just the message
      if (errorMessages.length === 1) {
        return { message: errorMessages[0] };
      }
  
      // For multiple errors, return a formatted list
      const message = errorMessages.length > 2
        ? `${errorMessages[0]}\n(+${errorMessages.length - 1} more issues)`
        : errorMessages.join('\n');
  
      return { message };
    }
  
    return { message: error.message || 'An unexpected error occurred' };
  };
  
  /**
   * Hook to handle API errors and display them in toast
   * @param useToast - The custom toast hook
   */
  export const useErrorHandler = (createAlert: Function) => {
    const showError = (error: APIError) => {
      const { message } = parseError(error);
      createAlert("error", message);
      return { message };
    };
  
    return { showError };
  };
  
  // Usage example:
  /*
  import useToast from '@/hooks/useToast';
  import { useErrorHandler } from '@/utils/errorParser';
  
  const YourComponent = () => {
    const createAlert = useToast();
    const { showError } = useErrorHandler(createAlert);
  
    const handleSubmit = async () => {
      try {
        // API call
        await submitData();
      } catch (error) {
        showError(error);
      }
    };
  
    return (
      // Your component JSX
    );
  };
  */