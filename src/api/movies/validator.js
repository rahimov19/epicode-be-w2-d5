import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const movieSchema = {
  Title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is mandatory field and needs to be a string!",
    },
  },

  Year: {
    in: ["body"],
    isInt: {
      errorMessage: "Year is mandatory field and needs to be a number!",
    },
  },
};

export const checkMoviesSchema = checkSchema(movieSchema);
export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during movie validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
