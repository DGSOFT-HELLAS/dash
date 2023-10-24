import React, { useState, useEffect, useRef, useReducer } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
import StepHeader from '@/components/StepHeader';
import { useRouter } from 'next/router';
import ExpandedRowGrid from '@/components/client/ExpandedRowGrid';

export default function Clients() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0)
    const [data, setData] = useState([])
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState({
        name: '',
        afm: '',
        address: '',
        phone: ''
    })
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 50,
        page: 1,
    });
  
   
    const onPage = (event) => {
        setlazyState(event);
    };
   

    const fetchClients = async () => {
        setLoading(true)
        let { data } = await axios.post('/api/clients/apiClients', {
            action: "fetchAll",
            skip: lazyState.first,
            limit: lazyState.rows,
            searchTerm: searchTerm
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
        searchTerm
    ])



    useEffect(() => {
        console.log('submitted: ' + submitted)
        if (submitted) handleFetch()
    }, [submitted])






    const renderHeader = () => {

        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Αναζήτηση" />
            </span>
        );
    };
    const header = renderHeader();

  

    const SearchClient = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.name} onChange={(e) => setSearchTerm(prev => ({...prev, name: e.target.value}))} />
                </span>
            </div>
        )
    }
    
    const SearchAFM = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.afm} onChange={(e) => setSearchTerm(prev => ({...prev, afm: e.target.value}))} />
                </span>
            </div>
        )
    }
    const SearchΑddress = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.address} onChange={(e) => setSearchTerm(prev => ({...prev, address: e.target.value}))} />
                </span>
            </div>
        )
    }
    const SearchPhone = () => {
        return (
            <div className="flex justify-content-start w-20rem ">
                <span className="p-input-icon-left w-full">
                    <i className="pi pi-search " />
                    <InputText value={searchTerm.phone} onChange={(e) => setSearchTerm(prev => ({...prev, phone: e.target.value}))} />
                </span>
            </div>
        )
    }
   
 

    const ShowOffers = ({OFFERSTATUS, NAME}) => {
        const handleClick = () => {
            const encodedString = encodeURIComponent(NAME);
            router.push(`/dashboard/clients/offers/${encodedString}`)
        }
        if(OFFERSTATUS) {
            return (
                <div className='flex cursor-pointer align-items-center p-2' onClick={handleClick}>
                    <div className={`bg-green-600  border-round mr-1 mt-1 `} style={{width: '4px', height: '4px'}}></div>
                    <span className='font-xm text-500'>OFFERS</span>
    
                </div>
            )
        }
       
    }
    return (
        <AdminLayout >
            <Toast ref={toast} />
            <StepHeader text="Πελάτες" />
            <DataTable
                lazy
                totalRecords={totalRecords}
                first={lazyState.first}
                onPage={onPage}
                rows={lazyState.rows}
                size="small"
                value={data}
                paginator
                rowsPerPageOptions={[50, 100, 200, 500]}
                dataKey="_id"
                paginatorRight={true}
                loading={loading}
                filterDisplay="row"
                showGridlines
            >   
                <Column body={ShowOffers}></Column>
                <Column field="NAME"  filter showFilterMenu={false}  filterElement={SearchClient} header="Ονομα" sortable></Column>
                <Column field="AFM" filter showFilterMenu={false} filterElement={SearchAFM} header="ΑΦΜ" sortable></Column>
                <Column field="ADDRESS" filter showFilterMenu={false} filterElement={SearchΑddress}  header="Διεύθυνση" sortable></Column>
                <Column field="EMAIL"  header="Email" sortable></Column>
                <Column field="PHONE01" filter showFilterMenu={false} filterElement={SearchPhone} header="Τηλέφωνο" sortable></Column>
                <Column field="ZIP" header="Ταχ.Κώδικας" sortable></Column>
            </DataTable>
            {/* <EditDialog
                style={dialogStyle}
                data={editData}
                setData={setEditData}
                dialog={editDialog}
                setDialog={setEditDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}
            />
            <AddDialog
                dialog={addDialog}
                setDialog={setAddDialog}
                hideDialog={hideDialog}
                setSubmitted={setSubmitted}
            /> */}

        </AdminLayout >
    );
}



















