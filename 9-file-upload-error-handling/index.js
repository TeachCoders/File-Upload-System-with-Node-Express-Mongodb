let express= require('express');
let multer = require('multer')
let app = express()
app.set('view engine', 'ejs')

//Storage Setting
let storage = multer.diskStorage({
    destination:'./public/images', //directory (folder) setting
    filename:(req, file, cb)=>{
        cb(null, Date.now()+file.originalname) // file name setting
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
    res.send(req.file)
})


//mULTIPLE IMAGE UPLODING
app.post('/multiplepost', upload.array('multiple_input', 3), (req, res)=>{
    req.files
    res.send(req.files)
})

app.get('/', (req, res)=>{
    res.render('index')
})

app.listen(300, ()=>{
    console.log('300 Port Working')
})