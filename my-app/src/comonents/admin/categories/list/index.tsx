import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { APP_ENV } from "../../../../env";
import http from "../../../../http";
import { IAuthUser } from "../../../auth/types";
import CategoryDeleteModal from "../CategoryDeleteModal";


interface ICategoryItem{
    id: number,
    name: string,
    image: string,
    description: string
}


const CategoriesList = ()=>{

  const {isAuth} = useSelector((store: any) => store.auth as IAuthUser);
  const {token} = useSelector((store: any) => store.auth as IAuthUser);
  if (isAuth)
  {
    http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log("token", token);  
  }
    const [categories, setCategories] = useState<Array<ICategoryItem>>([]);

      useEffect(() => {
        http.
            get<Array<ICategoryItem>>("api/Categories")
            .then((resp) => {
              setCategories(resp.data);
            });
        }, []);

      const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);

      const handleDeleteCategory = async () => {
        if (deleteCategoryId !== null) {          
          await http.delete(`api/Categories/${deleteCategoryId}`).then((response) => {
          setCategories(categories.filter((category) => category.id !== deleteCategoryId));
          setDeleteCategoryId(null);
          });
        }
      };

      const handleShowDeleteModal = (id: number) => {
        setDeleteCategoryId(id);
      };
    
      const handleCloseDeleteModal = () => {
        setDeleteCategoryId(null);
      };
    const content = categories.map((category) => (
      <tr key={category.id}>
        <th scope="row">{category.id}</th>
        <td>
          <img
            src={APP_ENV.IMAGE_PATH + "300_" + category.image}
            width="150"
          ></img>
        </td>
        <td>{category.name}</td>
        <td>{category.description}</td>
        <td>
        <Link to={`/admin/categories/edit/${category.id}`}>
          <button className="btn" type="button" style={{marginTop: 10}}>
            <img 
            src={"https://cdn-icons-png.flaticon.com/512/1828/1828270.png"}
            width="40"
            />
          </button>
        </Link>
        </td>
        
        <td >
          <button className="btn" type="button" onClick={() => handleShowDeleteModal(category.id)} style={{marginTop: 10}}>
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
        <div className="cotainer vh-100 d-flex flex-column justify-content-start align-items-center">
          <h1 className="text-center mt-3 mb-4 text-info">Categories</h1>

          <div className="d-flex justify-content-center mb-4">
            <Link to="/admin/categories/create">
              <button className="btn btn-info" style={{ marginLeft: "15px" }}>
                Add Category
              </button>
            </Link>
          </div>

          <div className="container col-8 ">
            <table className="table table-striped table-dark mb-4">
              <thead className="table-light">
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>

          <CategoryDeleteModal
            show={deleteCategoryId !== null}
            onHide={handleCloseDeleteModal}
            onDelete={handleDeleteCategory}
            categoryName={
              deleteCategoryId !== null
                ? categories.find((c) => c.id === deleteCategoryId)?.name || ""
                : ""
            }
          />
        </div>
      </>
    );
}

export default CategoriesList;
