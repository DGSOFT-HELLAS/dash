'use client'
import React, { useEffect, useState } from 'react'

import StepHeader from '@/components/StepHeader'
import ProductSearchGrid from '@/components/grid/ProductSearchGrid'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { setHolder } from '@/features/impaofferSlice'
import { useRouter } from 'next/router'
import SelectedProducts from '@/components/grid/SelectedProducts'
import SoftoneStatusButton from '@/components/grid/SoftoneStatusButton'
import { setPlainHolderName } from '@/features/impaofferSlice'
function generateRandomId(length = 8) {
    return Math.random().toString(36).substr(2, length);
}



const PlainHolder = () => {
    const dispatch = useDispatch();
    const {plainHolderName} = useSelector(state => state.impaoffer)
    const onChange = (e) => {
        dispatch(setPlainHolderName(e.target.value))
    }


    return (
        < AdminLayout>
            <StepHeader text={"Ονομα Holder"} />
            <div className='w-20rem mb-3 mt-2 flex'>
                <InputText className='w-full' value={plainHolderName} onChange={onChange } placeholder='Δώστε ένα όνομα στον Holder' />
                <Button className='ml-2' icon={plainHolderName !== '' ? "pi pi-check" : "pi pi-times"} severity={plainHolderName !== '' ? "success" : "danger"} />
            </div>
            {plainHolderName ? (<Continue  value={plainHolderName}/>) : null}

        </ AdminLayout>
    )
}


const Continue = ({value}) => {
    const { selectedProducts, mtrLines } = useSelector(state => state.products)
    const router = useRouter();
   
    const dispatch = useDispatch();
    const onHolderCompletions = async () => {

        dispatch(setHolder({
            id: generateRandomId(),
            name: value,
            products: mtrLines
        }))
        router.push('/dashboard/multi-offer/create-holder')
    }
    return (
        <>
            <StepHeader text={"Eπιλογή Προϊότων"} />
            <ProductSearchGrid />
            <div className='col-12 mt-6'>
                {selectedProducts.length > 0 ? (
                    <div>
                        <StepHeader text={`Συνολο Προϊόντων`} />
                        <SelectedProducts />
                    </div>
                ) : null}

            </div>
            <div className='mt-4 mb-5'>
                <SoftoneStatusButton  onClick={onHolderCompletions}/>
                {/* {selectedProducts.length !== 0 ? (<Button icon="pi pi-angle-right" disabled={selectedProducts.length === 0} label="Ολοκλήρωση Holder" onClick={onHolderCompletions} />
                ) : null} */}
            </div>
        </>
    )
}
export default PlainHolder