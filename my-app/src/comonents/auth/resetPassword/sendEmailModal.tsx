import { ChangeEvent, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import http from "../../../http";
import { useTranslation } from 'react-i18next';

interface MyModalProps {
    showModal: boolean;
    handleModal: () => void;
  }

  interface IEmail{
    email: string;
  }
const SendEmailModal = ({ showModal, handleModal }: MyModalProps) => {
  const { t } = useTranslation();
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
          setErrorMessage(t('auth.enterEmail'));
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
            setErrorMessage(t('auth.enterEmail'));
          }
          console.log ("Data sent", state); 
      };


    return (
      <>
        <Modal show={showModal} onHide={handleModal} style={{marginTop:"200px"}}>
        {successMessage && (
            <div className="alert alert-success" role="alert">
             {t('messages.resetLinkSent')}       
            </div>
          )}
          {!successMessage && errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
          <Modal.Header closeButton>
            <Modal.Title style={{color: "#e8baba"}}>{t('auth.enterEmail')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="mb-3">
              <label htmlFor="email" className="form-label" style={{color: "#e8baba"}}>
              {t('auth.email')}
              </label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={state.email}
                onChange={onChangeInputHandler}
                placeholder={t('auth.enterEmail')}
                required
              />
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button className="back-btn" style={{padding: "10px", width: "100px", marginTop: "0" }} onClick={handleModal}>
            {t('auth.close')}
            </Button>
            <Button className="cart-btn" style={{width: "200px",  marginTop: "0"}} onClick={sendEmail}>
            {t('auth.sendEmail')}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default SendEmailModal;