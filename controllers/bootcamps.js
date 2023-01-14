const Bootcamp = require('../models/Bootcamp')

// @desc    Get     all bootcamps
// @desc    Get     /api/v1/bootcamps
// @acces           Public   
exports.getBootcamps = async (req, res, next)=>{
   try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });  
   } catch (error) {
    res.status(400).json({success: false});
   }   
};


// @desc    Get     all bootcamp
// @route    Get     /api/v1/bootcamps/:id
// @acces           Public    
exports.getBootcamp = async (req, res, next)=>{
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        // check if the id is correct
        if(!bootcamp){
            return res.status(400).json({success: false});
        }
        res.status(200).json({
            success: true,
            data:  bootcamp
        });
    } catch (error) {
        res.status(400).json({success: false});
    } 
};


// @desc    Post    Create new bootcamp
// @route   Post    /api/v1/bootcamps
// @acces          Private   
exports.createBootcamp = async (req, res, next)=>{
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
        success: true,
        data: bootcamp 
    });   
    } catch (error) {
        res.status(400).json({success: false});
    }  
};

// @desc    Put    Update new bootcamp
// @route   Put    /api/v1/bootcamps/:id
// @acces          Private   
exports.updateBootcamp = async (req, res, next)=>{ 
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        // check if it does't exist
        if(!bootcamp){
            return res.status(400).json({success: false});
        }
        // if it exist
        res.status(200).json({success: false, data: bootcamp});
        
    } catch (error) {
        res.status(400).json({success: false});
    }   
};


// @desc    Delete    Delete new bootcamp
// @route   Delete   /api/v1/bootcamps/:id
// @acces          Private   
exports.deleteBootcamp = async (req, res, next)=>{ 
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        // check if it does't exist
        if(!bootcamp){
            return res.status(400).json({success: false});
        }
        // if it exist
        res.status(200).json({success: false, data: {} });
        
    } catch (error) {
        res.status(400).json({success: false});
    }   
};