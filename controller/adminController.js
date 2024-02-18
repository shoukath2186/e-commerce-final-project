


const Category = require('../model/categoryModel');

const User = require('../model/userModel');

const config = require('../config/config');

const Order = require('../model/ordersModel');

const Product = require('../model/productModel');









const adminloginload = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const getdata = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const adminemail = config.adminemail;
        const adminpassword = config.adminpassword;
        if (email == adminemail) {
            if (password == adminpassword) {


                req.session.admin_id = email;


                res.redirect("/admin/index");

            } else {
                res.render('login', { message: "Password not match." });
            }

        } else {
            res.render('login', { message: "Email incorrect." })
        }

    } catch (error) {
        console.log(error.message);
    }

}

//---------------------------------------

const testload = async (req, res) => {
    try {



        const currentYear = new Date().getFullYear();
        const yearsTolnclude = 7;
        const currentMonth = new Date().getMonth() + 1;

        



        const defaultMonthlyValue = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            total: 0,
            count: 0,
        }))

        const defaultYearlyValues = Array.from({ length: yearsTolnclude }, (_, i) => ({
            year: currentYear - yearsTolnclude + i + 1,
            total: 0,
            count: 0,
        }))

        // const defaultWeeklyValues = Array.from({ length: 7 }, (_, i) => ({
        //     week: i + 1,
        //     total: 0,
        //     count: 0,
        // }));

        //console.log("111",currentYear ,'333', yearsTolnclude,"222", currentMonth);


        

        //-----------------mountly saleseData graph



        const monthlySalesData = await Order.aggregate([
            {
                $unwind: '$items'
            },
            {
                $match: {
                    "items.oaderStatus": "Delivered",
                    createdAt: { $gte: new Date(currentYear - yearsTolnclude, currentMonth - 1, 1) },
                },
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: {
                        $sum: {
                            //$subtract:[
                            //{
                            $multiply: ['$items.quantity', '$items.price']
                            //}
                            //]
                        }
                    },
                    count: { $sum: 1 },
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id',
                    total: '$total',
                    count: '$count'
                }
            }
        ])



        const updatedMonthlyValues = defaultMonthlyValue.map((defaultMonth) => {
            const foundMount = monthlySalesData.find((monthData) => monthData.month === defaultMonth.month)
            return foundMount || defaultMonth
        })

        //console.log("monthlySalesData",updatedMonthlyValues);

        //-----------------------------year salese data grap-----------------------

        const yearlySalesData = await Order.aggregate([
            {
                $unwind: "$items"
            },
            {
                $match: {
                    "items.oaderStatus": "Delivered",
                    createdAt: { $gte: new Date(currentYear - yearsTolnclude, 0, 1) },

                },
            },
            {
                $group: {
                    _id: { $year: '$createdAt' },
                    total: {
                        $sum: {
                            // $subtract:[
                            $multiply: ['$items.quantity', '$items.price'],
                            //]
                        }
                    },
                    count: { $sum: 1 },
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id",
                    total: "$total",
                    count: "$count",
                }
            }

        ])

        const updatedYearlyValues = defaultYearlyValues.map((defaultYear) => {
            const fountYear = yearlySalesData.find((yearData) => yearData.year === defaultYear.year)
            return fountYear || defaultYear
        })

        //console.log("yearlySalesData",updatedYearlyValues);
        //---------------monthly users---------------------

        const verifyUserData = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(currentYear - yearsTolnclude, currentMonth - 1, 1) },
                },
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { $sum: 1 },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id field
                    month: '$_id',
                    total: '$total',
                    count: '$count',
                },
            },
        ]);

        const updatedMonthlyUsers = defaultMonthlyValue.map((defaultMonth) => {
            const foundMonth = verifyUserData.find((monthData) => monthData.month === defaultMonth.month);
            return foundMonth || defaultMonth;
        })

        //console.log("verifyUserData",updatedMonthlyUsers);
        //---------------------------yearly users-----------------------  

        const yearlyUsers = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(currentYear - yearsTolnclude, 0, 1) },
                },
            },
            {
                $group: {
                    _id: { $year: '$createdAt' },
                    total: { $sum: 1 },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id',
                    total: '$total',
                    count: '$count'
                }


            }
        ])

        const updatedYearUser = defaultYearlyValues.map((defaultYear) => {
            const findYearlyUser = yearlyUsers.find((yearData) => yearData.year == defaultYear.year);
            return findYearlyUser || defaultYear
        })


        //console.log("yealyBayProduct",updatedYearUser);
        //--------------------orders------------------------------

        const monthlyBayProduct = await Order.aggregate([
            {
                $unwind: '$items'
            },
            {
                $match: {
                    "items.oaderStatus": "Delivered",
                    createdAt: { $gte: new Date(currentYear - yearsTolnclude, currentMonth - 1, 1) },
                }

            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: {
                        $sum: 1
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id',
                    total: '$total',
                    count: '$count'
                }
            }

        ])

        const updatedMonthlyOrder = defaultMonthlyValue.map((defaultMonth) => {
            const findMonthlyOrder = monthlyBayProduct.find((monthData) => monthData.month == defaultMonth.month);
            return findMonthlyOrder || defaultMonth
        })


        //console.log("monthlyBayProduct",updatedMonthlyOrder);
        //----------------------yearly order-----------------------------

        const yearlyOrder = await Order.aggregate([
            {
                $unwind: '$items'
            },
            {
                $match: {
                    "items.oaderStatus": "Delivered",
                    createdAt: { $gte: new Date(currentYear - yearsTolnclude, 0, 1) },
                }
            },
            {
                $group: {
                    _id: { $year: '$createdAt' },
                    total: { $sum: 1 },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id',
                    total: '$total',
                    count: '$count'
                }
            }

        ])

        const updatedYearlyOrder = defaultYearlyValues.map((defaultYear) => {
            const fountYear = yearlyOrder.find((yearData) => yearData.year === defaultYear.year);
            return fountYear || defaultYear
        })

        //console.log("yearlyOrder",updatedYearlyOrder);

        //---------------------------------------------------------------








        const orderdata = await Order.aggregate([
            { $match: { status: { $ne: ['Returned'] } } },
            { $sort: { date: -1 } },
        ]).limit(5);


        const userdata = await User.find({}).limit(5).sort({ createdAt: -1 });


        //-------------------------------------------------------

        const productData = await Product.find({});

        let total = 0

        productData.forEach((product) => {
            // Ensure that quantity and price are valid numbers before calculating
            const quantity = Number(product.quantity);
            const price = Number(product.price);


            total += quantity * price;

        });

        const usersdata = await User.find({});

        const totalUser = usersdata.length;




        const totalOrder = productData.length;

        //--------------------best items----------------------

        const allProduct = await Order.aggregate([
            { $unwind: '$items' },
            { $lookup: { from: 'products', localField: 'items.productId', foreignField: '_id', as: 'product' } },
            { $unwind: '$product' },
            { $group: { _id: '$product.name', count: { $sum: 1 } } },
            { $project: { _id: 0, name: '$_id', number: '$count' } },

            { $sort: { number: -1 } },
            { $limit: 10 }
        ]);

        const allBrand = await Order.aggregate([
            { $unwind: '$items' },
            { $lookup: { from: 'products', localField: 'items.productId', foreignField: '_id', as: 'product' } },
            { $unwind: '$product' },
            { $group: { _id: '$product.brand', count: { $sum: 1 } } },
            { $project: { _id: 0, name: '$_id', number: '$count' } },

            { $sort: { number: -1 } },
            { $limit: 10 }
        ]);


        const bestCellingCatege = await Order.aggregate([
            { $unwind: '$items' },
            { $lookup: { from: 'products', localField: 'items.productId', foreignField: '_id', as: 'product' } },
            { $unwind: '$product' },
            { $lookup: { from: 'categories', localField: 'product.category', foreignField: '_id', as: 'category' } },
            { $group: { _id: '$category.name', count: { $sum: 1 } } },
            { $project: { _id: 0, name: '$_id', number: '$count' } },
            { $sort: { number: -1 } },
            { $limit: 10 }
        ]);






        //-------------------------------------
        //console.log(productsData);




        res.render('index', {
            user: userdata,
            order: orderdata,
            //---graf-----------
            monthValue: updatedMonthlyValues,
            yearValue: updatedYearlyValues,

            monthUser: updatedMonthlyUsers,
            yearUsers: updatedYearUser,

            monthlyOrder: updatedMonthlyOrder,
            yearlyOrder: updatedYearlyOrder,

            //---------header-----------
            total,
            totalUser,
            totalOrder,
            //-----best items----
            allProduct,
            allBrand,
            allCatege: bestCellingCatege


        });
    } catch (error) {
        console.log(error.message);
    }
}









