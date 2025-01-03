import { Clock, CreditCard, Shield, Truck } from "lucide-react";
import { motion } from "framer-motion";

// components/checkout/TrustBadges.jsx
export const TrustBadges = () => {
    const badges = [
      { icon: <Shield />, text: "Secure Payment" },
      { icon: <Truck />, text: "Free Shipping" },
      { icon: <Clock />, text: "24/7 Support" },
      { icon: <CreditCard />, text: "Multiple Options" },
    ];
  
    return (
      <div className="grid grid-cols-2 gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.text}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center p-4 bg-gradient-to-b from-gray-50 to-white rounded-lg
              border border-gray-100 shadow-sm"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <div className="w-5 h-5 text-orange-500">{badge.icon}</div>
            </div>
            <span className="text-sm text-gray-600 text-center font-medium">{badge.text}</span>
          </motion.div>
        ))}
      </div>
    );
  };
  