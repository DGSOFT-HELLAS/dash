import React, { useEffect, useRef, useState, createContext, useContext } from 'react'
import { Toolbar } from 'primereact/toolbar';

import { Button } from 'primereact/button';
import styled from 'styled-components';
import { Sidebar } from 'primereact/sidebar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import TreeSelectComp from './TreeSelectComp';
import { Badge } from 'primereact/badge';
import SelectImpas from './SelectImpas';
import Offer from './Offer';
import WhareHouseActions from './WhareHouseActions';

export const ProductQuantityContext = createContext();

export const ProductQuantityProvider = ({ children }) => {
    const [quantityContext, setQuantityContext] = useState(1);
    const [mtrlines, setMtrLines] = useState([])
    const [wharehouseLines, setWhereHouseLines] = useState([])
    return (
        <ProductQuantityContext.Provider value={{ 
            quantityContext, 
            setQuantityContext, 
            mtrlines, 
            setMtrLines, 
            setWhereHouseLines,
             wharehouseLines 
        }}>
            {children}
        </ProductQuantityContext.Provider>
    );
}



//TOOLBAR STUFF
const ProductToolbar = ({ selectedProducts, setSelectedProducts, setSubmitted }) => {

    console.log('selected products')
    console.log(selectedProducts)

    const startContent = () => {
        return <MenuComp selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} setSubmitted={setSubmitted} />
    }

    const endContent = () => {
        return <RightSide selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} setSubmitted={setSubmitted} />
    }

    return (
        <div>
            <Toolbar start={startContent} end={endContent} />
        </div>
    )
}


const RightSide = ({ selectedProducts }) => {

    const CalculateBasket = () => {
        let total = 0
        selectedProducts && selectedProducts.forEach((item) => {
            total += parseInt(item.PRICER)
        })
        return (
            <p className='mr-3'>Σύνολο:<span className='font-bold ml-1'>{`${total},00$`}</span> </p>
        )


    }
    return (
        <ContainerBasket >
            <div className='basket-icon'>
                < CalculateBasket />
                <i onClick={() => setVisible(true)} className="pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '25px', marginRight: '10px' }}>
                    <Badge value={selectedProducts == null ? "0" : selectedProducts?.length} ></Badge>
                </i>
            </div>
        </ContainerBasket >
    )
}




//SIDEBAR 
const MenuComp = ({ selectedProducts, setSelectedProducts, setSubmitted }) => {
    const [visible, setVisible] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const onMultipleActions = () => {
        setVisible(true)
    }

    const customIcons = (
        <React.Fragment>
            {activeIndex !== 0 ? (
                <button onClick={() => setActiveIndex(0)} className="p-sidebar-icon p-link mr-2">
                    <span className="pi pi-arrow-left" />
                </button>
            ) : null}

        </React.Fragment>
    );


        

    return (
        <ProductQuantityProvider>
            <Button
                icon="pi pi-shopping-cart"
                label="Kαλάθι λειτουργειών"
                className="mr-2"
                onClick={onMultipleActions}
                aria-controls="popup_menu_right"
                aria-haspopup
                severity="warning"
                disabled={selectedProducts == null || selectedProducts.length < 1 ? true : false}
            />
            <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} className="md:w-6	 lg:w-5	" icons={customIcons}>
                {activeIndex === 0 ? (
                    <>
                        <FirstScreen selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
                        <Button label="Μenu" icon="pi pi-bars" className="surface-ground text-primary w-full  mt-3" onClick={() => setShowMenu((prev) => !prev)} />
                        {showMenu ? (
                            <div className='mt-1 grid'>
                                <div className='col-12'>
                                    <MenuBtn label="Αλλαγή κατηγοριοποίησης" onClick={() => setActiveIndex(1)} />
                                    <MenuBtn label="Αλλαγή Impa" onClick={() => setActiveIndex(2)} />
                                    <MenuBtn label="Προσφορά" onClick={() => setActiveIndex(3)} />
                                    <MenuBtn label="Ποσοτική τροποποίηση αποθήκης" onClick={() => setActiveIndex(4)} />
                                </div>
                            </div>
                        ) : null}
                    </>
                ) : null}
                {activeIndex !== 0 ? (
                    <SecondScreen>
                        {activeIndex === 1 ? (<TreeSelectComp gridData={selectedProducts} setSubmitted={setSubmitted} />) : null}
                        {activeIndex === 2 ? (<SelectImpas gridData={selectedProducts} setSubmitted={setSubmitted} />) : null}
                        {activeIndex === 3 ? (<Offer selectedProducts={selectedProducts} />) : null}
                        {activeIndex === 4 ? (<WhareHouseActions selectedProducts={selectedProducts} setSubmitted={setSubmitted} />) : null}
                    </SecondScreen>
                ) : null}
            </Sidebar>

        </ProductQuantityProvider>

    )
}


