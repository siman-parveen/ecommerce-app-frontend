import { Container, Row, Col } from 'react-bootstrap';

function FooterComponent() {
  return (
    <footer className="bg-dark text-light py-3 w-100 fixed-bottom">
      <Container>
        <Row>
          <Col md={6} className="text-center text-md-start">
            <small>&copy; {new Date().getFullYear()} E-Commerce App. All rights reserved.</small>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <small>Contact: support@ecommerce.com</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterComponent;
