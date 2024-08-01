import nc from 'next-connect';
import multer from 'multer';
// import connectToDatabase from '../../';
import Image from '../../models/Image';

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}




const upload = multer({
  storage: multer.memoryStorage(),
});

const handler = nc()
  .use(upload.single('file'))
  .post(async (req, res) => {
    try {
      await connectToDatabase();
      const { buffer, originalname } = req.file;
      const base64 = buffer.toString('base64');
      const url = `data:image/jpeg;base64,${base64}`;

      const image = new Image({ url });
      await image.save();

      res.status(201).json({ imageUrl: image.url });
    } catch (error) {
      res.status(500).json({ error: 'Error uploading image' });
    }
  });

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
