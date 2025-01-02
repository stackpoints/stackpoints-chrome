import { useState, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { FloatingMenuItems } from "./FloatingMenuItems";
import PropTypes from "prop-types";

const BUTTON_CLASSES = `
  w-14 h-14 
  bg-orange-400 hover:bg-orange-500 
  rounded-full 
  flex items-center justify-center 
  text-white 
  shadow-lg 
  transition-transform duration-200 
  hover:scale-110 
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-so-orange
`;

const ToggleIcon = ({ isOpen }) => (
  isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />
);

ToggleIcon.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="fixed bottom-6 right-6">
      {isOpen && <FloatingMenuItems onClose={handleClose} />}

      <button
        onClick={handleToggle}
        className={BUTTON_CLASSES}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <ToggleIcon isOpen={isOpen} />
      </button>
    </div>
  );
}

