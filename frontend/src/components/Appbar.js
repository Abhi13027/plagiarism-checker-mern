import React from "react";
import { Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Appbar = () => {
  return (
    <Navbar className="p-3" bg="light" expand="md">
      <LinkContainer to="/">
        <Navbar.Brand>PLAGIARISM CHECKER</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
    </Navbar>
  );
};

export default Appbar;
