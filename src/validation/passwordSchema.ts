import * as Yup from 'yup';

export const passwordSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/\d/, 'Password must contain at least one number') // 👈 svarbiausia dalis
    .required('New password is required'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm the password'),
});
