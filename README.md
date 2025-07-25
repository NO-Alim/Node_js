- ✅ **Day 22: File Uploads with Multer**
    
    ### 🎯 Objective:
    
    Learn how to upload images or files using the `multer` middleware in Express.
    
    ### 📚 Topics:
    
    - What is `multipart/form-data`
        
        When you submit a standard HTML form with text inputs, the data is usually sent with the `Content-Type` header set to `application/x-www-form-urlencoded` or `application/json`. However, for file uploads, neither of these is suitable because they don't efficiently handle binary data.
        
        This is where `multipart/form-data` comes in. It's an encoding type that allows you to send a combination of text fields and binary files within a single request. Each part of the form (each input field, each file) is sent as a separate "part" in the request body, delimited by a unique boundary string. Your server then needs a special parser to correctly read and process these parts – and that's where Multer shines!
        
    - Installing and configuring `multer`
        
        Multer is a middleware specifically designed to parse `multipart/form-data`.
        
        ```jsx
        npm install multer
        # or
        yarn add multer
        ```
        
        **Configuration:**
        Multer primarily needs to know where to store the files and how to name them. It also allows for validation.
        
        - **`storage`**: This is the core configuration.
            - **`multer.diskStorage()`**: Used to store files on the local disk. It takes two functions:
                - `destination`: Specifies the folder where files should be saved.
                - `filename`: Specifies how the file should be named inside the destination folder.
            - You can also use other storage engines (e.g., for cloud services like AWS S3), but `diskStorage` is standard for local uploads.
        - **`fileFilter`**: A function that lets you control which files should be uploaded and which should be skipped. You can check `file.mimetype` for type validation.
        - **`limits`**: An object that specifies limits for the uploaded data. Most commonly used for `fileSize`.
    - Single vs multiple file upload
        
        Multer provides different methods depending on how many files you expect:
        
        - **`multer().single('fieldName')`**: For uploading a single file. `fieldName` is the name of the input field in your form (e.g., `<input type="file" name="image">`). The uploaded file info will be available in `req.file`.
        - **`multer().array('fieldName', maxCount)`**: For uploading multiple files from a single input field. `maxCount` is the maximum number of files allowed. The uploaded files info will be in `req.files` (an array).
        - **`multer().fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])`**: For uploading multiple files from different input fields. `req.files` will be an object with arrays for each field name (e.g., `req.files.avatar`, `req.files.gallery`).
        - **`multer().any()`**: Accepts all files that come over the wire. Use with caution as it can be less secure. `req.files` will be an array.
    - Serving static files
        
        Once files are uploaded to your server's local disk, you need a way to make them accessible via HTTP. Express provides the `express.static()` middleware for this. You specify a directory, and Express will serve its contents as static assets.
        
        For example, if you upload files to an `uploads` folder, `app.use('/uploads', express.static('uploads'))` will make files like `your_project_root/uploads/image.jpg` accessible at `http://your-api-url/uploads/image.jpg`.
        
    - Storing uploads locally or in cloud (basic intro)
        - **Local Storage (Disk Storage)**: This is what `multer.diskStorage()` facilitates. Files are saved directly onto the server's file system.
            - **Pros:** Simple to set up, good for development, no external dependencies (beyond Multer).
            - **Cons:** Not scalable (files are tied to a specific server instance), requires managing disk space, backup, and security manually. Not ideal for production with multiple server instances.
        - **Cloud Storage:** For production applications, it's highly recommended to store files in cloud storage services like:
            - **AWS S3 (Amazon Simple Storage Service):** Highly scalable, durable, secure, and cost-effective.
            - **Cloudinary:** A specialized media management platform that handles storage, optimization, and delivery.
            - **Google Cloud Storage, Azure Blob Storage:** Other cloud provider equivalents.
            - **How it works with Multer:** You would use a third-party Multer storage engine (e.g., `multer-s3`, `multer-cloudinary`) instead of `multer.diskStorage()`. This topic is outside the scope of this basic task but is essential for production.
    
    ### 💻 Task:
    
    - Setup file upload in route: `POST /upload` with an image
        
        
        ```jsx
        //upload.routes.js
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
        ```
        
        ```jsx
        //app.js
        import uploadRoutes from './routes/upload.routes.js'
        // Image upload route
        app.use('/api/upload', uploadRoutes)
        ```
        
    - Validate file type and size
        
        ```jsx
        const fileFilter = (req, file, cb) => {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new AppError('Invalid file type. Only JPEG, PNG, GIF, WEBP are allowed.', 400), false);
            }
        }
        ```
        
    - Serve image at `GET /uploads/filename.jpg`
        
        app.use('/uploads', express.static('uploads'));
        
    
    ### 🔁 Assignment:
    
    - Add image upload functionality to `/posts` or `/profile`