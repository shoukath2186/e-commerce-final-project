
const mongoose=require('mongoose');



const orderSchema=new  mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    orderId:{
        type:String
    },
    paymentMethod:{
        type:String
    },
    deliveryaddress:{
        type:Object,
        required:true
    },

    totalamount:{
        type:String,
        required:true
    },
    totaldiscountamount:{
        type:Number,
        default:0
    },
    date:{
        type:Date,
        required:true
    },
    expecteddelivery:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    paymentId:{
        type:String
    },
    totel:{
        type:Number
    },
    items:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'product',
            required:true
        },

        quantity:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        totalprice:{
            type:Number,
            required:true
        },
        discountperitem:{
            type:String,
            default:0
        },
        oaderStatus:{
            type:String,
            default:'placed'
        },
        cancellationreason:{
            type:String
        }
    }]

},
{
    timestamps:true  
})



const order=mongoose.model('order',orderSchema)


module.exports=order

