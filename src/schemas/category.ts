import * as Yup from "yup";

export const CategorySchema = Yup.object().shape({
  category_name: Yup.string().required("This field is required."),
  group: Yup.string().required("This field is required."),
});
