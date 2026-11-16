import { Button, ListGroup, Modal } from "react-bootstrap";

function ProductSelectModal({
    showModal,
    onHideModal,
    products = [],
    handleSelectProduct
}) {
    return (
        <Modal show={showModal} onHide={onHideModal} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Select a Product to Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {products.length === 0 ? (
                    <p className="text-muted mb-0">No products are available to review.</p>
                ) : (
                    <ListGroup>
                        {products.map((product, index) => (
                            <ListGroup.Item
                                key={`${product.productExternalId}-${index}`}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <span>{product.productName}</span>
                                <Button
                                    variant="outline-primary"
                                    onClick={() => handleSelectProduct(product.productExternalId)}
                                >
                                    Select
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHideModal}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProductSelectModal;
