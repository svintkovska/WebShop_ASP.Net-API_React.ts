import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import http from "../../../../http";
import upload from "../../../../assets/upload.png"

interface ICategoryCreate {
    name: string;
    description: string;
    image: File | null;
    }


const CreateCategoryPage = () =>{
    const navigator = useNavigate();

    const [state, setState] = useState<ICategoryCreate>({
        name: "",
        description: "",
        image: null
    });

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) =>{
        setState({...state, [e.target.name]: e.target.value});
    }

    const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const {target} = e;
      const {files} = target;

      if(files){
        const file = files[0];
        setState({...state, image: file});
        console.log("state", state);
        console.log("files[0]", files[0]);


      }
      target.value = "";
    }


    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        console.log(state);

        try{
          const result = await http
          .post("api/Categories", state, {
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
          <h1 className="mt-5 mb-4 text-center">Add Category</h1>

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
                <img src={(state.image == null ? upload : URL.createObjectURL(state.image))} 
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
                Add Category
              </button>
            </div>
          </form>
          <Link to="/categories/list">
                <button className="btn btn-outline-success">Go to Categories List</button>
          </Link>

        </div>
      </>
    );
}

export default CreateCategoryPage;