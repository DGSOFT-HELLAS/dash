'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { Button } from 'primereact/button';
import SoftoneStatusButton from '@/components/grid/SoftoneStatusButton';
import { useSelector, useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import StepHeader from '@/components/StepHeader';
import { useRouter } from 'next/router';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { setLazyState } from '@/features/productsSlice';
import ProductSearchGrid from '@/components/grid/ProductSearchGrid';
import SelectedProducts from '@/components/grid/SelectedProducts';
import { setSelectedProducts } from '@/features/supplierOrderSlice';
import { useSession } from 'next-auth/react';

const Page = () => {

  const dispatch = useDispatch()
  const router = useRouter()
  const { data: session, update } = useSession();
  let user = session?.user?.user;
  const {id} = router.query
  const {selectedProducts, mtrLines} = useSelector(state => state.products)




  const handleFinalSubmit = async () => {
    let { data } = await axios.post('/api/createOrder', {
      action: 'updateBucket',
      products: mtrLines,
      TRDR: id,
      createdFrom: user?.lastName,
    })
      router.push(`/dashboard/suppliers/order/${id}`)
  }
  return (
    <AdminLayout>
      <StepHeader text="Προσθήκη Προϊόντων στο bucket" />
      <ProductSearchGrid />
      {selectedProducts.length > 0 ? (
        <div className='mt-4'>
          <StepHeader text="Επιλεγμένα Προϊόντα" />
          <SelectedProducts />
        </div>
      ) : null}
      <div className='mt-3 flex'>
        <Button className='mr-2' severity='success' icon="pi pi-arrow-left" onClick={() => router.back()} />
        <SoftoneStatusButton  btnText={'Προσθήκη'} products={selectedProducts} onClick={handleFinalSubmit}/>
      </div>

    </AdminLayout>
  )
}





export default Page;