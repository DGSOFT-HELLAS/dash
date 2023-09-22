import { ImpaCodes } from "../../../../server/models/impaSchema"
import SoftoneProduct, { Product } from "../../../../server/models/newProductModel"
import connectMongo from "../../../../server/config"
import { array } from "yup"
export default async function handler(req, res) {
    const action = req.body.action 
    if(action === 'insert') {
        let {data} = req.body
        let newArray = []
        for(let item of data) {
            newArray.push({
                code: item.Code,
                englishDescription: item["English Description"],
                greekDescription: item["Ελληνική Περιγραφή"],
                unit: item.Unit
            })
        }
        console.log('new array')
        console.log(newArray)
        try {
            await connectMongo();
            const impas = await ImpaCodes.insertMany(newArray)
            console.log(impas)
            res.status(200).json({success: true, data: impas})
        } catch (e) {
            console.log(e)
        }
        
    }

    if(action === 'findAll') {
        try {
            await connectMongo();
            const impas = await ImpaCodes.find({})
            .populate('products', 'name');
            console.log(impas)
            res.status(200).json({success: true, data: impas})
        } catch (e) {
            console.log(e)
        }
    }
    if(action === 'find') {
        try {
            await connectMongo();
            const impas = await ImpaCodes.find({}, {code: 1,  englishDescription: 1})
            console.log(impas)
            res.status(200).json({success: true, data: impas})
        } catch (e) {
            console.log(e)
        }
    }

    if(action === 'correlateImpa') {
        let {dataToUpdate, id} = req.body
     
        try {
        await connectMongo();
            let arrayProductID = [];
            let count = 0;
            let errorArray = [];
            for(let item of dataToUpdate) {
                let response = await SoftoneProduct.updateOne({_id: item._id}, {$set: {impas: id}}, {upsert: true})
                console.log('response impa')
                console.log(response)
                if(response.modifiedCount == 1) {
                    count++;
                } else {
                    errorArray.push(item?.name)
                }
                arrayProductID.push(item._id)
              
            }  

            let updateImpa = await ImpaCodes.updateOne({_id: id}, {$push: {products: {$each: arrayProductID}}})
            console.log('updateImpa')
            console.log(updateImpa)
            
            if(count === dataToUpdate.length && updateImpa) {
                return res.status(200).json({success: true, message: 'Update Impa ολοκληρώθηκε'})
            } else {
                return res.status(200).json({success: true, message: 'Δεν ολοκληρώθηκε το update', result: errorArray})
            }
            
           
        }catch (e) {
          return res.status(400).json({success: false, result: null, error: "Προέκυψε κάποιο σφάλμα στην Εμημέρωση Impa και Προϊόντων"})
        }
    }
}