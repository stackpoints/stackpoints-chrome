import { useEffect } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";

// Separate component for the modal header
const ModalHeader = ({ title, onClose }) => (
  <div className="flex items-center justify-between p-4 border-b-4 border-so-orange">
    <h2 className="text-lg font-semibold text-so-black">{title}</h2>
    <CloseButton onClose={onClose} />
  </div>
);

// Separate component for the close button
const CloseButton = ({ onClose }) => (
  <button
    onClick={onClose}
    className="p-1 hover:bg-so-gray-100 rounded-full transition-colors duration-150"
    aria-label="Close modal"
  >
    <X className="w-5 h-5 text-so-gray-500" />
  </button>
);

// Separate component for the iframe content
const ModalContent = ({ url }) => (
  <div className="relative w-full h-[60vh]">
    <iframe
      src={url}
      className="absolute inset-0 w-full h-full rounded-b-lg"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Modal content"
    />
  </div>
);

// Custom hook for managing body overflow
const useBodyOverflow = (isOpen) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);
};

export function Modal({ isOpen, onClose, url, title }) {
  useBodyOverflow(isOpen);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-white" 
        onClick={onClose} 
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
          <ModalHeader title={title} onClose={onClose} />
          <ModalContent url={url} />
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

ModalHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

CloseButton.propTypes = {
  onClose: PropTypes.func.isRequired
};

ModalContent.propTypes = {
  url: PropTypes.string.isRequired
};