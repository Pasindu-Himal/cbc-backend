import Order from "../models/order.js";
import Review from "../models/review.js";

export async function createReview(req,res){
    if(req.user == null){
        res.status(403).json({
            message : "Please login and try again"
        })
        return
    }

    const reviewInfo = req.body;
    
    if(reviewInfo.name == null){
        reviewInfo.name = req.user.firstName + " " + req.user.lastName;
    }


 try{
     const rewId = await Order.findOne({productId : reviewInfo.productId})
     if(rewId.email == null){
        res.status(403).json({
            message : "You are not authorized to create a review"
        })
        return
     }
     
     
     if(rewId == null){
        res.status(403).json({
            message : "You are not authorized to create a review"
        })
        return
       }


       const review = new Review({
        productId : reviewInfo.productId,
        email : req.user.email,
        name : reviewInfo.name,
        rating : reviewInfo.rating,
        comment : reviewInfo.comment,
        images : reviewInfo.images
       })

       const createdReview = await review.save();
       res.json({
        message : "Review created successfully",
        review : createdReview
       })


    }catch(err){
        res.status(500).json({
            message : "Failed to create order",
            error : err
        })
    }








}