const SecondScreen = ({ children }) => {
    return (
        <div>
            {children}
        </div>
    )
}




const FirstScreen = ({ selectedProducts, setSelectedProducts }) => {

    const CalculateBasket = () => {
        let total = 0
        selectedProducts && selectedProducts.forEach((item) => {
            total += parseInt(item.PRICER)
        })
        return (
            <p className='mr-3 ml-1'><span className='font-normal'>Σύνολο:</span> {`${total},00$`}</p>
        )
    }

    const footer = () => {
        return (
            <div className='flex justify-between p-2'>
                <p className='mr-3 '><span className='font-normal'>Προϊόντα:</span> {`${selectedProducts !== null ? selectedProducts.length : 0}`}</p>
                <CalculateBasket />
            </div>
        )
    }

    const Basket = ({ name, categoryName, PRICER, MTRL }) => {
        return (
            <ProductBaksetTemplate
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            name={name}
            categoryName={categoryName}
            PRICER={PRICER}
            MTRL={MTRL}
        />
        )
    }

    return (
        <>
            <div className='flex align-items-center mb-2 mt-2'>
                <h2>Επεξεργασία:</h2>
            </div>
            <div className='box'>
                <DataTable className='border-1 border-round-sm	border-50' size="small" scrollHeight='350px' scrollable value={selectedProducts} footer={footer}  >
                    <Column field="Προϊόν" header="Προϊόν" body={Basket}></Column>
                </DataTable>



            </div>
        </>
    )
}




const MenuBtn = ({ label, onClick }) => {

    return (
        <Button onClick={onClick} style={{ textAlign: 'left' }} icon="pi pi-arrow-right" className='surface-ground text-primary w-full mb-1' label={label} severity='warning' />

    )
}



const ProductBaksetTemplate = ({ name, categoryName, PRICER, selectedProducts, setSelectedProducts, MTRL }) => {
    const [total, setTotal] = useState(PRICER)
    const [quantity, setQuantity] = useState(1)
    const { quantityContext, setQuantityContext, setMtrLines, mtrlines } = useContext(ProductQuantityContext);
  
   
    console.log('MTRLLINES')
    console.log(mtrlines)

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1)
        setMtrLines(prev => {
            return prev.map(item => {
                if (item.MTRL === MTRL[0]) {
                    return { ...item, QTY1: item.QTY1 + 1 };
                }
                return item;
            });
        });
     
    }

    useEffect(() => {
        setMtrLines(prev => {
         
            if (prev.some(item => item.MTRL === MTRL[0])) {
                return prev; 
            }
            return [...prev, { MTRL: MTRL[0], QTY1: 1}];
        });
    }, [quantity])


    const decreaseQuantity = () => {
        if (quantity === 1) return

        setQuantity(prev => prev - 1)
        setMtrLines(prev => {
            return prev.map(item => {
                if (item.MTRL === MTRL[0]) {
                    return { ...item, QTY1: item.QTY1 - 1 };
                }
                return item;
            });
        });
        
    }

    const remove = () => {
        let newArray = selectedProducts.filter((product) => product._id !== id)
        setSelectedProducts(newArray)
    }
    useEffect(() => {
        setTotal(parseInt(PRICER) * quantity)
    }, [quantity])
    return (
        <ProductBasket>
            <div>
                <div>
                    <p className='text-md text-900 font-semibold'>{name}</p>
                </div>
                <div className='details'>
                    <i className="pi pi-tag" style={{ fontSize: '12px', marginRight: '3px', marginTop: '2px' }}></i>
                    <p className='text-xs'>{categoryName}</p>
                </div>
                <span className='text-xs ml-1'>TIMH:</span>
                <span className='text-xs ml-2'>{total},00$</span>
            </div>
            <div className='flex'>
                <div className='font-xs flex align-items-center border-1 p-2 border-400 border-round'>
                    <div
                        onClick={decreaseQuantity}
                        className='mr-2 border-1  flex align-items-center justify-content-center border-round border-400 pointer-cursor'
                        style={{ width: '25px', height: '25px' }}>
                        <i className="pi pi-minus" style={{ fontSize: '10px' }}></i>
                    </div>
                    <p className='text-lg'>{quantity}</p>
                    <div
                        onClick={increaseQuantity}
                        className='ml-2 border-1  flex align-items-center justify-content-center border-round border-400' style={{ width: '25px', height: '25px' }}>
                        <i className="pi pi-plus" style={{ fontSize: '10px' }}></i>
                    </div>
                </div>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={remove} ></Button>
            </div>
        </ProductBasket>
    )
}


const ContainerBasket = styled.div`
   

    .basket-icon {
        display: flex;
        align-items: center;

    }

`


const ProductBasket = styled.div`
     display: flex;
        align-items: center;
        justify-content: space-between;
    .details {
        display: flex;
        align-items: center;
       
    }
`








export default ProductToolbar