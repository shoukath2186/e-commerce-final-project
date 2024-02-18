
const User = require('../model/userModel');

const Order = require('../model/ordersModel');

const Product = require('../model/productModel');

const bcrypt = require("bcrypt");

const product = require('../model/productModel');

const fs = require('fs')

const path = require('path')







const profileLoad = async (req, res) => {
    try {
        const userid = req.session.user_id;
        const userData = await User.findOne({ _id: userid })
        res.render('profile', { data: userData });

    } catch (error) {
        console.log(error.message);
    }
}


const editProfileLoad = async (req, res) => {
    try {
        const userid = req.session.user_id;
        const userData = await User.findOne({ _id: userid })

        res.render('editProfile', { data: userData })
    } catch (error) {
        console.log(error.message);
    }
}

const verifyeditProfile = async (req, res) => {
    try {
        const name = req.body.name;
        const userid = req.session.user_id;
        const mobile = req.body.mobile;

        await User.updateOne({ _id: userid }, { $set: { name: name, mobile: mobile } });

        res.redirect('/userProfile');

    } catch (error) {
        console.log(error.message);
    }
}

const userpasswordLoad = async (req, res) => {
    try {
        res.render('userPassword')
    } catch (error) {
        console.log(error.message);
    }
}
//------------------------------------------------------------------------------------------
function isStrongPassword(password) {
    // Minimum length requirement
    if (password.length < 8) {
        return false;
    }

    // Check for uppercase and lowercase letters
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
        return false;
    }

    // Check for at least one numeric digit
    if (!/\d/.test(password)) {
        return false;
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return false;
    }

    // All criteria passed
    return true;
}


const securePassword = async (password1) => {
    try {
        const passwordHash = await bcrypt.hash(password1, 10);
        return passwordHash

    } catch (error) {
        console.log(error.message);
    }
}

//------------------------------------------------------------------------------------------

const verifypassword = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const oldPassword = req.body.passwordold
        const new1password = req.body.passwordnew1;
        const new2password = req.body.passwordnew2;

        //console.log(0,oldPassword,111,new1password,222,new2password);

        const userData = await User.findOne({ _id: userId })

        const passwordmatch = await bcrypt.compare(oldPassword, userData.password)

        if (passwordmatch) {

            if (new1password === new2password) {
                const checkpasswodr = isStrongPassword(new1password);

                if (checkpasswodr) {
                    const password = await securePassword(new1password);
                    await User.updateOne({ _id: userId }, { $set: { password: password } });

                    res.render('userPassword', { newmessage: 'Password changed successfully.' });
                } else {

                    res.render('userPassword', { oldpassword: oldPassword, pass2: new2password, new1PassEror: "Password is not strong enough(Strong@123)." });
                }
            } else {
                //console.log('pass not sime');
            }

        } else {
            if (oldPassword) {
                res.render('userPassword', { pass1: new1password, pass2: new2password, oldPassEror: 'Password not valid.' });
            }
        }

    } catch (error) {
        console.log(error.message);
    }
}

//--------------------------------------------------------------------------

const userOrderLoda = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const orderData = await Order.find({ userId: userId }).sort({ date: -1 }).populate('items.productId');


        const productIds = orderData.flatMap(order => order.items.map(item => item.productId));

        let productData;
        if (productIds.length > 0) {
            productData = await Product.find({ _id: { $in: productIds } });
            //console.log(22222, productData);
        } else {
            console.log("No productIds found");
        }

        // console.log(11111, orderData);

        res.render('userOrder', { data: orderData });
    } catch (error) {
        console.log(error.message);
    }
};


const OrderdetailLoad = async (req, res) => {
    try {

        const orderid = req.query.orderid;

        const orderData = await Order.findOne({ _id: orderid }).populate('items.productId').populate('userId')

        res.render('userSinglOrder', { order: orderData });

    } catch (error) {
        console.log(error.message);
    }
}


const verifyOrderRequst = async (req, res) => {
    try {

        const userId = req.session.user_id;
        const orderId = req.query.orderid;
        const productId = req.query.productid;
        const action = req.query.data;
        const reason = req.query.reason;



        if (action == 'cancel') {
            const orderData = await Order.findOne({ _id: orderId, userId: userId, 'items.productId': productId });

            if (orderData) {
                const updatedOrder = await Order.updateOne(
                    { _id: orderId, 'items.productId': productId },
                    { $set: { 'items.$.oaderStatus': 'Requested cancellation', 'items.$.cancellationreason': reason } }
                );

                //console.log(updatedOrder);
                res.send({ data: 'success' });
                // Check if the update was successful
                if (updatedOrder.nModified > 0) {
                    console.log('Order updated successfully.');
                } else {
                    // console.log('No orders were updated. Check your criteria.');
                }
            } else {
                console.log('No order found with the provided orderId, userId, and productId.');
            }

        } else {
            const orderData = await Order.findOne({ _id: orderId, userId: userId, 'items.productId': productId });

            if (orderData) {
                const updatedOrder = await Order.updateOne(
                    { _id: orderId, 'items.productId': productId },
                    { $set: { 'items.$.oaderStatus': 'Requested return', 'items.$.cancellationreason': reason } }
                );

                //console.log(11111111111,updatedOrder);
                res.send({ data: 'success' });
                // Check if the update was successful
                if (updatedOrder.nModified > 0) {
                    console.log('Order updated successfully.');
                } else {
                    // console.log('No orders were updated. Check your criteria.');
                }
                //res.sent({data:'success'});
            } else {
                console.log('No order found with the provided orderId, userId, and productId.');
            }

        }

    } catch (error) {
        console.log(error.message);
    }
}

