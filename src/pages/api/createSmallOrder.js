
import connectMongo from "../../../server/config";
import SmallOrders from "../../../server/models/smallOrdersModel";
import { calculateCompletion, getPurdoc } from "./createOrder";
import createCSVfile from "@/utils/createCSVfile";
import { sendEmail } from "@/utils/offersEmailConfig";


export default async function handler(req, res) {
     const {action} = req.body;

     if(action === "createOrder") {
        const {mtrLines, supplier, createdFrom} = req.body;
        const TRDR = supplier?.TRDR;
        const NAME = supplier.NAME;
        const supplierEmail = supplier.EMAIL;
        const supplierName = supplier.NAME;

       

        //CALCULATE THE TOTAL COST OF THE PRODUCTS:
        let total_cost = calculateCompletion(mtrLines);
     
        try {
            await connectMongo();
            let create = await SmallOrders.create({
                total_cost: total_cost,
                supplierName: supplierName,
                TRDR: TRDR,
                supplierEmail: supplierEmail || "",
                status: "pending",
                PURDOCNUM: "",
                updatedFrom: createdFrom,
                products: mtrLines
            })
          
            return res.status(200).json({success: true, result: create});
            
        } catch (e) {   
            return res.status(400).json({success: false, result: null});
        }
     }

     if(action === "getOrders") {
        try {
            await connectMongo();
            let orders = await SmallOrders.find({}).sort({createdAt: -1});
            return res.status(200).json({success: true, result: orders});
        } catch (e) {
            return res.status(400).json({success: false, result: null});
        }
     }

     if(action === "getProducts") {
        const {id} = req.body;
        try {
            await connectMongo();
            let orders = await SmallOrders.findOne({_id: id }, {
                products: 1,
                total_cost: 1,
                _id: 0
            });
          
            return res.status(200).json({success: true, result: orders});
        } catch (e) {
            return res.status(400).json({success: false, result: null});
        }
     }

     if (action === 'addMore') {
        const { mtrLines, id } = req.body;
       
        try {
            await connectMongo();
            let find = await SmallOrders.findOne({ _id: id })
            //find products in the database with this TRDR
            let dbproducts = find?.products;
            let newtotal =find.total_cost + calculateCompletion(mtrLines);
            newtotal = parseFloat(newtotal.toFixed(2));
         
          
            let _products = [];
            for (let item of mtrLines) {
                let itemDB = dbproducts.find(dbItem => dbItem.MTRL === item.MTRL);
                if(!itemDB) {
                    _products.push(item)
                }
            }

           
            let update = await SmallOrders.updateOne({_id: id }, {
                $set: {
                    total_cost: newtotal
                 },
                $push: {
                    products: _products
                },
                
            })
           
            return res.status(200).json({ success: true })

        } catch (e) {
            return res.status(500).json({ success: false })
        }





    }

    if(action === "updateQuantity") {
        const {id, QTY1, MTRL } = req.body;
        
        try {
            await connectMongo();
            let find = await SmallOrders.findOne({_id: id, 'products.MTRL': MTRL});

            //find all products
            let products = find.products;
            //find the products that the quantity doesnt change
            let rest_products = products.filter(item => item.MTRL !== MTRL);
            //The item that we change the QUANTITY
            let product = products.find(item => item.MTRL === MTRL);

            //ESTIMATE THE NEW TOTAL:
            let total = 0;
            for(let item of rest_products) {
                total += item.TOTAL_COST;
            }
            let itemTotal = QTY1 * product.COST;
            itemTotal = parseFloat(itemTotal.toFixed(2));
            total += itemTotal;
            total = parseFloat(total.toFixed(2));

            //UPDATE THE ORDER
            let update = await SmallOrders.findOneAndUpdate({_id: id, 'products.MTRL': MTRL}, {
                $set: {
                    'total_cost': total,
                    'products.$.QTY1': QTY1,
                    'products.$.TOTAL_COST': itemTotal
                }
            }, {new: true})

            console.log(update);
            return res.status(200).json({success: true})
        } catch (e) {
            return res.status(500).json({success: false})
        }

    }
    if(action ==="deleteProduct") {
        const {id, MTRL} = req.body;


        try {
            await connectMongo();
            let find = await SmallOrders.findOne({_id: id, 'products.MTRL': MTRL});
            let products = find.products;
            let remaining = products.filter(item => item.MTRL !== MTRL);
            let total = 0;
            for(let item of remaining) {
                total += item.COST * item.QTY1;
            }

            let update = await SmallOrders.findOneAndUpdate({_id: id, 'products.MTRL': MTRL}, {
                $set: {
                    total_cost: total
                },
                $pull: {
                    products: {
                        MTRL: MTRL
                    }
                }
            }, {new: true})
            console.log(update);
            return res.status(200).json({success: true})
        } catch (e) {
            return res.status(500).json({success: false})
        }
    }
    if(action === "deleteOrder") {
        const {id} = req.body;
        try {
            await connectMongo();
            let deleteOffer = await SmallOrders.deleteOne({_id: id});

            return res.status(200).json({success: true})
        } catch (e) {
            return res.status(500).json({success: false})
        }
    }
    if(action === "issueFinDoc") {
        const {id, MTRL, TRDR} = req.body;
       
        try {
            await connectMongo();
            let find = await SmallOrders.findOne({_id: id}, {}).select('products');
            const products = find.products;
            const mtrlArr = products.map(item => {
                const MTRL = parseInt(item.MTRL);
                const QTY1 = parseInt(item.QTY1);
                return { MTRL, QTY1 };
            });
            console.log(mtrlArr )
            const purdoc = await getPurdoc(mtrlArr, TRDR);
            console.log('purdoc')
            console.log(purdoc)
            if (!purdoc) {
                return res.status(200).json({ success: false, result: null, message: 'ORDER NOT CREATED' })
            }
            await SmallOrders.findOneAndUpdate({_id: id}, {
                $set: {
                    PURDOCNUM: purdoc
                }
            }, {new: true})
            return res.status(200).json({success: true, message: null})
        } catch (e) {
            return res.status(500).json({success: false})
        }

    }
    if (action === "sentEmail") {
        const { TRDR, cc, subject, message, fileName, includeFile,  email, id } = req.body;
        console.log(email)
        console.log('sent email')
        
        if(email === 'no-email' || email === null) {
            return res.status(200).json({success: false, message: 'Δεν υπάρχει email για τον προμηθευτή'})
        }
        let newcc = []
        for (let item of cc) {
            newcc.push(item.email)
        }

       async function findProducts(id) {
            try {
                let find = await SmallOrders.findOne({ _id: id });
                console.log('find')
                console.log(find)
                let products = find.products;
                let _products = products.map((item, index) => {
                    return {
                        PRODUCT_NAME: item.NAME,
                        COST: item.COST,
                        QTY1: item.QTY1,
                        TOTAL_COST: item.TOTAL_COST
                    }
                })
                return _products;
            } catch (e) {
                console.log(e)
                return res.status(500).json({ success: false, result: null, message: 'Αδυναμία έυρεσης προϊόντων' })
            }
       }
        try {
            const _products = await findProducts(id);
            let csv = await createCSVfile(_products)
            let send = await sendEmail(email, newcc, subject, message, fileName, csv, includeFile);
        
            let update = await SmallOrders.findOneAndUpdate({ _id: id }, {
                $set: {
                    status: "sent"
                }
            }, { new: true
            })
           
            return res.status(200).json({ success: true,  send: send })

        } catch (e) {
            return res.status(500).json({ success: false, result: null })
        }

    }
}



