import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";
import { createReadStream } from "fs";

const { readJSON, writeJSON, writeFile } = fs;
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "./public/img/movies");

const moviesJSONPath = join(dataFolderPath, "movies.json");
const pdfJSONPath = join(dataFolderPath, "pdf.json");
const reviewsJSONPath = join(dataFolderPath, "reviews.json");

export const getMovies = () => readJSON(moviesJSONPath);
export const writeMovies = (moviesArray) =>
  writeJSON(moviesJSONPath, moviesArray);

export const getReviews = () => readJSON(reviewsJSONPath);
export const writeReviews = (reviewsArray) =>
  writeJSON(reviewsJSONPath, reviewsArray);
export const getPDF = () => readJSON(pdfJSONPath);
export const writePDF = (pdfArray) => writeJSON(pdfJSONPath, pdfArray);
export const saveMoviesCover = (filename, contentAsABuffer) =>
  writeFile(join(publicFolderPath, filename), contentAsABuffer);
export const getMoviesJsonReadableStream = () =>
  createReadStream(moviesJSONPath);
