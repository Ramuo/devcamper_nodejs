const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get     all bootcamps
// @desc    Get     /api/v1/bootcamps
// @acces           Public   
exports.getBootcamps = asyncHandler (async(req, res, next)=>{
    const bootcamps = await Bootcamp.find();

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });    
});


// @desc    Get     all bootcamp
// @route    Get     /api/v1/bootcamps/:id
// @acces           Public    
exports.getBootcamp = asyncHandler(async(req, res, next)=>{
    
    const bootcamp = await Bootcamp.findById(req.params.id);

    // check if the id is correct
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data:  bootcamp
    });
});


// @desc    Post    Create new bootcamp
// @route   Post    /api/v1/bootcamps
// @acces          Private   
exports.createBootcamp = asyncHandler (async(req, res, next)=>{

        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
        success: true,
        data: bootcamp 
    });   
});

// @desc    Put    Update new bootcamp
// @route   Put    /api/v1/bootcamps/:id
// @acces          Private   
exports.updateBootcamp = asyncHandler (async(req, res, next)=>{ 
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    // check if it does't exist
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    // if it exist
    res.status(200).json({success: false, data: bootcamp});
          
});


// @desc    Delete    Delete new bootcamp
// @route   Delete   /api/v1/bootcamps/:id
// @acces          Private   
exports.deleteBootcamp = asyncHandler(async(req, res, next)=>{ 
   
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    // check if it does't exist
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    // if it exist
    res.status(200).json({success: false, data: {} });
    
});