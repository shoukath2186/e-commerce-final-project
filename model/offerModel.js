const mongoose=require('mongoose');


const offerSchema=new mongoose.Schema({
    offerName:{
        type:String,
        required:true  
    },
    startingDate:{
        type:Date,
        required:true
    },
    expiryDate:{
        type:Date,
        required:true
    },
    percentage:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
})


const Offer=mongoose.model('Offer',offerSchema);

module.exports=Offer;