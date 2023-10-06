import Supplier from "../../../server/models/suppliersSchema";
import connectMongo from "../../../server/config";
import SoftoneProduct, { Product } from "../../../server/models/newProductModel";
import Markes from "../../../server/models/markesModel";
import nodemailer from 'nodemailer';

export default async function handler(req, res) {

    const action = req.body.action;
    if(action === 'fetchSuppliers') {
        const {skip, limit} = req.body
        try {
            await connectMongo();
            let totalRecords = await Supplier.countDocuments({});
            let suppliers = await Supplier.find({}).skip(skip).limit(limit)
            
            return res.status(200).json({ success: true, result: suppliers, totalRecords: totalRecords });
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }
    
    if (action === "searchSupplier") {
        let { skip, limit, searchTerm } = req.body;
        let regexSearchTerm = new RegExp("^" + searchTerm, 'i');
        const totalRecords = await Supplier.countDocuments({NAME: regexSearchTerm})
        let suppliers = await Supplier.find({NAME: regexSearchTerm}).skip(skip).limit(limit).select({NAME: 1, EMAIL: 1, _id: 1})
        return res.status(200).json({ success: true, result: suppliers, totalRecords: totalRecords })
    }

    if(action === "saveNewEmail") {
        let {email, id} = req.body;

        await connectMongo();
        try {
            console.log(email ,id)
            let update = await Supplier.updateOne({_id: id}, {
                $set: {
                    EMAIL: email
                }
            })
            return res.status(200).json({ success: true, result: update })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if(action === "fetchProducts") {
        const {skip, limit, searchTerm} = req.body;
        console.log('FETCH PRODUCTS')
        try {
            await connectMongo();
            let regexSearchTerm = new RegExp("^" + searchTerm, 'i');
            console.log(regexSearchTerm)
            let totalRecords;
            let pipeline = [
                {
                    $lookup: {
                        from: "markes",  
                        localField: "MTRMARK", 
                        foreignField: "softOne.MTRMARK",
                        as: "matched_mark"  // Output alias for matched documents from MARKES
                    }
                },
                {
                    $unwind: "$matched_mark"
                },
                {
                    $project: {
                        _id: 0, 
                        NAME: 1,
                        PRICER: 1,
                        MTRL: 1,
                        "brandName": "$matched_mark.softOne.NAME", 
                        "mtrmark": "$matched_mark.softOne.MTRMARK", 
                        "minValue": "$matched_mark.minValueOrder",
                        "minItems": "$matched_mark.minItemsOrder",
                    }
                },
                {
                    $skip: skip  // Skip the first 10 documents
                },
                {
                    $limit: limit // Limit the result to 10 documents
                }
            ]
           

            if (searchTerm ) {
                totalRecords = await SoftoneProduct.countDocuments({NAME: regexSearchTerm});
                pipeline.unshift({
                    $match: { NAME: regexSearchTerm }
                });
            } else {
                totalRecords = await SoftoneProduct.countDocuments({});
            }
             
            let products = await SoftoneProduct.aggregate(pipeline)
            return res.status(200).json({ success: true, result: products, totalRecords: totalRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if(action === 'fetchMarkes') {
        console.log('fetch markes')
        try {
            await connectMongo();
            let markes = await Markes.find({}).select({"softOne.NAME": 1, "softOne.MTRMARK": 1, _id: 0})
            return res.status(200).json({ success: true, result: markes })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if(action == "searchBrand") {
        console.log('search brand')

        const {skip, limit, mtrmark, searchTerm} = req.body;
        try {
            await connectMongo();
            let regexSearchTerm = new RegExp("^" + searchTerm, 'i');

            let pipeline = [
                {
                    $match: {
                        MTRMARK: parseInt(mtrmark) // Filtering documents by MTRMARK
                    }
                },
                {
                    $lookup: {
                        from: "markes",  // Join with the MARKES collection
                        localField: "MTRMARK",  // Join using the MTRMARK field from SoftoneProduct
                        foreignField: "softOne.MTRMARK",  // Join using softOne.MTRMARK from MARKES
                        as: "matched_mark"  // Output alias for matched documents from MARKES
                    }
                },
                {
                    $unwind: "$matched_mark"
                },
                {
                    $project: {
                        _id: 0,
                        NAME: 1,
                        PRICER: 1,
                        MTRL: 1,
                        brandName: "$matched_mark.softOne.NAME",
                        "minValue": "$matched_mark.minValueOrder",
                        "minItems": "$matched_mark.minItemsOrder",
                        
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit:limit
                }
            ]

            if (searchTerm ) {
                pipeline.unshift({
                    $match: { NAME: regexSearchTerm }
                });
            }

            let totalRecords = await SoftoneProduct.countDocuments({MTRMARK: parseInt(mtrmark)})
            let products = await SoftoneProduct.aggregate(pipeline)
            console.log(JSON.stringify(products))
            return res.status(200).json({ success: true, result: products, totalRecords: totalRecords })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
    }

    if(action === "sendOrder") {
        const {products, email} = req.body;
        console.log(products)
        let body = products.map((product) => {
            return `<p>--- <strong>Προϊόν</strong>--- </p><p>Όνομα: ${product.NAME}</p>
            <p>Ποσότητα: <strong>${product.QUANTITY}</strong></p>
            <p>Τιμή: <strong>${product.PRICE}€</strong></p>
            <p>Σύνολο Τιμής: <strong>${product.TOTAL_PRICE}€</strong></p>
            <p>---------------</p>`;
        }).join('');  // Join array elements into a single string

            console.log(body)


        try {
            const mailOptions = {
                from: "johnchiout.dev@gmail.com",
                to: "johnchiout.dev@gmail.com", 
                subject: `Προσφορά - NUM:`, 
                html: `${body}` 
            };



            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });


        //     return res.status(200).json({ success: true })
        //     // return res.status(200).json({ success: true, result: insert })
        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }
        
    }

}


// const transporter = nodemailer.createTransport({
//     host: 'smtp.office365.com',
//     port: 587,
//     secure: false, // use SSL, you can try with true also
//     auth: {
//         user: process.env.OFFICE365_USER,
//         pass: process.env.OFFICE365_PASSWORD
//     },
//     tls: {
//         ciphers: 'SSLv3'
//     }
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "johnchiout.dev@gmail.com",
        pass: process.env.NEXT_PUBLIC_NODEMAILER_PASS
    }
});