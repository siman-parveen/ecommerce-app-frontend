import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";
import { AuthContext } from "../security/AuthContext";
import { retrieveErrorMessage } from "../api/ApiCall";
import { useState } from "react";

function LogoutComponent() {
  const navigate = useNavigate();
  const { onLogout, isAuthenticated } = useContext(AuthContext);
  const [logoutError, setLogoutError] = useState(null);
  
  useEffect(() => {
      if(!isAuthenticated){
          navigate('/login');
      }
  });


  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        await onLogout?.();
        navigate("/login");
      } catch (error) {
        setLogoutError(retrieveErrorMessage(error));
      }
    }, 1500);
    return () => clearTimeout(timeout);
  }, [onLogout, navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      {logoutError
        ? <Alert variant="danger">Unable to log out: {logoutError}</Alert>
        : <Alert variant="info">Logging out...</Alert>}
    </Container>
  );
}

export default LogoutComponent;
