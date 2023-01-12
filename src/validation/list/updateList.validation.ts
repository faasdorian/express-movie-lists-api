import { checkSchema } from "express-validator";

const validateList = checkSchema({
  title: {
    optional: true,
    isString: { errorMessage: 'Title must be a string' },
    trim: { options: [' '] },
    isLength: {
      options: { min: 3, max: 45 },
      errorMessage: 'Title must be 3-45 characters long'
    },
    matches: {
      options: /^[a-zA-Z ]*$/,
      errorMessage: 'Title must be alphanumeric (with spaces)'
    }
  },
  privacy: {
    optional: true,
    isIn: {
      options: [['public', 'private']],
      errorMessage: 'Privacy must be public or private'
    }
  }
});

export default validateList;