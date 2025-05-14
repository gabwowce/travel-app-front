il// validation/loginSchema.ts
import * as Yup from 'yup';
export const loginSchema = Yup.object({
  email: Yup.string().email('Email is not valid').required('Email is Required'),
  password: Yup.string().min(6).required('Password is Required'),
});
