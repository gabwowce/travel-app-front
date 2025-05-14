
import * as Yup from 'yup';

export const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Vardas per trumpas')
    .max(50, 'Vardas per ilgas')
    .required('Vardas privalomas'),

  email: Yup.string()
    .trim()
    .email('Įvesk galiojantį el. paštą')
    .required('El. paštas privalomas'),

  password: Yup.string()
    .min(6, 'Slaptažodį turi sudaryti bent 6 simboliai')
    .matches(/[A-Z]/, 'Slaptažodyje turi būti bent viena didžioji raidė')
    .matches(/[0-9]/, 'Slaptažodyje turi būti bent vienas skaičius')
    .required('Slaptažodis privalomas'),

  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password')], 'Slaptažodžiai nesutampa')
    .required('Pakartoti slaptažodį privaloma'),
});
