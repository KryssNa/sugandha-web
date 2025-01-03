import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}
export const NavigationButton: React.FC<NavigationButtonProps> = ({
  direction,
  onClick,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`absolute top-1/2 transform -translate-y-1/2 
          ${direction === "left" ? "-left-4" : "-right-4"}
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "opacity-0 group-hover:opacity-100 cursor-pointer"
          }
          transition-all duration-300 ease-in-out
          bg-white rounded-full p-2 shadow-lg z-10`}
  >
    {direction === "left" ? (
      <ChevronLeft className='w-6 h-6 text-gray-800' />
    ) : (
      <ChevronRight className='w-6 h-6 text-gray-800' />
    )}
  </button>
);
