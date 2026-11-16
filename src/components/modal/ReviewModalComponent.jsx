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
        <Modal show={showModal} centered>
            <Modal.Header closeButton className="bg-success text-white">
                <Modal.Title>{modalMode === 'add' ? 'Add Review' : modalMode === 'edit' ? 'Edit Review' : 'View Review'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" name="productName" value={selectedReview.productName} disabled />
                    </Form.Group>
                    {modalMode === 'view' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Reviewed by</Form.Label>
                            <Form.Control type="text" name="customerName" value={selectedReview.customerName} disabled />
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>Ratings</Form.Label>
                        <div>
                            <Rating name="rating" emptySymbol={<FaRegStar color="gray" size={24} />} fullSymbol={<FaStar color="gold" size={24} />} initialRating={selectedReview.rating} onChange={(e) => handleChange(e)} readonly={modalMode === 'view'} />
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Review</Form.Label>
                        {modalMode === 'view' ? (
                            <Form.Control as="textarea" rows={6} value={selectedReview.comment} disabled />
                        ) : (
                            <Form.Control as="textarea" name="comment" rows={6} placeholder="Write your review here..." value={selectedReview.comment} onChange={(e) => handleChange(e)} required />
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="outline-secondary" onClick={handleCloseModal}>Cancel</Button>
                {!isAdmin && modalMode !== 'view' && (
                    <Button variant="success" onClick={handleSave}>{modalMode === 'add' ? 'Add Review' : 'Update Review'}</Button>
                )}
            </Modal.Footer>
        </Modal>
    );

}

export default ReviewModalComponent;