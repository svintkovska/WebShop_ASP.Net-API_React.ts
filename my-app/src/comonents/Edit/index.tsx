import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


interface ICategoryEdit {
    id: number;
    name: string;
    description: string;
    currentImg: string;
    uploadImage: File | null;
    }


const EditPage = () =>{
    const navigator = useNavigate();

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
        axios
          .get<ICategoryEdit>(`http://localhost:5285/api/Categories/edit/${catIdNumber}`)
          .then((resp) => {
            console.log("response - ", resp);
            setState(resp.data);
          });
      }, []);

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) =>{
        setState({...state, [e.target.name]: e.target.value});

    }

    const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const {target} = e;
      const {files} = target;
      //e.target.files

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
          const result = await axios
          .put(`http://localhost:5285/api/Categories`, state, {
            headers: {"Content-Type": "multipart/form-data"}
          });
          navigator("/");
        }
        catch(error: any){
          console.log ("error:", error);
        }
        console.log ("Data sent", state);

        
    }

    return (
        <>
        <div className="container col-6 offset-3">
          <h1 className="mt-5 mb-4 text-center">Edit Category</h1>

          <form onSubmit={onSubmitHandler}>
            <div className="mb-3">
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

            <div className="mb-3">
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
                <img src={(state.uploadImage == null ? "http://localhost:5285/images/" + state.currentImg :  URL.createObjectURL(state.uploadImage))} 
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
              <button type="submit" className="btn btn-success">
                Edit Category
              </button>
            </div>
          </form>
          <Link to="/">
                <button className="btn btn-outline-success">Go to Categories List</button>
          </Link>

        </div>
      </>

    );

}


export default EditPage;
