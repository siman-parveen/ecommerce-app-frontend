import { Button, Form, Modal } from "react-bootstrap";

function OrderModalComponent({isAdmin=false, showModal, modalMode, selectedOrder, handleHideModal, handleCancelOrder, updateOrderStatusByAdmin=null}) {
    return
    (   <Modal show={showModal}>
            <Modal.Header closeButton>
                <Modal.Title>{modalMode === 'user-view' ? 'Your Order' : 'View and Manage Order'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-2">
                    <Form.Label>Order# {selectedOrder.orderId}</Form.Label>
                </Form.Group>
                {isAdmin && <Form.Group className="mb-2">
                    <Form.Label>Ordered by {selectedOrder.customer}</Form.Label>
                </Form.Group>}
                <Form.Group>
                    <Form.Label>Items: {selectedOrder.items}</Form.Label>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Price: {selectedOrder.amount}</Form.Label>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Payment Method: {selectedOrder.paymentMethod}</Form.Label>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Status: {selectedOrder.status}</Form.Label>
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Order Status</Form.Label>
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleHideModal}>Close</Button>
                <Button variant="danger" className="me-2" onClick={handleCancelOrder}>Cancel Order</Button>
                {isAdmin && 
                    <>
                        <Button variant="light" onClick={updateOrderStatusByAdmin} value={"processing"}>✅ Mark as Processing</Button>
                        <Button variant="primary" onClick={updateOrderStatusByAdmin} value={"shipped"}>📦 Mark as Shipped</Button>
                        <Button variant="success" onClick={updateOrderStatusByAdmin} value={"delivered"}>📬 Mark as Delivered</Button>
                        <Button variant="info" onClick={() => {
                            handleHideModal();
                            setTimeout(() => navigate("/order/payment/details"), 1000);
                        }}>📜 View Payment Details</Button>
                    </>             
                }
                
            </Modal.Footer>
        </Modal>
    );
}