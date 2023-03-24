import * as yup from "yup";


const phoneRegExp = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/

export const OrderSchema = yup.object({
  phone: yup.string().matches(phoneRegExp, 'Phone number is not valid').required(),
  street: yup.string().required("Fill out the street"),
  city: yup.string().required("Fill out the city"),
  appartment: yup.string().required("Fill out the appartment"),
  payment: yup.string().required("Select a payment mathod"),
});