'use client';
import React, { useState, useEffect, use } from 'react';
import { Column } from 'primereact/column';
import { useSelector, useDispatch } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { deleteSelectedProduct, setMtrLines } from '@/features/impaofferSlice';
const ChosenProducts = () => {
    const { selectedProducts, mtrLines } = useSelector(state => state.impaoffer)
    const [length, setLength] = useState(selectedProducts.length)

  


    useEffect(() => {
        setLength(selectedProducts.length)
    }, [selectedProducts])



    return (
        <DataTable
            paginator
            rows={5}
            totalRecords={length}
            rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
            value={selectedProducts}
            className='border-1 border-round-sm	border-50'
            size="small"
        >
            <Column header="Προσφορά" body={itemTemplate}></Column>
            <Column header="Προσφορά" style={{ width: '70px' }} body={calculateTemplate}></Column>
            <Column style={{ width: '30px' }} body={RemoveTemplate}></Column>
        </DataTable>
    )
}

const calculateTemplate = (item) => {
    const [quantity, setQuantity] = useState(1)
    const dispatch = useDispatch();
   

    useEffect(() => {
        dispatch(setMtrLines({ MTRL: item.MTRL, QUANTITY: quantity }))
    }, [])
    const increaseQuantity = () => {
        setQuantity(prev => prev + 1)
        dispatch(setMtrLines({ MTRL: item.MTRL, QUANTITY: quantity + 1 }))
    }



    const decreaseQuantity = () => {
        if (quantity === 1) return
        setQuantity(prev => prev - 1)
        dispatch(setMtrLines({ MTRL: item.MTRL, QUANTITY: quantity - 1 }))

    }

    return (
        <div className='flex'>
            <div className='font-xs flex align-items-center border-1 p-2 border-300 border-round'>
                <div
                    onClick={decreaseQuantity}
                    className='mr-2 border-1 border-300  flex align-items-center justify-content-center border-round pointer-cursor'
                    style={{ width: '25px', height: '25px' }}>
                    <i className="pi pi-minus" style={{ fontSize: '10px' }}></i>
                </div>
                <div className='w-2rem flex align-items-center justify-content-center'>
                    <p className='text-lg'>{quantity}</p>
                </div>
                <div
                    onClick={increaseQuantity}
                    className='ml-2 border-1  flex align-items-center justify-content-center border-round border-400' style={{ width: '25px', height: '25px' }}>
                    <i className="pi pi-plus" style={{ fontSize: '10px' }}></i>
                </div>
            </div>
        </div>
    )
}

const RemoveTemplate = (item) => {
    const dispatch = useDispatch()
    return (
        <div className="flex flex-wrap p-2 align-items-center gap-3 border-left-1 border-400 pl-3">
            <i className="pi pi-trash text-red-400" onClick={() => dispatch(deleteSelectedProduct(item._id))}></i>
        </div>
    );
}

const itemTemplate = (item) => {
    return (
        <div className="flex flex-wrap p-2 align-items-center gap-3">
            <div className="flex-1 flex flex-column gap-2">
                <span className="font-bold">{item.NAME}</span>
                <div className="flex align-items-center gap-2">
                    <i className="pi pi-tag text-sm"></i>
                    <span>{item.CODE}</span>
                    <div>
                        <i className="pi pi-dollar font-bold text-sm text-primary"></i>
                        <span className='font-bold text-primary'>{item.PRICER}</span>
                    </div>
                </div>

            </div>
            {/* <span className="font-bold text-900">${item.PRICER}</span> */}
        </div>
    );
};

export default ChosenProducts;