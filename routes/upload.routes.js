import express from "express";
import multer from "multer";
import AppError from "../utils/AppError.js";


const router = express.Router();

// configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

// configure file filter for image validation
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Invalid file type. Only JPEG, PNG, GIF, WEBP are allowed.', 400), false);
    }
}

// configure multer limit
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

// single file allowed
router.post('/', upload.single('image'), (req, res, next) => {
    if (!req.file) {
        return next(new AppError('No File Uploaded', 400));
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(200).json({
        success: true,
        message: 'File uploaded successfully!',
        fileName: req.file.filename,
        filePath: req.file.path, // Full path on the server's disk
        fileUrl: fileUrl, // URL to access the image
        fileMimeType: req.file.mimetype,
        fileSize: req.file.size
    });
})


// multiple file allowed
router.post('/multiple', upload.array('image', 5), (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        // If no files were uploaded
        return next(new AppError('No files uploaded.', 400));
    }

    const uploadedFilesInfo = req.files.map(file => {
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        return {
            fileName: file.filename,
            filePath: file.path, // Full path on the server's disk
            fileUrl: fileUrl, // URL to access the image
            fileMimeType: file.mimetype,
            fileSize: file.size
        };
    });

    res.status(200).json({
        success: true,
        message: `${uploadedFilesInfo.length} files uploaded successfully!`,
        data: uploadedFilesInfo
    });
})

// 5. Handle Multer-specific errors 
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new AppError('File size too large. Max 5MB allowed.', 400));
        }
        // Add more MulterError codes if needed
        return next(new AppError(`Multer error: ${err.message}`, 400));
    }
    next(err); // Pass other errors to the global error handler
});


export default router;