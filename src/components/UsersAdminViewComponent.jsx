import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Container, Spinner, Modal, Form, Col, Card } from "react-bootstrap";
import { useAsyncError, useNavigate } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import { apicall_retrieveAllUsers, retrieveErrorMessage, retrieveMessage } from "../api/ApiCall";
import MessageComponent from "./MessageComponent";

const UsersAdminViewComponent = () => {

  const [users, setUsers] = useState([]);

  // const [user, setUser] = useState({});

  const navigate = useNavigate();

  const { isAuthenticated } = useContext(AuthContext);

  // const [modalShow, setModalShow] = useState(false);

  const [isFetchingRequired, setIsFetchingRequired] = useState(true);

  const [message, setMessage] = useState(null);


  useEffect(() => {
    if(!isAuthenticated){
      navigate('/login'); 
    } 
    else {
      if(isFetchingRequired){
        retrieveAllUsers();
      }  
    }
  }, [isAuthenticated, isFetchingRequired]);

  const retrieveAllUsers = async () => {
    try {
      const response = await apicall_retrieveAllUsers();

      if(response.data.success) {
        setUsers(response.data.responseData);
        setMessage(null);
      }else {
        setUsers([]);
        setMessage(retrieveMessage(response));
      }
    }catch(error) {
      setMessage(retrieveErrorMessage(error));
    }finally{
      setIsFetchingRequired(false);
    }
  }

  // function retrieveUserByUserId(userExternalId) {
  //   setUser(users.filter(user => user.userExternalId === userExternalId)[0]);
  // }

  const handleView = (userExternalId) => {
    //setModalShow(true);
    //retrieveUserByUserId(userExternalId);
    navigate(`/admin/user/${userExternalId}/details`);
  };

  // const handleCloseModal = () => {
  //   setModalShow(false);
  //   setUser({});
  // };

  return (
    <Container className="my-4">
      <h3 className="mb-3">All Users</h3>

      {message !== null && 
          <MessageComponent message={message} />
      }

      {users?.length > 0 &&
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userExternalId}>
                <td>{user.userExternalId}</td>
                <td>{user.userName}</td>
                <td>{user.emailId}</td>
                <td>{user.phoneNumber}</td>
                <td>
                  <Button variant="info" size="sm" onClick={() => handleView(user.userExternalId)} className="me-2">View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      }

      {/* <Modal show={modalShow} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>View User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control name="userName" value={user.userName} disabled={false} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control name="emailId" value={user.emailId} disabled={false} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" name="phoneNumber" value={user.phoneNumber} disabled={false} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
        </Modal.Footer>
      </Modal> */}
    </Container>
  );
};

export default UsersAdminViewComponent;
