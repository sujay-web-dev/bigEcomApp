const mongoose = require('mongoose')

const connectWithDb = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(console.log(`DB GOT CONNECTED`))
    .catch(err => {
        console.log(`DB CONNECTION ERROR`);
        console.log(err);
        process.exit(1);
    })
}

module.exports = connectWithDb