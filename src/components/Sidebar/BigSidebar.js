import { Container, Box } from '@mui/material';
// import styles from 'styles/Sidebar.module.css'
import styles from '@/styles/Sidebar.module.css'

import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector, useDispatch } from 'react-redux';
import { SidebarItem, SidebarItemNoLink } from './SidebarTabs';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';
import Divider from '@mui/material/Divider';
import LightHeader from '../Text/LightHeader';
//ICONS:
import { useState } from 'react';
import { SidebarExpandableItem } from './SidebarTabs';
import { useSession, signIn, signOut } from "next-auth/react"


const BigSidebar = () => {

  const [open, setOpen] = useState(false);
  const { isSidebarOpen } = useSelector((store) => store.user);
  const {data } = useSession();
  console.log('session in sidebar')
  console.log(data.user.role)

  const onClick = () => {
    setOpen(true)
  }
  return (
    <Wrapper isSidebarOpen={isSidebarOpen} >
      <LightHeader>ΜΕΝΟΥ</LightHeader>
      <SidebarItem to="/dashboard" label="Πίνακας Ελέγχου" />
      <SidebarItem to="/dashboard/test" label="Πελάτες" />
      <SidebarItem to="/dashboard/chart" label="Chart" />
      {/* <Divider variant="middle" sx={{ my: 2 }} /> */}
      <SidebarExpandableItem label="Accordion" open={open} setOpen={onClick}>
        <SidebarItem to="/dashboard/page1" label="Page1" />
        <SidebarItem to="/dashboard/fake/page2" label="Page2" />
      </SidebarExpandableItem>
      <SidebarExpandableItem label="Accordion2" open={open} setOpen={onClick}>
        <SidebarItem to="/dashboard/fake/page1" label="Page1" />
        <SidebarItem to="/dashboard/fake/page2" label="Page2" />
      </SidebarExpandableItem>
      {data?.user.role === 'admin' && (
         <SidebarExpandableItem label="Admin Pages" open={open} setOpen={onClick}>
         <SidebarItem to="/dashboard/admin" label="Page1" />
         <SidebarItem to="/dashboard/admin/page" label="Page2" />
       </SidebarExpandableItem>
      )}
    </Wrapper>


  );
};



const Wrapper = styled.div`
    display: ${props => props.isSidebarOpen ? 'block' : 'none'};
    position: absolute;
    top: 70px;
    left: 0;
    width: 260px;
    z-index: 3;
    padding: 10px;
    background-color: white;
    height: 100%;
    @media (max-width: 768px) {
        width: 100%;

    }
 
  

`



export default BigSidebar;