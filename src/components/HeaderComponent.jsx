import { useContext } from "react";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";

function HeaderComponent() {// isAuthenticated = true, isAdmin = true }) {

  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  //console.log(authContext);

  //const isAuthenticated = true;
  //const isAdmin = false;

  const navigate = useNavigate();

  const handleBack = () => {
    if(window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect sticky="top" className="shadow-sm">
      <Container fluid>
        <div className="d-flex align-items-center w-100">
          <Button
            variant="outline-light"
            className="me-2 px-3 py-1"
            style={{ fontWeight: 'bold', fontSize: '1.2rem', boxShadow: 'none' }}
            onClick={handleBack}
            title="Go Back"
          >
            <span aria-label="Back" role="img">←</span>
          </Button>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
            <span role="img" aria-label="shop">🛍️</span> E-Commerce
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" className="ms-auto" />
        </div>
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/products" className="fw-semibold">Products</Nav.Link>
            {isAuthenticated && !isAdmin && (
              <Nav.Link as={Link} to="/user/cart" className="fw-semibold">Cart</Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto">
            {isAuthenticated ? (
              !isAdmin ? (
                <NavDropdown title={<span><i className="bi bi-person-circle me-1"></i>User</span>} id="user-menu" align="end">
                  <NavDropdown.Item as={Link} to="/user/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/user/orders">Orders</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/user/reviews">Reviews</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/logout">Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown title={<span><i className="bi bi-shield-lock me-1"></i>Admin</span>} id="admin-menu" align="end">
                  <NavDropdown.Item as={Link} to="/admin/users">Users</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/manage/products">Manage Products</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/manage/orders">Manage Orders</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/manage/reviews">Manage Reviews</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/logout">Logout</NavDropdown.Item>
                </NavDropdown>
              )
            ) : (
              <Nav.Link as={Link} to="/login" className="fw-semibold">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderComponent;
