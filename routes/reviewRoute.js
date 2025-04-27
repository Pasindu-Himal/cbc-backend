import express from "express";
import { createReview, getReviews } from "../controllers/reviewController";

const reviewRouter = express.Router();

reviewRouter.post("/", createReview);
reviewRouter.get("/", getReviews);


export default reviewRouter;