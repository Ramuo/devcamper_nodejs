const express = require('express');

const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteteCourse
} = require('../controllers/courses');

const Course = require('../models/Course');
const advancedResults = require('../middleware/advanceResults');

const router = express.Router({mergeParams: true});


router
    .route('/')
    .get(advancedResults(Course,{
        path: 'bootcamp',
        select: 'name description'
    }), getCourses)
    .post(addCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteteCourse);




module.exports = router