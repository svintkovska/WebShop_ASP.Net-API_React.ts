import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import http from "../../../http";
import SuccessMessage from "../../common/SuccessMessage";
import { setImage } from "../AuthReducer";
import { IAuthUser } from "../types";


interface IProfileEdit {
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    currentImg: string;
    uploadImage: File | null;
    }


const EditProfile = () =>{
    const navigator = useNavigate();
    const {email} = useSelector((store: any) => store.auth as IAuthUser);
    const dispatch = useDispatch();
    const [successMessage, setSuccessMessage] = useState<boolean>(false);


    const [state, setState] = useState<IProfileEdit>({
        email: "",
        firstName: "",
        lastName: "",
        userName: "",
        currentImg: "",
        uploadImage: null
    });

    useEffect(() => {
        http
          .get<IProfileEdit>(`api/Account/edit/${email}`)
          .then((resp) => {
            setState(resp.data);
          });
      }, []);

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) =>{
        setState({...state, [e.target.name]: e.target.value});
    }

    const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const {target} = e;
      const {files} = target;

      console.log ("Show data", files);
      if(files){
        const file = files[0];
        setState({...state, uploadImage: file});
      }
      target.value = "";
    }

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
          const result = await http
          .put("api/Account", state, {
            headers: {"Content-Type": "multipart/form-data"}
          }).then(resp => {          
            localStorage.setItem("imagePath", resp.data);
            dispatch(setImage(resp.data));
            setSuccessMessage(true);
          })
        }
        catch(error: any){
          console.log ("error:", error);
        }
        console.log ("Data sent", state);     
    }

    return (
        <>
        <div className="container col-6 offset-3">
          <h1 className="mt-5 mb-4 text-center">Update Profile</h1>
          {successMessage && (
        <SuccessMessage message="Changes saved" />
      )}
          <div className="text-center">
          <Link to="/account/editProfile/changePassword">
                <button className="btn btn-outline-primary">Change Password</button>
          </Link>
          </div>

          <form onSubmit={onSubmitHandler}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={state.firstName}
                onChange={onChangeInputHandler}
                placeholder="Enter First Name"
                required
              />
              <div className="invalid-feedback">Please enter a valid first name.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={state.lastName}
                onChange={onChangeInputHandler}
                placeholder="Enter Last Name"
                required
              />
              <div className="invalid-feedback">Please enter a valid last name.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="userName" className="form-label">
                User Name
              </label>
              <input
                type="text"
                className="form-control"
                name="userName"
                value={state.userName}
                onChange={onChangeInputHandler}
                placeholder="Enter User Name"
                required
              />
              <div className="invalid-feedback">Please enter a valid user name.</div>
            </div>


            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                <img src={(state.uploadImage == null ? "http://localhost:5285/images/" + "300_"+ state.currentImg :  URL.createObjectURL(state.uploadImage))} 
                alt="select img" 
                width="150px" 
                style={{cursor: "pointer"}}/>
              </label>
              <input
                type="file"
                className="d-none"
                name="image"
                id="image"
                onChange={onFileChangeHandler}              
              />          
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-success mb-5">
                Update Profile
              </button>
            </div>
          </form>
          
        </div>
      </>

    );

}


export default EditProfile;