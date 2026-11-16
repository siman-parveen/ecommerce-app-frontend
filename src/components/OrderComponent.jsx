import { useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import DeleteModalComponent from "./modal/DeleteModalComponent";
import ToastComponent from "./ToastComponent";
import { apicall_addReview, apicall_cancelOrder, apicall_retrieveOrderByOrderExternalId, apicall_updateOrderStatusByAdmin, retrieveErrorMessage, retrieveMessage } from "../api/ApiCall";
import ReviewModalComponent from "./modal/ReviewModalComponent";

function OrderComponent() {
    const navigate = useNavigate();

    const { orderExternalId } = useParams();

    const { isAdmin, isAuthenticated } = useContext(AuthContext);

    const [isFetchRequired, setIsFetchRequired] = useState(true);

    const [message, setMessage] = useState(null);

    const [selectedOrder, setSelectedOrder] = useState({});

    //const [isDisabled, setIsDisabled] = useState(false);

    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const [reviewModalShow, setReviewModalShow] = useState(false);

    const [selectedReview, setSelectedReview] = useState({});


    useEffect(() => {
        if(!isAuthenticated){
            navigate('/login');
        } else {
            if(isFetchRequired) {
                setIsFetchRequired(false);
                retrieveOrderByOrderExternalId();
            }
        }
    }, [isFetchRequired]);

    const retrieveOrderByOrderExternalId = async () => {
        try{
            const response = await apicall_retrieveOrderByOrderExternalId(orderExternalId);

            if(response.data.success) {
                console.log(response?.data?.responseData);
                setSelectedOrder(response?.data?.responseData);
                setMessage(null);
            } else {
                setSelectedOrder({});
                setMessage(retrieveMessage(response));
            }
        }catch(error) {
            setMessage(retrieveErrorMessage(error));
        }
    }

    const handleCancelOrder = () => {
        setShowCancelOrderModal(true);
    };

    const handleReturnRefundOrder = () => {
      console.log("Return and Refund order");
    };

    const handleHideCancelOrderModal = () => {
        setShowCancelOrderModal(false);
    };

    const confirmCancelOrder = () => {
        try {
            apicall_cancelOrder(selectedOrder.orderExternalId);
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
            const response = await apicall_updateOrderStatusByAdmin(selectedOrder.orderExternalId, e.target.value);

            if(response.data?.success) {
                setShowToast(true);
                setToastType("success");
                setToastMessage("Order Updated Successfully!!");
                setIsFetchRequired(true);
            } else {
                setShowToast(true);
                setToastType("danger");
                setToastMessage(retrieveMessage(response));
            }
           
        }catch(error) {
            setMessage(retrieveErrorMessage(error));
        }
    }

    const handleReview = () => {
        setSelectedReview({});
        setReviewModalShow(true);
    }

    const addReview = async () => {
        try{
            const response = await apicall_addReview(selectedReview);
            if(response.data.success) {
                setToastType("success");
            }else{
                setToastType("danger");
            }
            setToastMessage(retrieveMessage(response));
            setShowToast(true);
            //setModalMode("");
            setIsFetchRequired(true);
        }catch(error) {
            setToastMessage(retrieveErrorMessage(error));
            setToastType("danger");
            setShowToast(true);
        }
    }

    const handleChange = (e) => {
        if(typeof(e) === 'number') {
            setSelectedReview((prev) => ({
                ...prev,
                rating: e 
            }));
            return;
        }
        const { name, value } = e.target;
        setSelectedReview((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleSave = () => {
        setReviewModalShow(false);
        addReview();
    }

    return (
        <Container className="my-4">
            <Row className="justify-content-center">
                <Col md={8} lg={7}>
                    <Card className="shadow-lg border-0">
                        <Card.Header className="bg-primary text-white text-center">
                            <h4 className="mb-0">{isAdmin ? "View and Manage Order" : "Your Order"}</h4>
                        </Card.Header>
                        {message !== null && (
                            <Card.Body className="text-center">
                                <Card.Title className="text-danger">{message}</Card.Title>
                                <Card.Text>Please check back later.</Card.Text>
                            </Card.Body>
                        )}
                        {message === null && (
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <div className="mb-3">
                                            <span className="fw-bold">Order#:</span> <span className="text-primary fw-bold">{selectedOrder.orderExternalId}</span>
                                        </div>
                                        {isAdmin && (
                                            <div className="mb-2">
                                                <span className="fw-bold">Customer:</span> <span className="text-success fw-semibold">{selectedOrder.customerName}</span>
                                            </div>
                                        )}
                                        <div className="mb-2">
                                            <span className="fw-bold">Items ({selectedOrder.orderItemCount}):</span>
                                            <div>
                                                {Array.isArray(selectedOrder.orderItems) && selectedOrder.orderItems.map(item => (
                                                    <span key={item.orderItemExternalId} className="badge bg-info text-dark me-2">
                                                        {item.productName} - Qty: {item.quantity} * Rs. {item.productPrice} - Rs. {item.quantity * item.productPrice}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <span className="fw-bold">Price:</span> <span className="badge bg-warning text-dark">Rs. {selectedOrder.totalCost}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="fw-bold">Payment Method:</span> <span className="badge bg-light text-dark">{selectedOrder.payment?.paymentMethod}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="fw-bold">Payment Status:</span> <span className="badge bg-light text-dark">{selectedOrder.payment?.paymentStatus}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="fw-bold">Status:</span> <span className={`badge ${selectedOrder.status === 'Delivered' ? 'bg-success' : 'bg-warning text-dark'}`}>{selectedOrder.status}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="mt-4">
                                    <div className="d-flex flex-wrap gap-2 mt-2 justify-content-center">
                                    {isAdmin && (
                                        <>
                                            {selectedOrder.status === 'NEW' && <Button variant="outline-info" value="PROCESSING" onClick={handleStatusUpdate}>Mark as Processing</Button>}
                                            {selectedOrder.status === 'PROCESSING' && <Button variant="outline-primary" value="SHIPPED" onClick={handleStatusUpdate}>Mark as Shipped</Button>}
                                            {selectedOrder.status === 'SHIPPED' && <Button variant="outline-success" value="DELIVERED" onClick={handleStatusUpdate}>Mark as Delivered</Button>}
                                        </>
                                    )}
                                    <Button variant="info" onClick={() => {
                                        setTimeout(() => navigate(`/order/${selectedOrder.orderExternalId}/payment/details`), 1000);
                                    }}>View Payment Details</Button>
                                    {selectedOrder.status !== 'DELIVERED' && (
                                        // <div className="mt-4 text-center">
                                        <>
                                            <Button variant="outline-danger" onClick={handleCancelOrder}>Cancel Order</Button>
                                            {selectedOrder.status === 'DELIVERED' && <Button variant="outline-success"  onClick={handleReview}>Give a Review</Button>}
                                        </>
                                        // </div>
                                    )}
                                    {selectedOrder.status === 'DELIVERED' && (
                                        // <div className="mt-4 text-center">
                                        <>
                                            <Button variant="outline-danger" onClick={handleReturnRefundOrder}>Return & Refund</Button>
                                            {selectedOrder.status === 'DELIVERED' && <Button variant="outline-success"  onClick={handleReview}>Give a Review</Button>}
                                        </>
                                        // </div>
                                    )}
                                    </div>
                                </div>
                            </Card.Body>
                        )}
                    </Card>
                </Col>
            </Row>
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
 
            <ReviewModalComponent 
                isAdmin = {isAdmin}
                showModal = {reviewModalShow}
                modalMode = {"add"}
                selectedReview =  {selectedReview}
                handleChange = {handleChange} //function to change the selectedReview attributes
                handleCloseModal = {() => setReviewModalShow(false)} //function to close the modal
                handleSave = {handleSave} //function to save the edited/added review
            />
        </Container>
    );
    };

    export default OrderComponent;
