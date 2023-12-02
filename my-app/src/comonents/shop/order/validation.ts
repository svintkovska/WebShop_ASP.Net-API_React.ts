import * as yup from "yup";


const phoneRegExp = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/

export const OrderSchema = yup.object({
  phone: yup.string().matches(phoneRegExp, 'Phone number is not valid').required(),
  name: yup.string().required("Fill out the Nova Poshta Address"),
  novaPoshtaAddress: yup.string().required("Fill out the Nova Poshta Address"),
});