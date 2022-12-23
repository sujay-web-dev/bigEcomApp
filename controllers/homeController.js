const BigPromise = require('../middlewares/bigPromise')

exports.home = BigPromise(async(req,res) => {
    // const dbConnec = await apiCall()
    res.status(200).json({
        success:true,
        greeting:"Hello this is a Sample Backend"
    })
})









