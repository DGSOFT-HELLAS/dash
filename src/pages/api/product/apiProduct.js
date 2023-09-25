

import axios from "axios";
import format from "date-fns/format";
import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import SoftoneProduct, { Descriptions } from "../../../../server/models/newProductModel"
import { MtrCategory, MtrGroup, SubMtrGroup } from "../../../../server/models/categoriesModel";


import { Product } from "../../../../server/models/newProductModel";
import { ProductAttributes } from "../../../../server/models/attributesModel";
import Offer from "@/components/grid/Product/Offer";
import { id } from "date-fns/locale";



export const config = {
    api: {
        responseLimit: false,
    },
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 's-maxage=10');
    const action = req.body.action;


    if (action === 'findSoftoneProducts') {



        await connectMongo();
        let count = await Product.countDocuments()


        let pipeline = [
            {
                $lookup: {
                    from: "softoneproducts",
                    localField: "softoneProduct",
                    foreignField: "_id",
                    as: "softoneProduct"
                },

            },

            {
                $lookup: {
                    from: 'mtrcategories',
                    localField: 'softoneProduct.MTRCATEGORY',
                    foreignField: 'softOne.MTRCATEGORY',
                    as: 'mtrcategory'
                }
            },
            {
                $lookup: {
                    from: 'manufacturers',
                    localField: 'softoneProduct.MTRMANFCTR',
                    foreignField: 'softOne.MTRMANFCTR',
                    as: 'manufacturers'
                }
            },

            {
                $lookup: {
                    from: "mtrgroups",
                    localField: "softoneProduct.MTRGROUP",
                    foreignField: "softOne.MTRGROUP",
                    as: "mtrgroups"
                }
            },

            {
                $lookup: {
                    from: "markes",
                    localField: "softoneProduct.MTRMARK",
                    foreignField: "softOne.MTRMARK",
                    as: "mrtmark"
                }
            },

            {
                $lookup: {
                    from: "submtrgroups",
                    localField: "softoneProduct.CCCSUBGOUP2",
                    foreignField: "softOne.cccSubgroup2",
                    as: "mtrsubgroup"
                }
            },

            {
                $project: {
                    _id: 1,
                    MTRL: '$softoneProduct.MTRL',
                    MTRGROUP: '$softoneProduct.MTRGROUP',
                    MTRCATEGORY: '$softoneProduct.MTRCATEGORY',
                    CCCSUBGOUP2: '$softoneProduct.CCCSUBGOUP2',
                    CODE: '$softoneProduct.CODE',
                    CODE1: '$softoneProduct.CODE1',
                    CODE2: '$softoneProduct.CODE2',
                    UPDDATE: '$softoneProduct.UPDDATE',
                    INTRASTAT: '$softoneProduct.INTRASTAT',
                    VAT: '$softoneProduct.VAT',
                    PRICER: '$softoneProduct.PRICER',
                    PRICEW: '$softoneProduct.PRICEW',
                    PRICER01: '$softoneProduct.PRICER01',
                    PRICER02: '$softoneProduct.PRICER02',
                    PRICER03: '$softoneProduct.PRICER03',
                    PRICER04: '$softoneProduct.PRICER04',
                    PRICER05: '$softoneProduct.PRICER05',
                    PRICEW01: '$softoneProduct.PRICEW01',
                    PRICEW02: '$softoneProduct.PRICEW02',
                    PRICEW03: '$softoneProduct.PRICEW03',
                    PRICEW04: '$softoneProduct.PRICEW04',
                    PRICEW05: '$softoneProduct.PRICEW05',
                    ISACTIVE: '$softoneProduct.ISACTIVE',
                    UPDDATE: '$softoneProduct.UPDDATE',
                    mrtmark: '$mrtmark.name',
                    mrtmanufact: '$manufacturers.softOne.NAME',
                    MTRMANFCTR: '$manufacturers.softOne.MTRMANFCTR',
                    name: 1,
                    description: 1,
                    availability: 1,
                    localized: 1,
                    updatedFrom: 1,
                    updatedAt: 1,
                    categoryName: '$mtrcategory.categoryName',
                    mtrgroups: "$mtrgroups.groupName",
                    mtrsubgroup: "$mtrsubgroup.subGroupName",
                }
            }
            ,


        ]



        let fetchProducts = await Product.aggregate(pipeline)
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getAvailability`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
            })
        });

        const responseJSON = await response.json();
        // // console.log(responseJSON)

        // setInterval(availabilityInterval, 1500);

        return res.status(200).json({ success: true, result: fetchProducts, count: count });

    }

    if (action === 'update') {
        let { data } = req.body;
        console.log(data)

        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/updateMtrl`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
                ...obj
            })
        });
        let responseJSON = await response.json();
        if(responseJSON.error) return res.status(400).json({ success: false, result: null });
        let updateSoftoneProduct = await SoftoneProduct.updateOne({ NAME: data.NAME }, {
            $set: {
                ...data
            }
        })
        let updateDescriptions = await Descriptions.updateOne({ _id: data?.descriptions?._id }, {
            $set: {
                en: data?.descriptions?.en,
                es: data?.descriptions?.es,
                de: data?.descriptions?.de,
                fr: data?.descriptions?.fr,
            }
        })
        console.log(updateDescriptions)
        return res.status(200).json({ success: true, result: updateSoftoneProduct });

    }
    if (action === "translate") {
        let data = req.body.data;
        let { id, fieldName, index } = req.body

        try {
            await connectMongo();
            const updated = await Product.updateOne(
                { _id: id },
                {
                    $set: {
                        localized: {
                            fieldName: fieldName,
                            translations: data
                        }
                    }
                }
            );
            return res.status(200).json({ success: true, result: updated });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }
    }
    if (action === 'search') {


        let query = req.body.query;
        await connectMongo();
        // Construct a case-insensitive regex pattern for the search query

        const regexPattern = new RegExp(query, 'i');
        let search = await SoftoneProduct.find({ NAME: regexPattern })
        console.log(search)
        return res.status(200).json({ success: true, result: search });
    }

    if (action === 'insert') {
        await connectMongo();
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/getMtrl`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
            })
        });
        let buffer = await translateData(response)
        console.log(buffer.result)
        await connectMongo();
        let insert1 = await SoftoneProduct.insertMany(buffer.result)

        let softone = await SoftoneProduct.find({}, { MTRL: 1, NAME: 1, _id: 1 })


        let productsInsert = softone.map((item) => ({
            softoneProduct: item._id,
            name: item.NAME,
            MTRL: item.MTRL,
            softoneStatus: true,
        }))
        let insert = await Product.insertMany(productsInsert)

        return res.status(200).json({ success: true, result: insert });



    }

    if (action === 'updateClass') {
        let { categoryid, groupid, subgroupid, gridData } = req.body;

        //All products that will change classes
        //Από εργαλεία χειρός θα ανήκει σε Ηλεκτρικά εργαλεία πχ

        //MTRL = ID -> TO FIND THE PRODUCT IN THE DATABASE AND UPDATE THEM
        let OBJ = {
            MTRGROUP: groupid,
            MTRCATEGORY: categoryid,
            CCCSUBGOUP2: subgroupid,
            CCCSUBGROUP3: ""
        }

        await connectMongo()



        async function updateMongo(item) {
            let MTRLID = item.MTRL[0];
            let result = await SoftoneProduct.updateOne({
                MTRL: MTRLID
            }, {
                ...OBJ
            })

            if (result.modifiedCount > 0) {
                return { MTRLID: MTRLID, updated: true }
            }
            if (result.modifiedCount < 1) {
                return { MTRLID: MTRLID, updated: false }
            }

        }

        try {
            let results = [];
            if (gridData) {
                for (let item of gridData) {
                    // let sonftoneresult = await updateSoftone(item)
                    // results.push(sonftoneresult)

                    let mongoresult = await updateMongo(item)
                    results.push(mongoresult)



                }
                return res.status(200).json({ success: true, result: results });
            }
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }


    }

    if (action === 'intervalInventory') {
        console.log('interval')
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.mtrl/mtrlInventory`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
            })
        });
        let buffer = await translateData(response)
        const now = new Date();
        const formattedDateTime = format(now, 'yyyy-MM-dd HH:mm:ss');
        let count = 0;
        try {
            for (let item of buffer.result) {
                let product = await Product.updateOne({
                    MTRL: item.MTRL
                }, {
                    $set: {
                        availability: {
                            DIATHESIMA: item.AVAILABLE,
                            SEPARAGELIA: item.ORDERED,
                            DESVMEVMENA: item.RESERVED,
                            date: formattedDateTime.toString()
                        }
                    }

                })
                console.log(product)
                if (product.modifiedCount == 1) {
                    count++;
                }
            }
            if (count == buffer.result.length) {
                return res.status(200).json({ success: true, result: 'ok' });
            } else {
                return res.status(200).json({ success: false, result: 'not ok' });
            }
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }




    }



    if (action === 'filterCategories') {
        let categoryID = 11;
        await connectMongo();

        let result = await Product.aggregate([
            {
                $lookup: {
                    from: "softoneproducts",
                    localField: "softoneProduct",
                    foreignField: "_id",
                    as: "softoneProduct"
                },
            },
            {
                $match: {
                    "softoneProduct.MTRCATEGORY": 11
                }
            },
            {
                $lookup: {
                    from: 'mtrcategories',
                    localField: 'softoneProduct.MTRCATEGORY',
                    foreignField: 'softOne.MTRCATEGORY',
                    as: 'mtrcategory'
                }
            },

            {
                $unwind: "$mtrcategory"
            },
            {
                $project: {
                    "softoneProduct": 1,
                    "mtrcategory.categoryName": 1,
                }
            }


        ])








        return res.status(200).json({ success: true, result: result });
    }

    if (action === 'warehouse') {
        const { exportWarehouse, importWarehouse, diathesimotita } = req.body;
        const now = new Date();
        const formattedDateTime = format(now, 'yyyy-MM-dd HH:mm:ss');
     
        const updates =  diathesimotita.map(item => ({
            updateOne: {
                filter: { MTRL: item.MTRL },
                update: {
                    $set: {
                        "availability.DIATHESIMA": item.available,
                        "availability.date":  formattedDateTime.toString(),
                    }
                },
                upsert: false  // optional: set to true if you want to create a new document when no document matches the filter
            }
        }));
        SoftoneProduct.bulkWrite(updates)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.error(err);
            });

        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getItemDoc`;
        async function modifySoftonePost(SERIES, data) {
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({
                    username: "Service",
                    password: "Service",
                    COMPANY: 1001,
                    WHOUSE: 1000,
                    SERIES: SERIES,
                    WHOUSESEC: 1000,
                    MTRLINES: data
                })
            });
            let resJSON = await response.json();
            console.log(resJSON);
            return resJSON;
        }

        try {
            let importRes;
            let exportRes;
            if (exportWarehouse && exportWarehouse.length > 0) {
                   importRes = await modifySoftonePost(1011, exportWarehouse)
            }
            if (importWarehouse && importWarehouse.length > 0) {
                   exportRes =  await modifySoftonePost(1010, importWarehouse)
            }


            return res.status(200).json({ success: true, resultImport: importRes, resultExport: exportRes });
        } catch (e) {
            return res.status(400).json({ success: false, result: null });
        }

    }

    if (action === "importCSVProducts") {



        const { data } = req.body;
        await connectMongo();
        //ADD THE SOFTONE PRODUCT
        try {

            const softOneData = data.map((item) => {
                return {
                    NAME: item.name || '',
                    CODE: item.CODE || '',
                    CODE1: item.CODE1 || '',
                    CODE2: item.CODE2 || '',
                    VAT: item.VAT || '',
                    COUNTRY: item.COUNTRY || '',
                    INTRASTAT: item.INTRASTAT || '',
                    WIDTH: item.WIDTH || '',
                    HEIGHT: item.HEIGHT || '',
                    LENGTH: item.LENGTH || '',
                    GWEIGHT: item.GWEIGHT || '',
                    VOLUME: item.VOLUME || '',
                    STOCK: item.STOCK || '',
                    PRICER: item.PRICER || '',
                    PRICEW: item.PRICEW || '',
                    PRICER05: item.PRICER05 || '',
                }
            })
            let createSoftone = await SoftoneProduct.create(softOneData)

            let productInsert = createSoftone.map((item) => {
                return {
                    name: item.NAME || '',
                    description: item.description || '',
                    softoneStatus: false,
                    attributes: item.attributes || [],
                }
            })
            let insert = await Product.insertMany(productInsert)
            return res.status(200).json({ success: true, result: insert });

        } catch {
            return res.status(400).json({ success: false, error: 'error' });
        }

    }

	if(action === "translate") {
		let data = req.body.data;

		let {id, fieldName, index} = req.body
		

		try {
			await connectMongo();
			const result = await Product.findOne({ _id: id  });
			if(result.localized.length == 0) {
				result.localized.push({
					fieldName: fieldName,
					translations: data
				})

				

			} 

			if(result.localized.length > 0) {
				result.localized.map((item) => {
					if(item.fieldName == fieldName) {
						item.translations = data;
					}
					return item;
				})
			
				
			}
			const finalUpdate = await Product.updateOne(
				{_id: id},
				{$set: {localized:result.localized}}
			  	);

			return res.status(200).json({ success: true, result: finalUpdate  });
		} catch(e) {
			return res.status(400).json({ success: false, result: null });
		}
	}
}



