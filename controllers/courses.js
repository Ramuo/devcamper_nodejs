const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');


// @desc    Get courses
// @route    GET /api/v1/courses
// @route    GET /api/v1/bootcamps/:bootcampId/courses
// @acces    Public
exports.getCourses = asyncHandler (async(req, res, next) => {
    if(req.params.bootcampId){
        const courses = await Course.find({bootcamp: req.params.bootcampId});

        return res.status(200).json({
            success: true,
            count:  courses.length,
            data: courses,
        })
    }else{
       res.status(200).json(res.advancedResults);
    }   
});


// @desc    Get Single course
// @route   GET /api/v1/courses/:id
// @acces   Public
exports.getCourse = asyncHandler (async(req, res, next) => {
   const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
   });

   if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }
        
    res.status(200).json({
        success: true,
        data: course
    })
});


// @desc    Add/Create course
// @desc    POST /api/v1/bootcamps/:bootcampId/courses
// @acces   Private
exports.addCourse = asyncHandler (async(req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
 
    if (!bootcamp) {
     return next(
       new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404)
     );
   }
   // Create/add new course
   const course = await Course.create(req.body);

   // Make sure user is course owner
   if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`, 401));
    }
         
    res.status(200).json({
        success: true,
        data: course
    });
 });


// @desc    update course
// @route   PUT /api/v1/courses/:id
// @acces   Private
exports.updateCourse = asyncHandler (async(req, res, next) => {
    let course = await Course.findById(req.params.id);
 
    if (!course) {
        return next(
          new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
        );
    }
  

    // Make sure user is course owner
   if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update a course to bootcamp ${course._id}`, 401));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
       
    res.status(200).json({
        success: true,
        data: course
    });
 });


// @desc    Delete    course
// @route   Delete    /api/v1/courses/:id
// @acces   Private
exports.deleteteCourse = asyncHandler (async(req, res, next) => {

    const course = await Course.findById(req.params.id);
 
    if (!course) {
        return next(
          new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
        );
    }
  
     // Make sure user is course owner
   if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete a course to bootcamp ${course._id}`, 401));
    }


    await course.remove();
       
    res.status(200).json({
        success: true,
        data: {}
    });
 });




