import React, { useContext, useEffect, useState } from "react";
import { Card, Badge, Container, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import { apicall_retrievePaymentByOrderId } from "../api/ApiCall";

function ViewPaymentDetailComponent() {

  const navigate = useNavigate();

  const { orderExternalId } = useParams();

  const { isAuthenticated } = useContext(AuthContext);

  const [isFetchRequired, setIsFetchRequired] = useState(true);
  
  const [payment, setPayment] = useState(null);

  const [message, setMessage] = useState(null);

  useEffect(() => {
      if(!isAuthenticated){
          navigate('/login');
      } else {
        if(isFetchRequired) {
          retrievePaymentByOrderId();
        }
      }
  }, [isFetchRequired]);

  const retrievePaymentByOrderId = async () => {
    try{
      const result = await apicall_retrievePaymentByOrderId(orderExternalId);
      setPayment(result.data.responseData);
      setIsFetchRequired(false);
      setMessage(null);
    }catch(error) {
      setMessage(error?.code === "ERR_NETWORK" ? error?.message : error?.response?.data?.message);
      setIsFetchRequired(false);
    }
  }
  
  return (
    <Container>
        <Card className="my-4 shadow-sm">
          {message !== null && 
              <Col md={12}>
                  <Card className="text-center my-4">
                  <Card.Body>
                      <Card.Title>{message}</Card.Title>
                      <Card.Text>Please check back later..</Card.Text>
                  </Card.Body>
                  </Card>
              </Col>
          }
          {payment != null && 
          <>
          <Card.Header as="h5">Payment Detail</Card.Header>
          <Card.Body>
            <p><strong>Payment ID:</strong> {payment.paymentId}</p>
            <p><strong>Order ID:</strong> {payment.orderId}</p>
            <p><strong>Paid By:</strong> {payment.paidBy}</p>
            <p><strong>Amount:</strong> ₹ {payment.amount} {payment.currency}</p>
            <p><strong>Payment Mode:</strong> {payment.paymentMode}</p>
            <p>
              <strong>Status:</strong>{" "}
              <Badge bg={payment.status === "SUCCESS" ? "success" : payment.status === "PROCESSING" ? "warning" : "danger"}>
                {payment.status}
              </Badge>
            </p>
            <p><strong>Transaction Date:</strong> {new Date(payment.transactionDate).toLocaleString()}</p>
          </Card.Body>
          </>}
        </Card>
    </Container>
    
  );
}

export default ViewPaymentDetailComponent;
