'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Toolbar, Edit, Inject, Filter} from '@syncfusion/ej2-react-grids';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import styled from 'styled-components';
import { toast } from 'react-toastify';


function DialogEdit() {
    return (
        <AdminLayout>
            <GridTable />
        </AdminLayout>
    );
}



const GridTable = () => {
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(true)
    const [refresh, setRefresh] = useState(true)
    const [count, setCount] = useState(0)

    const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    const editparams = { params: { popupHeight: '300px' } };
    const validationRules = { required: true };
    const orderidRules = { required: true, number: true };
    const pageSettings = { pageCount: 5 };



    const passwordValidation = {
        minLength: [5, 'Τουλάχιστον 5 χαρακτήρες'],
    }
   


    const handleCRUD = async (data, action) => {
        console.log(`Action is: ${action}, data: ${JSON.stringify(data)}`)
        const resp = await axios.post('/api/admin/users', { action: action, ...data })
        console.log('response')
        console.log(resp)
        return resp.data;
    }


    const handleFetchUser = async () => {

        try {
            const resp = await axios.post('/api/admin/users', { action: 'findAll' })
            setData(resp.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleFetchUser();
    }, [refresh])


    useEffect(() => {
        console.log('GridTable')
        setCount((prev) => prev + 1)
       
    }, [])
    
    console.log('effect run ' + count + ' times' )

    const actionBegin = (args) => {
     
    };


    //Αdd and save user
    const actionComplete = async (args) => {
        console.log(args)
       
        if(args.requestType === 'save') {
            console.log('args after save')
            console.log(args)
          
        }
        if(args.requestType === 'save' && args.action === 'edit') {}  
        //ADD NEW
        if(args.requestType === 'save' && args.action === 'add') {
            let res = await handleCRUD(args.data, 'add')
            if(res && res.success === true) {
                res && toast.success('Επιτυχής ενημέρωση')
            }
            if(res && res.success === false) {
                res && toast.success(`Αποτυχία ενημέρωσης: ${res.error}`)
            }
            
          
        }  

    }
   

    return (
     <>
           <div className='control-pane'>
            <div className='control-section'>
                <GridComponent
                    dataSource={data}
                    toolbar={toolbarOptions}
                    allowPaging={true}
                    editSettings={editSettings}
                    pageSettings={pageSettings}
                    actionComplete={actionComplete}
                    
                >
                    <ColumnsDirective  >
                        <ColumnDirective field='firstName' headerText='Όνομα' width='100' validationRules={validationRules}></ColumnDirective>
                        <ColumnDirective field='lastName' headerText='Eπώνυμο' width='100' validationRules={validationRules}></ColumnDirective>
                        <ColumnDirective field='email' headerText='Email' width='180' validationRules={validationRules}></ColumnDirective>
                        <ColumnDirective field='password' headerText='Kωδικός' width='100'  validationRules={passwordValidation}  template={rowData => '••••••••••'}  ></ColumnDirective>
                        <ColumnDirective field='role'  headerText='Ρόλος' width='150' editType='dropdownedit' edit={editparams}  validationRules={validationRules}></ColumnDirective>
                    </ColumnsDirective>
                    <Inject services={[Page, Edit, Toolbar, Filter]} />
                </GridComponent>
            </div>
        </div>
     </>

    )

}





const CustomGrid = styled(GridComponent).attrs(props => ({
  className: props.className // Pass the className prop from styled component to Syncfusion Button
}))`

`;

export default DialogEdit;