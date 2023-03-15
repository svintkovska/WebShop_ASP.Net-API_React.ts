import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { APP_ENV } from "../../../../env";
import http from "../../../../http";
import { IAuthUser } from "../../../auth/types";


interface IProductItem{
    id: number,
    name: string,
    images: Array<string>,
    description: string,
    price: number,
    category: string
}


const ProductsList = ()=>{


    const [products, setProducts] = useState<Array<IProductItem>>([]);

      useEffect(() => {
        http.
            get<Array<IProductItem>>("api/Products")
            .then((resp) => {
                setProducts(resp.data);
            });
        }, []);

  
      const OnDeleteClickHandler = (id: number) => {
        http.delete(`api/Products/${id}`).then((response) => {
          const updatedProducts = products.filter((product) => product.id !== id);
          setProducts(updatedProducts);
        });   
      };
          
    const content = products.map((product) => (
      <tr key={product.id}>
        <th scope="row">{product.id}</th>
        <td>
          <img
            src={APP_ENV.IMAGE_PATH +"300_" + product.images[0]}
            width="150"
          ></img>
        </td>
        <td>{product.name}</td>
        <td>{product.category}</td>
        <td>{product.price}</td>
        <td>{product.description}</td>
        <td>
        <Link to={`/Products/edit/${product.id}`}>
          <button className="btn" type="button" style={{marginTop: 10}}>
            <img 
            src={"https://cdn-icons-png.flaticon.com/512/143/143437.png"}
            width="40"
            />
          </button>
        </Link>
        </td>
        
        <td >
          <button className="btn" type="button" onClick={() => OnDeleteClickHandler(product.id)} style={{marginTop: 10}}>
          <img 
            src={"https://cdn-icons-png.flaticon.com/512/3221/3221897.png"}
            width="40"
            />
          </button>
        </td>
      </tr>
    ));



    return (
      <>
        <h1 className="text-center mt-3 mb-4">Products</h1>

        <div className="d-flex justify-content-center mb-4">

          <Link to="/products/create">
            <button className="btn btn-success" style={{ marginLeft: "15px" }}>
              Add Product
            </button>
          </Link>
        </div>

        <div className="container col-10">
          <table className="table table-striped table-dark">
            <thead className="table-light">
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Description</th>

                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>
      </>
    );
}

export default ProductsList;
