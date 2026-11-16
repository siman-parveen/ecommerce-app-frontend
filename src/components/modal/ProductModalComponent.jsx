import { Button, Form, Modal } from "react-bootstrap";

function ProductModalComponent({modalMode, showModal, selectedProduct, handleCloseModal, handleSave, handleChange}) {

    /*
    Example of usage:
        <ProductModalComponent 
            modalMode = {modalMode}
            showModal = {showModal}
            selectedProduct =  {selectedProduct}
            handleCloseModal = {handleCloseModal} //function to close the modal
            handleSave = {handleSave} //function to save the edited/added product
            handleChange = {handleChange} //function to change the selectedProduct attributes
         />
    */

    return(
        <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton className="bg-success text-white">
                <Modal.Title>{modalMode === 'add' ? 'Add Product' : 'Edit Product'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control name="productName" value={selectedProduct.productName} onChange={handleChange} placeholder="Enter product name" required autoFocus />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description" value={selectedProduct.description} onChange={handleChange} placeholder="Enter product description" required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" min="0" step="0.01" name="price" value={selectedProduct.price} onChange={handleChange} placeholder="Enter price" required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control type="number" min="0" name="stock" value={selectedProduct.stock} onChange={handleChange} placeholder="Enter stock quantity" required />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleCloseModal}>Cancel</Button>
                <Button variant="success" onClick={handleSave}>{modalMode === 'add' ? 'Add Product' : 'Update Product'}</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProductModalComponent;