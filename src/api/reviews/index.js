import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checkReviewSchema, triggerBadRequest } from "./validator.js";
import { getReviews, writeReviews } from "../../lib/fs-tools.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;

const reviewsRouter = express.Router();

reviewsRouter.post(
  "/:imdbId/reviews",
  checkReviewSchema,
  triggerBadRequest,
  async (req, res, next) => {
    const reviewsArray = await getReviews();
    const imdbId = req.params.imdbId;
    try {
      const newReview = {
        ...req.body,
        imdbId: imdbId,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: uniqid(),
      };

      reviewsArray.push(newReview);
      await writeReviews(reviewsArray);
      res.status(201).send({
        id: newReview.id,
      });
    } catch (error) {
      next(error);
    }
  }
);

reviewsRouter.get("/:imdbId/reviews/", async (req, res, next) => {
  try {
    const reviewsArray = await getReviews();
    const movieReview = reviewsArray.filter(
      (review) => review.imdbId === req.params.imdbId
    );
    console.log(movieReview);
    res.send(movieReview);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:imdbId/reviews/:reviewId", async (req, res, next) => {
  try {
    const reviewsArray = await getReviews();
    const review = reviewsArray.find(
      (review) => review.id === req.params.reviewId
    );
    if (review) {
      res.send(review);
    } else {
      next(NotFound(`Review with id ${req.params.reviewId} is not found`));
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put(
  "/:imdbId/reviews/:reviewId",
  checkReviewSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const reviewsArray = await getReviews();

      const index = reviewsArray.findIndex(
        (review) => review.id === req.params.reviewId
      );
      const oldReview = reviewsArray[index];
      const updatedReview = {
        ...oldReview,
        ...req.body,
        updatedAt: new Date(),
      };
      reviewsArray[index] = updatedReview;
      await writeReviews(reviewsArray);
      res.send(updatedReview);
    } catch (error) {
      next(error);
    }
  }
);

reviewsRouter.delete("/:imdbId/reviews/:reviewId", async (req, res, next) => {
  try {
    const reviewsArray = await getReviews();

    const remainingReviews = reviewsArray.filter(
      (product) => product.id !== req.params.reviewId
    );
    await writeReviews(remainingReviews);
    res.send();
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
