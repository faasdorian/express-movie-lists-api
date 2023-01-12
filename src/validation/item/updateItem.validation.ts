import { checkSchema } from "express-validator";

const validateItems = checkSchema({
  watched: {
    exists: {
      options: { checkFalsy: true }
    },

    isBoolean: {
      errorMessage: "Must be a boolean"
    }
  }
});

export default validateItems;