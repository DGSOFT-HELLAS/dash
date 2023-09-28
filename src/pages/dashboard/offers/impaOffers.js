

import React, { useState, useEffect } from 'react';
import { PickList } from 'primereact/picklist';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { Button } from 'primereact/button';
import { useSelector, useDispatch } from 'react-redux';
import StepHeader from '@/components/ImpaOffer/StepHeader';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import ImpaDataTable from '@/components/ImpaOffer/ImpaProductsTable';
import ProductsDataTable from '@/components/ImpaOffer/ProductTable';
import ChosenProducts from '@/components/ImpaOffer/ChosenProducts';
import ChooseCustomer from '@/components/ImpaOffer/ChooseCustomer';
import ChooseImpa from '@/components/ImpaOffer/ChooseImpa';
import CreateHolder from '@/components/ImpaOffer/HolderPage';
import Holders from '@/components/ImpaOffer/Holders';


import MainPage from '@/components/ImpaOffer/MainPage';
import HolderPage from '@/components/ImpaOffer/HolderPage';
const sources = [
    { name: 'Πηγή: Προϊόντα με Impa', id: 1 },
    { name: 'Πηγή: Όλα τα προϊόντα', id: 2 },

];


const ImpaOffers = () => {
    const { selectedImpa, selectedClient, holderPage } = useSelector(state => state.impaoffer)
    const [chooseImpa, setChooseImpa] = useState(true)
    useEffect(() => {
        if (selectedImpa) {
            setChooseImpa(false)
        }
    }, [selectedImpa])


    return (
        <AdminLayout>
           <div className='p-2'>
           <MainPage />
           </div>
        </AdminLayout>

    );
}




// const PickListComp = () => {
//     const { selectedProducts, selectedImpa } = useSelector(state => state.impaoffer)
//     const [show, setShow] = useState(false)
//     const [dataSource, setDataSource] = useState(
//         { name: 'Πηγή: Προϊόντα με Impa', id: 1 },
//     )

//     useEffect(() => {
//         setDataSource({ name: 'Πηγή: Προϊόντα με Impa', id: 1 },)
//     }, [])

//     const onDataSourceChange = (e) => {
//         setDataSource(e.value)
//     }

//     const StartContent = () => {
//         return (
//             <React.Fragment>
//             <Dropdown value={dataSource} onChange={onDataSourceChange} options={sources} optionLabel="name"
//                 placeholder="Επιλογή Πίνακα" className="w-full" />
//         </React.Fragment>
//         )
//     } 

//     const EndContent = () => {
//         return (
//             <React.Fragment>
//             <Button icon={`pi ${!show ? " pi-angle-up" : " pi-angle-down"}`} rounded outlined severity="secondary" aria-label="Search" onClick={() => setShow(prev => !prev)} />
//         </React.Fragment>
//         )
//     } 

//     return (
//         <div className='mt-4' >
//             <StepHeader text={"Βήμα 3:"} />
//             <div >
//                 <Toolbar start={StartContent} end={EndContent} />
//                 {!show ? (
//                     <>
//                         {dataSource.id == 1 ? (<ImpaDataTable />) : null}
//                         {dataSource.id == 2 ? (<ProductsDataTable />) : null}
//                     </>
//                 ) : null}
//             </div>

//             <div className='col-12 mt-4'>

//                 {selectedProducts.length > 0 ? (
//                     <>
//                         <StepHeader text={`Συνολο Προϊόντων για Impa ${selectedImpa?.code}:`} />
//                         <ChosenProducts />
//                     </>
//                 ) : null}

//             </div>
//         </div>
//     )

// }

export default ImpaOffers;








