import React, { useState, useEffect, useRef, use } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Button } from 'primereact/button';
import XLSXDownloadButton from '../exportCSV/Download';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import CreatedAt from '@/components/grid/CreatedAt';
import SendEmailTemplate from '../emails/SendEmailTemplate';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';


const OfferGrid = ({ clientName }) => {
    const [expandedRows, setExpandedRows] = useState(null);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState({
        grid: false,
        delete: false,
    })
    const [refetch, setRefetch] = useState(false)
    const [statuses] = useState(['pending', 'done', 'rejected']);

    const handleFetch = async () => {
        setLoading(prev => ({ ...prev, grid: true }))
        let res = await axios.post('/api/singleOffer', { action: 'findOffers', clientName: clientName })
        setData(res.data.result)
        setLoading(prev => ({ ...prev, grid: false }))
    }


    useEffect(() => {
        handleFetch();
    }, [refetch])


    //STATUS ROW:
    const getSeverity = (value) => {
        switch (value) {
            case 'done':
                return 'warning';

            case 'rejected':
                return 'danger';

            default:
                return null;
        }
    };
    //ON STATUS UPDATE:
    const onRowEditComplete = async (e) => {
        let { newData, index } = e;
        setLoading(prev => ({ ...prev, grid: true }))
        let { data } = await axios.post('/api/createOffer', { action: 'updateStatus', status: newData.status, id: newData._id })
        setLoading(prev => ({ ...prev, grid: false }))
        setRefetch(prev => !prev)

    };
    //OPTIONS FOR THE STATUS ON EDIT:
    const statusEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Status"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverity(option)}></Tag>;
                }}
            />
        );
    };


    //SUBMIT ACTIONS, SEND EMAIL TO CLIENT:
    // const Actions = ({products, clientName, clientEmail, _id, SALDOCNUM,createdAt}) => {
    const Actions = ({ clientEmail, clientName, products, SALDOCNUM, createdAt, _id }) => {

        const op = useRef(null);
        const _products = products.map((item, index) => {
            return {
                CLIENT_NAME: clientName,
                CLIENT_EMAIL: clientEmail || 'Δεν υπάρχει email',
                SALDOCNUM: SALDOCNUM,
                CREATED_AT: createdAt,
                SALDOCNUM: SALDOCNUM,
                PRODUCT_NAME: item.NAME,
                PRICE: item.PRICE,
                QTY1: item.QTY1,
                TOTAL_PRICE: item.TOTAL_PRICE
            }
        })


        const onDelete = async () => {
            setLoading(prev => ({ ...prev, delete: true }))
            let { data } = await axios.post('/api/singleOffer', { action: 'deleteOffer', id: _id })
            setLoading(prev => ({ ...prev, delete: false }))
            setRefetch(prev => !prev)
        }
        return (
            <div className='flex justify-content-center'>
                <i className="pi pi-ellipsis-v pointer" style={{ fontSize: '1.1rem', color: 'blue' }} onClick={(e) => op.current.toggle(e)}></i>
                <OverlayPanel className='w-15rem' ref={op}>
                    <Button loading={loading.delete} label="Διαγραφή" severity='danger' className='w-full mb-2' icon="pi pi-trash" onClick={onDelete} />
                    <XLSXDownloadButton data={_products} fileName={`${clientName}.offer`} />
                    <SendEmailTemplate
                        mt={2}
                        email={clientEmail}
                        products={_products}
                        clientName={clientName}
                        SALDOCNUM={SALDOCNUM}
                        setRefetch={setRefetch}
                        op={op}
                    />
                </OverlayPanel>
            </div>


        )
    }

    const allowExpansion = (rowData) => {
        return rowData
    };


    const Header = () => {
        const _newdata = [];

        data.forEach((item) => {
            item.products.forEach((product) => {
                _newdata.push({
                    CLIENT_NAME: item.clientName,
                    CLIENT_EMAIL: item.clientEmail,
                    SALDOCNUM: item.SALDOCNUM,
                    CREATED_AT: item.createdAt,
                    PRODUCT_NAME: product.NAME,
                    PRICE: product.PRICE,
                    QTY1: product.QTY1,
                    TOTAL_PRICE: product.TOTAL_PRICE
                });
            });
        });
        return (
            <div className='flex justify-content-end'>
                <XLSXDownloadButton data={_newdata} fileName="offer" />
            </div>
        )
    }
    const header = Header();


    const RowExpansionTemplate = ({ products, _id, TRDR, totalPrice }) => {
        return (
            <RowExpansionGrid products={products} id={_id} setRefetch={setRefetch} TRDR={TRDR}  totalPrice={totalPrice}/>
        )
    }

    return (
        <div className="card mt-3">
            <DataTable
                loading={loading.grid}
                header={header}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                value={data}
                showGridlines
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={RowExpansionTemplate}
            >
                <Column expander={allowExpansion} style={{ width: '5%', textAlign: 'center' }} />
                <Column field="clientName" header="Όνομα"></Column>
                <Column field="clientEmail" header="Email"></Column>
                <Column field="FINCODE" header="Κωδ.Παραστατικού"></Column>
                <Column field="createdAt" body={CreatedAt} header="Ημ. Δημ."></Column>
                <Column header="Status" field="status" body={Status} style={{ width: '20%' }} editor={(options) => statusEditor(options)}></Column>
                <Column field="createdFrom" body={CreatedFrom} header="Created From" style={{ width: '10%' }}></Column>
                <Column header="Status Edit" rowEditor headerStyle={{ width: '50px' }} bodyStyle={{ textAlign: 'center' }}></Column>
                <Column headerStyle={{ width: '30px' }} bodyStyle={{ textAlign: 'end' }} body={Actions}></Column>
            </DataTable>
        </div>
    )
}


