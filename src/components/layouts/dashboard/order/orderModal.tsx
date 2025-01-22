import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Truck, X } from 'lucide-react';

const OrderModal = ({ selectedOrder, setSelectedOrder }) => {
    if (!selectedOrder) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setSelectedOrder(null)}
            />
            <motion.div
                layoutId={`order-${selectedOrder.id}`}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-full max-w-3xl bg-white rounded-xl shadow-xl z-50 overflow-y-auto max-h-[90vh]"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Order #{selectedOrder.orderNumber}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Placed on {new Date(selectedOrder.date).toLocaleDateString()}
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(null);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {selectedOrder.tracking && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
                            <div className="relative">
                                <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200" />
                                <div className="space-y-6">
                                    {selectedOrder.tracking.updates.map((update, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center 
                        ${index === 0 ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>
                                                {index === 0 ? <Truck className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{update.status}</p>
                                                <p className="text-sm text-gray-500">{update.location}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(update.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rest of the modal content remains the same */}

                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OrderModal;