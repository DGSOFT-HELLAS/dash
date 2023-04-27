

import connectMongo from "../../../server/utils/connection";
import User from "../../../server/models/userModel";

// export default async function addTest(req, res) {
//   try {
//     console.log('CONNECTING TO MONGO');
//     await connectMongo();
//     console.log('CONNECTED TO MONGO');

//     console.log('CREATING DOCUMENT');
//     const test = await User.create(req.body);
//     console.log('CREATED DOCUMENT');

//     res.json({ test });
//   } catch (error) {
//     console.log(error);
//     res.json({ error });
//   }
// }

export default async function handler(req, res) {
  try {
    await connectMongo();
    const createUser = await User.create(req.body);
    res.status(200).json({  createUser })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}