//----------------------------------------------------------------------


const puppeteer = require('puppeteer');
const { stringify } = require('querystring');

const docsDir = path.join(__dirname, '');


const verifydownloadinvoice = async (req, res) => {
    try {
        const orderId = req.query.orderid

        const orderData = await Order.findById(orderId)
            .populate('items.productId')
            .populate("userId")
            .populate('deliveryaddress')
            .exec();

        if (orderData.status !== 'pending') {

            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            const data = {
                productlist: orderData.items.map((productItem, index) => {
                    let productInfo = {
                        'product Title': productItem.productId.name,
                        'product Qty': '' + productItem.quantity
                    };

                    // if(productItem.offer !== null && typeof productItem.offer !=='undefined'){
                    //     productInfo['Original Product Price']=productItem.productId.price;
                    //     productInfo['Discounted Price']=productItem.price;

                    //    const savings=productItem.productId.price-productItem.price;
                    //     const discountPercentage = (savings / productItem.productId.price) * 100;
                    //     productInfo['savings']= Discount: ${discountPercentage.toFixed(2)};

                    // }else{
                    productInfo['Original Product Price'] = productItem.productId.price;
                    productInfo['Product Price'] = '' + productItem.totalprice;
                    // }

                    return productInfo
                }),
                Address: {
                    name: orderData.deliveryaddress.name,
                    mobile: orderData.deliveryaddress.phone,
                    street: orderData.deliveryaddress.country,
                    area: orderData.deliveryaddress.landmark,
                    landmark: orderData.deliveryaddress.city,
                    landmark: orderData.deliveryaddress.address,
                    pincode: orderData.deliveryaddress.pincode,
                },
                subtotal: orderData.totalamount,

            }

            //console.log(data);
            const html = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }

        .company-heading {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }

        h1 {
          text-align: center;
          color: #333;
        }

        ul {
          list-style-type: none;
          padding: 0;
        }

        li {
          margin-bottom: 10px;
        }

        p {
          margin-top: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }

        th {
          background-color: #f2f2f2;
        }

        .invoice-details {
          border-top: 2px solid #333;
          padding-top: 10px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="company-heading">FUSIONFURNI</div>
      <ul>
          <li>Kinfra Kakkancheri</li>
          <li>Near Calicut University</li>
          <li>Kozhikode</li>
          <li>67122</li>
        </ul>
      <hr>

      <h1>Invoice</h1>
      <hr>
      <b><p>Address:</b>
        <ul>
          <li>Name: ${data.Address.name}</li>
          <li>Mobile: ${data.Address.mobile}</li>
          <li>Street: ${data.Address.street}</li>
          <li>Area: ${data.Address.area}</li>
          <li>Landmark: ${data.Address.landmark}</li>
          <li>Pincode: ${data.Address.pincode}</li>
        </ul>
      </p>
      <table>
        <thead>
          <tr>
            <th>Product Title</th>
            <th>Original Product Price</th>
            <th>quantity</th>
            <th>Discounted Price</th>
            <th>Savings %</th>
           <th>Totel</th>
            
          </tr>
          </thead>
          <tbody>
  ${data.productlist.map(products => `
    <tr>
      <td>${products['product Title']}</td>
      <td>${products['Original Product Price'] ? `₹${products['Original Product Price']}` : ''}</td>
      <td>${products['product Qty'] ? products['product Qty'] : '0'}</td>
      <td>${products['Discounted Price'] ? `₹${products['Discounted Price']}` : '00'}</td>
      <td>${products['Savings'] ? products['Savings'] : '0%'}</td>
      <td>${products['Product Price'] ? `₹${products['Product Price']}` : ''}</td>
    </tr>
  `).join('')}
</tbody>
          </table>

     <b><p>Subtotal: ₹${data.subtotal}</p></b> 

      <div class="invoice-details">
        <p>Invoice ID: ${generateInvoiceID()}</p>
        <p>Invoice Date: ${new Date().toLocaleDateString("en-GB")}</p>
      </div>
    </body>
  </html>
`;

            function generateInvoiceID() {
                return Math.floor(1000 + Math.random() * 9000);
            }


            await page.setContent(html);

            const filename = Math.random() + '_doc' + '.pdf';
            const filepath = path.join(docsDir, filename);

            await page.pdf({
                path: filepath,
                format: 'A4',
                displayHeaderFooter: true,
                headerTemplate: '<h4 style="color: red; font-size: 20; font-weight: 800; text-align: center;">CUSTOMER INVOICE</h4>',
                footerTemplate: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
            });

            await browser.close();

            // Sending the file for download
            res.download(filepath, filename, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error initiating download');
                }

                fs.unlinkSync(filepath);
            });

            // console.log(data);
            //console.log(orderData);
        } else {
            res.send("<h1 style='color:red'>payment pending</h1>");
        }

    } catch (error) {
        console.log(error.message);
    }
}







const addressManageLoad = async (req, res) => {
    try {
        const userId = req.session.user_id;

        const userdata = await User.findOne({ _id: userId });

        res.render('userAddress', { datas: userdata });

    } catch (error) {
        console.log(error.message);
    }
}


const userAddAddressLoad = async (req, res) => {
    try {

        res.render('userAddAddress');

    } catch (error) {
        console.log(error.message);
    }
}


const verifyuserAddAddress = async (req, res) => {
    try {

        const userid = req.session.user_id;

        const { name, phone, country, landmark, city, address, pincode } = req.body;

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

        res.redirect('/addressManage')
    } catch (error) {
        console.log(error.message);
    }
}


const verifyEditAddAdres = async (req, res) => {
    try {

        const userid = req.query.userids;
        const addressid = req.query.addressids;

        //console.log(req.query);

        //console.log(11111,userid,22222,addressid);

        const user = await User.findOne({ _id: userid, 'address._id': addressid });

        let Address;
        if (user && user.address) {
            // Find the matching address in the user's address array
            Address = user.address.find(addr => addr._id.toString() === addressid);
        }

        //console.log(11111111111,Address);

        res.render('userEditAddress', { address: Address });

    } catch (error) {
        console.log(error.message);
    }
}


const verifyEditAddress = async (req, res) => {
    try {

        const userid = req.session.user_id;
        const addressId = req.body.addressId;

        const { name, phone, country, landmark, city, address, pincode } = req.body;

        const updateData = await User.updateOne({ _id: userid, 'address._id': addressId }, {
            $set: {
                'address.$.name': name,
                'address.$.phone': phone,
                'address.$.country': country,
                'address.$.landmark': landmark,
                'address.$.city': city,
                'address.$.address': address,
                'address.$.pincode': pincode
            }
        })

        //console.log(updateData);

        res.redirect('/addressManage')

    } catch (error) {
        console.log(error.message);
    }
}


const verifydeleteAddress = async (req, res) => {
    try {

        const userid = req.body.userid;
        const addressid = req.body.addressid;

        //console.log(req.body);


        const updateData = await User.updateOne(
            { _id: userid },
            {
                $pull: {
                    address: { _id: addressid }
                }
            }
        );
        res.redirect('/addressManage')
        //console.log(updateData);


    } catch (error) {
        console.log(error.message);
    }
}


const walletLoad = async (req, res) => {
    try {
        const UserId = req.session.user_id;
        const userData = await User.findById(UserId);
        //console.log(userData);
        res.render("wallet", { data: userData });
    } catch (error) {
        console.log(error.message);
    }
}

//============================================================
const Rayorpay = require('razorpay');
var instance = new Rayorpay({
    key_id: 'rzp_test_fz8s5MTBK2bkp1',
    key_secret: 'kvbMa8Bi3xVB5LRcfnIONyBw'
});

const randomstrng = require('randomstring');

//================================================================
const verifyWalletAmount = async (req, res) => {
    try {

        const total = req.body.amount;

        const randomString = randomstrng.generate({
            length: 15,
            charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        });

        var options = {
            amount: total * 100,
            currency: 'INR',
            receipt: randomString

        };
        instance.orders.create(options, function (err, order) {
            res.send({ status: 'success', order: order });


        })

    } catch (error) {
        console.log(error.message);
    }
}


const verifyaddAmount = async (req, res) => {
    try {

        const UserId = req.session.user_id;
        const amount = req.body.amount.amount;
        const total = amount / 100

        const userData=await User.findById(UserId)

        const newtotal=userData.wallet+total

        const history=[{date:new Date(),
            amount:total,
            description:'+ credit'
        }]

        const update = await User.updateOne({ _id: UserId }, {
            $set: { wallet: newtotal },
            $push: { walletData: { $each: history } }
        });

        res.send({status:'success'})

    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    profileLoad,
    editProfileLoad,
    verifyeditProfile,
    userpasswordLoad,
    verifypassword,
    userOrderLoda,
    OrderdetailLoad,
    verifyOrderRequst,
    verifydownloadinvoice,
    addressManageLoad,
    userAddAddressLoad,
    verifyuserAddAddress,
    verifyEditAddAdres,
    verifyEditAddress,
    verifydeleteAddress,
    walletLoad,
    verifyWalletAmount,
    verifyaddAmount



}
