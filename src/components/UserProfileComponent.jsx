import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Container, Form, Row, Col, Modal, ListGroup } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import { apicall_addUserAddress, apicall_deleteUserAddress, apicall_retrieveUserByUserId, apicall_updateUser, apicall_updateUserAddress, retrieveErrorMessage, retrieveMessage } from "../api/ApiCall";
import MessageComponent from "./MessageComponent";

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
      const response = await apicall_retrieveUserByUserId(isAdmin ? params.userExternalId : userExternalId);

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
      }else{

      }
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
    try{
      address.userExternalId = userExternalId;
      let response = null;
      if(modalMode === "add") {
        response = await apicall_addUserAddress(address);
      } else if (modalMode === "edit") {
        response = await apicall_updateUserAddress(addressExternalId, address);
      }

      if(response != null && !response.data.success){
        //add toast
      }

      setIsFetchRequired(true);
    } catch(error) {
      setMessage(retrieveErrorMessage(error));
      setIsFetchRequired(false);
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
      await apicall_deleteUserAddress(addressExternalId);
      setIsFetchRequired(true);
    }catch(error) {
      console.log(error);
    }
  }

  return (
    <Container className="my-4">
      {user !== null && <h3 className="mb-4">{user.userName}'s User Profile </h3>}

      {message !== null && 
          <MessageComponent message={message} />
      }

      {user !== null && 
      <Row>
        {/* User Details */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between">
              <span>User Details</span>
              {!isAdmin &&
                <Button variant="outline-primary" size="sm" onClick={() => setEditUser(!editUser)}>
                  {editUser ? "Cancel" : "Edit"}
                </Button>
              }
            </Card.Header>
            <Card.Body>
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
                  <Button variant="success" onClick={saveUser}>
                    Save
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Addresses */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between">
              <span>Saved Addresses</span>
              {!isAdmin && <Button
                variant="outline-success"
                size="sm"
                onClick={() => {
                  setModalMode("add");
                  setAddress({});
                  setAddressExternalId(null);
                  setModalShow(true);
                }}
              >
                Add
              </Button>}
            </Card.Header>
            <Card.Body>
              {!user.address || user.address.length === 0 ? (
                <p>No addresses available.</p>
              ) : (
                <ListGroup>
                  {user.address.map((addr) => (
                    <ListGroup.Item
                      key={addr.addressExternalId}
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <strong>{addr.addressName}</strong>: {addr.addressLine}, {addr.city}, {addr.state}, {addr.pincode}, {addr.country}
                      </div>
                      <div>
                        {!isAdmin && 
                          <>
                            <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditAddress(addr)}>Edit</Button>
                            <Button variant="danger" size="sm" className="me-2" onClick={() => handleDeleteAddress(addr.addressExternalId)}>Delete</Button>
                          </>
                        }
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>}

      {/* Address Modal */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          {modalMode === "add" && <Modal.Title>Add Address</Modal.Title>}
          {modalMode === "edit" && <Modal.Title>Edit Address</Modal.Title>}
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["addressName", "addressLine", "city", "state", "pincode", "country"].map((field) => (
              <Form.Group className="mb-2" key={field}>
                <Form.Label>{field.replace(/([A-Z])/g, " $1").toUpperCase()}</Form.Label>
                <Form.Control
                  type="text"
                  name={field}
                  value={address[field] || ""}
                  onChange={handleAddressChange}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddOrEditAddress}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfileComponent;
