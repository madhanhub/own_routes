const multer=require('multer')
const multers3 = require('multer-s3')
const { S3Client } = require('@aws-sdk/client-s3')

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

// const multer = require('multer')
// const multers3 = require('multer-s3')
// const { S3Client } = require('@aws-sdk/client-s3')
// const path = require('path')

// const s3 = new S3Client({
// 	endpoint: process.env.S3_ENDPOINT,
// 	region: process.env.S3_REGION,
// 	credentials: {
// 		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// 		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// 	},
// })

// const upload = multer({
// 	storage: multers3({
// 		s3,
// 		bucket: process.env.BUCKET_NAME,
// 		contentType: multers3.AUTO_CONTENT_TYPE,
// 		acl: 'public-read',
// 		metadata: (req, file, cb) => {
// 			cb(null, {
// 				fieldname: file.fieldname,
// 			})
// 		},
// 		key: (req, file, cb) => {
// 			cb(null, file.originalname)
// 		},
// 	}),
// 	fileFilter: function (req, file, callback) {
// 		var ext = path.extname(file.originalname)
// 		if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
// 			return callback(new Error('Only images are allowed'))
// 		}
// 		callback(null, true)
// 	},
// 	limits: {
// 		fileSize: 1024 * 1024,
// 	},
// }).single('file')

// module.exports = upload
