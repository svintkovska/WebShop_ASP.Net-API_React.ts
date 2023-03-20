import classNames from "classnames";
import qs from "qs";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from 'react-router-dom';
import { APP_ENV } from "../../../../env";
import http from "../../../../http";
import { IProductItem, IProductResult, IProductSearch } from "../types";



const ProductsList = ()=>{
  const [products, setProducts] = useState<Array<IProductItem>>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<IProductResult>({
      pages: 0,
      products: [],
      total: 0,
      currentPage:0
  });

  const [search, setSearch] = useState<IProductSearch>({
      name: searchParams.get("name") || "",
      description: searchParams.get("description") || "",
      categoryId: searchParams.get("categoryId") || "",
      page: searchParams.get("page") || 1,
  });

  function filterNonNull(obj: IProductSearch) {
      return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v));
    }

    const buttons = [];
    for (let i = 1; i <= data.pages; i++) {
      buttons.push(i);
    }

    const pagination = buttons.map((page) => (
      <li key={page} className="page-item">
        <Link
          className={classNames("page-link", { active: data.currentPage === page })}
          onClick={() => setSearch({ ...search, page })}
          to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
        >
          {page}
        </Link>
      </li>
    ));

    useEffect(() => {
      console.log("search", search);
      http.
          get<IProductResult>("api/Products/search", {
              params: search
          })
          .then((resp) => {
              console.log("porducts list", resp.data);
              setData(resp.data);
              setProducts(resp.data.products);
          });
      }, [search]);


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
          <nav>
            <ul className="pagination">{pagination}</ul>
          </nav>
        </div>
      </>
    );
}

export default ProductsList;
