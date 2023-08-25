import React from "react";
import HeaderStyle from "./HeaderStyle.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

function Header() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>
            <img className="logo" alt="alienLogo" src="images/logo.png" /> Ask
            Me
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
