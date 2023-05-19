import React, {useState} from 'react'
import styled from 'styled-components';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';
export const Input = ({ id, type, value, onChange, label, placeholder }) => {

  return (
    <InputDiv mt={10}
      className="focusDiv"
      >
      <label htmlFor={id}>{label}</label>
      <input name={id} id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} />
    </InputDiv>
  )
}

export const InputPassword = ({ id, value, onChange, label, placeholder, }) => {
  const [showPass, setShowPass] = React.useState(false);
  return (
    <InputDiv mt={10} className="focusDiv" >
      <label htmlFor={id}>{label}</label>
      <input name={id} id={id} type={showPass ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} />
      <IconButton className='showPassIcon' onClick={() => setShowPass(prev => !prev)}>
        {showPass ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputDiv>
  )
}




export const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: ${props => props.mt ? `${props.mt}px` : '0px'};
  background-color: ${props => props.theme.palette.background};
  /* border: 1px solid #eaeaea ; */
  border-radius: 5px;
  padding: 10px;
  border: 2px solid transparent;
  
  //change the border color when the input is focused
  &.focusDiv:focus-within{
    border-color: ${props => props.theme.palette.primary.main };
  }
  //change the label when the input is focused
  &.focusDiv:focus-within label{
    color: ${props => props.theme.palette.primary.main };
  }

  
  label {
      font-size: 10px;
      letter-spacing: 0.9px;
      color: ${props => props.theme.palette.grey.light};
      font-weight: 600;
      margin-bottom: 1px;
    

  }
  input {
    outline: none;
    width: 100%;
    display: flex;
    border-style: none;
    font-size: 14px;
    letter-spacing: 0.3px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    background-color: ${props => props.theme.palette.background};
    margin-top: 2px;
    height: 100%;
    }
  

  .showPassIcon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);

  }
  
`


export const InputPass = ({error, name , label, placeholder, register}) => {
;
  const [showPass, setShowPass] = React.useState(false);
  return (
      <Container  error={error}>
          <div className="input"  >
              <label htmlFor={name}>{label}</label>
              <input name={name}  type={showPass ? 'text' : 'password'} placeholder={placeholder}  {...register(name)}/>
              <IconButton className='showPassIcon' onClick={() => setShowPass(prev => !prev)}>
                  {showPass ? <VisibilityOff /> : <Visibility />}
              </IconButton>
          </div>
          {error && <span className="error-text">{error.message}</span>}
      </Container>
  )
}


export const InputStyled = ({ name, type, label, placeholder, register, error, mt }) => {
  return (
      <Container error={error}>
          <div mt={mt} className="input" error={error}  >
              <label htmlFor={name}>{label}</label>
              <input name={name} type={type} placeholder={placeholder}  {...register(name)} />
          </div>
          {error && <span className="error-text">{error.message}</span>}
      </Container>
  )
}


const errorColor = '#ff0033'



export const Container = styled.div`
min-height: 65px;
/* background-color: lightblue; */
margin-bottom: 5px;
.input {
  display: flex;
flex-direction: column;
width: 100%;
position: relative;
font-weight: 600;
margin-top: ${props => props.mt ? `${props.mt}px` : '0px'};
background-color: ${props => props.theme.palette.background};
/* border: 1px solid #eaeaea ; */
border-radius: 5px;
padding: 10px;
border: 2px solid ${props => props.error ? errorColor : ' transparent'};
}

//change the border color when the input is focused
& .input:focus-within{
  border-color:${props => props.error ? errorColor : props.theme.palette.primary.main};
}
//change the label when the input is focused
& .input:focus-within label{
  color: ${props => props.error ? errorColor : props.theme.palette.primary.main};
}

& .focusDiv label:valid {
  border-color: pink;
}


label {
    font-size: 10px;
    letter-spacing: 0.9px;
    font-weight: 600;
    margin-bottom: 1px;
      color: ${props => props.error ? errorColor : props.theme.palette.text.light};

}
input {
  outline: none;
  width: 100%;
  display: flex;
  border-style: none;
  font-size: 14px;
  letter-spacing: 0.3px;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  margin-top: 2px;
  height: 100%;
  background-color: ${props => props.theme.palette.background};

  }

.showPassIcon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);

}

.error-text {
  color: red;
  margin-left: 5px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
}


`