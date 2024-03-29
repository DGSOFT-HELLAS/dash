import styled from "styled-components";

const FormTitle = styled.h2`
    font-size: 1.2rem;
    margin-bottom: 20px;
    margin-top: 30px;
    position: relative;
    &:after {
        content: '';
        display: block;
        width: 20px;
        height: 3px;
        border-radius: 30px;
        position: absolute;
        left: 0;
        bottom: -7px;
        background-color: ${props => props.theme.palette.primary.main};
    }
`

const Divider = styled.div`
    width: 100%;
    height: 1px;
    background-color: #e8e8e8;
    margin: 20px 0;
`


const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
   
`
export {
    FormTitle,
    Divider,
    Container
}