const docsload = async (req, res) => {
    try {
        const users = await User.find({ is_admin: 0 });
        res.render('docs', { users: users });
    } catch (error) {
        console.log(error.message);

    }
}



const accountload = async (req, res) => {
    try {
        res.render('account');
    } catch (error) {
        console.log(error.message);
    }
}

const settingsload = async (req, res) => {
    try {
        res.render('settings');
    } catch (error) {
        console.log(error.message);
    }
}

const chartsload = async (req, res) => {
    try {

        const cartData = await Order.find({ 'items.oaderStatus': 'Delivered' }).populate('userId').populate('items.productId');




        res.render('charts', { order: cartData });
    } catch (error) {
        console.log(error.message);
    }
}

//-------------------xxxxxxxxx-----------------------

const verifydate = async (req, res) => {
    try {
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;

        //console.log(3333,startDate,4444,endDate);

        if (startDate && endDate) {

            const cartData = await Order.find({
                'items.oaderStatus': 'Delivered',
                createdAt: { $gte: startDate, $lte: endDate }
            }).populate('userId').populate('items.productId')
            // console.log(1111111,cartData);
            res.send({ order: cartData });
        }

    } catch (error) {
        console.log(error.message);
    }
}


//---------------------------------------------------

const helpload = async (req, res) => {
    try {
        res.render('help');
    } catch (error) {
        console.log(error.message);
    }
}





const updateuserstatus = async (req, res) => {
    try {
        const userid = req.params.id;
        const userdata = await User.findById(userid);

        if (!userdata) {
            return res.status(404).send('User not found.');
        }
        let updateUser;
        if (userdata.blocked) {
            updateUser = await User.findByIdAndUpdate(userid, { $set: { blocked: false } }, { new: true });
        } else {
            updateUser = await User.findByIdAndUpdate(userid, { $set: { blocked: true } }, { new: true });
        }

        res.send({ status: 'success', user: updateUser });


    } catch (error) {
        console.log(error.message);

    }
}


const logoutload = async (req, res) => {
    try {
        req.session.destroy();

        res.redirect('/admin/login')
    } catch (error) {
        console.log(error.message);
    }
}

//----------------orders---------------------------------------

module.exports = {
    adminloginload,
    getdata,
    testload,
    docsload,
    accountload,
    settingsload,
    chartsload,
    verifydate,
    helpload,
    updateuserstatus,
    logoutload
};