const CreatedFrom = ({ createdFrom }) => {
    return (
        <div className='flex align-items-center'>
            {createdFrom ? (
                <>
                    <i className="pi pi-user mr-1 mt-1 text-primary" style={{ fontSize: '12px' }}></i>
                    <span className="text-600">{createdFrom}</span>
                </>
            ) : null}

        </div>
    )
}

const Status = ({ status }) => {
    let color;
    if (status === 'created') color = "bg-green-500"
    if (status === 'pending') color = "bg-green-500"
    if (status === 'sent') color = "bg-blue-500"
    if (status === 'done') color = "bg-orange-500"
    if (status === 'rejected') color = "bg-red-500"

    return (
        <div className='flex align-items-center '>

            <span className={`mt-1 ${color} border-circle`} style={{ width: '7px', height: '7px' }}>
            </span >
            <span className='ml-2 text-600'>{status.toUpperCase()}</span>
        </div>
    )
}




const RowExpansionGrid = ({ id, setRefetch, TRDR }) => {
    const toast = useRef(null);

    const [state, setState] = useState({
        products: [],
        discount: 0,
        discountedTotal: 0,
        loading: false,
        refetch: false
    })

    useEffect(() => {
        console.log('here')
        const handleTotalPrice = async () => {
           const {data} = await axios.post('/api/singleOffer', { action: 'calculateTotal', id: id })
           setState(prev => ({ ...prev, discountedTotal: data.result.discountedTotal, totalPrice: data.result.totalPrice, discount: data.result.discount }))
        }
        handleTotalPrice()
    }, [state.refetch, state.discount])
   
    const showError = (message) => {
        toast.current.show({severity:'error', summary: 'Error', detail:message, life: 3000});
    }
   
    const handleFetch = async () => {
        let { data } = await axios.post('/api/singleOffer', { action: 'findOfferProducts', id: id })
        setState(prev => (
            { 
                ...prev, 
                products: data.result.products,
                totalPrice: data.result.totalPrice, 
                discountedTotal: data.result.discountedTotal,
                discount: data.result.discount
            }))
    
    }
    useEffect(() => {
        handleFetch()
    }, [state.refetch])

    const onRemove = async (MTRL) => {

    }
    const RemoveItem = ({ MTRL }) => {
        return (
            <div>
                <i className="pi pi-trash pointer p-1" style={{ fontSize: '1rem', color: 'red' }} onClick={() => onRemove(MTRL)}></i>
            </div>
        )
    }


    
    const TotalPrice = ({ TOTAL_PRICE }) => {
        return (
            <div>
                <p className='font-bold'>{TOTAL_PRICE + " €"}</p>
            </div>
        )
    }
    
    const Price = ({ PRICE }) => {
        return (
            <div>
                <p className='font-bold'>{PRICE + " €"}</p>
            </div>
        )
    }


    const Footer = ({}) => {

        const handleDiscount = (e) => {
            console.log(e.value)
            setState(prev => ({ ...prev, totalDiscount: e.value }))
        }

        // id, discount, products, TRDR

        const onValueChange = async () => {
            let { data } = axios.post('/api/singleOffer', { 
                action: 'updateDiscountTotal', 
                id: id, 
                discount: state.totalDiscount, 
                TRDR: TRDR
             })
            setState(prev => ({ ...prev, refetch: !prev.refetch }))

        }
        return (
            <div className='flex align-items-center'>
                <div>
                    <span className='font-light'>Συνολική Τιμή: </span>
                    <span>{state.totalPrice}</span>
                </div>
                <div className='ml-2 flex justify-content-center align-items-center'>
                    <div className='flex'>
                        <span className="p-input-icon-right">
                            <span className='ml-2 font-light'>Έκπτωση: </span>
                            <i className={`pi pi-check `} onClick={onValueChange} />
                            <InputNumber value={state.discount} onChange={handleDiscount} onValueChange={onValueChange} max={80} min={0} mode="decimal" maxFractionDigits={2} />
                        </span>
                    </div>
                    <div className='bg-surface-400 ml-2'>
                        <span className='font-light'>Τελική Τιμή:</span>
                        <span>{state.discountedTotal}</span>
                    </div>
                </div>
            </div>
        )
    }

    const Discount = ({ NAME, MTRL, PRICE, QTY1, DISCOUNT }) => {
        const [value, setValue] = useState(0)

        const onValueChange = async () => {
            let { data } = await axios.post('/api/singleOffer', {
                action: 'updateDiscount',
                discount: value,
                NAME: NAME,
                MTRL: MTRL,
                QTY1: QTY1,
                PRICE: PRICE,
                id: id,
                TRDR: TRDR,
            })
            if (!data.success && data?.message) {
                showError(data.message)
            }
            setState(prev => ({ ...prev, refetch: !prev.refetch }))

        }



        useEffect(() => {
            setValue(DISCOUNT ? DISCOUNT : 0)


        }, [])

        const onChange = async (e) => {
            console.log(e.value)
            setValue(e.value)
        }
        return (
            <div className='flex'>
                <span className="p-input-icon-right">
                    <i className={`pi pi-check ${value == DISCOUNT ? 'text-500' : 'text-green-400'}`} onClick={onValueChange} />
                    <InputNumber value={value} onChange={onChange} onValueChange={onValueChange} max={80} min={0} mode="decimal" maxFractionDigits={2} />
                </span>
            </div>
        )
    }

 
   
    const Quantity = ({ QTY1, MTRL, PRICE, }) => {
        const [quantity, setQuantity] = useState(QTY1)
        const handleQuantity = async () => {
            const {data} = await axios.post('/api/singleOffer', {
                action: "updateQuantity",
                QTY1: quantity,
                MTRL: MTRL,
                id: id,
            })
           
            setState(prev => ({ ...prev, refetch: !prev.refetch }))
            }

        useEffect(() => {
            if (quantity === QTY1) return;
            handleQuantity();
        }, [quantity])
        return (
            <div>
                <InputNumber
                    value={quantity}
                    size='small'
                    min={0}
                    onValueChange={(e) => setQuantity(e.value)}
                    showButtons
                    buttonLayout="horizontal"
                    decrementButtonClassName="p-button-secondary"
                    incrementButtonClassName="p-button-secondary"
                    incrementButtonIcon="pi pi-plus"
                    decrementButtonIcon="pi pi-minus"
                    inputStyle={{ width: '70px', textAlign: 'center' }}
                />
            </div>
        )
    }

    return (
        <div  >
            <Toast ref={toast} />
            <DataTable
                className=' p-datable-sm '
                value={state.products}
                footer={Footer }
            >
                <Column header="Όνομα Προϊόντος" field="NAME"></Column>
                <Column header="Τιμ. M" body={Price} style={{ width: '100px' }} field="PRICE"></Column>
                <Column header="%" style={{ width: '100px' }} field="MTRL" body={Discount}></Column>
                <Column header="Τιμ. Έκπ." style={{ width: '50px' }} field="DISCOUNTED_PRICE"></Column>
                <Column header="Πoσ." field="QTY1" body={Quantity} style={{ width: '100px' }}></Column>
                <Column header="ΣT" body={TotalPrice} style={{ width: '80px' }} field="TOTAL_PRICE"></Column>
                <Column body={RemoveItem} bodyStyle={{ textAlign: 'center' }} style={{ width: '30px' }}></Column>
            </DataTable>
        </div>
    )
};



