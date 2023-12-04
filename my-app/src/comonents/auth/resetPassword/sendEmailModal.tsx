import { ChangeEvent, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import http from "../../../http";

interface MyModalProps {
    showModal: boolean;
    handleModal: () => void;
  }

  interface IEmail{
    email: string;
  }
const SendEmailModal = ({ showModal, handleModal }: MyModalProps) => {
   
    const [state, setState] = useState<IEmail>({
        email: "",
      });
      const [errorMessage, setErrorMessage] = useState<string>("");
      const [successMessage, setSuccessMessage] = useState<boolean>(false);


      const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value });
      };

      const sendEmail = async () => {

        if(state.email == '')
        {
          setErrorMessage("Enter email");
          return;
        }
        try{
            const result = await http
            .post("api/account/forgotPassword", state).then(resp =>{
              setSuccessMessage(true);
            });
          }
          catch(error: any){
            console.log ("error:", error);
            setErrorMessage("Enter your email!");
          }
          console.log ("Data sent", state); 
      };


    return (
      <>
        <Modal show={showModal} onHide={handleModal} style={{marginTop:"200px"}}>
        {successMessage && (
            <div className="alert alert-success" role="alert">
             Email with the password reset link has been successfully sent            
            </div>
          )}
          {!successMessage && errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
          <Modal.Header closeButton>
            <Modal.Title style={{color: "#e8baba"}}>Enter your email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="mb-3">
              <label htmlFor="email" className="form-label" style={{color: "#e8baba"}}>
                Email
              </label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={state.email}
                onChange={onChangeInputHandler}
                placeholder="Enter Email"
                required
              />
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button className="back-btn" style={{padding: "10px", width: "100px", marginTop: "0" }} onClick={handleModal}>
              Close
            </Button>
            <Button className="cart-btn" style={{width: "200px",  marginTop: "0"}} onClick={sendEmail}>
              Send Email
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default SendEmailModal;