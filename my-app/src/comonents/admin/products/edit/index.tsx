import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import http from "../../../../http";
import upload from "../../../../assets/upload.png"
import { ICategory, ICreateProduct, IEditProduct } from "../types";
import SuccessMessage from "../../../common/SuccessMessage";
import { APP_ENV } from "../../../../env";




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
        files: []
      });

      console.log("images", product.images);

    console.log("initial product", product);

      
    useEffect(() => {
      const res = http
        .get<IEditProduct>(`api/Products/edit/${prodIdNumber}`)
        .then((resp) => {
          setProduct({
            id: resp.data.id,
            name: resp.data.name,
            price: resp.data.price,
            description: resp.data.description,
            categoryId: resp.data.categoryId,
            categories: resp.data.categories,
            images: resp.data.images ?? [],
            currentImages: resp.data.currentImages,
            files: []
          });
          console.log("useeffect", resp.data);
        });
    }, []);
      console.log("useeffect", product);         

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
        const updatedImages = [...product.currentImages];
        updatedImages.splice(index, 1);
        setProduct({ ...product, files: updatedFiles, currentImages: updatedImages });
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
      const onEditCurrentImageHandler = (index: number, imgName: string) => {
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
            const updatedCurrentImages = [...product.currentImages];
            updatedCurrentImages[index] = newImages[0].url;
            setProduct({
              ...product,
              currentImages: updatedCurrentImages,
              images: product.images.map((image, i) => (i === index ? { ...image, url: newImages[0].url } : image)),
            });
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
      
    



      const blobToFile = async (url: string): Promise<File | null> => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const filename = url.split("/").pop() || "filename.jpg";
          const file = new File([blob], filename, { type: blob.type });
          return file;
        } catch (error) {
          console.error(error);
          return null;
        }
      };
      
     
    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("price", product.price.toString());
      formData.append("description", product.description);
      formData.append("categoryId", product.categoryId.toString());
      formData.append("id", productId ? productId.toString() : "0");

      for (let image of product.images) {
        if (image.file) {
          formData.append("files", image.file);
        }
      }

      const files: File[] = [];
      const imgNames: string[] = [];

      for (let image of product.currentImages) {
        if (image) {
          let file;
          if (typeof image === "string" && image.startsWith("blob:")) {
            file = await blobToFile(image);
            console.log("1");
          } else if (typeof image === "string") {
            imgNames.push(image);
          }
          if (file) {
            formData.append("files", file);
            console.log("3");
          }
        }
      }

      for (let image of files) {
        if (image) {
          formData.append("files", image);
        }
      }
      for (let name of imgNames) {
        formData.append("currentImages", name);
      }
      try {
        const result = await http.put(`api/Products`, formData, {
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
        <div className="cotainer vh-100 d-flex flex-column justify-content-start align-items-center">
          <h1 className="mt-5 mb-4 text-center text-info">Update Product</h1>
          {successMessage && <SuccessMessage message="Succesufully updated" />}
          <form
            onSubmit={onSubmitHandler}
            className="border border-info pb-2 pt-5 ps-5 pe-5"
            style={{ width: 700 }}
          >
            <div className="d-flex flex-row justify-content-baseline align-items-center">
              <div className="mb-3 me-5 col-6">
                <label htmlFor="name" className="form-label text-info">
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
                <div className="invalid-feedback">
                  Please enter a valid name.
                </div>
              </div>
              <div className="mb-3 ">
                <label htmlFor="price" className="form-label text-info">
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
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label text-info">
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
            <div className="mb-3 col-4">
              <label htmlFor="categoryId" className="form-label text-info">
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
                        src={image}
                        alt="product-image"
                        className="mw-100 mh-100"
                        width="150px"
                        height="150px"
                        style={{ objectFit: "cover", cursor: "pointer" }}
                        onClick={() => onEditCurrentImageHandler(index, image)}
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
              <button type="submit" className="btn btn-info mb-3">
                Update Product
              </button>
            </div>
          </form>
          <Link to="/products/list">
            <button className="btn btn-outline-info mt-3 mb-3">
              Go Back to Products
            </button>
          </Link>
        </div>
      </>
    );

}


export default EditProductPage;