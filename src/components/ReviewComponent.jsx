import { Button, Card, Col, Container, Row } from "react-bootstrap";
import ReviewModalComponent from "./modal/ReviewModalComponent";
import DeleteModalComponent from "./modal/DeleteModalComponent";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../security/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apicall_deleteReviewByExternalId, apicall_retrieveReviewByExternalId, apicall_updateReview, retrieveErrorMessage, retrieveMessage } from "../api/ApiCall";
import ToastComponent from "./ToastComponent";

function ReviewComponent() {

    const { isAdmin, isAuthenticated, userExternalId } = useContext(AuthContext);

    const navigate = useNavigate();

    const [isFetchRequired, setIsFetchRequired] = useState(true);

    const [message, setMessage] = useState(null);

    const { reviewExternalId } = useParams();

    useEffect(() => {
          if(!isAuthenticated){
              navigate('/login');
          } else {
                if(isFetchRequired) {
                    setIsFetchRequired(false);
                    retrieveReviewByExternalId();
                }
          }
      });

    const [productReview, setProductReview] = useState({});

    //const [selectedReviewExternalId, setSelectedReviewExternalId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("");
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const handleHideModal = () => {
        setShowModal(false);
        //setProductReview({});
        setModalMode("")
    };

    const openReviewModalForEdit = () => {
        setModalMode("edit");
        setShowModal(true);
        setProductReview(productReview);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductReview((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    // const handleReview = () => {
    //     apicall_updateReview();
        
    // }

    const retrieveReviewByExternalId = async () => {
        try{
            const response = await apicall_retrieveReviewByExternalId(reviewExternalId);
            console.log(response);
            if(response.data.success) {
                setProductReview(response.data.responseData);
            } else {
                setToastType("danger");
                setShowToast(true);
                setToastMessage(retrieveMessage(response));
            } 
           
        }catch(error) {
            setToastMessage(retrieveErrorMessage(error));
            setShowToast(true);
            setToastType("danger");
        }   
    }

    const editReview = async () => {
        try{
            const reviewDTO = {
                userExternalId,
                productExternalId: productReview.productExternalId,
                rating: productReview.rating,
                comment: productReview.comment
            };
            const response = await apicall_updateReview(reviewExternalId, reviewDTO);
            if(response.data.success) {
                setToastType("success");
            } else {
                setToastType("danger")
            }
            setShowToast(true)
            setToastMessage(retrieveMessage(response));
            setShowModal(false);
            setModalMode("");
            setIsFetchRequired(true);
        }catch(error) {
            setMessage(error?.code === "ERR_NETWORK" ? error?.message : error?.response?.data?.message);
            setIsFetchRequired(false);
        }
    }

    const handleDelete = () => {
        setDeleteModalShow(true);
    }

    const deleteReviewById = async () => {
        try{
            const response = await apicall_deleteReviewByExternalId(reviewExternalId);
            if(response.data.success) {
                setDeleteModalShow(false);
                setProductReview({});
                navigate(-1);
            } else {
                setToastType("danger");
                setToastMessage(retrieveMessage(response));
                setShowToast(true);
            }
        }catch(error) {
            setMessage(retrieveErrorMessage(error));
            setIsFetchRequired(false);
        }
    }
    

    return (
        <Container className="my-4">

            <Card className="mt-4">
               <Card.Body>
                    <Row>
                        <Col md={8}>
                        <h5>
                            Product:{" "}
                            <Card.Header>{productReview.productName}</Card.Header>
                        </h5>

                        {isAdmin && (<p><strong>Reviewed By:</strong> {productReview.customerName}</p>)}

                        <p>
                            <strong>Reviewed At:</strong> {productReview.reviewedAt}
                        </p>

                        <p>
                            <strong>Review:</strong>{" "}
                            <span className="d-block text-wrap">{productReview.comment}</span>
                        </p>

                        {!isAdmin && (
                            <div className="mt-3 d-flex gap-2">
                                <Button variant="warning"onClick={() => openReviewModalForEdit()}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete()}>Delete</Button>
                            </div>
                        )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <ReviewModalComponent 
                isAdmin = {isAdmin}
                showModal = {showModal}
                modalMode = {modalMode}
                selectedReview = {productReview}
                handleChange = {handleChange}
                handleCloseModal = {handleHideModal}
                handleSave = {editReview}
            />

            <DeleteModalComponent 
                deleteModalShow={deleteModalShow}
                confirmDeleteMessage={"Are you sure you want to delete this review?"} 
                handleHideDeleteModal={() => setDeleteModalShow(false)} 
                deleteEntity={deleteReviewById}
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
}

export default ReviewComponent;