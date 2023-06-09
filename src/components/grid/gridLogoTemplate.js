import Image from "next/image";
import { useRef } from "react";
import styled from "styled-components";
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
const GridLogoTemplate = ({logo}) => {
    const op = useRef(null);
    return (
        <ImageDiv >
            {logo ? (
               <>
                 <div  onClick={(e) => op.current.toggle(e)}>
                      <Image
                src={`/uploads/${logo}`}
                alt={logo}
                fill={true}

            />
            </div>
            <OverlayImage op={op} logo={logo}/>
               </>
              
            ) : (
                <i className="pi pi-image" style={{ fontSize: '30px', color: '#e6e7e6' }}></i>
            )}
            
        </ImageDiv>

    )
}

const OverlayImage = ({logo, op}) => {
    return (
        <OverlayPanel ref={op}>
            <LargeImage>
                <Image
                    src={`/uploads/${logo}`}
                    alt={logo}
                    fill={true}

                />
            </LargeImage>
        </OverlayPanel>
    )
}

const LargeImage = styled.div`
    width: 200px;
    height: 150px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    image {
        object-fit: contain;
        border-radius: 5px;
    }
`
const ImageDiv = styled.div`
    cursor: pointer;
    width: 70px;
    height: 60px;
    padding: 10px;
    /* border-radius: 50%; */
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    border-radius: 4px;
   
    img {
        object-fit: contain;
    }
`
export default GridLogoTemplate;