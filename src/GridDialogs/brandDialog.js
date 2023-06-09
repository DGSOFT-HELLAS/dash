'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Input from '@/components/Forms/PrimeInput';
import GallerySmall from '@/components/GalleryListSmall';
import { AddMoreInput } from '@/components/Forms/PrimeAddMultiple';
import axios from 'axios';
import styled from 'styled-components';
import PrimeUploads from '@/components/Forms/PrimeImagesUpload';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { FormTitle, Divider, Container } from '@/componentsStyles/dialogforms';

import { TextAreaInput } from '@/components/Forms/PrimeInput';
import { useSession } from "next-auth/react"
import AddDeleteImages from '@/components/GalleryListSmall';
import { set } from 'mongoose';

const EditDialog = ({ dialog, hideDialog, setSubmitted }) => {
    const { gridRowData } = useSelector(store => store.grid)
    console.log('gridrowData: ' + JSON.stringify(gridRowData))
    const { data: session } = useSession()
    const [images, setImages] = useState([])
    const [logo, setLogo] = useState([])

    const toast = useRef(null);
    const { control, handleSubmit, formState: { errors }, reset } = useForm({defaultValues: gridRowData});
    const [videoList, setVideoList] = useState(gridRowData?.videoPromoList)
   
    
   
    useEffect(() => {
        // Reset the form values with defaultValues when gridRowData changes
        reset({ ...gridRowData });
    }, [gridRowData, reset]);


    useEffect(() => {
        setVideoList(gridRowData?.videoPromoList)
        //handle images:
        let newArray = []
        if (gridRowData?.photosPromoList && gridRowData?.photosPromoList.length > 0) {

            for (let image of gridRowData?.photosPromoList) {
                newArray.push(image.photosPromoUrl)
            }
            setImages(newArray)
        }

        //In the database empty logo is saved as an empty string, so we need to convert it to an empty array
        setLogo(gridRowData?.logo ? [gridRowData?.logo] : [])
    }, [gridRowData])


    const handleEdit = async (data) => {
        console.log('data logo: ' + JSON.stringify(logo))
        let newLogo = logo[0]
        if(logo.length === 0) {
            newLogo = ''

        }
        let newImages = []
        for(let image of images) {
            let obj = {
                name: image,
                photosPromoUrl: image
            }
            newImages.push(obj)
        }
        const object = {
            ...data,
            videoPromoList: videoList,
            logo: newLogo ,
            photosPromoList: newImages 
        }
      
        try {
            let user = session.user.user.lastName
            let resp = await axios.post('/api/product/apiMarkes', {action: "update", data: {...object, updatedFrom: user, }, id: gridRowData._id, mtrmark: gridRowData?.softOne?.MTRMARK})
            if(!resp.data.success) {
                return showError(resp.data.softoneError)
            }
            showSuccess()
            setSubmitted(true)
            hideDialog()
        
               
        } catch (e) {
            console.log(e)
        }
    }

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής ενημέρωση στην βάση', life: 4000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης', life: 4000 });
    }


    const handleClose = () => {
        hideDialog()
    }

  
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Ακύρωση" icon="pi pi-times" severity="info" outlined onClick={handleClose} />
            <Button label="Αποθήκευση" icon="pi pi-check" severity="info" onClick={handleSubmit(handleEdit)} />
        </React.Fragment>
    );

    return (
        < Container>
            <form >
                <Toast ref={toast} />
                <Dialog
                    visible={dialog}
                    style={{ width: '32rem', maxWidth: '80rem' }}
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                    header="Διόρθωση Προϊόντος"
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={hideDialog}
                    maximizable
                >
                    <FormTitle>Λεπτομέριες</FormTitle>
                    <Input
                        label={'Όνομα'}
                        name={'name'}
                        control={control}
                        required
                    />
                    <TextAreaInput
                        autoResize={true}
                        label={'Περιγραφή'}
                        name={'description'}
                        control={control}
                    />
                    < Divider />
                    <FormTitle>Λογότυπο	</FormTitle>
                   
                    <AddDeleteImages 
                        state={logo}
                        setState={setLogo}
                        multiple={false}
                        singleUpload={true}
                        id={gridRowData._id}
                    />
                    < Divider />
                    <FormTitle>Φωτογραφίες</FormTitle>
                    <AddDeleteImages 
                        state={images}
                        setState={setImages}
                        multiple={true}
                        id={gridRowData._id}
                    />
                   
                    < Divider />
                    <FormTitle>Βίντεο</FormTitle>
                    <AddMoreInput
                        setFormData={setVideoList}
                        formData={videoList}
                        mb={'30px'}
                    />
                    < Divider />
                    <FormTitle>Pim Access:</FormTitle>
                    <Input
                        label={'Pim url:'}
                        name={'pimAccess.pimUrl'}
                        required={true}
                        control={control}
                    />
                    <Input
                        label={'Pim url:'}
                        name={'pimAccess.pimUserName'}
                        required={true}
                        control={control}
                    />
                    <Input
                        label={'Pim url:'}
                        name={'pimAccess.pimPassword'}
                        required={true}
                        control={control}
                    />
                    < Divider />
                    <FormTitle>Url</FormTitle>
                    <Input
                        label={'Url Ιστοσελίδας:'}
                        name={'websSiteUrl'}
                        required={true}
                        control={control}
                    />
                    <Input
                        label={'Url Καταλόγου:'}
                        name={'officialCatalogueUrl'}
                        required={true}
                        control={control}
                    />
                    <Input
                        label={'Url Facebook:'}
                        name={'facebookUrl'}
                        required={true}
                        control={control}
                    />
                    <Input
                        label={'Url Instagram:'}
                        name={'instagramUrl'}
                        required={true}
                        control={control}
                    />

                </Dialog>
            </form>
        </Container>

    )
}



