import mongoose from 'mongoose';
import { model, models, Schema } from 'mongoose';





const softoneProduct = new mongoose.Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    MTRL: { type: String, required: true },
    ISACTIVE: String,
    NAME: String,
    CODE: String,
    CODE1: String,
    CODE2: String,
    MTRCATEGORY: {
        type: Number,
        default: 0
    },
    MTRGROUP: {
        type: Number,
        default: 0
    },

    CCCSUBGOUP2: {
        type: Number,
        default: 0
    },
    MTRMANFCTR: String,
    MTRMARK: {
        type: Number,
        default: 0
    },
    VAT: String,
    COUNTRY: String,
    INTRASTAT: String,
    MTRUNIT1: String,
    MTRUNIT3: String,
    MU31: String,
    MTRUNIT4: String,
    MU41: String,
    WIDTH: String,
    HEIGHT: String,
    LENGTH: String,
    GWEIGHT: String,
    VOLUME: String,
    STOCK: String,
    SOCURRENCY: String,
    PRICER: String,
    PRICEW: String,
    PRICER01: String,
    PRICER02: String,
    PRICER03: String,
    PRICER04: String,
    PRICER05: String,
    PRICEW01: String,
    PRICEW02: String,
    PRICEW03: String,
    PRICEW04: String,
    PRICEW05: String,
    UPDDATE: String,
  
}, {

    timestamps: true,
});


const productSchema = new mongoose.Schema({
    MTRL: String,
    softoneProduct: {
        type: Schema.Types.ObjectId,
        ref: 'SoftoneProduct',
    },
    attributes: [{ type: Schema.Types.ObjectId, ref: "ProductAttributes" }],
    name: { type: String, required: true },
    description: { type: String, required: false },
    localized: [{
        fieldName: String,
        translations: [
            {
                locale: String,
                code: String,
                translation: String,
            }
        ]
}],
    expected: { type: Number, required: false, },
    reserved: { type: Number, required: false },
   
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Media'
    }],
    impas: [{
        type: Schema.Types.ObjectId,
        ref: 'ImpaCodes'
    }],
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'Media'
    }],
    //Σελίδα κατασκευαστή
    ventorUrl: { type: String, required: false },
    updatedFrom: String,
    availability: {
        DIATHESIMA: String,
        SEPARAGELIA: String,
        DESVMEVMENA: String,
    },

},
{

    timestamps: true,
});


const mediaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true }
});


const impaCodesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    localized: [
        {
            locale: String,
            name: String,
            fields: [
                {
                    fieldName: String,
                    translation: String
                }

            ]
        }
    ],
});




const SoftoneProduct = models.SoftoneProduct || model('SoftoneProduct', softoneProduct)
const Product = models.Product || model('Product', productSchema);
const Media = models.Media || model('Media', mediaSchema);

export {
    Product,
    Media,
}
export default SoftoneProduct;