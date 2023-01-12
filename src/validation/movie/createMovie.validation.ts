import { checkSchema } from "express-validator";

const validateMovie = checkSchema({
  title: {
    exists: { options: { checkFalsy: true } },
    isString: { errorMessage: "Title must be a string" },
    trim: { options: [" "] },
    isLength: {
      options: { min: 3, max: 85 },
      errorMessage: "Title must be 3-85 characters long",
    },
  }
});

export default validateMovie;