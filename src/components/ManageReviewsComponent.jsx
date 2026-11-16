import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Pagination } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import ReviewModalComponent from "./modal/ReviewModalComponent";
import { apicall_addReview, apicall_retrieveAllReviewGivenByUser, apicall_retrieveAllReviews, apicall_retrieveProductsBroughtByUser, apicall_retrieveReviewsGivenToTheProduct, retrieveErrorMessage, retrieveMessage } from "../api/ApiCall";
import MessageComponent from "./MessageComponent";
import ToastComponent from "./ToastComponent";
import ProductSelectModal from "./ProductSelectModal";

function ManageReviewsComponent() {

    const navigate = useNavigate();

    const { userExternalId, isAdmin, isAuthenticated } = useContext(AuthContext);

    const [isFetchRequired, setIsFetchRequired] = useState(true);

    const { productExternalId } = useParams();

    const [productsBroughtByUser, setProductsBroughtByUser] = useState([]);

    const [message, setMessage] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const reviewDTO = {userExternalId: "", productExternalId: "", productName: "", customerName: "", rating: 0, comment: "" };

    const [productReviews, setProductReviews] = useState([]);

    const [productReview, setProductReview] = useState(reviewDTO);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('');
    const [selectProductToReviewModal, setSelectProductToReviewModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 6;

    const indexOfLastProduct = currentPage * reviewsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - reviewsPerPage;
    const currentReviews = productReviews.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(productReviews.length / reviewsPerPage);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            if (isFetchRequired) {
                setIsFetchRequired(false);
                retrieveReviews();
            } 
        }
    }, [isFetchRequired, isAuthenticated]);

    const retrieveReviews = async () => {
        try {
            let response;
            if(productExternalId !== null && productExternalId !== undefined){
                response = await apicall_retrieveReviewsGivenToTheProduct(productExternalId);
            }
            else if(isAdmin) {
                response = await apicall_retrieveAllReviews();
            } else {
                response = await apicall_retrieveAllReviewGivenByUser(userExternalId);
            }   

            if(response.data.success) {
                setProductReviews(response.data.responseData);
                setMessage(null);
            } else {
                setProductReviews([]);
                setMessage(retrieveMessage(response))
            }
            console.log(response);
        }catch(error) {
            setMessage(retrieveErrorMessage(error));
        }
    }

    const addReview = async () => {
        try{
            setShowModal(false);
            //console.log(productReview);
            const response = await apicall_addReview(productReview);
            if(response.data.success) {
                setToastType("success");
            }else{
                setToastType("danger");
            }
            setToastMessage(retrieveMessage(response));
            setShowToast(true);
            setModalMode("");
            setIsFetchRequired(true);
        }catch(error) {
            setToastMessage(retrieveErrorMessage(error));
            setToastType("danger");
            setShowToast(true);
            //setIsFetchRequired(false);
        }
    }

    const handleHideModal = () => {
        setShowModal(false);
        setProductReview(reviewDTO);
        setModalMode("")
    };

    const handleOpenModalForAddReview = async () => {
        try {
            const response = await apicall_retrieveProductsBroughtByUser(userExternalId);
            if(response.data.success) {
                const productsToReview = response.data.responseData;
                productsToReview.map(
                    async (productToReview) => {
                        if(!productToReview.ratingExternalId) {
                            setProductsBroughtByUser((prevReviews) => [...prevReviews, productToReview]);
                        }
                    })
                setSelectProductToReviewModal(true);
            } else {
                setToastMessage(retrieveMessage(response));   
                setToastType("danger");
                setShowToast(true);
            }
        } catch(error) {
            setToastMessage(retrieveErrorMessage(error));   
            setToastType("danger");
            setShowToast(true);
        }
        
    };

    const handleChange = (e) => {
        if(typeof(e) === 'number') {
            setProductReview((prev) => ({
                ...prev,
                rating: e 
            }));
            return;
        }
        const { name, value } = e.target;
        setProductReview((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    
    const viewAndManageReview = (reviewExternalId) => {
        setTimeout(() =>{
            navigate(`/user/reviews/${reviewExternalId}`);
        }, 1000);
    }

    const viewReview = (reviewExternalId) => {
        setTimeout(() =>{
            navigate(`/admin/manage/reviews/${reviewExternalId}`);
        }, 1000);
    }

    return (
        <>
            <ToastComponent isShow={showToast} toastType={toastType} message={toastMessage} onToastClose={() => setShowToast(false)} />
            <Container className="my-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold">Manage Reviews</h3>
                    {!isAdmin && <Button variant="success" onClick={handleOpenModalForAddReview}><i className="bi bi-plus-lg me-1"></i>Add Review</Button>}
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
                    {currentReviews.length === 0 ? (
                        <Col className="text-center text-muted py-5">No reviews found.</Col>
                    ) : (
                        currentReviews.map(review => (
                            <Col md={6} lg={4} className="mb-4" key={review.reviewExternalId}>
                                <Card className="shadow-sm h-100 border-0">
                                    <Card.Header className="bg-light fw-bold text-success">{review.productName}</Card.Header>
                                    <Card.Body>
                                        {isAdmin && <Card.Text className="mb-1 text-secondary">Reviewed by: <span className="fw-semibold">{review.customerName}</span></Card.Text>}
                                        <Card.Text className="mb-1">Reviewed at: <span className="fw-light">{review.reviewedAt}</span></Card.Text>
                                        <Card.Text className="mb-2">Rating: <span className="badge bg-info">{review.rating}</span></Card.Text>
                                        {!isAdmin && <Button variant="outline-primary" className="me-2" onClick={() => viewAndManageReview(review.reviewExternalId)}><i className="bi bi-eye me-1"></i>View & Manage</Button>}
                                        {isAdmin && <Button variant="outline-warning" className="me-2" onClick={() => viewReview(review.reviewExternalId)}><i className="bi bi-eye me-1"></i>View</Button>}
                                    </Card.Body>
                                </Card>
                            </Col>
                        )))
                    }
                </Row>

                <ReviewModalComponent 
                    isAdmin = {isAdmin}
                    showModal = {showModal}
                    modalMode = {modalMode}
                    selectedReview = {productReview}
                    handleChange = {handleChange}
                    handleCloseModal = {handleHideModal}
                    handleSave = {addReview}
                />


                <ProductSelectModal 
                    showModal={selectProductToReviewModal} 
                    onHideModal={() => setSelectProductToReviewModal(false)} 
                    products={productsBroughtByUser}
                    handleSelectProduct={(selectedProductId) => {
                        console.log("handleSelectProduct");
                        const selectedProduct = productsBroughtByUser.find(product => product.productExternalId === selectedProductId);
                        if (selectedProduct) {
                            console.log("selected product: " + selectedProductId)
                            setProductReview({
                                ...productReview, 
                                productExternalId: selectedProduct.productExternalId,
                                productName: selectedProduct.productName,
                                userExternalId: userExternalId
                            });
                            setSelectProductToReviewModal(false);
                            setModalMode("add");
                            setShowModal(true);
                        }
                    }}
                />
            </Container>
        </>
    );
}

export default ManageReviewsComponent;
