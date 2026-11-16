import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Container, Card, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ToastComponent from "./ToastComponent";
import { AuthContext } from "../security/AuthContext";
import { retrieveErrorMessage } from "../api/ApiCall";

function AuthComponent() {

  const authContext = useContext(AuthContext);

  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ userName: "", emailId: "", password: "" , phoneNumber: "" });
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [authMessage, setAuthMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (authContext.isAuthenticated) {
      navigate('/products');
    }
  });

  const actionsForLogin = async () => {

    try {
      const response = await authContext.login(formData);

      if (response.success) {
        navigate('/products');
      } else {
        setShowToast(true);
        setToastType("danger");
        setAuthMessage(response.errorMessage);
      }
    } catch (err) {
      setShowToast(true);
      setToastType("danger");
      setAuthMessage(retrieveErrorMessage(err));
    }
  }

  const actionsForSignUp  = async () => {

    try {
      const response = await authContext.signUp(formData);

      if (response.success) {
        navigate('/products');
      } else {
        setShowToast(true);
        setToastType("danger");
        setAuthMessage(response.errorMessage);
      }
    } catch (err) {
      setShowToast(true);
      setToastType("danger");
      setAuthMessage(retrieveErrorMessage(err));
    }
  }

  function onToastClose() {
    setShowToast(false);
    setToastType("");
    setAuthMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (mode === "login") {
      actionsForLogin();
    } else {
      actionsForSignUp();
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "85vh" }}>
      <Card style={{ width: "26rem" }} className="p-0 shadow-lg border-0">
        {mode === "login" ?
          <Card.Header className="bg-primary text-white text-center py-3">
            <h4 className="mb-0">Welcome Back!</h4>
          </Card.Header>
          : 
          <Card.Header className="bg-success text-white text-center py-3">
            <h4 className="mb-0">Create Your Account</h4>
          </Card.Header>
          }
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <ToggleButtonGroup type="radio" name="mode" value={mode} onChange={val => setMode(val)}>
              <ToggleButton id="login-btn" variant={mode === "login" ? "primary" : "outline-primary"} value="login">
                <i className="bi bi-box-arrow-in-right me-2"></i>Login
              </ToggleButton>
              <ToggleButton id="signup-btn" variant={mode === "signup" ? "success" : "outline-success"} value="signup">
                <i className="bi bi-person-plus me-2"></i>Sign Up
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <Form onSubmit={handleSubmit} autoComplete="off">
            {mode === "signup" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" name="userName" value={formData.userName} onChange={handleChange} required placeholder="Enter your username" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="e.g. +1234567890" />
                </Form.Group>
              </>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email ID</Form.Label>
              <Form.Control type="email" name="emailId" value={formData.emailId} onChange={handleChange} required placeholder="Enter your email" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Enter your password" />
            </Form.Group>
            <Button type="submit" className="w-100 py-2" variant={mode === "login" ? "primary" : "success"}>
              {mode === "login" ? <><i className="bi bi-box-arrow-in-right me-2"></i>Login</> : <><i className="bi bi-person-plus me-2"></i>Sign Up</>}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ToastComponent isShow={showToast} toastType={toastType} message={authMessage} onToastClose={onToastClose}/>
    </Container>
  );
}

export default AuthComponent;
