import React, { useState, useEffect, useRef, useReducer } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Image from 'next/image';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import axios from 'axios';
import styled from 'styled-components';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast'
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { AddDialog, EditDialog } from '@/GridDialogs/brandDialog';
import Gallery from '@/components/GalleryList';
import Link from 'next/link'

import { TabView, TabPanel } from 'primereact/tabview';

export default function TemplateDemo() {
    const [brand, setBrand] = useState([]);
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState([])
    const [expandedRows, setExpandedRows] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },

    });
    //
    const [images, setImages] = useState([])

    const handleFetchUser = async () => {
        try {
            const resp = await axios.post('/api/admin/markes/markes', { action: 'findAll' })

            setData(resp.data.markes)
            setImages(resp.data.images)

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        handleFetchUser();

    }, []);




    const logoTemplate = (data) => {
        let logo = data.logo ? data.logo : 'notfound.jpg'
        return (
            <ImageDiv>
                <Image
                    src={`/uploads/${logo}`}
                    alt="mountain"
                    sizes="40px"
                    fill={true}

                />
            </ImageDiv>

        )
    }
    //TEMPLATES

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Αναζήτηση" />
            </span>
        );
    };
    const header = renderHeader();

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };



    const allowExpansion = (rowData) => {
        // 
        return rowData
    };

    const onRowCollapse = (event) => {
        // toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    };
    const onRowExpand = (event) => {
        // toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    };

    const rowExpansionTemplate = (data) => {

        return (
            < ShowDetails >
                {/* <div className="list-item">
                    <span>Ιστοσελίδα:</span>
                    <Link className="grid-link" href={data.webSiteUrl}>{data.webSiteUrl}</Link>
                </div>
                <div className="divider"></div>
                <div className="list-item">
                    <span>Ιnstagram:</span>
                    <span>{data.instagramUrl}</span>
                </div>
                <div className="divider"></div>
                <div className="list-item">
                    <span>URL καταλόγου:</span>
                    <span>{data.officialCatalogueUrl}</span>
                </div>
                <div className="divider"></div>
                <div className="list-item">
                    <span>Εικόνες:</span>
                </div> */}
                    <div className="card">
            <TabView>
                <TabPanel header="Φωτογραφίες">
                    <Gallery  />
                </TabPanel>
                <TabPanel header="Βίντεο">
                    <p className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
                        eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui 
                        ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                    </p>
                </TabPanel>
                <TabPanel header="Λεπτομέριες">
                    <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti 
                        quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
                        culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. 
                        Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                    </p>
                </TabPanel>
            </TabView>
        </div>
            </ ShowDetails >
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={() => console.log('export pdf')} />
            </>
        );

    };


    //Edit:
    const editProduct = (product) => {
        setBrand({ ...product })
        setEditDialog(true)
    };

    //Add product
    const openNew = () => {
        setBrand([]);
        setSubmitted(false);
        setAddDialog(true);
    };


    const hideDialog = () => {
        setSubmitted(false);
        setEditDialog(false);
        setAddDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);
        console.log('brand: ' + JSON.stringify(brand))
        // if (product.name.trim()) {
        //     let _products = [...products];
        //     let _product = { ...product };

        //     if (product.id) {
        //         const index = findIndexById(product.id);

        //         _products[index] = _product;
        //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        //     } else {
        //         _product.id = createId();
        //         _product.image = 'product-placeholder.svg';
        //         _products.push(_product);
        //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        //     }

        //     setProducts(_products);
        //     setProductDialog(false);
        //     setProduct(emptyProduct);
    }

    // CUSTOM TEMPLATES FOR COLUMNS
    const actionBodyTemplate = (rowData) => {
        return (
            <ActionDiv>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => console.log('delete')} />
            </ActionDiv>
        );
    };
    return (
        <AdminLayout >
            {/* <Toast ref={toast} /> */}
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
            <DataTable
                header={header}
                value={data}
                paginator
                rows={8}
                rowsPerPageOptions={[5, 10, 25, 50]}
                showGridlines
                rowExpansionTemplate={rowExpansionTemplate}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                onRowExpand={onRowExpand}
                onRowCollapse={onRowCollapse}
                dataKey="softOne.MTRMARK"
                filters={filters} onFilter={(e) => setFilters(e.filters)}
                //edit:
                editMode="row"
            >
                {/* <Column field="softOne.MTRMARK" header="MTRMARK" sortable></Column> */}
                <Column bodyStyle={{ textAlign: 'center' }} expander={allowExpansion} style={{ width: '20px' }} />
                <Column field="logo" header="Λογότυπο" body={logoTemplate} ></Column>
                <Column field="softOne.NAME" header="Ονομα" sortable></Column>
                <Column field="softOne.ISACTIVE" header="Status" tableStyle={{ width: '5rem' }} body={ActiveTempate}></Column>
                {/* <Column header="Actions"  body={actionsTemplate} tableStyle={{ width: '80px'}}></Column> */}
                {/* <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
                <Column body={actionBodyTemplate} exportable={false} bodyStyle={{ textAlign: 'center' }} tableStyle={{ width: '100px' }}></Column>

            </DataTable>
            <EditDialog
                data={brand}
                setData={setBrand}
                dialog={editDialog}
                setDialog={setEditDialog}
                hideDialog={hideDialog}
                saveProduct={saveProduct}
                submitted={submitted}
                setSubmitted={setSubmitted}
            />
            <AddDialog
                data={brand}
                setData={setBrand}
                dialog={addDialog}
                setDialog={setAddDialog}
                hideDialog={hideDialog}
                saveProduct={saveProduct}
                submitted={submitted}
                setSubmitted={setSubmitted}
            />
        </AdminLayout >
    );
}


const ActiveTempate = ({ softOne }) => {
    const isActive = softOne.ISACTIVE
    return (
        <div>
            {isActive == 1 ? (
                <Tag severity="success" value=" active "></Tag>
            ) : (
                <Tag severity="Danger" value="deleted" ></Tag>
            )}

        </div>
    )

}







const ImageDiv = styled.div`
    width: 55px;
    height: 40px;
    padding: 10px;
    /* border-radius: 50%; */
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
   
    img {
        object-fit: contain;
    }
`

const ActionDiv = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    button {
        box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
        margin-left: 2px;
        margin-right: 2px;
    }


`




const ShowDetails = styled.div`
    border: 1px solid #e0e0e0;
   
    .list-item  {
        padding: 20px;
        /* border-bottom: 1px solid #e0e0e0; */
     
    } 
    .list-item span:nth-child(1) {
        font-weight: bold;
        margin-right: 20px;
    }
   

    .divider {
        padding: 0px;
        height: 1px;
        background-color: #e0e0e0;
    }

    .grid-link {
        color: #0d6efd;
        cursor: pointer;

    }
`