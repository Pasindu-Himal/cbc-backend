
import Order from "../models/order.js"
import Product from "../models/product.js"

export async function createOrder(req,res){
    if(req.user == null){
        res.status(403).json({
            message : "Please login and try again"
        })
        return
    }

    const orderInfo = req.body

    if(orderInfo.name == null){
        orderInfo.name = req.user.firstName + " " + req.user.lastName
    }

    //CBC-00001
    let orderId = "CBC-00001"

    const lastOrder = await Order.find().sort({date : -1}).limit(1)

    //[]-one element array return when find() is called
    if(lastOrder.length > 0){
        const lastOrderId = lastOrder[0].orderId  //"CBC00547"

        const lastOrderNumberString = lastOrderId.replace("CBC-", "")  //"00547"
        const lastOrderNumber = parseInt(lastOrderNumberString)  //547
        const newOrderNumber = lastOrderNumber + 1  //548
        const newOrderNumberString = String(newOrderNumber).padStart(5, '0');
        orderId = "CBC-" + newOrderNumberString  //"CBC-00548" 
    }

    

    try{
        let total = 0;
        let labelledTotal = 0;
        const products = []

        for(let i=0; i<orderInfo.products.length; i++){

            const item = await Product.findOne({productId : orderInfo.products[i].productId})
            if(item == null){
                res.status(404).json({
                    message : "Product with productId " + orderInfo.products[i].productId + " not found"
                })
                return
            }

            if(item.isAvailable == false){
                res.status(404).json({
                    message : "Product with productId " + orderInfo.products[i].productId + " is not available right now"
                })
                return
            }

            products[i] = {
                productInfo : {
                    productId : item.productId,
                    name : item.name,
                    altName : item.altName,
                    description : item.description,
                    images : item.images,
                    labelledPrice : item.labelledPrice,
                    price : item.price
                },
                quantity : orderInfo.products[i].qty
            }
            //total = total + (item.price * orderInfo.products[i].qty)
            total += (item.price * orderInfo.products[i].qty)
            //labelledTotal = labelledTotal + (item.labelledPrice * orderInfo.products[i].qty)
            labelledTotal += (item.labelledPrice * orderInfo.products[i].qty)
        }
        
        const order = new Order({
            orderId : orderId,
            email : req.user.email,
            name : orderInfo.name,
            address : orderInfo.address,
            total : 0,
            phone : orderInfo.phone,
            products : products,
            labelledTotal : labelledTotal,
            total : total
        })

        const createdOrder = await order.save()
        res.json({
            message : "Order created successfully",
            order : createdOrder
        })
    }catch(err){
        res.status(500).json({
            message : "Failed to create order",
            error : err
        })
    }

}