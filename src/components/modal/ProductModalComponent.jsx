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
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
            <Modal.Title>{modalMode === 'add' ? 'Add Product' : 'Edit Product'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control name="productName" value={selectedProduct.productName} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" value={selectedProduct.description} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                <Form.Label>Price</Form.Label>
                <Form.Control type="text" name="price" value={selectedProduct.price} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" name="stock" value={selectedProduct.stock} onChange={handleChange} />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>{modalMode === 'add' ? 'Add' : 'Update'}</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProductModalComponent;