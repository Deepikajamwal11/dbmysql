const path = require("path");
const uuid = require("uuid").v4;

module.exports = {
    success: function(res, message = "", body = {}) {
        return res.status(200).json({
            success: true,
            status: 200,
            message: message,
            body: body
        });
    },
    failure: function(res, message = "", body = {}) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: message,
            body: body
        });
    },
    error: function(res, message = "", body = {}) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: message,
            body: body
        });
    },
    fileUpload: async (file) => {
        if (!file) return null;
        const extension = path.extname(file.name);
        const filename = uuid() + extension;
        const filePath = path.join(process.cwd(), 'public', 'images', filename);
        try {
            await new Promise((resolve, reject) => {
                file.mv(filePath, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            return `/images/${filename}`;
        } catch (error) {
            console.error('Error moving file:', error);
            throw new Error('Error uploading file');
        }
    },  
    fileUploads: async (files) => {
        let filepaths = [];
        
        // Ensure files is always an array
        files = Array.isArray(files) ? files : [files];
      
        // Process each file
        for (const file of files) {
          if (file && file.name) {
            const extension = path.extname(file.name);
            const filename = uuid() + extension;
            const uploadPath = path.join(process.cwd(), "public", "images", filename);
      
            // Move the file to the server
            await new Promise((resolve, reject) => {
              file.mv(uploadPath, (err) => {
                if (err) reject(err);
                else resolve();
              });
            });
      
            // Store the relative file path
            filepaths.push(`/images/${filename}`);  // File path relative to 'public' directory
          }
        }
      
        return filepaths;
      },
      
      
    checkValidation: async (v) => {
        try {
            const matched = await v.check();
            if (!matched) {
                const errorMessages = Object.values(v.errors).map(error => error.message);
                return errorMessages.length > 0 ? errorMessages[0] : 'Validation failed.';
            }
            return ''; 
        } catch (error) {
            console.error('Validation error:', error);
            return 'An unexpected error occurred during validation.';
        }
    },    
    checkAdminSession :async (req, res, next) => {
        if (req.originalUrl === '/login' || req.originalUrl === '/loginpost') {
            return next();
        }
        if (!req.session.admin) {
            return res.redirect('/login');
        }
        next();
    }
};
