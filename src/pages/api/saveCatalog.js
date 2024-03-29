import connectMongo from "../../../server/config";
import Supplier from "../../../server/models/suppliersSchema";
import Markes from "../../../server/models/markesModel";
import BrandCatalog from "../../../server/models/catalogsModel";
export default async function handler(req, res) {
    const {action} = req.body;
    

    if(action === 'create') {
        const {catalogName, id} = req.body;

        try {
            let createCatalog = await BrandCatalog.create({
                name: catalogName,
                brand: id,
            })

            let updateMarkes = await Markes.findByIdAndUpdate({
                _id: id,
            }, {
                $push: {
                    catalogs: createCatalog._id
                }
            }, {new: true})
            console.log(updateMarkes)
            return res.status(200).json({ success: true, result: updateMarkes })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
    if(action === 'getBrandCatalogs') {
        // this is the brand id
        const {id, skip, limit} = req.body;
        await connectMongo();
        try {
            let cat = await Markes.findById(id).skip(skip).limit(limit).populate('catalogs');
            let totalRecords = await Markes.findById(id).populate('catalogs');
            return res.status(200).json({ success: true, result: cat, totalRecords: totalRecords})
        } catch (e) {
            return res.status(400).json({ success: false, result: null, totalRecords: null })
        }
    }

    if(action === 'findAll') {
        await connectMongo();
        const {skip, limit} = req.body;
        try {
            let result = await BrandCatalog.find().skip(skip).limit(limit).populate('brand');
            let totalRecords = await BrandCatalog.find().populate('brand');
            console.log(result)
            return res.status(200).json({ success: true, result: result, totalRecords: totalRecords})
        } catch (e) {
            return res.status(400).json({ success: false, result: null })
        }
    }
    if(action === "deleteCatalog") {
        await connectMongo();
        
        const { id} = req.body;
        try {
            let deleteCatalog = await BrandCatalog.findByIdAndDelete(id);
            let updateMarkes = await Markes.findByIdAndUpdate({
                _id: deleteCatalog.brand,
            }, {
                $pull: {
                    catalogs: deleteCatalog._id
                }
            }, {new: true})
            return res.status(200).json({ success: true, result: updateMarkes })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
    
}