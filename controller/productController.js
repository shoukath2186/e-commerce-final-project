const product=require('../model/productModel');

const Category=require('../model/categoryModel');

const Cart=require('../model/cartModel')

const path=require('path');

const sharp=require('sharp');

const Offer=require('../model/offerModel');

//------------------------------------------




const addingproductload=async(req,res)=>{
    try {
        const categorydata=await Category.find({is_listed:true});
        res.render('addingproduct',{categorys:categorydata,message:""});
    } catch (error) {
        console.log(error.message);
    }
}



const verifyaddingproduct=async(req,res)=>{

   
           
    try {
         
        const existproduct=await product.findOne({name:req.body.productName});
        
        
        if(existproduct){
            res.status(404).send('<h1>category already exist</h1>')
        }else{
            const{productName,quantity,discription,categorys,price,brand,date}=req.body
            const filename=[]
            
            

            const data=await Category.find({is_listed:true});

            if(quantity<=0){
                return res.render('addingproduct',{messageqty:"Quantity not valid.",categorys:data,productName:productName,quantity:quantity,discription:discription,
                price:price,brand:brand});
            }

            if(price<=0){
                return res.render('addingproduct',{messageprice:"Price not valid.",categorys:data,productName:productName,quantity:quantity,discription:discription,
                price:price,brand:brand});
            }
            

            if(req.files.length !==4 ){
                return res.render('addingproduct',{message:"4 image needed.",categorys:data,productName:productName,quantity:quantity,discription:discription,
                price:price,brand:brand});
            }
            //saving images
            
            for(let i=0;i<req.files.length;i++){
                const imagesPath=path.join(__dirname,'../1adminproperties/sharpImage',req.files[i].filename)
                
                await sharp(req.files[i].path).resize(800, 1200, { fit: 'fill' }).toFile(imagesPath);
                filename.push(req.files[i].filename);
                
                
            }
            
            
            const selectedCategory = await Category.findOne({name:categorys});

            

            if (!selectedCategory) {
                return res.render('addingproduct',{messageCateg:"Selected category not found.",categorys:data,productName:productName,quantity:quantity,discription:discription,
                price:price,brand:brand});
                
            }
            

            
            const newProduct=new product({
                name:productName,
                discription,
                quantity,
                price,
                image:filename,
                category:selectedCategory._id,
                brand,
                date,
            })
            await newProduct.save()

            res.redirect("/admin/addproduct");
        };

    } catch (error) {
        console.log(error.message);
    }
}


const addproductload=async(req,res)=>{
    try {
        const productdata=await product.find({}).populate('category');

        const offers=await Offer.find({})


        res.render('addproduct',{products:productdata,data:offers});


    } catch (error) {
        console.log(error.message);
    }
}


const productStatus=async(req,res)=>{
    try {
        const productId=req.params.id
        const productdata=await product.findById(productId);

        

        if (!productdata) {
            return res.status(404).send('<h1>product not found</h1>');
        } 
            let updatedProduct;
            if(productdata.is_listed){
                updatedProduct = await product.findByIdAndUpdate(productId, { $set: { is_listed: false } }, { new: true })
            }else{
                updatedProduct = await product.findByIdAndUpdate(productId, { $set: { is_listed: true } }, { new: true })
            }
            
        res.send({status:'success',products:updatedProduct})
    } catch (error) {
        console.log(error.message);
    }
}


const editingProduct=async(req,res)=>{
    try {
        const id=req.query.productId
        const categorydata=await Category.find({is_listed:true});
        const data=await product.findOne({_id:id});
        if(!data){
            req.flash('message',"product not found")
            return res.redirect(`/admin/editProduct?productId=${id}`);
        }
        res.render('editproduct',{products: data, categ: categorydata});
    } catch (error) {
        console.log(error.message);
    }
} 




