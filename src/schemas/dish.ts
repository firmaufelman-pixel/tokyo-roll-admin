import * as Yup from "yup";

export const DishSchema = Yup.object().shape({
  dish_name: Yup.string().required("This field is required."),
  price: Yup.string().required("This field is required."),
  category: Yup.string().required("This field is required."),
});
