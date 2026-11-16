import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Pagination, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import { apicall_retrieveAllOrders, apicall_retrieveOrdersGivenByUser, retrieveErrorMessage, retrieveMessage } from "../api/ApiCall";
import MessageComponent from "./MessageComponent";
import ToastComponent from "./ToastComponent";

function ManageOrdersComponent() {

    const navigate = useNavigate();

    const { userExternalId, isAdmin, isAuthenticated } = useContext(AuthContext);

    const [isFetchRequired, setIsFetchRequired] = useState(true);

    const [orders, setOrders] = useState([]);

    const [message, setMessage] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState("info");

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 6;

    const indexOfLastProduct = currentPage * ordersPerPage;
    const indexOfFirstProduct = indexOfLastProduct - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    useEffect(() => {
        if(!isAuthenticated){
            navigate('/login');
        } else {
            if(isFetchRequired) {
                setIsFetchRequired(false);
                retrieveOrders();
                //setPagination();
            }
        }
    }, [isFetchRequired]);


    const retrieveOrders = async () => {
        try {
            let response;
            
            if(isAdmin){
                response = await apicall_retrieveAllOrders();
            } else {
                response = await apicall_retrieveOrdersGivenByUser(userExternalId);
            }

            if(response.data.success) {
                setOrders(response?.data?.responseData);
                setMessage(null);
            } else {
                setOrders([]);
                setMessage(retrieveMessage(response));
            }            
        }catch(error) {
            setMessage(retrieveErrorMessage(error));
            setShowToast(true);
            setToastType("danger");
        } 
    }

    const viewSelectedOrder = (selectedOrderId) => {
        navigate(`/user/orders/${selectedOrderId}`);
    };

    const viewAndManageSelectedOrder = (selectedOrderId) => {
        navigate(`/admin/manage/orders/${selectedOrderId}`);
    };

    return (
        <Container className="my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Manage Orders</h3>
            </div>

            {totalPages > 1 && (
                <Pagination className="mb-3">
                    <Pagination.Prev
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Item disabled>of</Pagination.Item>
                    <Pagination.Item active>{totalPages}</Pagination.Item>
                    <Pagination.Next
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    />
                </Pagination>
            )}

            {message !== null && <MessageComponent message={message} />}

            <Row>
                {currentOrders.length === 0 ? (
                    <Col className="text-center text-muted py-5">No orders found.</Col>
                ) : (
                    currentOrders.map(order => (
                        <Col md={6} lg={4} className="mb-4" key={order.orderExternalId}>
                            <Card className="shadow-sm h-100 border-0">
                                <Card.Body>
                                    <Card.Title className="mb-2 text-success fw-bold">Order# {order.orderExternalId}</Card.Title>
                                    {isAdmin && <Card.Text className="mb-1 text-secondary">Ordered By: <span className="fw-semibold">{order.customerName}</span></Card.Text>}
                                    <Card.Text className="mb-2"><span className={`badge ${order.status === 'Delivered' ? 'bg-success' : 'bg-warning text-dark'}`}>{order.status}</span></Card.Text>
                                    {isAdmin ? 
                                    <Button variant="outline-warning" className="me-2" onClick={() => viewAndManageSelectedOrder(order.orderExternalId)}><i className="bi bi-tools me-1"></i>View & Manage</Button>
                                    :
                                    <Button variant="outline-primary" className="me-2" onClick={() => viewSelectedOrder(order.orderExternalId)}><i className="bi bi-eye me-1"></i>View</Button>}
                                </Card.Body>
                            </Card>
                        </Col>
                    )))
                }
            </Row>

        </Container>
    );
}

export default ManageOrdersComponent;