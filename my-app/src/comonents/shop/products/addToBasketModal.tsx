import { useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  show: boolean;
  onClose: () => void;
}

const AddToBasketModal: React.FC<Props> = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        onClose();
      }, 1600);
    }
  }, [show, onClose]);

  const modal = (
    <div
      className={`modal fade ${show ? "show" : ""}` }
      tabIndex={-1}
      role="dialog"
      style={{ display: show ? "block" : "none", padding: 10,
      width: 200, position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)" 
      }}
    
    >
      <div className="modal-dialog modal-dialog-centered" role="document" >
        <div className="modal-content" >
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">Added</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body  ms-2 mb-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png"
              width={100}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default AddToBasketModal;
