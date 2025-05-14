import * as Yup from 'yup';

export const passwordSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm the password'),
});
