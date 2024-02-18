const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://shoukathotm777:shoukath1234@cluster0.u9cxxhu.mongodb.net/?retryWrites=true&w=majority");

const express = require('express');
const app = express();
const path = require('path')

//-----------------rezer pay-------------------






app.use(express.static(path.join(__dirname, "2homeproperties")));

app.use(express.static(path.join(__dirname, "1adminproperties")));

//----------user page----------------
const router = require('./router/userRouter')

app.use("/", router);
//-----------admin page----------------

const adminrouter = require('./router/adminRouter')

app.use('/', adminrouter);


//-----asets------------------



//app.use(express.static(path.join(__dirname,"1adminpropertice")));


const port = 9999;
app.listen(port, () => {
    console.log(`surver port http://localhost:${port}`);
})



