let express= require('express');
let fs = require('fs');
let path = require('path')
let multer = require('multer')
let mongoose = require('mongoose')
let methodOverride = require('method-override')
let app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(methodOverride('_method'))

mongoose.connect('mongodb://localhost:27017/IMGDB2')
let myschema = mongoose.Schema({
    Picture : String
})
let mymodel = mongoose.model('table', myschema)

//Storage Setting
let storage = multer.diskStorage({
    destination:'./public/images', //directory (folder) setting
    filename:(req, file, cb)=>{
        cb(null, file.originalname) // file name setting
    }
})

//Upload Setting
let upload = multer({
   storage: storage,
   fileFilter:(req, file, cb)=>{
    if(
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/gif'

    ){
        cb(null, true)
    }
    else{
        cb(null, false);
        cb(new Error('Only jpeg,  jpg , png, and gif Image allow'))
    }
   }
})

//SINGALE IMAGE UPLODING
app.post('/singlepost', upload.single('single_input'), (req, res)=>{
    req.file
    if(!req.file){
        return console.log('You have not Select any Image, Please Select any Image on Your Computer')
    }
    mymodel.findOne({Picture:req.file.filename})
    .then((a)=>{
        if(a){
            console.log("Your Image Dulicate, Please Try anoter Images")
        }
        else{
            mymodel.create({Picture:req.file.filename})
                .then((x)=>{
                    res.redirect('/view')

                })
                .catch((y)=>{
                    console.log(y)
                })
        }
    })
                
    
    //res.send(req.file.filename)
})


//mULTIPLE IMAGE UPLODING
app.post('/multiplepost', upload.array('multiple_input', 3), (req, res)=>{

 
    if(!req.files){
        return console.log('You have not Select any Image, Please Select any Image on Your Computer')
    }
    
    req.files.forEach((singale_image)=>{
        
        mymodel.findOne({Picture: singale_image.filename})
        .then((a)=>{
            if(a){
                console.log("Your Image Dulicate, Please Try anoter Images")
            }
            else{
                mymodel.create({Picture: singale_image.filename})
                .then((x)=>{
                    res.redirect('/view')
                })
                .catch((y)=>{
                    console.log(y)
                })
            }
        })
        .catch((b)=>{
            console.log(b)
        })

                


    })
})

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/edit/:id', (req, res)=>{
    let readquery ={_id:req.params.id};
    //console.log(readquery)
    res.render('edit-file', {readquery})
})

app.put('/edit/:id',upload.single('single_input'), (req, res)=>{
   

    mymodel.updateOne({_id:req.params.id}, {
        Picture : req.file.filename
    })
    .then((x)=>{
        res.redirect('/view')
    })
    .catch((y)=>{
        console.log(y)
    })
})


app.delete('/delete/:id', (req, res)=>{
    let curretn_img_url = (__dirname+'/public/images/'+req.params.id);
   //console.log(curretn_img_url)
   fs.unlinkSync(curretn_img_url)
    mymodel.deleteOne({Picture:req.params.id})
    .then(()=>{
        res.redirect('/view')
    })
    .catch((y)=>{
        console.log(y)
    })
})

app.get('/view', (req, res)=>{
    mymodel.find({})
    .then((x)=>{
        res.render('privew', {x})
        //console.log(x)
    })
    .catch((y)=>{
        console.log(y)
    })

    
})

app.listen(300, ()=>{
    console.log('300 Port Working')
})