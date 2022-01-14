let express= require('express');
let multer = require('multer')
let mongoose = require('mongoose')
let app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

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

app.get('/view', (req, res)=>{
    mymodel.find({})
    .then((x)=>{
        res.render('privew', {x})
        console.log(x)
    })
    .catch((y)=>{
        console.log(y)
    })

    
})

app.listen(300, ()=>{
    console.log('300 Port Working')
})