const addSchema = yup.object().shape({
    name: yup.string().required('Συμπληρώστε το όνομα'),
});


const AddDialog = ({
    dialog,
    hideDialog,
    setSubmitted
}) => {


    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
        reset
    } = useForm({
        resolver: yupResolver(addSchema),
        defaultValues: {
            name: '',
            description: '',
            pimUrl: '',
            pimUserName: '',
            pimPassword: '',
            webSiteUrl: '',
            officialCatalogueUrl: '',
            facebookUrl: '',
            instagramUrl: '',
        }
    });
    const { data: session, status } = useSession()
    const toast = useRef(null);
    const [disabled, setDisabled] = useState(false)
    const [logo, setLogo] = useState('')
    const [images, setImages] = useState([])
    const [videoList, setVideoList] = useState([{
        name: '',
        videoUrl: ''
    }])


    const cancel = () => {
        hideDialog()
        reset()
    }


    const handleAdd = async (data) => {
        console.log('data')
        setDisabled(false)
        let dataImages = []
        for (let i of images) {
            dataImages.push({
                name: i,
                photosPromoUrl: i
            })
        }
        const body = {
            ...data,
            photosPromoList: dataImages,
            videoPromoList: videoList,
            logo: logo[0],
        }

        console.log('body')
        let createdFrom = session.user.user.lastName
        let res = await axios.post('/api/product/apiMarkes', { action: 'create', data: body, createdFrom: createdFrom })
        if(!res.data.success) return showError(res.data.softoneError)
        setDisabled(true)
        setSubmitted(true)
        showSuccess()
        hideDialog()
        reset();
    }



    const productDialogFooter = (
        <>
            <Button label="Ακύρωση" icon="pi pi-times" outlined onClick={cancel} />
            <Button label="Αποθήκευση" icon="pi pi-check" type="submit" onClick={handleSubmit(handleAdd)} disabled={disabled} />
        </>
    );

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Επιτυχής ενημέρωση στην βάση', life: 4000 });
    }
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Αποτυχία ενημέρωσης βάσης : ' + message, life: 5000 });
    }

    return (
        <form noValidate onSubmit={handleSubmit(handleAdd)}>
            <Toast ref={toast} />
            <Dialog
                visible={dialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Προσθήκη Μάρκας"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}>
                <FormTitle>Λεπτομέριες</FormTitle>
                <Input
                    label={'Όνομα'}
                    name={'name'}
                    mb={'10px'}
                    required
                    control={control}
                    error={errors.name}
                />

                <Input
                    label={'Περιγραφή'}
                    name={'description'}
                    mb={'20px'}
                    control={control}
                />
                <FormTitle>Λογότυπο</FormTitle>
                <PrimeUploads
                    setState={setLogo}
                    multiple={false}
                    mb={'20px'} />


                <FormTitle>Βίντεο</FormTitle>
                <AddMoreInput
                    setFormData={setVideoList}
                    formData={videoList}
                    mb={'20px'}
                />
                <FormTitle>Φωτογραφίες</FormTitle>
                <PrimeUploads
                    setState={setImages}
                    multiple={true}
                    mb={'30px'} />
                <FormTitle>Pim Access</FormTitle>
                <Input
                    label={'Pim URL'}
                    name={'pimURL'}
                    control={control}
                />
                <Input
                    label={'Pim Username'}
                    name={'pimUserName'}
                    control={control}
                />
                <Input
                    label={'Pim Password'}
                    name={'pimPassword'}
                    control={control}
                />
                <FormTitle>Urls:</FormTitle>
                <Input
                    label={'URL Ιστοσελίδας'}
                    name={'webSiteUrl'}
                    control={control}
                />
                <Input
                    label={'URL Kαταλόγου'}
                    name={'officialCatalogueUrl'}
                    control={control}
                />
                <Input
                    label={'URL facebook'}
                    name={'facebookUrl'}
                    control={control}
                />
                <Input
                    label={'URL instagram'}
                    name={'instagramUrl'}
                    control={control}
                />

            </Dialog>
        </form>
    )

}





export { EditDialog, AddDialog }
