import * as Yup from 'yup';

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email is required'),
});
