import multer from 'multer';
import path from 'path';
import fs from 'fs';




// Set up the multer middleware to handle file uploads
const upload = multer({ dest: 'public/uploads/' });

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser since multer will handle the request
  },
};

export default async function handler(req, res) {
  return new Promise((resolve, reject) => {
    upload.array('files')(req, res, async function (err) {
      if (err) {
        console.error(err);
        return reject({ statusCode: 500, message: 'Error uploading files' });
      }

      const { files } = req;

      const uploadedURLs = [];
      try {
        // Process each uploaded file
        for (const file of files) {
          // const timestamp = Date.now();
          const newFileName = `${file.originalname}`;
          // const newFileName = `${timestamp}-${file.originalname}`;
          const filePath = path.join('public/uploads/', file.originalname);
          if (fs.existsSync(filePath)) {
            return reject({ statusCode: 500, message: 'File exists' });

          } 
            
          fs.renameSync(file.path, path.join('public/uploads/', newFileName));
          const publicURL = `${newFileName}`;
          uploadedURLs.push(publicURL);
        }

        if (uploadedURLs.length === 0) {
          return reject({ statusCode: 500, message: 'Error uploading files' });
        }

        return resolve({ statusCode: 200, body: { success: true, urls: uploadedURLs } });
      } catch (error) {
        console.error(error);
        return reject({ statusCode: 500, message: 'Error processing files' });
      }
    });
  })
    .then(({ statusCode, body }) => {
      res.status(statusCode).json(body);
    })
    .catch(({ statusCode, message }) => {
      res.status(statusCode).json({ error: message });
    });
}




