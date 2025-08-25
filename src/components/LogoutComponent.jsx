import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";
import { AuthContext } from "../security/AuthContext";

function LogoutComponent() {
  const navigate = useNavigate();
  const { onLogout, isAuthenticated } = useContext(AuthContext);
  
  useEffect(() => {
      if(!isAuthenticated){
          navigate('/login');
      }
  });


  useEffect(() => {
    //authContext.onLogout?.();
    setTimeout(() => {
      navigate("/login");
      onLogout?.();
    }, 1500);
  }, [onLogout, navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Alert variant="info">You have been logged out. Redirecting...</Alert>
    </Container>
  );
}

export default LogoutComponent;
