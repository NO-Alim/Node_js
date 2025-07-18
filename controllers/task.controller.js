const getTask = (req, res, next) =>{
    res.status(200).json({
        success: true,
        message: 'You task request are complete successfully.',
        data: {
            task: []
        }
    })
}

export { getTask}