import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Card, Button, ListGroup, Table, Row, Col } from "react-bootstrap";
import { apicall_deleteOrder, apicall_makePaymentForOrder, apicall_removeProductFromCart, apicall_retrieveOrderByOrderExternalId, retrieveErrorMessage, retrieveMessage } from "../api/ApiCall";
import ToastComponent from "./ToastComponent";
import { AuthContext } from "../security/AuthContext";

function PaymentConfirmationPage() {

    const { isAdmin, isAuthenticated } = useContext(AuthContext); 
    
    const location = useLocation();

    const cartItems = location.state?.cartItems || [];

    const [isFetchRequired, setIsFetchRequired] = useState(true);
    const { orderExternalId } = useParams();
    const navigate = useNavigate();

    const [transactionId, setTransactionId] = useState(null);

    const [orderDetails, setOrderDetails] = useState(null);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");

    useEffect(() => {
        if(!isAuthenticated) {
            navigate('/login');
        }else{
            if(isAdmin){
                if(window.history.length > 1) {
                    navigate(-1);
                } else {
                    navigate('/');
                }
            } else {
                if(isFetchRequired){
                    setIsFetchRequired(false);
                    if(cartItems.length > 0) {
                        fetchOrderDetails();
                    }else{
                        navigate('/user/cart');
                    }
                }
            }
        }
    }, [isFetchRequired])

    const fetchOrderDetails = async () => { 
        try {
            const response = await apicall_retrieveOrderByOrderExternalId(orderExternalId);
            if (response.data.success) {
                setOrderDetails(response.data.responseData);
                createNewTransactionId();
            } else {
                setShowToast(true);
                setToastMessage(retrieveMessage(response));
                setToastType("danger");
            }
        } catch (error) {
            setShowToast(true);
            setToastMessage(retrieveErrorMessage(error));
            setToastType("danger");
        } 
    };

    const createNewTransactionId = () => {
        const now = new Date();

        const pad = (num) => num.toString().padStart(2, "0");

        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1);
        const day = pad(now.getDate());
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        const randomDigits = Math.floor(10000 + Math.random() * Math.random() * 9000);

        setTransactionId(`TXN${year}${month}${day}${hours}${minutes}${seconds}${randomDigits}`);
    }

    const handlePayment = async () => {

        try{

            const paymentMode = "UPI";
            const totalAmount = orderDetails.totalCost;

            const paymentDTO = { transactionId, totalAmount, paymentMode, orderExternalId };

            const response_makePayment = await apicall_makePaymentForOrder(orderExternalId, paymentDTO);

            if(!response_makePayment) {
                const deleteOrderResponse = await apicall_deleteOrder(orderExternalId);
                if(!deleteOrderResponse.data.success){
                    setShowToast(true);
                    setToastMessage(retrieveMessage(deleteOrderResponse));
                    setToastType("danger");
                }
                setShowToast(true);
                setToastMessage(retrieveMessage(response_makePayment));
                setToastType("danger");
            }

            await Promise.all(
                cartItems.map(async (item) => {
                    const result = await apicall_removeProductFromCart(item.cartItemExternalId);
                    if(!result.data.success) {
                        setShowToast(true);
                        setToastMessage(retrieveMessage(result));
                        setToastType("danger");
                    }
                })
            );

            setShowToast(true);
            setToastMessage("Payment successful!! Please wait while we redirect you to order details page...");
            setToastType("success");

            setTimeout(() => {
                navigate(`/order/${orderExternalId}/payment/details`)
            }, 1000);

        }catch(error){
            setShowToast(true);
            setToastMessage(retrieveErrorMessage(error));
            setToastType("danger");
        }
    }

    const cancelPayment = async () => {

        try {
            const deleteOrderResponse = await apicall_deleteOrder(orderExternalId);
            if(!deleteOrderResponse.data.success){
                setShowToast(true);
                setToastMessage(retrieveMessage(deleteOrderResponse));
                setToastType("danger");
            }
        }catch(error) {
            setShowToast(true);
            setToastMessage(retrieveErrorMessage(error));
            setToastType("danger");
        } finally {
           // setIsLoading(false);
        }
    };

    if (!orderDetails) {
        return (
            <Container className="text-center my-5">
                <Card className="shadow-sm p-4">
                    <h3 className="mb-3">Order not found</h3>
                    <Button variant="primary" onClick={() => navigate("/user/orders")}>Go to Orders</Button>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={8} lg={7}>
                    <Card className="shadow-lg border-0">
                        <Card.Header className="bg-primary text-white text-center">
                            <h4 className="mb-0">Payment Confirmation</h4>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <strong>Order ID:</strong> <span className="text-primary">{orderDetails.orderExternalId}</span>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Transaction ID:</strong> <span className="text-success">{transactionId}</span>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Total Amount Paid:</strong> <span className="text-danger">₹ {orderDetails.totalCost?.toFixed(2)}</span>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Delivery Address:</strong>
                                    <div className="mt-1">
                                        <span className="fw-light">{orderDetails.address?.addressLine}, {orderDetails.address?.city}, {orderDetails.address?.state}, {orderDetails.address?.pinCode}, {orderDetails.address?.country}</span>
                                    </div>
                                </ListGroup.Item>
                                {/* <ListGroup.Item>
                                    <strong>Phone:</strong> <span className="fw-light">{orderDetails.phoneNumber}</span>
                                </ListGroup.Item> */}
                                <ListGroup.Item>
                                    <strong>Ordered Items:</strong>
                                    <Table hover size="sm" borderless className="mt-2">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Product Name</th>
                                                <th>Quantity</th>
                                                <th>Price (₹)</th>
                                                <th>Expected Delivery Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderDetails.orderItems.map(item => (
                                                <tr key={item.productExternalId}>
                                                    <td>{item.productName}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{(item.productPrice * item.quantity)?.toFixed(2)}</td>
                                                    <td>{item.deliveredDate}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                        <Card.Footer className="bg-light text-center">
                            <Row className="g-2">
                                <Col xs={12} md={6}>
                                    <Button variant="success" className="w-100" onClick={handlePayment} disabled={cartItems.length === 0}>Confirm Order</Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-danger" className="w-100" onClick={cancelPayment} disabled={cartItems.length === 0}>Cancel Order</Button>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
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
}

export default PaymentConfirmationPage;
