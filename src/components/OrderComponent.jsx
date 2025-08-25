import { useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import DeleteModalComponent from "./modal/DeleteModalComponent";
import ToastComponent from "./ToastComponent";
import { apicall_cancelOrder, apicall_retrieveOrderByOrderExternalId, apicall_updateOrderStatusByAdmin, retrieveErrorMessage, retrieveMessage } from "../api/ApiCall";

function OrderComponent() {
    const navigate = useNavigate();

    const { orderExternalId } = useParams();

    const { isAdmin, isAuthenticated } = useContext(AuthContext);

    const [isFetchRequired, setIsFetchRequired] = useState(true);

    const [message, setMessage] = useState(null);

    const [selectedOrder, setSelectedOrder] = useState({});

    const [isDisabled, setIsDisabled] = useState(false);

    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState("");
    const [toastMessage, setToastMessage] = useState("");


    useEffect(() => {
        if(!isAuthenticated){
            navigate('/login');
        } else {
            if(isFetchRequired) {
                retrieveOrderByOrderExternalId();
            }
        }
    }, [isFetchRequired]);

    const retrieveOrderByOrderExternalId = async () => {
        try{
            const response = await apicall_retrieveOrderByOrderExternalId(orderExternalId);

            if(response.data.success) {
                setSelectedOrder(response?.data?.responseData);
                setMessage(null);
            } else {
                setSelectedOrder({});
                setMessage(retrieveMessage(response));
            }
        }catch(error) {
            setMessage(retrieveErrorMessage(error));
        } finally{
            setIsFetchRequired(false);
        }
    }

    const handleCancelOrder = () => {
        setShowCancelOrderModal(true);
    };

    const handleHideCancelOrderModal = () => {
        setShowCancelOrderModal(false);
    };

    const confirmCancelOrder = () => {
        try {
            apicall_cancelOrder(selectedOrder.orderId);
            handleHideCancelOrderModal();
            setShowToast(true);
            setToastType("success");
            setToastMessage("Order Cancelled Successfully!!");
            setTimeout(() => {navigate(-1);}, 3000);
        } catch(error) {
            setMessage(retrieveErrorMessage(error));
        }
    };


    const handleStatusUpdate = async  (e) => {
        try {
            const response = await apicall_updateOrderStatusByAdmin(selectedOrder.orderId, e.target.value);

            if(response.data.success) {
                setShowToast(true);
                setToastType("success");
                setToastMessage("Order Updated Successfully!!");
            } else {
                setShowToast(false);
                setToastType("danger");
                setToastMessage(retrieveMessage(response));
            }
           
        }catch(error) {
            setMessage(retrieveErrorMessage(error));
        }
    }

    

    return (
        <Container className="my-4">
            <h3>{isAdmin ? "View and Manage Order" : "Your Order"}</h3>
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
            <Card className="mt-4">
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Order#:</strong> {selectedOrder.orderId}</p>
                            {isAdmin && <p><strong>Customer:</strong> {selectedOrder.customer}</p>}
                            <p><strong>Items:</strong> {selectedOrder.items}</p>
                            <p><strong>Price:</strong> ${selectedOrder.amount}</p>
                            <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                            <p><strong>Status:</strong> {selectedOrder.status}</p>
                        </Col>
                    </Row>

                    {isAdmin && (
                    <div className="mt-4">
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {selectedOrder.status === 'NEW' && <Button variant="light" value="processing" onClick={handleStatusUpdate} >Mark as Processing</Button>}
                            {selectedOrder.status === 'PROCESSING' && <Button variant="primary" value="shipped" onClick={handleStatusUpdate} >Mark as Shipped</Button>}
                            {selectedOrder.status === 'SHIPPED' && <Button variant="success" value="delivered" onClick={handleStatusUpdate}>Mark as Delivered</Button>}
                            <Button variant="info" onClick={() => {
                                setTimeout(() => navigate(`/order/${selectedOrder.orderId}/payment/details`), 1000);
                            }} >View Payment Details</Button>
                        </div>
                    </div>
                    )}

                    {!isAdmin && (
                        <div className="mt-4">
                            <Button variant="danger" onClick={handleCancelOrder}>Cancel Order</Button>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <DeleteModalComponent 
                deleteModalShow={showCancelOrderModal}
                confirmDeleteMessage={"Are you sure you want to cancel this order?"} 
                handleHideDeleteModal={handleHideCancelOrderModal} 
                deleteEntity={confirmCancelOrder}
            />

            <ToastComponent 
                isShow={showToast} 
                toastType={toastType} 
                message={toastMessage} 
                onToastClose={() => {
                    setShowToast(false);
                    setToastType("");
                    setToastMessage("");
                }}
            />
        </Container>
    );
    };

    export default OrderComponent;
