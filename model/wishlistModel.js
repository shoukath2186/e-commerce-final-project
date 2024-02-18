const mongoose=require("mongoose");



const wishlistSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        require:true
    },
    productId:{
        type:mongoose.Schema.ObjectId,
        ref:'product',
        require:true
    },
})

const Wishlist=mongoose.model('Wishlist',wishlistSchema)

module.exports=Wishlist;