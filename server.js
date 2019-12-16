let express = require('express')

let app = express()
app.get('/user',(req,res)=>{
    res.json({name:"我是你爽哥哥yayay"})
})
app.listen(3100)