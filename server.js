const express=require('express');
const proxy=require('http-proxy-middleware');
const app=express();
const PORT=8080;
app.use(express.static('dist'));
/* const apiProxy=proxy('/api/**',{
    target:"http://localhost:3000",
    changeOrigin:true,
    pathRewrite:{
        "^/api":""
    }
}) */
const apiProxy=proxy('/**',{
    target:"http://localhost:3000",
    changeOrigin:true
})
app.use(apiProxy);
app.listen(PORT,function(err){
    if(err){
        console.log(':',err);
    }else{
        console.log('listen at http://localhost:'+PORT);
    }
})