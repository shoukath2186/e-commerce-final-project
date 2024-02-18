
const Product = require("../model/productModel");

const Cart = require('../model/cartModel');

const User = require('../model/userModel');

const Order = require('../model/ordersModel');

const randomstrng = require('randomstring');

const Rayorpay=require('razorpay');

const product = require("../model/productModel");

const Wishlist=require('../model/wishlistModel');


const Coupon=require('../model/couponModel');

const Category=require('../model/categoryModel');

const Offer=require('../model/ordersModel');


var instance=new Rayorpay({
    key_id:'rzp_test_fz8s5MTBK2bkp1',
    key_secret:'kvbMa8Bi3xVB5LRcfnIONyBw'
});


//---------------------random string-------------------------------------

//const randomStrng=randomstrng.generate();



//---------------------------------------------------


const shoppingcartload = async (req, res) => {
    try {
        const user = req.session.user_id;

        const cartDetails = await Cart.find({ user_id: user }).sort({_id:-1}).populate('items.product_id').populate('user_id');



        if (cartDetails && cartDetails.length > 0) {
            // Initialize total price
            let total = 0;

            // Loop through each cart
            cartDetails.forEach(cart => {
                // Loop through each item in the cart
                cart.items.forEach(item => {
                    // Assuming 'totel_price' is a numeric field, add it to the total
                    total += item.totel_price;
                });
            });



            res.render("cart", { cartdata: cartDetails, totelprice: total });
        } else {
            res.render('cart', { cartdata: cartDetails, totelprice: 0 })
        }
    } catch (error) {
        console.log(error.message);
    }
}
//--------------------------

const verifyaddcart = async (req, res) => {
    try {
        const userid = req.session.user_id;
        const newQuantity = req.body.qty;
        const productId = req.body.productid;

        const price=req.body.Price;


        console.log(1111,price);



        const cartData = await Cart.find({ user_id: userid, 'items.product_id': productId }).populate('items.product_id');


        //console.log(cartData);

        if (cartData.length > 0) {



            const itemsArray = cartData[0].items;


            let totalQty = 0;
            const newQty = parseInt(newQuantity);

            itemsArray.forEach(item => {
                // Assuming item.product_id is the populated object
                totalQty += item.product_id.quantity;
            });

            

            // Calculate the total quantity
            let cartQty = 0;
            itemsArray.forEach(item => {
                // Assuming each item has a 'quantity' property
                cartQty += item.quantity;
            });

            const sumQty = cartQty + newQty;

           // console.log(1111, cartQty, 22222, sumQty);

            let finalQty;

            if (sumQty > totalQty) {
                 
                finalQty=totalQty.toString();
            } else {
                 finalQty=sumQty.toString();
            }



           const finelprice=finalQty* price;

            const cartdata = await Cart.updateOne(
                { user_id: userid, 'items.product_id': productId },
                { $set: { 'items.$.quantity': finalQty ,'items.$.totel_price':finelprice} }
            );
            //console.log(cartdata);
            res.redirect(`/showdetails/${productId}`);
        } else {

            const userdata=await User.findById({_id:userid});

            const productdata=await Product.findOne({_id:productId})

            
            const newCart = new Cart({
                user_id: userdata,
                items: [{
                    product_id:productdata,
                    quantity:newQuantity,
                    price:price,
                    totel_price:price,
                }]
            })

            await newCart.save()

            await Cart.updateOne(
                { user_id: userid, 'items.product_id': productId },
                { $set: { 'items.$.quantity': newQuantity } }
            );

            
           res.redirect(`/showdetails/${productId}`);
        }



    } catch (error) {
        console.log(error.message);
    }
}


const cartload = async (req, res) => {
    try {
        const productid = req.params.id;

        const userid = req.session.user_id;

        const Price=req.body.price;

        //console.log(9999,Price);


        if (userid == undefined) {
            return res.render('newlogin', { message: 'Please login.' });

        }

        const userdata = await User.findOne({ _id: userid });



        const productdetil = await Product.findOne({ _id: productid });


        const cartdata = await Cart.find({ user_id: userid, 'items.product_id': productid })

        if (cartdata && cartdata.length > 0) {


            const cartData = await Cart.findOne({ user_id: userid, 'items.product_id': productid }).populate('items.product_id');






            if (cartData.items[0].quantity === cartData.items[0].product_id.quantity) {

                return res.redirect('/shop');


            }



            if (cartData) {
                
                const itemIndex = cartData.items.findIndex(item => item.product_id.equals(productid));

                if (itemIndex !== -1) {
                    
                    cartData.items[itemIndex].quantity += 1;

                    
                    cartData.items[itemIndex].totel_price = Price * cartData.items[itemIndex].quantity;

                   
                    const updatedCart = await cartData.save();
                   // console.log(5454,updatedCart);
                } else {
                    console.log('Item not found in the cart');
                }
            } else {
                console.log('Cart not found');
            }

            //console.log(a);        


            res.redirect('/shop');
        } else {



            const newCart = new Cart({
                user_id: userdata,
                items: [{
                    product_id: productdetil,
                    price: Price,
                    totel_price: Price,
                }]
            })

            await newCart.save()

            res.redirect('/shop')

        }
    } catch (error) {
        console.log(error.message);
    }
}





