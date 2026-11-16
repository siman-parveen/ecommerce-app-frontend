import { Button, Form, Modal } from "react-bootstrap";

function OrderModalComponent({isAdmin=false, showModal, modalMode, selectedOrder, handleHideModal, handleCancelOrder, updateOrderStatusByAdmin=null}) {
    return (
        <Modal show={showModal} centered>
            <Modal.Header closeButton className="bg-success text-white">
                <Modal.Title>{modalMode === 'user-view' ? 'Your Order' : 'View and Manage Order'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Order# <span className="text-primary">{selectedOrder.orderId}</span></Form.Label>
                    </Form.Group>
                    {isAdmin && <Form.Group className="mb-3">
                        <Form.Label>Ordered by <span className="fw-semibold text-success">{selectedOrder.customer}</span></Form.Label>
                    </Form.Group>}
                    <Form.Group className="mb-2">
                        <Form.Label>Items</Form.Label>
                        <Form.Control type="text" value={selectedOrder.items} disabled />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" value={selectedOrder.amount} disabled />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Payment Method</Form.Label>
                        <Form.Control type="text" value={selectedOrder.paymentMethod} disabled />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Status</Form.Label>
                        <span className={`badge ${selectedOrder.status === 'Delivered' ? 'bg-success' : 'bg-warning text-dark'}`}>{selectedOrder.status}</span>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="outline-secondary" onClick={handleHideModal}>Close</Button>
                <Button variant="outline-danger" className="me-2" onClick={handleCancelOrder}>Cancel Order</Button>
                {isAdmin && (
                    <>
                        <Button variant="outline-info" onClick={updateOrderStatusByAdmin} value={"processing"}>Mark as Processing</Button>
                        <Button variant="outline-primary" onClick={updateOrderStatusByAdmin} value={"shipped"}>Mark as Shipped</Button>
                        <Button variant="outline-success" onClick={updateOrderStatusByAdmin} value={"delivered"}>Mark as Delivered</Button>
                        <Button variant="info" onClick={() => {
                            handleHideModal();
                            setTimeout(() => navigate("/order/payment/details"), 1000);
                        }}>View Payment Details</Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    );
}