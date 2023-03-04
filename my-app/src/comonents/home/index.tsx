import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

interface ICategoryItem{
    id: number,
    name: string,
    image: string,
    description: string
}


const HomePage = ()=>{

    const [categories, setCategories] = useState<Array<ICategoryItem>>([]);

    useEffect(() => {
        axios
          .get<Array<ICategoryItem>>("http://localhost:5285/api/Categories")
          .then((resp) => {
            console.log("response - ", resp);
            setCategories(resp.data);
          });
      }, []);

      const OnDeleteClickHandler = (id: number) => {
        axios.delete(`http://localhost:5285/api/Categories/${id}`).then((response) => {
          console.log(response.data);
          const updatedCatgories = categories.filter((category) => category.id !== id);
          setCategories(updatedCatgories);
        });
     
      };
          

    const content = categories.map((category) => (
      <tr key={category.id}>
        <th scope="row">{category.id}</th>
        <td>
          <img
            src={"http://localhost:5285/images/" + category.image}
            width="150"
          ></img>
        </td>
        <td>{category.name}</td>
        <td>{category.description}</td>
        <td>
        <Link to={`/categories/edit/${category.id}`}>
          <button className="btn" type="button" style={{marginTop: 10}}>
            <img 
            src={"https://cdn-icons-png.flaticon.com/512/143/143437.png"}
            width="40"
            />
          </button>
        </Link>
        </td>
        
        <td >
          <button className="btn" type="button" onClick={() => OnDeleteClickHandler(category.id)} style={{marginTop: 10}}>
          <img 
            src={"https://cdn-icons-png.flaticon.com/512/3221/3221897.png"}
            width="40"
            />
          </button>
        </td>
      </tr>
    ));

 const onReloadClickHandler = ()=> {
     axios.get<Array<ICategoryItem>>("http://localhost:5285/api/Users")
     .then((resp) =>{
        console.log("response - ", resp);
        setCategories(resp.data);
     });
}

    return (
      <>
        <h1 className="text-center mt-3 mb-4">Users</h1>

        <div className="d-flex justify-content-center mb-4">
          <button
            className="btn me-2"
            style={{ marginTop: "-10px" }}
            onClick={onReloadClickHandler}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/6711/6711474.png"
              width={45}
              height={45}
              alt="Reload"
            />
          </button>
          <Link to="/categories/create">
            <button className="btn btn-success" style={{ marginLeft: "15px" }}>
              Add Category
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

export default HomePage;
