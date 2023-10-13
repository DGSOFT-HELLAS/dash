import React from 'react'
import AdminLayout from '@/layouts/Admin/AdminLayout'
import ChooseSupplier from '@/components/SuppliersOrder/ChooseSupplier'

const Page = () => {
  return (
    <AdminLayout>
            <ChooseSupplier /> 
    </AdminLayout>
  )
}

export default Page