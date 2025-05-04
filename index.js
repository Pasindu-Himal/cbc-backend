import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRoute.js";
import jwt from "jsonwebtoken";
import orderRouter from "./routes/orderRoute.js";
import reviewRouter from "./routes/reviewRoute.js";

let app = express();


app.use(bodyParser.json());

app.use((req, res, next) => {
  const tokenString = req.header("Authorization");
  if (tokenString != null) {
    const token = tokenString.replace("Bearer ", "");
    //console.log(token);

    jwt.verify(token, "abc@123", (err, decoded) => {
      if (decoded != null) {
        req.user = decoded;
        next();
        //console.log(decoded);
      } else {
        console.log("Invalid token");
        res.status(403).json({
          message: "Invalid token",
        });
      }
    });
  } else {
    next();
  }
});

mongoose
  .connect(
    "mongodb+srv://admin:1234@cluster0.qgvnz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to the databases");
  })
  .catch(() => {
    console.log("Databases connection failed");
  });

app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);
app.use("/reviews", reviewRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
