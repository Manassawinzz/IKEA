import React from 'react'

import { Container, Nav, Navbar } from 'react-bootstrap';



function Nav_Bar() {
    return (
        <div>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                    <Navbar.Brand href="#"> <div className='Brand' > IKEA</div></Navbar.Brand>
                    <Nav className="me-auto">
                    </Nav>
                </Container>
            </Navbar>
        </div>
    )
}

export default Nav_Bar