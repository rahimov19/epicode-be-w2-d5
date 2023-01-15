import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  getMovies,
  getPDF,
  writeMovies,
  writePDF,
} from "../../lib/fs-tools.js";
import { pipeline } from "stream";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";

const filesRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({ cloudinary, params: { folder: "movies" } }),
}).single("movie");

filesRouter.post(
  "/:movieId/cover",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const url = req.file.path;
      const movies = await getMovies();
      const index = movies.findIndex(
        (movie) => movie.imdbID === req.params.movieId
      );
      if (index !== -1) {
        const oldMovie = movies[index];
        const updatedMovie = {
          ...oldMovie,
          Poster: url,
          updatedAt: new Date(),
        };
        movies[index] = updatedMovie;
        await writeMovies(movies);
      }
      res.send("Movie Cover Uploaded");
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post("/savepdf", async (req, res, next) => {
  let pdfArray = await getPDF();
  try {
    let newPDF = {
      ...req.body,
    };
    pdfArray = [];
    pdfArray.push(newPDF);
    await writePDF(pdfArray);
    res.status(201).redirect("/files/pdf3");
  } catch (error) {
    next(error);
  }
});

filesRouter.get("/pdf3", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=Movie.pdf");
    let movie = await getPDF();
    console.log(movie);
    const source = await getPDFReadableStream(movie[0]);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    console.log(error);
  }
});
export default filesRouter;
