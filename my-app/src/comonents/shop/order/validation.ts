import * as yup from "yup";


const phoneRegExp = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/

export const OrderSchema = yup.object({
  receiverPhone: yup.string().matches(phoneRegExp, 'Phone number is not valid').required(),
  receiverName: yup.string().required("Fill out the Nova Poshta Address"),
  novaPoshtaCity: yup.string().required("Select city on the right"),
  novaPoshtaWarehouse: yup.string().required("Select warehouse on the right"),
});