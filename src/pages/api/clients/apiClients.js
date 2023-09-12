import translateData from "@/utils/translateDataIconv";
import connectMongo from "../../../../server/config";
import Clients from "../../../../server/models/modelClients";

export default async function handler(req, res) {
    const action = req.body.action
    if (action === 'findAll') {
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.trdr/getCustomers`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
            })
        });
        console.log('response')
        let buffer = await translateData(response)
      
        try {
            await connectMongo();
            let findClients = await Clients.find({});
            let missingArray = []
            if(buffer.result.length > findClients.length) {
                      let diff = buffer.result.filter((client) => {
                        let find = findClients.find((findClient) => findClient.TRDR === client.TRDR)
                        if(!find) return client
                      })
                      missingArray.push(...diff)
            }
            return res.status(200).json({ success: true, result: findClients, missing: missingArray })
        } catch (e) {
            return res.status(400).json({ success: false, data: [] })
        }

    }


    if (action === "insert") {
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.trdr/getCustomers`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
            })
        });
        console.log('response')
        let buffer = await translateData(response)

        try {
            await connectMongo();
            let result = await Clients.insertMany(buffer.result)
            console.log(result)
            return res.status(200).json({ success: true, data: result })
        } catch (e) {
            return res.status(400).json({ success: false, data: [] })
        }
    }
    if(action === 'upsert') {
        let {data} = req.body;
        console.log('upsert')
        console.log(data)
       

        try {
            await connectMongo();
            for(let item of data) {
                let result = await Clients.updateOne({TRDR: item.TRDR}, item, {upsert: true})
                console.log(result)
            }
            return res.status(200).json({ success: true })
        } catch (e) {
            return res.status(400).json({ success: false })
        }
    
    }

    if(action === 'fetchBatch') {
        let {skip, limit} = req.body;
        console.log('fetchBatch')
        try {
            await connectMongo();
            let totalRecords = await Clients.countDocuments({})
            let result = await Clients.find({})
            .skip(skip)
            .limit(limit)
            console.log('result ' + JSON.stringify(result))
            return res.status(200).json({ success: true, result: result, totalRecords:totalRecords })
        } catch(e) {
            return res.status(400).json({ success: false })
        }
    }

    if(action === 'search') {
        let {searchTerm, skip, limit} = req.body;

        console.log('searchTerm ' + searchTerm)
        console.log('skip ' + skip)
        console.log('limit ' + limit)

        try {
            await connectMongo();
            const totalRecords = await Clients.countDocuments({})
            if(searchTerm === '') {
                
                const clients = await Clients.find({})
                .skip(skip)
                .limit(limit);
                return res.status(200).json({ success: true, result: clients, totalRecords: totalRecords })
            } else {

                const clients = await Clients.find({
                    $text: {
                        $search: searchTerm
                    }
                }).skip(skip).limit(limit);
               
                const clientsTotal = await Clients.find({
                    $text: {
                        $search: searchTerm
                    }
                })

                let totalRecords = clientsTotal.length;
               
              
                return res.status(200).json({ success: true, result: clients , totalRecords: totalRecords })
            }




        } catch (e) {
            return res.status(400).json({ success: false })
        }

      
    }

    if(action === 'sendOffer') {
        let {data } = req.body;
        let URL = `${process.env.NEXT_PUBLIC_SOFTONE_URL}/JS/mbmv.utilities/getSalesDoc`;
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                username: "Service",
                password: "Service",
                SERIES: 7001,
                COMPANY:1001,
                ...data
            })
        });
        let responseJSON = await response.json();
        console.log(responseJSON)
        return res.status(200).json({ success: true, result: responseJSON })
    }
}