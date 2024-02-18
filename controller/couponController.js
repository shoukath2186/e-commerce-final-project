

const Coupon=require('../model/couponModel');


const couponload=async(req,res)=>{
    try {
        const couponData=await Coupon.find({}).sort({_id:-1});

        //console.log(couponData);

        res.render('coupon',{coupon:couponData});
    } catch (error) {
        console.log(error.massege);
    }
}

const addcoponload=async(req,res)=>{
    try {
        res.render('addcoupon');
        
    } catch (error) {
        console.log(error.massege);
    }
}




const verifyaddcoupon=async(req,res)=>{
    try {
        
         const couponsCode=req.body.couponCode;
        
        const coupondatas=await Coupon.findOne({couponCode:couponsCode});
        console.log(1111);
          
        if(!coupondatas){
         console.log(222);
        const{couponName,couponCode,couponDescription,availability,minAmount,discountAmount,date}=req.body;
       
        
        const newCoupon=new Coupon({
            couponName:couponName,
            couponCode:couponCode,
            couponDescription:couponDescription,
            availability:availability,
            minAmount:minAmount,
            discountAmount:discountAmount,
            expiryDate:date
        });
        const data=await newCoupon.save()

        console.log(444,data);

        res.redirect('/admin/coupon')
    }else{
        console.log(333);
         const expiryDate = new Date(coupondatas.expiryDate);
         const formattedExpiryDate = expiryDate.toISOString().split('T')[0];
         // console.log(formattedExpiryDate);
        res.render('addcoupon',{exists:'Coupon already Exisist.',coupon:coupondatas,date:formattedExpiryDate});
    }
        
    } catch (error) {
        console.log(error.massege);
    }
}

const editcouponload=async(req,res)=>{
    try {
        const couponid=req.query.couponid;
        

        const datas=await Coupon.findById(couponid);
         

         const expiryDate = new Date(datas.expiryDate);
         const formattedExpiryDate = expiryDate.toISOString().split('T')[0]; 

        res.render('editcoupon',{coupon:datas,date:formattedExpiryDate});
        
        
    } catch (error) {
        console.log(error.massege);
    }
}
const verifyeditproduct=async(req,res)=>{
    try {

       

        
        const{couponName,couponCode,couponDescription,availability,minAmount,discountAmount,date,id}=req.body;


        const update=await Coupon.updateOne({_id:id},{$set:{
            couponName:couponName,
            couponCode,
            couponDescription,
            availability,
            minAmount,
            discountAmount,
            expiryDate:date
        }})
        

        res.redirect('/admin/coupon')
    

    } catch (error) {
        console.log(error.massege);
    }
}

const deletecouponload=async(req,res)=>{
    try {
        const couponId=req.query.couponid;
        await Coupon.deleteOne({_id:couponId});
    } catch (error) {
        console.log(error.massege);
    }
}



module.exports={
    couponload,
    addcoponload,
    verifyaddcoupon,
    editcouponload,
    verifyeditproduct,
    deletecouponload

}