import * as Yup from 'yup';

export const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),

  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),

  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});
