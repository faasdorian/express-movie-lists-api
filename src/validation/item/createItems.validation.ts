import { checkSchema } from "express-validator";
import { validate as uuidValidate } from "uuid";

const validateItems = checkSchema({
  listId: {
    exists: {
      options: { checkFalsy: true }
    },

    isUUID: {
      errorMessage: "Must be a valid uuid"
    }
  },

  moviesIds: {
    exists: {
      options: { checkFalsy: true }
    },

    isArray: {
      errorMessage: "Must be an 1-50 items array",
      options: { min: 1, max: 50 }
    },

    custom: {
      options: (value: string[]) => {
        return value.every((item) => uuidValidate(item));
      },
      errorMessage: "Items must be valid uuids"
    }

  }
});

export default validateItems;