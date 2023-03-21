import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../../../../http";
import upload from "../../../../assets/upload.png";
import { useFormik } from "formik";
import { CreateSchema } from "./validation";
import classNames from "classnames";
import InputGroup from "../../../common/inputGroup";

interface ICategoryCreate {
  name: string;
  description: string;
  image: File | null;
}

const CreateCategoryPage = () => {
  const navigator = useNavigate();

  const [state, setState] = useState<ICategoryCreate>({
    name: "",
    description: "",
    image: null,
  });

  const initValues: ICategoryCreate = {
    name: "",
    description: "",
    image: null,
  };
  // const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) =>{
  //     setState({...state, [e.target.name]: e.target.value});
  // }

  const onSubmitFormik = async (values: ICategoryCreate) => {
    console.log("Fornik submit", values);

    try {
      const result = await http.post("api/Categories", values, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigator("/");
    } catch (error: any) {
      console.log("error:", error);
    }
    console.log("Data sent", state);
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: CreateSchema,
    onSubmit: onSubmitFormik,
  });

  const { values, errors, touched, handleSubmit, handleChange, setFieldValue } = formik;

  
  const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const { files } = target;

    if (files) {
      const file = files[0];
      //setState({ ...state, image: file });
      setFieldValue("image", file);
      console.log("state", state);
      console.log("files[0]", files[0]);
    }
    target.value = "";
  };

  return (
    <>
      <div className="container col-6 offset-3">
        <h1 className="mt-5 mb-4 text-center">Add Category</h1>

        <form onSubmit={handleSubmit}>
          <InputGroup
            field="name"
            label="Name"
            onChange={handleChange}
            error={errors.name}
            touched={touched.name}
          />
          {/* <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className={classNames("form-control", {
                "is-invalid": touched.name && errors.name,
                "is-valid": touched.name && !errors.name,
              })}
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Enter Name"
            />
            {touched.name && errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div> */}

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className={classNames("form-control", {
                "is-invalid": touched["description"] && errors["description"],
                "is-valid": touched["description"] && !errors["description"],
              })}
              name="description"
              rows={3}
              value={values.description}
              onChange={handleChange}
              placeholder="Enter Description"
            ></textarea>
            {touched["description"] && errors["description"] && (
              <div className="invalid-feedback">{errors["description"]}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              <img
                src={
                  values.image == null
                    ? upload
                    : URL.createObjectURL(values.image)
                }
                alt="select img"
                width="150px"
                style={{ cursor: "pointer" }}
              />
            </label>
            <input
              type="file"
              className="d-none"
              name="image"
              id="image"
              onChange={onFileChangeHandler}
            />

            {touched["image"] && errors["image"] && (
              <div className="alert alert-danger" role="alert">
               {errors["image"]}
              </div>
            )}
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success">
              Add Category
            </button>
          </div>
        </form>
        <Link to="/categories/list">
          <button className="btn btn-outline-success">
            Go to Categories List
          </button>
        </Link>
      </div>
    </>
  );
};

export default CreateCategoryPage;