const verifyQty = async (req, res) => {
    try {
        const user = req.session.user_id;
        const qty = req.query.qty;
        const cartid = req.query.cartid;
        const productid = req.query.productid;


        

        const cartdata = await Cart.findOne({ _id: cartid, user_id: user, 'items.product_id': productid })
        
       


        if (cartdata) {
            const itemIndex = cartdata.items.findIndex(item => item.product_id.equals(productid));

            if (itemIndex !== -1) {
                const item = cartdata.items[itemIndex];
                item.quantity = parseInt(qty);
                item.totel_price = item.price * parseInt(qty);
                const update = await cartdata.save();
                
            } else {
                console.log('Item not found in the cart');
            }
        } else {
            console.log('Cart not found');
        }


        const sendData=await Cart.find({user_id: user});

        if (cartdata) {

            res.send({ status: 'success', data:sendData  });
        } else {
            res.send({ status: 'faile', updated: false });
        }





    } catch (error) {
        console.log(error.message);
    }
}

const verifycartdelete = async (req, res) => {
    try {
        const user = req.session.user_id;
        const cartid = req.query.cartid;
        //console.log(cartid);
        await Cart.deleteOne({ _id: cartid, user_id: user });

        res.redirect('/shopping-cart')

    } catch (error) {
        console.log(error.message);
    }
}


//----------------------------------------------------------------------------------------------------------------------

const checkoutload = async (req, res) => {
    try {
        const userid = req.session.user_id;

        const userdata = await User.findOne({ _id: userid });

        const cartdata = await Cart.find({ user_id: userid }).populate('items.product_id')

        let total = 0;

        // Loop through each cart
        cartdata.forEach(cart => {
            // Loop through each item in the cart
            cart.items.forEach(item => {
                // Assuming 'totel_price' is a numeric field, add it to the total
                total += item.totel_price;
            });
        });

        const coupondata=await Coupon.find({}).sort({_id:-1});
        
        
        res.render('checkout', { userdata: userdata, cart: cartdata, total: total,coupon:coupondata });

    } catch (error) {
        console.log(error.message);

    }
}




const verifySingleCheck = async (req, res) => {
    try {


        const userid = req.session.user_id;

        const fullproduct = req.query.fullproduct;





        const userdata = await User.findOne({ _id: userid });
        if (fullproduct) {
            res.redirect('/checkout')
        } else {
            const cartid = req.query.cartid;


            const cartdata = await Cart.findById({ _id: cartid, user_id: userid }).populate('items.product_id');

            //console.log(cartdata);

            const total = cartdata.items[0].totel_price;

            const coupondata=await Coupon.find({}).sort({_id:-1});

            //console.log('cart data;',cartdata,'user data;',userdata,'totel;',total);
            res.render('checkout', { userdata: userdata, cart: cartdata, total: total,coupon:coupondata });
        }
    } catch (error) {
        console.log(error.message);
    }
}







const addAddressverify = async (req, res) => {
    try {

        const userid = req.session.user_id;

        const { name, phone, country, landmark, city, address, pincode } = req.body;

        //console.log(req.body);

        const userdata = await User.findOneAndUpdate({ _id: userid }, {

            $push: {
                address: {
                    name: name,
                    phone: phone,
                    country: country,
                    landmark: landmark,
                    city: city,
                    address: address,
                    pincode: pincode
                }
            }

        },
            { new: true }
        );

        const cartid = req.query.cartid;



        if (cartid) {
            //console.log(cartid);
            const cartdata = await Cart.findById({ _id: cartid, user_id: userid });

            const userdata = await User.findOne({ _id: userid });

            //console.log(cartdata);

            const total = cartdata.items[0].totel_price;

            //console.log('cart data;',cartdata,'user data;',userdata,'totel;',total);
            res.render('checkout', { userdata: userdata, cart: cartdata, total: total });
        } else {
            res.redirect('/checkout');
        }


    } catch (error) {
        console.log(error.message);
    }
}

//-------------------------------------------------------------------------------------------------------------------------

