// validation/loginSchema.ts
import * as Yup from "yup";
export const loginSchema = Yup.object({
  email: Yup.string().email("Email is not valid").required("Email is Required"),
  password: Yup.string().required("Password is Required"),
});
