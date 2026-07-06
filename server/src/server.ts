import express from 'express';

const app = express();

app.get('/',(req, res)=>{
    res.status(200).json({
        success: true,
        message: "Route active?"
    })
})

const PORT = 5000;

app.listen(PORT, ()=>{
    console.log('Server Active');
});