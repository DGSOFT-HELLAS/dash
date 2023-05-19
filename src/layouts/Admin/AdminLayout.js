'use client'
import React from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import AdminNavbar from '@/components/AdminNavbar';
import BigSidebar from '@/components/Sidebar/BigSidebar';
import { useEffect } from 'react';


const AdminLayout = ({children}) => {
    const { isSidebarOpen } = useSelector((store) => store.user)
    const [count, setCount] = React.useState(0);
    useEffect(() => {
      
        setCount((prev) => prev + 1)
       
    }, [] )

    console.log('AdminLayout effect run ' + count + ' times')
    return (
            <Container>
                <AdminNavbar />
                <div className="main-box">
                    <BigSidebar />
                    <SidebarContainer isSidebarOpen={isSidebarOpen}>
                        {children}
                    </SidebarContainer>
                </div>
              

            </Container>
    )
}


const Container = styled.div`
    .main-box {
        width: 100%;
       
    }

`


const SidebarContainer = styled.div`
    position: absolute;
    top: 70px;
    left: ${({ isSidebarOpen }) => isSidebarOpen ? '260px' : '0'};
    width: ${({ isSidebarOpen }) => isSidebarOpen ? 'calc(100% - 260px)' : '100%'};
    padding: 40px;
    overflow-y:scroll;
    background-color: ${({ theme }) => theme.palette.background};
    height: calc(100vh - 70px);

    @media (max-width: 768px) {
        width: 100%;
        left: 0;
    }
`


export default AdminLayout