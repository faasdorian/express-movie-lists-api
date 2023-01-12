import { checkSchema } from "express-validator";

const validateSignup = checkSchema({
  username: {
    exists: {
      options: { checkFalsy: true }
    },
    isString: {
      errorMessage: 'Username must be a string'
    },
    trim: { options: [' '] },
    isAlphanumeric: {
      errorMessage: 'Username must be alphanumeric'
    },
    isLength: {
      errorMessage: 'Username must have 3-20 characters',
      options: { min: 3, max: 20 }
    }
  },
  password: {
    exists: { options: { checkFalsy: true } },
    isString: { errorMessage: "Password should be string" },
    trim: { options: [' '] },
    isLength: { errorMessage: "Password must be 8-35 characters long", options: { min: 8, max: 35 } },
    isStrongPassword: {
      errorMessage: 'Password must be strong (1 uppercase, 1 lowercase, 1 number, and 1 special character)'
    }
  },
  isAdmin: {
    optional: true,
    isBoolean: { errorMessage: "isAdmin must be a boolean" }
  }
});

export default validateSignup;