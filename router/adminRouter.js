const express=require('express');
const admin_router=express();
const path=require('path')
admin_router.set("view engine",'ejs');
admin_router.set("views","./views/adminPage");

admin_router.use(express.json());
admin_router.use(express.urlencoded({extended:true}));

const multer=require('multer');

const flash = require('express-flash');

admin_router.use(flash())


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        
        cb(null, path.join(__dirname,'..',"1adminproperties","publicImages"));
        
    },
    filename:function(req,file,cb){        
        const name = Date.now() + '-' + file.originalname
        cb(null, name);
    }
})

const upload=multer({storage:storage}).array('image',10);

//--------------------------------------------------






const session=require('express-session');


const config=require('../config/config');
admin_router.use(session({secret:config.adminsessionSecret,
    resave: false,
    saveUninitialized: false}));

const auth=require("../middleware/adminauth")



const categoryController=require('../controller/categoryController')

const adminController=require('../controller/adminController');

const productController=require('../controller/productController')

const orderController=require('../controller/orderController');

const couponController=require('../controller/couponController');

const offerController=require('../controller/offerController')


admin_router.get("/admin/login",auth.islogout,adminController.adminloginload);

admin_router.get("/admin",auth.islogout,adminController.adminloginload);

admin_router.post('/admin/getadmin',adminController.getdata);

admin_router.get("/admin/index",auth.islogin,adminController.testload);

admin_router.get('/admin/docs',auth.islogin,adminController.docsload);

admin_router.get('/admin/account',auth.islogin,adminController.accountload);

admin_router.get('/admin/settings',auth.islogin,adminController.settingsload);

admin_router.get('/admin/charts',auth.islogin,adminController.chartsload);

admin_router.post('/admin/datesort',auth.islogin,adminController.verifydate);


admin_router.get('/admin/help',auth.islogin,adminController.helpload);

admin_router.post('/admin/users/:action/:id',auth.islogin,adminController.updateuserstatus);

admin_router.get("/admin/logout",auth.islogin,adminController.logoutload);

//-----------------------category-------------------

admin_router.get('/admin/category',auth.islogin,categoryController.ordersload);

admin_router.get("/admin/addcategory",auth.islogin,categoryController.addcategoryload);

admin_router.post('/admin/addcategory',auth.islogin,categoryController.verifyaddcategory);

admin_router.post('/admin/orders/:action/:id',auth.islogin,categoryController.verifyeditcategory);

admin_router.get('/admin/editcategory',auth.islogin,categoryController.editcategoryload);

admin_router.post('/admin/editcategory',auth.islogin,categoryController.geteditcategory);

admin_router.get('/admin/deletecatege/:id',auth.islogin,categoryController.deletecateg);

admin_router.post('/admin/addOfferCatege',auth.islogin,categoryController.addOfferCatege);

admin_router.post('/admin/removecategoffer',auth.islogin,categoryController.removecategoffer)

//--------------product-------------

admin_router.get('/admin/addproduct',auth.islogin,productController.addproductload);

admin_router.get('/admin/addingproduct',auth.islogin,productController.addingproductload);

admin_router.post('/admin/addingproduct',upload,productController.verifyaddingproduct);

admin_router.post('/admin/product/:action/:id',auth.islogin,productController.productStatus);

admin_router.get('/admin/editProduct',auth.islogin,productController.editingProduct);

admin_router.post("/admin/editProduct",auth.islogin,upload,productController.verifyEditProduct);

admin_router.get('/admin/deleteproduct/:productId',auth.islogin,productController.deleteproduct);

admin_router.post('/singleImgEdit',auth.islogin,upload,productController.verifySingleImg);

admin_router.post('/admin/addOfferProduct',auth.islogin,productController.verifyOfferProduct);

admin_router.post('/admin/removeproductoffer',auth.islogin,productController.verifyRemoveOffer);

//--------------------------order----------------------------------

admin_router.get("/admin/notifications",auth.islogin,orderController.notificationsload);

admin_router.get('/admin/productview',auth.islogin,orderController.productviewLoad);

admin_router.post('/admin/updateStatus',auth.islogin,orderController.verifyupdateStatus);

//-------------------------coupon--------------------------------------------------

admin_router.get('/admin/coupon',auth.islogin,couponController.couponload);

admin_router.get('/admin/addcoupen',auth.islogin,couponController.addcoponload);

admin_router.post('/admin/addcoupen',auth.islogin,couponController.verifyaddcoupon);

admin_router.get('/admin/editcoupon',auth.islogin,couponController.editcouponload);

admin_router.post('/admin/editcoupon',auth.islogin,couponController.verifyeditproduct);

admin_router.get('/admin/deletecoupon',auth.islogin,couponController.deletecouponload);

//-------------------------offer----------------------------

admin_router.get('/admin/offer',auth.islogin,offerController.offerload);

admin_router.get('/admin/addoffer',auth.islogin,offerController.oddOfferLoad);

admin_router.post('/admin/addoffer',auth.islogin,offerController.verifyOffer);

admin_router.get('/admin/editoffer',auth.islogin,offerController.editOfferload);

admin_router.post('/admin/editoffer',auth.islogin,offerController.verifyEditOffer);

admin_router.delete('/admin/deleteoffer',auth.islogin,offerController.deleteOffer);









module.exports=admin_router;