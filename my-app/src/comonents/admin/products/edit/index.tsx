import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { APP_ENV } from "../../../../env";
import http from "../../../../http";
import upload from "../../../../assets/upload.png"


  interface ICategory{
    id: number;
    name: string;
  }
  interface IProduct {
    id: number;
    name: string;
    price: number;
    description: string;
    categoryId: number;
    categories: ICategory[];
    currentImages: string[];
    files: File[]
  }


const EditProductPage = () =>{
    const navigator = useNavigate();
    
    const { productId } = useParams();
    console.log(productId);

    let prodIdNumber = -1;
    if(productId)
    {
        prodIdNumber = parseInt(productId, 10);
    }
    console.log(prodIdNumber);

    
    const [category, setCategory] = useState<ICategory>({
        id: 0,
        name: "",
    });
    const [product, setProduct] = useState<IProduct>({
        id: prodIdNumber,
        name: "",
        price: 0,
        description: "",
        categoryId: 0,
        categories: [],
        currentImages: [],
        files: []
      });

         
      const [file, setFile] = useState<File | null>(null);
    
     useEffect(() => {
       const res =  http
          .get<IProduct>(`api/Products/edit/${prodIdNumber}`)
          .then((resp) => {
            console.log("GET --", resp.data);

            setProduct(resp.data);
            console.log("GET --", resp.data);
            
          });
      }, []);

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) =>{
        setProduct({...product, [e.target.name]: e.target.value});
    }
    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
    
        setProduct((prevProduct) => ({
          ...prevProduct,
          [name]: parseInt(value),
        }));
      };

     

    const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { target } = e;
      const { files } = target;

      console.log("Show data", files);
    //   if (files) {
    //     const file = files[0];
    //     setState({ ...state, uploadImage: file });
    //   }
      target.value = "";
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();


      try {
        const result = await http.put("api/Categories", product, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigator("/");
      } catch (error: any) {
        console.log("error:", error);
      }
      console.log("Data sent", product);
    };

    return (
      <>
        <div className="container col-6 offset-3">
          <h1 className="mt-5 mb-4 text-center">Edit Product</h1>

          <form onSubmit={onSubmitHandler}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={product.name}
                onChange={onChangeInputHandler}
                placeholder="Enter Name"
                required
              />
              <div className="invalid-feedback">Please enter a valid name.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                id="price"
                name="price"
                value={product.price}
                onChange={onChangeInputHandler}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                name="description"
                rows={3}
                value={product.description}
                onChange={onChangeInputHandler}
                placeholder="Enter Description"
              ></textarea>
              <div className="invalid-feedback">
                Please enter a valid description.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="categoryId" className="form-label">
                Category
              </label>
              <select
                className="form-select"
                id="categoryId"
                name="categoryId"
                value={product.categoryId}
                onChange={handleCategoryChange}
              >
                <option value="">Select a category</option>
                {product.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                <img src={upload} 
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
                Edit Product
              </button>
            </div>
          </form>
          <Link to="/products/list">
            <button className="btn btn-outline-success">
              Go to Product List
            </button>
          </Link>
        </div>
      </>
    );

}


export default EditProductPage;