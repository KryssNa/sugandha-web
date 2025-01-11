// components/admin/orders/StatusUpdateModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, CheckCircle, Clock } from 'lucide-react';
import { Order } from './OrderManagement';

interface StatusUpdateModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Order['status']) => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  order,
  onClose,
  onUpdateStatus,
}) => {
  const statuses: { value: Order['status']; label: string; icon: React.ReactNode }[] = [
    {
      value: 'pending',
      label: 'Pending',
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
    },
    {
      value: 'processing',
      label: 'Processing',
      icon: <Clock className="w-5 h-5 text-blue-500" />,
    },
    {
      value: 'completed',
      label: 'Completed',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
    },
  ];

  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Update Order Status
                </h3>
                <div className="space-y-4">
                  {statuses.map((status) => (
                    <motion.button
                      key={status.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onUpdateStatus(order.id, status.value);
                        onClose();
                      }}
                      className={`w-full flex items-center p-4 rounded-lg border 
                        ${order.status === status.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                        } transition-colors`}
                    >
                      <div className="flex-shrink-0">{status.icon}</div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {status.label}
                        </p>
                      </div>
                      {order.status === status.value && (
                        <div className="ml-auto">
                          <div className="h-2 w-2 bg-orange-500 rounded-full" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 
                    transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StatusUpdateModal;