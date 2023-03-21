import * as yup from "yup";

export const CreateSchema = yup.object({
  name: yup.string().required("Fill out the name"),
  description: yup.string().required("Fill out the description"),
  image: yup.mixed().required("Select a file"),
});