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
          <div className="modal-body">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9460/9460264.png"
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
