import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// PLACE ORDER
const placeOrder = async (req, res) => {
  try {
    const frontend_url = "https://food-del-frontend-gxrc.onrender.com"; // apna correct port rakho

    // 1️⃣ Save order in DB
    const newOrder = new orderModel({
      userId: req.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();

    // 2️⃣ Clear user cart
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    // 3️⃣ Stripe needs MIN ₹50 → so send TOTAL amount as ONE item
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Food Order",
            },
            unit_amount: req.body.amount * 100, // ₹ → paisa
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.log("BACKEND ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};

// VERIFY ORDER
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.query;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment Successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Verify Error" });
  }
};

// USER ORDERS
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// ADMIN LIST
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// UPDATE STATUS
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };


// import { response } from "express";
// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js"
// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)



// // placing user model from frontend
// const placeOrder = async (req,res)=>{
    
//     const frontend_url = "http://localhost:5173"

//     try {
//         const newOrder = new orderModel({
//             userId:req.userId,
//             items:req.body.items,
//             amount:req.body.amount,
//             address:req.body.address
//         })
//         await newOrder.save();

//         await userModel.findByIdAndUpdate(req.userId,{cartData:{}})
        


//         const line_items = req.body.items.map((item)=>({
//                price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:item.name
//                 },
//                 unit_amount:item.price*100
//                },
//                quantity:item.quantity
//         }))

//         line_items.push({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:"Delivery Charges"
//                 },
//                 unit_amount:2*100
//             },
//             quantity:1
//         })



//         const session = await stripe.checkout.sessions.create({
//             line_items:line_items,
//             mode:'payment',
//             success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
            

//         })

//         res.json({success:true,session_url:session.url})

//     } catch (error) {
//         console.log("BACKEND ERROR:", error);
//         res.json({success:false,message: error})
        
//     }
// }
// // userorder for frontend

// const verifyOrder = async (req, res) =>{
//     const  {orderId, success} = req.query;
//     try {
//         if (success == "true") {
//             await orderModel.findByIdAndUpdate(orderId,{payment:true});
//             res.json({success:true,message:"Paid"})
//         }
//         else{
//             await orderModel.findByIdAndDelete(orderId);
//             res.json({success:false,message:"Not Paid"})

//         }
        
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:"error"})
        
//     }
// }

// // user order fro frontend 

// const userOrders = async (req, res) =>{
//     try {
//         const orders = await orderModel.find({userId:req.userId});
//         res.json({success:true,data:orders})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
        
//     }
// }


// // listing orders for admin pannel 

// const listOrders = async (req,res)=>{
//        try {
//         const orders = await orderModel.find({});
//         res.json({success:true,data:orders})

//        } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"error"})
        
//        }
// }


// // api for updating order status

// const updateStatus = async (req,res) =>{
//   try {
//     await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
//     res.json({success:true,message:"Status updated"})
//   } catch (error) {
//     console.log(error);
//     res.json({success:false,message:"Error"})
    
    
//   }
// }

// export { placeOrder, verifyOrder, userOrders,listOrders,updateStatus}
