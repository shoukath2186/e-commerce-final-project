
const Order = require('../model/ordersModel');

const Product = require('../model/productModel');

const User = require('../model/userModel');



const notificationsload = async (req, res) => {
    try {
        const orderData = await Order.find({}).populate('items.productId').populate('userId').sort({_id:-1});
        //console.log(orderData);
        res.render('order', { order: orderData });
    } catch (error) {
        console.log(error.message);
    }
}

const productviewLoad = async (req, res) => {
    try {
        const orderId = req.query.orderid;



        const orderdata = await Order.findOne({ _id: orderId }).populate('items.productId');
        //console.log(orderdata)



        res.render('productview', { product: orderdata });

    } catch (error) {
        console.log(error.message);
    }
}

const verifyupdateStatus = async (req, res) => {
    try {
        const newstatus = req.query.status;
        const orderId = req.query.dataId;
        const productid = req.query.productId;
        const userId = req.query.userId;
        const productnewid = req.query.product_id;

        //console.log(2222,newstatus,3333,productid,4444,orderId);

        const orderData = await Order.findOne({ _id: orderId });

        // console.log(orderData);

        // console.log(orderData);

        if (newstatus == 'Cancelled' || newstatus == 'Returned' || newstatus == 'Approved') {



            if (orderData.paymentMethod == 'razerpay' || orderData.paymentMethod == 'wallet') {

                if(orderData.status !=='pending'){

                const userId = orderData.userId

                const userData = await User.findById(userId);

                const productPrice = await Order.findOne({ _id: orderId, 'items._id': productnewid });

                const matchingItem = productPrice.items.filter(data => data._id == String(productnewid));

                //console.log(matchingItem);

                const total = matchingItem[0].totalprice;

                const newtotal = userData.wallet + total

                //console.log(1111,newtotal,2222,total);

                const history = [{
                    date: new Date(),
                    amount: total,
                    description: '+ credit'
                }]

                const update = await User.updateOne({ _id: userId }, {
                    $set: { wallet: newtotal },
                    $push: { walletData: { $each: history } }
                });

            }

            }


            const orderDatas = await Order.findOne({ _id: orderId });

            orderDatas.items.forEach(async (item) => {

                if (item.productId.toString() === productid) {
                    const productdata = await Product.findOne({ _id: item.productId });
                    //console.log(productdata);

                    //console.log(item);
                    const newQty = item.quantity + productdata.quantity
                    //console.log(999,newQty);
                    await Product.updateOne({ _id: productdata._id }, { $set: { quantity: newQty } })



                }
            });

        }

        if (orderData) {
            orderData.items.forEach(async (item) => {
                // console.log('success',item.productId.toString(),'==',productid);
                if (item.productId.toString() === productid) {

                    const updatedOrder = await Order.updateOne(
                        { _id: orderId, 'items.productId': productid },
                        { $set: { 'items.$.oaderStatus': newstatus } }
                    );
                    // console.log(updatedOrder);
                }
            });

            res.send({ data: 'sucsess' });
        }


    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    notificationsload,
    productviewLoad,
    verifyupdateStatus
}