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
      }, 2000);
    }
  }, [show, onClose]);

  const modal = (
    <div className={`modal fade ${show ? "show" : ""}`} tabIndex={-1} role="dialog" style={{ display: show ? "block" : "none" }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">Item added to cart</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="text-center"><i className="fas fa-check-circle text-success me-2"></i>Your item has been successfully added to the cart.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default AddToBasketModal;