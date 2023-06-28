import styled from "styled-components"
import Link from "next/link"
import { InputText } from 'primereact/inputtext';
const UrlInput =({label, value, }) => {
    return (
        <DisabledDisplay>
             <div className="disabled-card">
        <label>
           {label}
        </label>
        <Link href={value}>
            <div className="p-inputgroup">
                <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-link"></i>
                        </span>
                        <InputText disabled value={value} />
                </div>
            </div>
        </Link>
    </div>
        </DisabledDisplay>
       
    )
}

export default UrlInput
const  DisabledDisplay  = styled.div`
    .disabled-card{
        margin-bottom: 10px;
        display: flex;
        width: 100%;
        flex-direction: column;
        & label {
            margin-bottom: 5px;
        }
    }

`