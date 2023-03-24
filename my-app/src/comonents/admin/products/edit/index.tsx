import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import http from "../../../../http";
import upload from "../../../../assets/upload.png"
import { ICategory, ICreateProduct, IEditProduct } from "../types";
import SuccessMessage from "../../../common/SuccessMessage";




const EditProductPage = () =>{
    const navigator = useNavigate();
    const [successMessage, setSuccessMessage] = useState<boolean>(false);

    const { productId } = useParams();
    let prodIdNumber = -1;
    if(productId)
    {
      prodIdNumber = parseInt(productId, 10);
    }

    
    const [category, setCategory] = useState<ICategory>({
        id: 0,
        name: "",
    });

    const [product, setProduct] = useState<IEditProduct>({
        id: prodIdNumber, 
        name: "",
        price: 0,
        description: "",
        categoryId: 0,
        categories: [],
        images: [],
        currentImages: [],
        existingImages: [],
        files: []
      });

     
    console.log("initial product", product);

      
     useEffect(() => {
       const res =  http
          .get<IEditProduct>(`api/Products/edit/${prodIdNumber}`)
          .then((resp) => {
            //setProduct({ ...product, categories: resp.data as any});
            setProduct(resp.data);
            console.log("useeffect", product);         
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

     
      const [showFileInput, setShowFileInput] = useState(false);


      const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setShowFileInput(false);

        const { target } = e;
        const { files } = target;
      
        if (files) {
          const fileList = Array.from(files);
          const newImages = fileList.map((file) => ({ file, url: URL.createObjectURL(file) }));
          setProduct({ ...product, files: [...product.files, ...fileList], images: [...product.images, ...newImages] });
        }
      
        target.value = "";
      };
      
      const onDeleteImageHandler = (index: number) => {
        const updatedFiles = [...product.files];
        updatedFiles.splice(index, 1);
        const updatedImages = [...product.images];
        updatedImages.splice(index, 1);
        setProduct({ ...product, files: updatedFiles, images: updatedImages });
      };

      const onDeleteCurrentImageHandler = (index: number) => {
        const updatedFiles = [...product.files];
        updatedFiles.splice(index, 1);
        const updatedImages = [...product.images];
        updatedImages.splice(index, 1);
        setProduct({ ...product, files: updatedFiles, existingImages: updatedImages });
      };
      
      const onEditImageHandler = (index: number) => {
        setShowFileInput(false);

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = false;
        input.addEventListener("change", (e) => {
          const { target } = e;
          if (target instanceof HTMLInputElement && target.files) {
            const newImages = Array.from(target.files).map((file) => ({
              file,
              url: URL.createObjectURL(file),
            }));
            const updatedImages = [...product.images];
            updatedImages[index] = newImages[0];
            setProduct({ ...product, images: updatedImages });
          }
        });
        input.click();
      };
      const onEditCurrentImageHandler = (index: number) => {
        setShowFileInput(false);

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = false;
        input.addEventListener("change", (e) => {
          const { target } = e;
          if (target instanceof HTMLInputElement && target.files) {
            const newImages = Array.from(target.files).map((file) => ({
              file,
              url: URL.createObjectURL(file),
            }));
            const updatedImages = [...product.images];
            updatedImages[index] = newImages[0];
            setProduct({ ...product, existingImages: updatedImages });
          }
        });
        input.click();
      };
      
      const onSelectImageHandler = (index: number) => {
        setShowFileInput(false);

        const inputElement = document.createElement("input");
        inputElement.type = "file";
        inputElement.multiple = false;
        inputElement.accept = "image/*";
      
        inputElement.addEventListener("change", (e: any) => {
          const file = e.target.files[0];
          if (file) {
            const newImages = [...product.images];
            const updatedImage = {
              file: file,
              url: URL.createObjectURL(file)
            };
            newImages[index] = updatedImage;
            setProduct({ ...product, images: newImages });
          }
        });
      
        inputElement.click();
      };
      
      
    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("price", product.price.toString());
    formData.append("description", product.description);
    formData.append("categoryId", product.categoryId.toString());

    for (let image of product.images) {
      if (image.file) {
        formData.append("files", image.file);
      }
    }
    
      try {
        const result = await http.post("api/Products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          
        });
        setSuccessMessage(true);
        setTimeout(() => {
          navigator("/admin/products/list");
          }, 1000);
      } catch (error: any) {
        console.log("error:", error);
      }
      console.log("Data sent", product);
    };

  

    return (
      <>
        <div className="container col-6 offset-3">
          <h1 className="mt-5 mb-4 text-center">Create Product</h1>
          {successMessage && (
        <SuccessMessage message="Succesufully created" />
      )}
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
                required
              />
              <div className="invalid-feedback">
                Please enter a valid price.
              </div>
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
              {product.currentImages.length > 0 &&
                  product.currentImages.map((image, index) => (
                    <div
                      key={index}
                      className="d-inline-block position-relative mx-1"
                    >
                      <img
                        src={"http://localhost:5285/images/" + "300_" + image}
                        alt="product-image"
                        className="mw-100 mh-100"
                        width="150px"
                        height="150px"
                        style={{ objectFit: "cover", cursor: "pointer" }}
                        onClick={() => onEditCurrentImageHandler(index)}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        onClick={() => onDeleteCurrentImageHandler(index)}
                      >
                        <i className="bi bi-x">X</i>
                      </button>
                    </div>
                  ))}
                {product.images.length > 0 &&
                  product.images.map((image, index) => (
                    <div
                      key={index}
                      className="d-inline-block position-relative mx-1"
                    >
                      <img
                        src={image.url}
                        alt="product-image"
                        className="mw-100 mh-100"
                        width="150px"
                        height="150px"
                        style={{ objectFit: "cover", cursor: "pointer" }}
                        onClick={() => onEditImageHandler(index)}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        onClick={() => onDeleteImageHandler(index)}
                      >
                        <i className="bi bi-x">X</i>
                      </button>
                    </div>
                  ))}
                <img
                  src={upload}
                  alt="select img"
                  width="150px"
                  style={{ cursor: "pointer" }}
                  onClick={() => onSelectImageHandler(product.images.length)}
                />
                {showFileInput && (
                  <input
                    type="file"
                    className="d-none"
                    name="image"
                    id="image"
                    onChange={onFileChangeHandler}
                    onBlur={() => setShowFileInput(false)}
                  />
                )}
              </label>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-success">
                Create Product
              </button>
            </div>
          </form>
          <Link to="/products/list">
            <button className="btn btn-outline-success">
              Go to Products List
            </button>
          </Link>
        </div>
      </>
    );

}


export default EditProductPage;