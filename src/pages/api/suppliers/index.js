import Supplier from "../../../../server/models/suppliersSchema";
import connectMongo from "../../../../server/config";
export default async function handler(req, res) {

    const action = req.body.action;
    
    if(action === "fetchAll") {
        const {skip, limit, searchTerm, sortOffers} = req.body;
        try {
            await connectMongo();
        
            const filterConditions = {};
            if (searchTerm.afm) filterConditions.AFM = new RegExp(searchTerm.afm, 'i');
            if (searchTerm.name) filterConditions.NAME = new RegExp(searchTerm.name, 'i');
            if (searchTerm.phone01) filterConditions.PHONE01 = new RegExp(searchTerm.phone01, 'i');
            if (searchTerm.phone02) filterConditions.PHONE02 = new RegExp(searchTerm.phone02, 'i');
            if (searchTerm.email) filterConditions.EMAIL = new RegExp(searchTerm.email, 'i');
            if (searchTerm.address) filterConditions.ADDRESS = new RegExp(searchTerm.address, 'i');
        
            let query = Supplier.find(filterConditions);
        
            if (sortOffers === 1) {
              query = query.sort({ ORDERSTATUS: 1 });
            } else if (sortOffers === -1) {
              query = query.sort({ ORDERSTATUS: -1 });
            }
            let condition = Object.keys(filterConditions).length === 0;
            const totalRecords = await (condition
              ? Supplier.countDocuments()
              : Supplier.countDocuments(filterConditions));
        
            const suppliers = await query.skip(skip).limit(limit);

            return res.status(200).json({ success: true, result: suppliers, totalRecords: totalRecords })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

    if(action === "updateOne") {
        const {data, user} = req.body;
        console.log('sefsefsfesfsfes')
        console.log(data)
        console.log(user)
        try {
            await connectMongo();
            let result = await Supplier.findOneAndUpdate({ _id: data._id }, {
                ...data,
                updatedFrom: user
            }, { new: true })
            return res.status(200).json({ success: true, result: result })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

    if(action === "create") {
        const {data} = req.body;
        console.log(data)
        // try {
        //     await connectMongo();
        //     let result = await Supplier.create(data);
        //     console.log('result')
        //     console.log(result)
        //     return res.status(200).json({ success: true, result: result })
        // } catch (e) {
        //     return res.status(400).json({ success: false })
        // }
    }

    if(action === 'saveCatalog') {
        const {catalogName, id} = req.body;
        console.log('catalogName')
        console.log(catalogName)
        try {
            await connectMongo();
            let result = await Supplier.findOneAndUpdate({_id: id}, {
                $set: {
                    catalogName: catalogName
                }   
            })
            return res.status(200).json({ success: true, result: result })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }

    if(action === 'findSuppliersBrands') {
	
		const {supplierID} = req.body;

		try {
			await connectMongo();
			let result = await Supplier.findOne({
                _id: supplierID
            }, {brands: 1}).populate('brands');
			
			return res.status(200).json({ success: true, result: result });
		} catch (e) {
			return res.status(400).json({ success: false, result: null });
		}
	}

    if(action === "deleteBrandFromSupplier") {
        const {supplierID, brandID} = req.body;
        console.log('supplierID')
        console.log(supplierID)
        console.log('brandID')
        console.log(brandID)
        try {
            await connectMongo();
            let result = await Supplier.findOneAndUpdate({_id: supplierID}, {
                $pull: {
                    brands: brandID
                }
            })
            return res.status(200).json({ success: true, result: result })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    }
}