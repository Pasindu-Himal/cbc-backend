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
     const rev = await Order.findOne({productId : reviewInfo.productId})
     if(rev.email != req.user.email){
        res.status(403).json({
            message : "You are not authorized to create a review"
        })
        return
     }
     
     
     if(rev == null){
        res.status(403).json({
            message : "You are not authorized to create a review"
        })
        return
       }


       const review = new Review({
        productId : reviewInfo.productId,
        // userId : req.user.userId,
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
            message : "Failed to create review",
            error : err
        })
    }

}


export async function getReviews(req,res){
    try{
        const itemId = req.params.productId;
        const showReview = await Review.find({productId : itemId});
        res.json({
            reviews : showReview
           })
    }catch(err){
        res.status(500).json({
            message : "Failed to get reviews",
            error : err
        })
    }
}


export async function updateReview(req,res){
    try{
        const updateId = req.params.productId;
        const updateRevs = req.body;
        const updateRw = await Review.findOne({productId : updateRevs.productId})
        if(updateRw.email != req.user.email){
            res.status(403).json({
                message : "You are not authorized to update a review"
            })
            return
         }

         if(updateRw.productId == null){
            res.status(403).json({
                message : "You are not authorized to update a review"
            })
            return
         }

         const updatereview = new Review({
            productId : updateRevs.productId,
            // userId : req.user.userId,
            email : req.user.email,
            rating : updateRevs.rating,
            comment : updateRevs.comment,
            images : updateRevs.images
           })

           const updatedReview = await updatereview.save();
           res.json({
            message : "Review updated successfully",
            review : updatedReview
        })

    }catch(err){
        res.status(400).json({
            message : "Failed to update review",
            error : err
        });
    }
}


export async function deleteReview(req,res){
    try{
        const deleteId = req.params.productId;
        const deleteRw = await Review.findOne({productId : deleteId})
        if(deleteRw.email != req.user.email){
            res.status(403).json({
                message : "You are not authorized to delete a review"
            })
            return
         }

         if(deleteRw.productId == null){
            res.status(403).json({
                message : "You are not authorized to delete a review"
            })
            return
         }

         const deletereview = new Review({
            productId : deleteRw.productId,
            // userId : req.user.userId,
            email : req.user.email,
            rating : "",
            comment : "",
            images : []
           })

           const deletedReview = await deletereview.save();
           res.json({
            message : "Review deleted successfully",
            review : deletedReview
        })

    }catch(err){
        res.status(400).json({
            message : "Failed to delete review",
            error : err
        });
    }
}
