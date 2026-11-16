import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Container, Form, Row, Col, Modal, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import { apicall_addUserAddress, apicall_deleteUserAddress, apicall_retrieveUserByUserId, apicall_updateUser, apicall_updateUserAddress, retrieveErrorMessage, retrieveMessage } from "../api/ApiCall";
import MessageComponent from "./MessageComponent";
import ToastComponent from "./ToastComponent";

const UserProfileComponent = () => {

  const navigate = useNavigate();

  const { isAdmin, userExternalId, isAuthenticated } = useContext(AuthContext); 
  
  const params = useParams();

  const [isFetchRequired, setIsFetchRequired] = useState(true);

  const [user, setUser] = useState(null);

  const [editUser, setEditUser] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const [modalMode, setModalMode] = useState("");

  const [address, setAddress] = useState({});
  const [addressExternalId, setAddressExternalId] = useState(null);

  const [message, setMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const [addressError, setAddressError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      if(isFetchRequired) {
        retrieveUserByUserId();
      }
    }
  }, [isFetchRequired]);


  const retrieveUserByUserId = async () => {
    try{
      const response = await apicall_retrieveUserByUserId(isAdmin ? params.userExternalId : userExternalId, isAdmin);

      if(response.data.success) {
        setUser(response.data.responseData);
        setMessage(null);
      }else{
        setUser(null);
        setMessage(retrieveMessage(response));
      }
    }catch(error) {
      setUser(null);
      setMessage(retrieveErrorMessage(error));
    } finally {
      setIsFetchRequired(false);
    }
  }

  
  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveUser = async () => {
    try{
      const userRequestDto = {
        userName: user.userName,
        emailId: user.emailId,
        phoneNumber: user.phoneNumber 
      }
      const response = await apicall_updateUser(userExternalId, userRequestDto);

      if(response.data.success) {
        setUser(response.data.responseData);
        setToastType("success");
      }else{
        setToastType("danger");
      }
      setShowToast(true);
      setToastMessage(retrieveMessage(response));

    }catch(error) {
      setIsFetchRequired(false);
    }finally {
      setEditUser(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleAddOrEditAddress = async () => {
    const requiredFields = ["addressName", "addressLine", "city", "state", "pinCode", "country"];
    for (const field of requiredFields) {
      if (!address[field] || address[field].trim() === "") {
        setAddressError(`Please fill in all required fields.`);
        return;
      }
    }
    setAddressError(null);
    try{
      address.userExternalId = userExternalId;
      let response = null;
      if(modalMode === "add") {
        response = await apicall_addUserAddress(address);
      } else if (modalMode === "edit") {
        response = await apicall_updateUserAddress(addressExternalId, address);
      }

      if(response != null && !response.data.success){
        setToastType("danger");
      } else {
        setToastType("success");
      }

      setShowToast(true);
      setToastMessage(retrieveMessage(response));

      setIsFetchRequired(true);
    } catch(error) {
      setIsFetchRequired(false);
      setShowToast(true);
      setToastType("danger");
      setToastMessage(retrieveErrorMessage(error));
    }finally {
      setModalMode("");
      setModalShow(false);
      setAddress({});
      setAddressExternalId(null);
    }
   
  };

  const handleEditAddress = (address) => {
    setModalMode("edit");
    setAddress(address);
    setAddressExternalId(address.addressExternalId);
    setModalShow(true);
  };

  const handleDeleteAddress = async (addressExternalId) => {
    try{
      const response = await apicall_deleteUserAddress(addressExternalId);

      if(response.data.success) {
        setIsFetchRequired(true);
        setToastType("success");
      }else{
        setToastType("danger");
      }
      setShowToast(true);
      setToastMessage(retrieveMessage(response));
      
    }catch(error) {
      setShowToast(true);
      setToastType("danger");
      setToastMessage(retrieveErrorMessage(error));
    }
  }

  return (
    <Container className="my-4">
      {user !== null && (
        <Row className="justify-content-center">
          <Col md={10} lg={10}>
            <Card className="shadow-lg border-0 mb-4">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <span className="fw-bold">{user.userName}'s Profile</span>
                {!isAdmin && (
                  <Button variant="outline-light" size="sm" onClick={() => setEditUser(!editUser)}>
                    {editUser ? "Cancel" : "Edit"}
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h5 className="mb-3 text-secondary">User Details</h5>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="userName"
                          value={user.userName}
                          disabled={!editUser}
                          onChange={handleUserChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="emailId"
                          value={user.emailId}
                          disabled={!editUser}
                          onChange={handleUserChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          name="phoneNumber"
                          value={user.phoneNumber}
                          disabled={!editUser}
                          onChange={handleUserChange}
                        />
                      </Form.Group>
                      {editUser && (
                        <Button variant="success" onClick={saveUser} className="mt-2">
                          Save
                        </Button>
                      )}
                    </Form>
                  </Col>
                  <Col md={6}>
                    <h5 className="mb-3 text-secondary">Saved Addresses</h5>
                    {!user.address || user.address.length === 0 ? (
                      <p className="text-muted">No addresses available.</p>
                    ) : (
                      <ListGroup>
                        {user.address.map((addr) => (
                          <ListGroup.Item key={addr.addressExternalId} className="d-flex justify-content-between align-items-start">
                            <div>
                              <span className="fw-bold text-primary">{addr.addressName}</span>: {addr.addressLine}, {addr.city}, {addr.state}, {addr.pinCode}, {addr.country}
                            </div>
                            <div>
                              {!isAdmin && (
                                <div className="d-flex gap-2">
                                  <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEditAddress(addr)}><i className="bi bi-pencil-square"></i></Button>
                                  <Button variant="outline-danger" size="sm" onClick={() => handleDeleteAddress(addr.addressExternalId)}><i className="bi bi-trash"></i></Button>
                                </div>
                              )}
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                    {!isAdmin && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="mt-3"
                        onClick={() => {
                          setModalMode("add");
                          setAddress({});
                          setAddressExternalId(null);
                          setModalShow(true);
                        }}
                      >
                        <i className="bi bi-plus-lg me-1"></i>Add Address
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      {message !== null && <MessageComponent message={message} />}
      {/* Address Modal */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{modalMode === "add" ? "Add Address" : "Edit Address"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {addressError && <div className="text-danger mb-2">{addressError}</div>}
            {["addressName", "addressLine", "city", "state", "pinCode", "country"].map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>{field.replace(/([A-Z])/g, " $1").toUpperCase()}</Form.Label>
                <Form.Control
                  type="text"
                  name={field}
                  value={address[field] || ""}
                  onChange={handleAddressChange}
                  placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="outline-secondary" onClick={() => setModalShow(false)}>Cancel</Button>
          <Button variant="success" onClick={handleAddOrEditAddress}>Save</Button>   
        </Modal.Footer>
      </Modal>
      <ToastComponent
        isShow={showToast}
        toastType={toastType}
        message={toastMessage}
        onToastClose={() => {
          setShowToast(false);
          setToastMessage("");
          setToastType("");
        }}
      />
    </Container>
  );
};

export default UserProfileComponent;
