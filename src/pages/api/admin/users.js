import bcrypt from 'bcrypt';
import User from '../../../../server/models/contactInfoModel';
import connectMongo from '../../../../server/config';

export default async function handler(req, res) {

    
 

    let action = req.body.action
    console.log( '\n action: ' + JSON.stringify(action) + '\n')

    //iNSERT NEW USER
    if(action === 'add') {
      console.log(req.body)
        try {
           

            await connectMongo();
            let password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            console.log('hassPassword' + JSON.stringify(hashPassword ))


            const user = await User.create({password: hashPassword, email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, role: req.body.role })
            let fake = false;
            if(user && fake === true) {
              return  res.status(200).json({success: true, user: user});
            } 
            else {
              return res.status(200).json({success: false, user: null});
            }
        
            
        } catch (error) {
          return res.status(400).json({ success: false, error: 'failed to fetch user' });
        }
    }

    //UPDATE SELECTED USER:
    if(action === 'save') { 
        try {
            await connectMongo();
            await User.updateOne(
              { _id: body._id},  
              {
                firstName: body.firstName, 
                lastName: body.lastName,
                email: body.email,
                phones: {
                  landline: body.landline, 
                  mobile: body.mobile
                }, 
                address: {
                  address: body.address, 
                  country:body.country,
                  city: body.city,
                  postalcode: body.postalcode,
                }
              });
        
            const user = await User.findOne({ _id: body._id});
            res.status(200).json({ success: true, user });
            
            
          } catch (error) {
            res.status(400).json({ success: false });
        
         }
    }

    if(action === 'findAll') {
        try {
            await connectMongo();
            const user = await User.find({});
            // console.log('------------ Request to the database to fetch all users: ' + JSON.stringify(user))
        
            if(user) {
                res.status(200).json({success: true, user: user});
            }
            else {
              res.status(200).json({success: false, user: null});
            }
          
            
          } catch (error) {
            res.status(400).json({ success: false, error: 'failed to fetch user' });
          }
        
    }
   

}


const addUserValidation = (req) => {
  console.log('are we here')
  if(req.body.password === '') {
    console.log('are we here `100')
    return  res.status(200).json({success: false, user: null, error: 'Missing parameters'});
  }
}