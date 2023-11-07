import axios from "axios";
let AccessKey = process.env.NEXT_PUBLIC_BUNNY_KEY;

const storageZoneName = 'kolleris'
const region = 'storage'
const path = 'images'
const headers = {
  AccessKey: AccessKey,
  'Content-Type': 'application/octet-stream',
}

export async function uploadBunny(data, fileName) {
    let result = await axios.put(`https://${region}.bunnycdn.com/${storageZoneName}/images/${fileName}`, data , { headers: headers })
    return result.data
}




// "kolleris.b-cdn.net/test09.jpg"