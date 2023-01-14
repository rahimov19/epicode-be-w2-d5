import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { getMovies, writeMovies } from "../../lib/fs-tools.js";
import { checkMoviesSchema, triggerBadRequest } from "./validator.js";
const { NotFound, Unauthorized, BadRequest } = httpErrors;

const moviesRouter = express.Router();

moviesRouter.post(
  "/",
  checkMoviesSchema,
  triggerBadRequest,
  async (req, res, next) => {
    const moviesArray = await getMovies();
    try {
      const newMovie = {
        ...req.body,
        Type: "Movie",
        createdAt: new Date(),
        imdbID: uniqid(),
      };
      moviesArray.push(newMovie);
      await writeMovies(moviesArray);
      res.status(201).send({
        imdbID: newMovie.imdbID,
      });
    } catch (error) {
      next(error);
    }
  }
);

moviesRouter.get("/", async (req, res, next) => {
  if (req.query.search) {
    try {
      const moviesArray = await getMovies();
      const moviesArrayfiltered = moviesArray.filter((movie) => {
        return movie.Title.toLowerCase().includes(
          req.query.search.toLowerCase()
        );
      });
      if (moviesArrayfiltered.length > 0) {
        res.send(moviesArrayfiltered);
      } else {
        try {
          let response = await fetch(
            `http://www.omdbapi.com/?s=${req.query.search}&apikey=383cbcb8`,
            { method: "GET" }
          );
          if (response.ok) {
            let data = await response.json();
            if (data.Search && data.Search.length > 0) {
              let movies = data.Search;
              const moviesArray = await getMovies();
              const newMoviesArray = moviesArray.concat(movies);
              await writeMovies(newMoviesArray);
              res.send(movies);
            } else {
              next(NotFound(`No movies with ${req.query.search} title found`));
            }
          } else {
            next(NotFound(`No movies with ${req.query.search} title found`));
          }
        } catch (error) {
          next(error);
        }
      }
    } catch (error) {
      next(error);
    }
  } else {
    try {
      const movies = await getMovies();
      res.send(movies);
    } catch (error) {
      next(error);
    }
  }
});

moviesRouter.get("/:movieId", async (req, res, next) => {
  try {
    const moviesArray = await getMovies();
    const movie = moviesArray.find(
      (movie) => movie.imdbID === req.params.movieId
    );
    if (movie) {
      res.send(movie);
    } else {
      next(NotFound(`Movie with id ${req.params.movieId} is not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default moviesRouter;
