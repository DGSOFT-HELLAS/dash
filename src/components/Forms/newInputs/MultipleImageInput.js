import { useState } from 'react';
import Dropzone from 'react-dropzone';
import Image from 'next/image';
import styled from 'styled-components';
import CameraAltIcon from '@mui/icons-material/CameraAlt';



function ImageUploader() {
    const [uploadedImages, setUploadedImages] = useState([]);
    console.log(uploadedImages)

    const handleDrop = async (acceptedFiles) => {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const response = await fetch('/api/uploads/saveImageMulter', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const { urls } = await response.json();
                setUploadedImages(urls);
            } else {
                console.error('Error uploading files');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <UploaderStyled>
            <Dropzone onDrop={handleDrop} accept="image/*" multiple>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        < CameraAltIcon  />
                        <p>Σύρετε ή πατήστε και επιλέξτε φωτογραφίες</p>
                        
                    </div>
                )}
            </Dropzone>
            <div className="multiple-upload-images-container" >
                {uploadedImages && uploadedImages.map((imageUrl, index) => (
                    <div className="multiple-upload-images" key={index}>
                        <Image
                            src={imageUrl}
                            alt={`Uploaded ${index + 1}`}
                            fill={true}
                            sizes={50}
                        />
                    </div>

                ))}
            </div>
        </UploaderStyled>
    );
}





const UploaderStyled = styled.div`

    border: 1px dashed ${({ theme }) => theme.palette.primary.light10};
    padding: 10px;
    border-radius: 4px;
    & div {
        display: flex;
        align-items: center;
        padding: 5px;
        width:  100%;
    }

    svg {
        color: ${({ theme }) => theme.palette.primary.light10};
        margin-right: 10px;
    }
    .multiple-upload-images {
        width: 50px;
        height: 50px;
        position: relative;
        margin: 3px;
        border-radius: 4px;
    }
    
`
export default ImageUploader;