'use client'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector, useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { setSelectedSupplier, setInputEmail } from '@/features/supplierOrderSlice';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/router';
import StepHeader from '../multiOffer/StepHeader';

const SuppliersGrid = () => {
    const router = useRouter();
    const { selectedSupplier } = useSelector(state => state.supplierOrder)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [sortOffers, setSortOffers] = useState(1)
    const [searchTerm, setSearchTerm] = useState({
        name: '',
        afm: '',
        address: '',
        phone01: '',
        phone02: '',
        email: ''
    })
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 15,
        page: 1,
    });
    const [totalRecords, setTotalRecords] = useState(0);
    const dispatch = useDispatch()
    useEffect(() => {
       dispatch(setSelectedSupplier(null)) 
    }, [])


    console.log('selected supplier')
    console.log(selectedSupplier)

    const fetchClients = async () => {
        const isAnyFieldNotEmpty = Object.values(searchTerm).some(value => value == '');
        if (isAnyFieldNotEmpty) {
            setLoading(true)
        }
       
        let { data } = await axios.post('/api/suppliers', {
            action: "fetchAll",
            skip: lazyState.first,
            limit: lazyState.rows,
            searchTerm: searchTerm,
            sortOffers: sortOffers,
        })
        setData(data.result)
        setTotalRecords(data.totalRecords)
        setLoading(false)

    }

    useEffect(() => {
        fetchClients();
    }, [
        lazyState.rows,
        lazyState.first,
        searchTerm,
        sortOffers
    ])

    const SearchName = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.name} onChange={(e) => setSearchTerm(prev => ({ ...prev, name: e.target.value }))} />
                </span>
            </div>
        )
    }

    const SearchAFM = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.afm} onChange={(e) => setSearchTerm(prev => ({ ...prev, afm: e.target.value }))} />
                </span>
            </div>
        )
    }
 
    const SearchEmail = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.email} onChange={(e) => setSearchTerm(prev => ({ ...prev, email: e.target.value }))} />
                </span>
            </div>
        )
    }


  

    const onSelectionChange = (e) => {
        dispatch(setSelectedSupplier(e.value))
    }

    const onPage = (event) => {
        setlazyState(event);
    };

   

  
    


 
  
    return (
        <>
                <DataTable
                    value={data}
                    paginator
                    rows={lazyState.rows}
                    rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
                    first={lazyState.first}
                    lazy
                    totalRecords={totalRecords}
                    onPage={onPage}
                    selectionMode={'radio'}
                    selection={selectedSupplier}
                    onSelectionChange={onSelectionChange}
                    loading={loading}
                    filterDisplay="row"
                    className="p-datatable-gridlines p-datatable-sm"
                    id={'_id'}
                    showGridlines
                >  
                    <Column selectionMode="single" ></Column>
                <Column field="NAME" filter showFilterMenu={false} filterElement={SearchName}  header="Ονομα"></Column>
                <Column field="AFM" filter showFilterMenu={false} filterElement={SearchAFM} header="ΑΦΜ" ></Column>
                <Column field="EMAIL" filter showFilterMenu={false} filterElement={SearchEmail} header="Email"></Column>
                </DataTable>
        </>
    )
}






export default SuppliersGrid;