const verifyCoupon=async(req,res)=>{
    try {
        const userid=req.session.user_id;
        const total=req.body.amount
        const userdata=await User.findById(userid)
        const couponCode=req.body.code;
        
        


        const coupon=await Coupon.findOne({couponCode:couponCode}).populate('userUsed.userId');

         
              const userIds = coupon.userUsed.map(user => user.userId);

    
            const userExists = userIds.includes(userdata._id);

            //console.log(1111,userIds,2222,userdata._id);
       
            //console.log(99999,userExists);

        if(!userExists){

            if(coupon.minAmount<total){
                 const newdate=new Date();
                 

                 const dbdate=coupon.expiryDate;

                 
                if(newdate<dbdate){

                    if(coupon.availability==0) {
                        console.log('fail');
                        res.send({status:'noQty'})
                    }else{
                      
                    await Coupon.updateOne({couponCode:couponCode},{$push:{userUsed:userdata._id}})
                    await Coupon.updateOne({couponCode:couponCode},{$inc:{availability:-1}});
                    //console.log(coupon);
                      
                    //console.log('success');

                      const newAmount=total-coupon.discountAmount

                      res.send({status:'success',data:newAmount})
                    }
                }else{
                    res.send({status:'date'})
                }
                 
            }else{
                res.send({status:'minAmount'})
            }

        }else{      
            res.send({status:'used'})

        }
        
    } catch (error) {
        console.log(error.message);
    }
}



const verifybuyproduct = async (req, res) => {
    try {
        const userid = req.session.user_id;
       
        const total=req.query.total;

        const cartid=req.query.cartid;

        const addressid = req.query.addid;

        const paymentmeted=req.query.method;

       

        //console.log('total:',total,'cartid:',cartid,'addressid:',addressid,4567,paymentmeted);
        
       
        const userdata = await User.findOne({ _id: userid });

        //----------------------------------------------

       let paymentids;
       let paymentmeterd;
       let newstatus;

        if (paymentmeted==='COD') {
            const randomString = randomstrng.generate({
                length: 15,
                charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            });
        
            paymentids=randomString
            paymentmeterd='COD';
            
    
            
        }else if(paymentmeted==='wallet'){
            const randomString = randomstrng.generate({
                length: 15,
                charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            });
        
            paymentids=randomString
            paymentmeterd='wallet';
            newstatus='orderd'

            const usertotal=userdata.wallet;
            if(usertotal<total){
                return res.send({status:'faild'})
            }

        }else{
            const randomString = randomstrng.generate({
                length: 15,
                charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            });
        
            paymentids=randomString
            paymentmeterd='razerpay';
           

        
        }


        const paymentid = randomstrng.generate({
            length: 10,
            charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        });
        
        
        
        
        
       //--------------------

       
       

        //console.log(cartid);

        let items = []; 

        

        if (cartid) {
            const cartData = await Cart.findOne({ _id: cartid, user_id: userid });

            //console.log(cartdata.items);



            cartData.items.forEach((item) => {
               
                const newItem = {
                    productId: item.product_id, 
                    quantity: item.quantity,
                    price: item.price,
                    totalprice: item.totel_price,
                    cancellationreason: '' 
                }
                items.push(newItem);
            }

            );

            await Cart.deleteOne({_id:cartid})
            //console.log('cartData:',cartdata,'totel:',total);
        } else {

            const cartData = await Cart.find({ user_id: userid });

            cartData.forEach((cart) => {
                cart.items.forEach((item) => {
                    
                   

                    
                    const newItem = {
                        productId: item.product_id, 
                        quantity: item.quantity,
                        price: item.price,
                        totalprice: item.totel_price,
                        cancellationreason: ''
                    };

                    // Push the new item into the items array
                    items.push(newItem);
                });
            });

        await Cart.deleteMany({user_id: userid});

        }

       // console.log(2222,items);


        const date = new Date();
        const delivery = new Date(date.getTime() + 10 * 24 * 60 * 60 * 1000);
        const deliveryDate = delivery.toLocaleString("en-US", { year: "numeric", month: "short", day: "2-digit" }).replace(/\//g, "-");

        

        const matchingAddress = userdata.address.find(addr => addr._id == addressid);

        //console.log(3333,matchingAddress);

        const newOrder = new Order({
            userId: userdata,
            orderId: paymentids,
            paymentMethod:paymentmeterd,
            deliveryaddress: matchingAddress, 
            totalamount: total,
            date: new Date(),
            expecteddelivery: deliveryDate,
            status:newstatus|| 'placed',
            paymentId: paymentid,
            totel: total,
            items: items
        });

         
        const orderdatas = await newOrder.save();

        //console.log(4444,orderdatas);

        const orderId=orderdatas._id;

      

        const updatePromises = orderdatas.items.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (product) {
              const newQuantity = product.quantity - item.quantity;
              await Product.updateOne(
                { _id: item.productId },
                { $set: { quantity: newQuantity } }
              );
            }
          });
          
          await Promise.all(updatePromises);
        
        

          if (paymentmeted==='COD') {
          
            res.send({status:'success',odredid:orderId});
            
        }else if(paymentmeted==='wallet'){
            
            const amount=userdata.wallet-orderdatas.totalamount

            const history=[{
                date:new Date(),
                amount:orderdatas.totalamount,
                description:'- debit'
            }]


            const updatedata = await User.updateOne({ _id: userid },{
                $set:{wallet:amount},
                $push: { walletData: { $each: history } }

            });



            res.send({status:'success',odredid:orderId});
        }else{

            var options = {
                amount: total*100,
                currency: 'INR',
                receipt: orderdatas.paymentId
                
            };
            instance.orders.create(options,function(err,order){
                res.send({status:'razer',order:order});
                //console.log(88888,order);

            })
        }
        

    } catch (error) {
        console.log(error.message);
    }
}

