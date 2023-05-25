import React from "react"
import { CircularProgress } from "@mui/material"
import styled from "styled-components";

const Button = ({children, onClick, loading, size, type, edit, mt, mb}) => {
  return (
    <Btn 
      mt={mt}
      size={size} 
      type={type} 
      onClick={onClick} 
      edit={edit} 
      disabled={loading}
    
      mb={mb}
      >
      {loading ? <CircularProgress  size={'20px'}/>  : <>{children}</>}
    </Btn>
  )
}







export const Btn = styled.button`
  width: ${props => props.size ? `${props.size}` : '140px'};
  margin-top: ${props => props.mt ?  `${props.mt}px` : '0'};
  margin-bottom: ${props => props.mb ? `${props.mb}px` : '0'};
  background-color: ${props => props.edit ? '#7cbef4' : props.theme.palette.primary.main};
  border-radius: 4px;
  outline: none;
  height: 40px;
  border-style: none;
  color: white;
  font-weight: 300;
  font-family: 'Roboto' , sans-serif;
  font-size: 13px;
  letter-spacing: 0.4px;
  transition: all 0.03s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  cursor: pointer;
  &:hover {

  }
  &:active {
    transform: scale(0.90);
  }
  &:disabled {
    background-color: #7cbef4;
  }

 
`



export default Button;