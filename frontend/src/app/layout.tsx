// app/layout.tsx
'use client';

import 'bootstrap/dist/css/bootstrap.css';
import { useEffect } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // This ensures Bootstrap's JavaScript runs on the client side
    typeof document !== undefined ? require('bootstrap/dist/js/bootstrap.bundle.min.js') : null;
  }, []);

  return (
    <html lang="en">
      <body>
      <Navbar expand="lg" className="navbar navbar-expand-lg navbar-dark bg-dark py-0">
          <Container>
            <Navbar.Brand href="/">WeatherWave</Navbar.Brand>
           
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav className="me-0">
                <Nav.Link href="/docuser">Documentation</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        
        <main className="container py-0">
          {children}
        </main>
      </body>
      
    </html>
  );
}