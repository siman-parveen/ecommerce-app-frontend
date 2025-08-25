// src/components/ErrorPageComponent.jsx
import { useContext, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../security/AuthContext';

const ErrorPageComponent = ({ status = 404, message = "Page Not Found" }) => {
  const navigate = useNavigate();

  const { isAuthenticated } = useContext(AuthContext);  
  
  useEffect(() => {
      if(!isAuthenticated){
          navigate('/login');
      }
  });

  return (
    <Container className="text-center my-5">
      <Row>
        <Col>
          <h1 className="display-1 text-danger">{status}</h1>
          <h2 className="mb-4">{message}</h2>
          <Button variant="primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorPageComponent;