const verifyEditProduct = async (req, res) => {
    try {
        const id = req.body.id;
        const { productName, quantity, discription, categorys, price, brand } = req.body;

        const selectedCategory = await Category.findOne({ name: categorys });

        const categorydata1=await Category.find({is_listed:true});


             const datas1=await product.findOne({_id:id});
             
             const existingProduct = await product.find({ name: productName, _id: { $ne: id } });

        if(existingProduct.length>0){

            return res.render('editproduct',{messagename:"Poduct already exist.",products: datas1, categ:categorydata1,productName:productName,quantity:quantity,discription:discription,
            price:price,brand:brand});
        }
        

        // Check if the category is found
        if (!selectedCategory) {
            return res.status(400).send("Selected category not found");
        }

        if(quantity<=0){
            return res.render('editproduct',{messageqty:"Quantity not valid.",products: datas1, categ:categorydata1,productName:productName,quantity:quantity,discription:discription,
            price:price,brand:brand});
        }

        if(price<=0){
            return res.render('editproduct',{messageprice:"Price not valid.",products: datas1, categ:categorydata1,productName:productName,quantity:quantity,discription:discription,
            price:price,brand:brand});
        }

        

        let filenames = [];
        
        if(req.files.length ==4){
        console.log(req.files.length);

        
        if (req.files && req.files.length > 0) {      
                
            for (let i = 0; i < Math.min(req.files.length, 4); i++) {               
                const imagePath = path.join(__dirname, '../1adminproperties/sharpImage', req.files[i].filename);
                await sharp(req.files[i].path).resize(800, 1200, { fit: 'fill' }).toFile(imagePath);
                filenames.push(req.files[i].filename);
            }
        }
        const updateData = { name: productName, discription, quantity, price, category: selectedCategory._id, brand };

        // Update product information
        await product.findByIdAndUpdate({ _id: id }, updateData);

        
        if (filenames.length > 0) {
           
            await product.findByIdAndUpdate({ _id: id }, { $set: { image: filenames } });
        }

        req.flash('message', "Product updated successfully");
        res.redirect('/admin/addproduct');

    }else if(req.files.length==0){ 

       
        const updateData = { name: productName, discription, quantity, price, category: selectedCategory._id, brand };

        // Update product information
        await product.findByIdAndUpdate({ _id: id }, updateData);

        // Update images only if filenames are available
        if (filenames.length > 0) {
            // Replace existing images with new ones
            await product.findByIdAndUpdate({ _id: id }, { $set: { image: filenames } });
        }

        req.flash('message', "Product updated successfully");
        res.redirect('/admin/addproduct');
    }else{
        return res.render('editproduct',{message:"4 image needed.",products: datas1, categ:categorydata1,productName:productName,quantity:quantity,discription:discription,
        price:price,brand:brand});
    }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};


const verifySingleImg=async(req,res)=>{
    try {
        const productImage = req.files;
        const productId=req.query.productid;
        const position=req.query.position;

        //console.log(1111,req.files[0].filename);

        let filenames=[]

        const imagePath = path.join(__dirname, '../1adminproperties/sharpImage', req.files[0].filename);
        await sharp(req.files[0].path).resize(800, 1200, { fit: 'fill' }).toFile(imagePath);
        filenames.push(req.files[0].filename);

        const productdata=await product.findOne({_id:productId});
                  
        productdata.image[position]=filenames.join()
                 
        const updation=await product.updateOne({_id:productId},{$set:{image:productdata.image}});

        res.redirect(`/admin/editProduct?productId=${productId}`);
        
    } catch (error) {
        console.log(error.message);
    }
}



const deleteproduct=async(req,res)=>{
    try {

        const productId = req.params.productId;
        
        const productid = await product.findOne({_id:productId});

        await Cart.deleteMany({'items.product_id':productid});



        await product.deleteOne({_id:productId});



        
        res.redirect('/admin/addproduct');



        
    } catch (error) {
        console.log(error.message);
    }
}




const verifyOfferProduct=async(req,res)=>{
    try {
        const productId=req.body.productId;
        const offerId=req.body.offerId;

        const offerdata=await product.updateOne({_id:productId},{$set:{offer:offerId}})

        res.send({status:'success'});
    
        

    } catch (error) {
        console.log(error.message);
    }
}

const verifyRemoveOffer=async(req,res)=>{
    try {
        const productId= req.body.productId;
        const offerid=req.body.offerId
        await product.updateOne({_id:productId},{$unset:{offer:offerid}});
        res.send({status:'success'});
    } catch (error) {
        console.log(error.message);
    }
}




module.exports={
    addingproductload,
    verifyaddingproduct,
    addproductload,
    productStatus,
    editingProduct,
    verifyEditProduct,
    verifySingleImg,
    deleteproduct,
    verifyOfferProduct,
    verifyRemoveOffer

}


