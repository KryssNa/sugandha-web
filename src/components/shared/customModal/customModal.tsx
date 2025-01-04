import React, { createContext, useContext, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle } from 'lucide-react';

// Types
interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
}

interface ModalConfig {
  title?: React.ReactNode;
  content: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
  disableClickOutside?: boolean;
  onClose?: () => void;
  footerButtons?: React.ReactNode;
  contentClassName?: string;
  titleClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

interface ModalState extends ModalConfig {
  isOpen: boolean;
}

// Create Modal Context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Custom hook for using modal
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Modal Provider Component
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    content: null,
  });

  const showModal = useCallback((config: ModalConfig) => {
    setModalState({ ...config, isOpen: true });
  }, []);

  const hideModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    if (modalState.onClose) {
      modalState.onClose();
    }
  }, [modalState]);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <CustomModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        content={modalState.content}
        size={modalState.size}
        showClose={modalState.showClose}
        disableClickOutside={modalState.disableClickOutside}
        footerButtons={modalState.footerButtons}
        contentClassName={modalState.contentClassName}
        titleClassName={modalState.titleClassName}
        headerClassName={modalState.headerClassName}
        footerClassName={modalState.footerClassName}
      />
    </ModalContext.Provider>
  );
};

// Size configurations for the modal
const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[95vw] max-h-[95vh]'
};

// Modal Component
interface CustomModalProps extends ModalConfig {
  isOpen: boolean;
  onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  size = 'md',
  showClose = true,
  disableClickOutside = false,
  footerButtons,
  contentClassName = '',
  titleClassName = '',
  headerClassName = '',
  footerClassName = ''
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!disableClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`relative bg-white rounded-xl shadow-xl w-full 
              ${sizeClasses[size]} overflow-hidden`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className={`flex items-center justify-between p-4 border-b border-gray-200 ${headerClassName}`}>
                {title && (
                  <h2 className={`text-xl font-semibold text-gray-900 ${titleClassName}`}>
                    {title}
                  </h2>
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Close modal"
                  >
                    <XCircle className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={`p-4 ${contentClassName}`}>
              {content}
            </div>

            {/* Footer */}
            {footerButtons && (
              <div className={`flex justify-end gap-3 p-4 border-t border-gray-200 ${footerClassName}`}>
                {footerButtons}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Example usage:
// export const ExampleUsage: React.FC = () => {
//   const { showModal, hideModal } = useModal();

//   const handleOpenModal = () => {
//     showModal({
//       title: "Custom Modal Title",
//       content: (
//         <div className="space-y-4">
//           <p>This is the modal content.</p>
//           <p>You can put anything here!</p>
//         </div>
//       ),
//       size: "md",
//       footerButtons: (
//         <>
//           <button
//             onClick={hideModal}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => {
//               // Handle confirmation
//               hideModal();
//             }}
//             className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
//           >
//             Confirm
//           </button>
//         </>
//       ),
//     });
//   };

//   return (
//     <button
//       onClick={handleOpenModal}
//       className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
//     >
//       Open Modal
//     </button>
//   );
// };
