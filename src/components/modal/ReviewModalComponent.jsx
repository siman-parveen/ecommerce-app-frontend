import { Button, Form, Modal } from "react-bootstrap";
import { FaRegStar, FaStar } from "react-icons/fa";
import Rating from "react-rating";

function ReviewModalComponent({isAdmin=false, showModal, modalMode, selectedReview, handleChange=null, handleCloseModal, handleSave}) {

     /*
    Example of usage:
        <ReviewModalComponent 
            isAdmin = {isAdmin}
            showModal = {showModal}
            modalMode = {modalMode}
            selectedReview =  {selectedReview}
            handleChange = {handleChange} //function to change the selectedReview attributes
            handleCloseModal = {handleCloseModal} //function to close the modal
            handleSave = {handleSave} //function to save the edited/added review
        />
    */

    return (
        <Modal show={showModal}>
            <Modal.Header closeButton>
                <Modal.Title>{modalMode === 'add' ? 'Add Review' : modalMode === 'edit' ? 'Edit Review' : 'View Review'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-2">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control type="text" name="productName" value={selectedReview.productName} disabled={true} />
                </Form.Group>
                {modalMode === 'view' && <Form.Group className="mb-2">
                    <Form.Label>Reviewed by</Form.Label>
                    <Form.Control type="text" name="customerName" value={selectedReview.customerName} disabled={true} />
                </Form.Group>}
                <Form.Group className="mb-2">
                    <Form.Label>Ratings</Form.Label>
                    <div>
                        <Rating name="rating" emptySymbol={<FaRegStar color="gray" size={20} />} fullSymbol={<FaStar color="gold" size={20} />} initialRating={0}  onChange={handleChange} value={selectedReview.rating}/>
                    </div>
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Review</Form.Label>
                    {modalMode === 'view' && <Form.Label>{selectedReview.comment}</Form.Label>}
                    {modalMode !== 'view' && <Form.Control as="textarea" name="comment" rows={10} placeholder="Write your review here..." value={selectedReview.comment} disabled={false} onChange={handleChange} required /> }
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                {!isAdmin && <Button variant="primary" onClick={handleSave}>{modalMode === 'add' ? 'Add' : 'Update'}</Button>}
            </Modal.Footer>
        </Modal>
    )

}

export default ReviewModalComponent;