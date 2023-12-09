import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import http from "../../../../http";
import SuccessMessage from "../../../common/SuccessMessage";


interface ICategoryEdit {
    id: number;
    name: string;
    description: string;
    currentImg: string;
    uploadImage: File | null;
    }


const EditCategoryPage = () =>{
    const navigator = useNavigate();
    const [successMessage, setSuccessMessage] = useState<boolean>(false);

    const { categoryId } = useParams();
    let catIdNumber = -1;
    if(categoryId)
    {
      catIdNumber = parseInt(categoryId, 10);
    }
    console.log(catIdNumber);

    const [state, setState] = useState<ICategoryEdit>({
        id: catIdNumber,
        name: "",
        description: "",
        currentImg: "",
        uploadImage: null
    });
    
    useEffect(() => {
        http
          .get<ICategoryEdit>(`api/Categories/edit/${catIdNumber}`)
          .then((resp) => {
            setState(resp.data);
          });
      }, []);

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) =>{
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
        console.log(state);

        try{
          const result = await http
          .put("api/Categories", state, {
            headers: {"Content-Type": "multipart/form-data"}
          });
          setSuccessMessage(true);
        setTimeout(() => {
          navigator("/admin/categories/list");
          }, 1000);
        }
        catch(error: any){
          console.log ("error:", error);
        }
        console.log ("Data sent", state);     
    }

    return (
        <>
        <div className="cotainer vh-100 d-flex flex-column justify-content-start align-items-center">
          <h1 className="mt-5 mb-4 text-center text-info">Edit Category</h1>
          {successMessage && (
        <SuccessMessage message="Succesufully changed" />
      )}
    
          <form onSubmit={onSubmitHandler} className="border border-info pb-2 pt-5 ps-5 pe-5 bg-light rounded"
            style={{ width: 500 }}>
            <div className="mb-3 text-info">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={state.name}
                onChange={onChangeInputHandler}
                placeholder="Enter Name"
                required
              />
              <div className="invalid-feedback">Please enter a valid name.</div>
            </div>

            <div className="mb-3 text-info">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                name="description"
                rows={3}
                value={state.description}
                onChange={onChangeInputHandler}
                placeholder="Enter Description"
              ></textarea>
              <div className="invalid-feedback">
                Please enter a valid description.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                <img src={(state.uploadImage == null ? "http://localhost:5285/images/" + "300_" +state.currentImg :  URL.createObjectURL(state.uploadImage))} 
                alt="select img" 
                style={{cursor: "pointer", objectFit: 'contain', height: '150px', width: '150px'}}/>
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
              <button type="submit" className="btn btn-outline-info mb-2">
                Edit Category
              </button>
            </div>
          </form>
          <Link to="/admin/categories/list">
                <button className="btn btn-info mt-5">Go Back to Categories</button>
          </Link>
        </div>
      </>

    );

}


export default EditCategoryPage;