const successpageload=async (req,res)=>{
    try {
        
         const orderid=req.query.orderid;

         const paymentId =req.query.paymentid;

         
         
         
         let orderdata;
        
         if(orderid){
        orderdata=await Order.findOne({_id:orderid}).populate('items.productId');
         }else{
           orderdata=await Order.findOne({paymentId:paymentId}).populate('items.productId'); 
         }
        
          res.render('ordersuccesspage', { order: orderdata });
        
    } catch (error) {
        console.log(error.message);
    }
}




const verifypayment=async(req,res)=>{
    try {
        const datas=req.body;

        const crypto=require('crypto');
        let hmac = crypto.createHmac('sha256','kvbMa8Bi3xVB5LRcfnIONyBw')
        

        //console.log(2222,req.body);

        const paymentId=req.body.orderdatas.order.receipt;
        const update=await Order.updateOne({paymentId:paymentId},{$set:{status:'success'}})

        //console.log(3333,update);

        hmac.update(datas.payment.razorpay_order_id + "|" + datas.payment.razorpay_payment_id);

        const hmacFormat = hmac.digest('hex');

       // console.log(2222,hmacFormat);

       if (hmacFormat == datas.payment.razorpay_signature) {
         //console.log('success');
          res.send({status:true}) ; 
         }else{
            //console.log('fail');
            res.send({status:false})
         }
    } catch (error) {
        console.log(error.message);
    }
}
//---------------------------------------------------

const verifyRepayment=async(req,res)=>{
    try {
        const OrderId=req.body.orderId
        const orderData=await Order.findById(OrderId);

        console.log(orderData);
         const total=parseInt(orderData.totalamount);
        var options = {
            amount: total*100,
            currency: 'INR',
            receipt: orderData.paymentId
            
        };
        instance.orders.create(options,function(err,order){
            res.send({status:'razer',order:order});
            

        })
        
    } catch (error) {
        console.log(error.message);
    }
}

//-----------------------------------------------

const verifyStatus=async(req,res)=>{
    try {
        //console.log(8989,req.body);
        const paymentId=req.body.orderdata.order.receipt;
        
        const update=await Order.updateOne({paymentId:paymentId},{$set:{status:'pending'}})
        res.send({data:'success'});
    } catch (error) {
        console.log(error.message);
    }
}


const wishlistLoad=async(req,res)=>{
    try {
        const userid=req.session.user_id;

        const wishlist=await Wishlist.find({userId:userid}).populate('productId').sort({_id:-1});

        //console.log(wishlist);

        res.render('wishlist',{datas:wishlist});
    } catch (error) {
        console.log(error.message);
    }
}

const verifyWishlist=async(req,res)=>{
    try {
        const userid=req.session.user_id;
        const productid=req.query.productid;

        const existdata=await Wishlist.findOne({productId:productid})

        if(!existdata){

        const userdata=await User.findById(userid);
        const productdata=await product.findById(productid);

        

        const newWishlist=new Wishlist({
            userId:userdata._id,
            productId:productdata._id
        })

        await newWishlist.save()

    }
         


        
        
    } catch (error) {
        console.log(error.message);
    }
}


const verifydeliteWishlist=async(req,res)=>{
    try {
        const wishid=req.query.wishlistId;

        await Wishlist.deleteOne({_id:wishid});

        res.redirect('/wishlist')
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    shoppingcartload,
    verifyaddcart,
    cartload,
    verifyQty,
    verifycartdelete,
    checkoutload,
    verifySingleCheck,
    addAddressverify,
    verifyCoupon,
    verifybuyproduct,
    successpageload,
    verifypayment,
    verifyRepayment,
    verifyStatus,
    wishlistLoad,
    verifyWishlist,
    verifydeliteWishlist
}