export const DiscountDialog = ({ 
    MTRL, 
    DISCOUNTED_TOTAL,
    id, 
    setState,
    TRDR, 
    QTY1, 
    NAME,
    PRICE,
}) => {
   
    const [localState, setLocalState] = useState({
        discount: 0,
        visible: false,
        loading: false,

    })

   

    const handleCalculatePrice = (e) => {
        setLocalState((prev) => ({ ...prev, discount: e.value }))
    }

   
    const onSubmit = async () => {
        let { data } = await axios.post('/api/singleOffer',
            {
                action: 'addDiscount',
                DISC1PRC: localState.discount,
                products: [{
                    NAME: NAME,
                    MTRL: MTRL,
                    QTY1: QTY1,
                    PRICE: PRICE,
                }],
                TRDR: TRDR,
                id: id
            })
        setLocalState((prev) => ({ ...prev, visible: false, loading: false}))
        setState(prev => ({ ...prev, refetch: !prev.refetch }))
    }
    return (
        <div>
            <div className={`text-white border-round text-sm ${DISCOUNTED_TOTAL ? "bg-green-500" : "bg-primary"}`}>
                <i className="pi pi-percentage pointer p-1  text-sm" onClick={() => setLocalState(prev => ({ ...prev, visible: true }))}></i>
            </div>
            <Dialog header="%" visible={localState.visible} style={{ width: '20vw' }} onHide={() => setLocalState(prev => ({ ...prev, visible: false }))}>
                <div className="flex-auto w-full">
                    <label htmlFor="percent" className="font-bold block mb-2">Έκπτωση</label>
                    <InputNumber  locale="gr-GR"  className='w-full' inputId="percent" value={localState.discount} max={100} onChange={handleCalculatePrice} minFractionDigits={0} maxFractionDigits={5}/>
                </div>
                <div className='flex align-items-center justify-content-end mt-6'>
                    <Button label="Εφαρμογή" icon="pi pi-check" onClick={onSubmit} />
                </div>
            </Dialog>
        </div>
    )
}

export default OfferGrid





