const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
//const { parse } = require('dotenv');



// @desc    Get     all bootcamps
// @desc    Get     /api/v1/bootcamps
// @acces           Public   
exports.getBootcamps = asyncHandler (async(req, res, next)=>{
    res.status(200).json(res.advancedResults);   
});


// @desc    Get     Single bootcamp
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
    // Add user to req.body
    req.body.user = req.user.id;

    // Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});

    // If the user is not an admin, they can only add one bootcamp
    if(!publishedBootcamp && req.user.role !== 'admin'){
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400));

    }

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
    let bootcamp = await Bootcamp.findById(req.params.id, req.body);
    // check if it does't exist
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is bootcamp owner
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401));
    }

    bootcamp = await Bootcamp.findByOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // if it exist
    res.status(200).json({success: true, data: bootcamp});
          
});


// @desc    Delete Delete new bootcamp
// @route   Delete /api/v1/bootcamps/:id
// @acces   Private   
exports.deleteBootcamp = asyncHandler(async(req, res, next)=>{ 
   
    const bootcamp = await Bootcamp.findById(req.params.id);
    // check if it does't exist
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is bootcamp owner
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401));
    }

    bootcamp.remove();

    // if it exist
    res.status(200).json({success: true, data: {} });
    
});

// @desc     Get bootcamp within a radius
// @route    Get /api/v1/bootcamps/radius/:zipcode/:distance
// @acces    Private   
exports.getBootcampsInRadius = asyncHandler(async(req, res, next)=>{ 
   const {zipcode, distance } = req.params;


   // Let's Get lat/lng from geocoder
   const loc = await geocoder.geocode(zipcode);
   const lat = loc[0].latitude;
   const lng = loc[0].longitude;


   // Calc radius using radians
   // Divide distance by radius of eath
   // Eath radius = 3,963 mi
   // Eath radius = 6,378 mi

   const radius = distance / 3963;

   const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
   });
   res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
   })
});



// @desc    upload Photo for bootcamp
// @route   Put /api/v1/bootcamps/:id/photo
// @acces   Private   
exports.bootcampPhotoUpload = asyncHandler(async(req, res, next)=>{ 
   
    const bootcamp = await Bootcamp.findById(req.params.id);
    // check if it does't exist
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is bootcamp owner
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401));
    }

    // let'us check if a file was uploaded
    if(!req.files){
        return next(new ErrorResponse(`Please upload a file`, 400));
    } 
    const file = req.files.file;
    //Make sur the image is a photo 
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please upload an image file`, 400));
    };

    // Check the file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
          new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }
    

    //Create a custom filename
    // file.name = `photo_${bootcamp._id}`;
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
        if(err){
            console.log(err);
            return next(new ErrorResponse(`Problem with file upload ${process.env.MAX_FILE_UPLOAD}`, 500));  
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});


        res.status(200).json({
            success: true,
            data: file.name
        })
    } );

});

