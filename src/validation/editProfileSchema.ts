import * as Yup from 'yup';

const editProfileSchema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  profile: Yup.object({
    location: Yup.string().nullable(),
    bio: Yup.string().max(160, 'Bio is too long').nullable(),
    website: Yup.string().url('Invalid URL').nullable(),
  }),
});
