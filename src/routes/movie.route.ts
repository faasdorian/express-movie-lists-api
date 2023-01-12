import { Router } from "express";
import { addMovie, getMovies } from "../controllers/movie.controller";
import checkValidation from "../middleware/checkValidation";
import verifyAdmin from "../middleware/verifyAdmin";
import verifyJwt from "../middleware/verifyJwt";
import createMovieValidation from "../validation/movie/createMovie.validation";


const router = Router();

router.post("/", verifyJwt, verifyAdmin, createMovieValidation, checkValidation, addMovie);
router.get("/", verifyJwt, getMovies);

export default router;
