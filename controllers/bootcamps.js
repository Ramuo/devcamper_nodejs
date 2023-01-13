const Bootcamp = require('../models/Bootcamp')

// @desc    Get     all bootcamps
// @desc    Get     /api/v1/bootcamps
// @acces           Public   
exports.getBootcamps = (req, res, next)=>{
    console.log(req.body)
    res.status(200).json({success: true, msg: 'Show all bootcamps'})
    
  
}


// @desc    Get     all bootcamp
// @route    Get     /api/v1/bootcamps/:id
// @acces           Public    
exports.getBootcamp = (req, res, next)=>{
    res.status(201).json({success: true, msg: `show bootcamp ${req.params.id}`})
  
}


// @desc    Post    Create new bootcamp
// @route   Post    /api/v1/bootcamps
// @acces          Private   
exports.createBootcamp = (req, res, next)=>{
    res.status(201).json({success: true, msg: 'Create new bootcamp'}) 
}

// @desc    Put    Update new bootcamp
// @route   Put    /api/v1/bootcamps/:id
// @acces          Private   
exports.updateBootcamp = (req, res, next)=>{
    res.status(201).json({success: true, msg: `Upadate bootcamp ${req.params.id}`}) 
  
}


// @desc    Delete    Delete new bootcamp
// @route   Delete   /api/v1/bootcamps/:id
// @acces          Private   
exports.deleteBootcamp = (req, res, next)=>{
    res.status(201).json({success: true, msg:  `Delete bootcamp ${req.params.id}`})
  
}