import PropTypes from "prop-types"; 
import { Modal } from "../modal/Modal";
import { useState, useCallback, memo } from "react";

const initialModalState = {
  isOpen: false,
  url: '',
  title: '',
};

// Button component
const Button = memo(({ onClick, className, disabled, children }) => (
  <button 
    className={className}
    onClick={onClick}
    disabled={disabled}
    type="button"
    aria-haspopup="dialog"
  >
    {children}
  </button>
));

Button.displayName = 'Button';

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

// Main ModalButton component
function ModalButton({ 
  btnChildren, 
  frameUrl, 
  classes, 
  modalTitle, 
  disabled = false,
  onClick = null
}) {
  const [modalConfig, setModalConfig] = useState(initialModalState);

  const handleOpenModal = () => {
    setModalConfig({
      isOpen: true,
      url: frameUrl,
      title: modalTitle
    });

    //onClick?.();
   
  }

  const handleCloseModal = useCallback(() => {
    setModalConfig(prevConfig => ({
      ...prevConfig,
      isOpen: false,
    }));
  }, []);

  return (
    <div className="modal-button-container">
      <Button
        onClick={handleOpenModal}
        className={classes}
        disabled={disabled}
      >
        {btnChildren}
      </Button>

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={handleCloseModal}
        url={modalConfig.url}
        title={modalConfig.title}
      />
    </div>
  );
}

ModalButton.propTypes = {
  btnChildren: PropTypes.node.isRequired,
  frameUrl: PropTypes.string.isRequired,
  classes: PropTypes.string,
  modalTitle: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

ModalButton.defaultProps = {
  disabled: false,
  classes: '',
};

export default memo(ModalButton);
