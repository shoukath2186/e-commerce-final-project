
const Offer=require('../model/offerModel');

const Product=require('../model/productModel');

const Category=require('../model/categoryModel')


const offerload=async(req,res)=>{
    try {
        const offerData=await Offer.find({});
        res.render('offer',{data:offerData})
        
    } catch (error) {
        console.log(error.message);
    }
}

const oddOfferLoad=async(req,res)=>{
    try {
        res.render('addoffer');
    } catch (error) {
        console.log(error.message);
    }
}


const verifyOffer=async(req,res)=>{
    try {
        const checkName=req.body.offerName

        const offerdata=await Offer.findOne({offerName:checkName})

        if(!offerdata){
         
        const{offerName,startDate,expdate,percentage}=req.body

        const newOffer=new Offer({
            offerName:offerName,
            startingDate:startDate,
            expiryDate:expdate,
            percentage:percentage
        })

       const saveData=await newOffer.save()

       res.redirect('/admin/offer');
    }else{
        res.render('addoffer',{message:'Offer alredy exist.'});
    }

    } catch (error) {
        console.log(error.message);
    }
}

const editOfferload=async(req,res)=>{
    try {
        const offerId=req.query.offerid
        const datas=await Offer.findById(offerId)

        const newDate = new Date(datas.startingDate);
         const startDate = newDate.toISOString().split('T')[0];

         const expiryDate = new Date(datas.expiryDate);
         const endDate = expiryDate.toISOString().split('T')[0];
        

        res.render('editOffer',{data:datas,sDate:startDate,eDate:endDate});
       
    } catch (error) {
        console.log(error.message);
    }
}

const verifyEditOffer=async(req,res)=>{
    try {
       const{id,offerName,startDate,expdate,percentage}=req.body;
       
       await Offer.updateOne({_id:id},{$set:{offerName:offerName,startingDate:startDate,expiryDate:expdate,percentage:percentage}})

       res.redirect('/admin/offer')

    } catch (error) {
        console.log(error.message);
    }
}


const deleteOffer=async(req,res)=>{
    try {
        const offerid=req.query.offerid;
         
        await Offer.deleteOne({_id:offerid});

        await Product.updateOne({offer:offerid},{$unset:{offer:offerid}})

        await Category.updateOne({offer:offerid},{$unset:{offer:offerid}})

        res.send({status:'success'});  

    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
   offerload,
   oddOfferLoad,
   verifyOffer,
   editOfferload,
   verifyEditOffer,
   deleteOffer
}