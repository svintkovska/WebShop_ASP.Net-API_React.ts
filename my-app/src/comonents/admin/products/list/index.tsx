import classNames from "classnames";
import qs from "qs";
import { useState, useEffect, ChangeEvent } from "react";
import { Link, useSearchParams } from 'react-router-dom';
import { APP_ENV } from "../../../../env";
import http from "../../../../http";
import ProductDeleteModal from "../ProductDeleteModal";
import { IProductItem, IProductResult, IProductSearch } from "../types";



const ProductsList = ()=>{
  const [products, setProducts] = useState<Array<IProductItem>>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<IProductResult>({
      pages: 0,
      products: [],
      total: 0,
      currentPage:0,
      categories: []
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

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) =>{
      setSearch({...search, [e.target.name]: e.target.value});
  }


    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

    const handleDeleteProduct = async () => {
      if (deleteProductId !== null) {

        await http.delete(`api/Products/${deleteProductId}`).then((response) => {
          setProducts(products.filter((product) => product.id !== deleteProductId));
        setDeleteProductId(null);
        });
      }
    };

    const handleShowDeleteModal = (id: number) => {
      setDeleteProductId(id);
    };

    const handleCloseDeleteModal = () => {
      setDeleteProductId(null);
    };

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
        <Link to={`/admin/products/edit/${product.id}`}>
          <button className="btn" type="button" style={{marginTop: 10}}>
            <img 
            src={"https://cdn-icons-png.flaticon.com/512/1828/1828270.png"}
            width="40"
            />
          </button>
        </Link>
        </td>
        
        <td >
          <button className="btn" type="button"  onClick={() => handleShowDeleteModal(product.id)}  style={{marginTop: 10}}>
          <img 
            src={"https://cdn-icons-png.flaticon.com/512/3221/3221897.png"}
            width="40"
            />
          </button>
        </td>
      </tr>
    ));

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = event.target;
      const categoryId = value !== "" ? parseInt(value, 10) : null;

      setSearch((prevProduct) => ({
        ...prevProduct,
        [name]: categoryId,
      }));
      console.log(search);
    };

    return (
      <>
        <div className="cotainer vh-100 d-flex flex-column justify-content-start align-items-center">
          <h1 className="text-center mt-3 mb-4 text-info">Products</h1>

          <div className="d-flex justify-content-center mb-4 ">
            <Link to="/admin/products/create">
              <button
                className="btn btn-info"
                style={{ marginLeft: "15px" }}
              >
                Add Product
              </button>
            </Link>
          </div>
          <div className="d-flex flex-row justify-content-center ">
            <div className="mb-3 col-4 me-5">
              <label htmlFor="name" className="form-label d-none">
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={search.name}
                onChange={onChangeInputHandler}
                placeholder="Search by name"
              />
            </div>
            <div className="mb-3 col-4 me-5">
              <label htmlFor="description" className="form-label d-none">
              </label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={search.description}
                onChange={onChangeInputHandler}
                placeholder="Search by description"
              />
            </div>
            <div className="mb-3 col-4 me-5">
              <label htmlFor="categoryId" className="form-label d-none">
              </label>
              <select
                className="form-select"
                id="categoryId"
                name="categoryId"
                value={search.categoryId}
                onChange={handleCategoryChange}
              >
                <option value="">Select a category</option>
                {data.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="container col-8">
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
            <div className="d-flex flex-row justify-content-center">
              <nav>
                <ul className="pagination">{pagination}</ul>
              </nav>
            </div>
          </div>

          <ProductDeleteModal
            show={deleteProductId !== null}
            onHide={handleCloseDeleteModal}
            onDelete={handleDeleteProduct}
            productName={
              deleteProductId !== null
                ? products.find((c) => c.id === deleteProductId)?.name || ""
                : ""
            }
          />
        </div>
      </>
    );
}

export default ProductsList;
