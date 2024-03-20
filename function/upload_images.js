const multer=require('multer')
const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'photo')
  },
  filename:(req,file,cb)=>{
  cb(null,file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
	// Allowed file extensions
	const allowedTypes = /jpeg|png|jpg|gif/;
	// Check extension
	const extension = allowedTypes.test(String(file.originalname).toLowerCase());
	// Check MIME type
	const mimeType = allowedTypes.test(file.mimetype);
  
	if (extension && mimeType) {
	  cb(null, true); // Accept the file
	} else {
	  cb(new Error('Unsupported file type'), false); // Reject the file
	}
  };
  
  const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 1024 * 1024 * 5 } // for example, limit file size to 5MB
  });
  
// const upload=multer({storage})
module.exports=upload
