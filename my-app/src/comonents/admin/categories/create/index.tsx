import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../../../../http";
import upload from "../../../../assets/upload.png";
import { useFormik } from "formik";
import { CreateSchema } from "./validation";
import classNames from "classnames";
import InputGroup from "../../../common/inputGroup";
import SuccessMessage from "../../../common/SuccessMessage";

interface ICategoryCreate {
  name: string;
  description: string;
  image: File | null;
}

const CreateCategoryPage = () => {
  const navigator = useNavigate();
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

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

  const onSubmitFormik = async (values: ICategoryCreate) => {
    console.log("Fornik submit", values);

    try {
      const result = await http.post("api/Categories", values, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage(true);
        setTimeout(() => {
          navigator("/admin/categories/list");
          }, 1000);

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
      <div className="cotainer vh-100 d-flex flex-column justify-content-start align-items-center">
        <h1 className="mt-2 mb-4 text-center text-info">Create Category</h1>
        {successMessage && <SuccessMessage message="Succesufully created" />}
        <form
          onSubmit={handleSubmit}
          className="border border-info pb-2 pt-5 ps-5 pe-5 bg-light rounded"
          style={{ width: 500 }}
        >
          <InputGroup
            field="name"
            label="Name"
            onChange={handleChange}
            error={errors.name}
            touched={touched.name}
          />

          <div className="mb-3">
            <label htmlFor="description" className="form-label text-info">
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
                style={{ cursor: "pointer", objectFit: 'contain', height: '150px', width: '150px' }}
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
            <button type="submit" className="btn btn-outline-info mb-2">
              Add Category
            </button>
          </div>
        </form>
        <Link to="/admin/categories/list">
          <button className="btn btn-info mt-3">
            Go Back to Categories
          </button>
        </Link>
      </div>
    </>
  );
};

export default CreateCategoryPage;
