import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Image, Button, Form, Card } from "react-bootstrap";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import ProductModalComponent from "./modal/ProductModalComponent";
import { apicall_addProductToCart, apicall_deleteProduct, apicall_retrieveProductByProductId, apicall_updateProductDetails, retrieveErrorMessage, retrieveMessage } from "../api/ApiCall";
import ToastComponent from "./ToastComponent";
import DeleteModalComponent from "./modal/DeleteModalComponent";

const ProductComponent = () => {

  const navigate = useNavigate();

  const { userExternalId, isAdmin, isAuthenticated } = useContext(AuthContext);

  const [product, setProduct] = useState({});

  const productRequestDTO = {
    productName: "", 
    description: "",
    stock: 0, 
    price: 0.01,
    discountPercentage: 0 
  };

  const { productExternalId } = useParams();

  const [quantity, setQuantity] = useState(1);

  const [showModal, setShowModal] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const [isFetchRequired, setIsFetchRequired] = useState(true);

  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const [isAnyButtonClicked, setIsAnyButtonClicked] = useState(false);

  useEffect(() => {
      if(!isAuthenticated){
          navigate('/login');
      } else {
          if(isFetchRequired) {
            setIsFetchRequired(false);
            retrieveProductByExternalId();
          }
      }
  }, [isFetchRequired]);

  const retrieveProductByExternalId = () => {
    const productPromise = apicall_retrieveProductByProductId(productExternalId);
    productPromise.then((response) => {
      if(response.data.success) {
        setProduct(response.data.responseData);
        setToastType("success");
      } else {
        setToastType("danger");
      }
      setToastMessage(retrieveMessage(response));
      setShowToast(true);
    }).catch((error) => {
      setToastMessage(retrieveErrorMessage(error));
      setShowToast(true);
      setToastType("danger");
    });
  }

  const handleAddToCart = async () => {
    setIsAnyButtonClicked(true);
    try {
      const productQuantityDto = { productExternalId, quantity }
      const result = await apicall_addProductToCart(userExternalId, productQuantityDto);
      setToastMessage(retrieveMessage(result));
      setShowToast(true);
      if(!result.data.success) {  
        setToastType("danger");
        return;
      }
      setToastType("success");
      navigate('/user/cart');
    } catch (error) {
      setToastMessage(retrieveErrorMessage(error));
      setShowToast(true);
      setToastType("danger");
    } finally {
      setIsAnyButtonClicked(false);
    }
  };

  const handleBuyNow = () => {
    setTimeout(() => {
      navigate(`/user/product/${productExternalId}/checkout`, { state : { quantity }});
    }, 1000)
  };

  const handleEditProduct = () => {
    setShowModal(true);
  }

  const createProductRequestDTO = () => {
    productRequestDTO.productName = product.productName;
    productRequestDTO.description = product.description;
    productRequestDTO.price =  product.price;
    productRequestDTO.stock =  product.stock;
    productRequestDTO.discountPercentage =  0;
  }

  const handleSaveForUpdateProduct = async () => {
    try {
      setShowModal(false);
      createProductRequestDTO();
      const response = await apicall_updateProductDetails(productExternalId, productRequestDTO);
      
      if(response.data.success) {
        setProduct(response.data.responseData);
        setToastType("success");
      }else{
        setToastType("danger");
      }
      setShowToast(true);
      setToastMessage(retrieveMessage(response));
    }catch(error) {
      setToastMessage(retrieveErrorMessage(error));
      setShowToast(true);
      setToastType("danger");
    }
  }

  const handleCloseForUpdateProduct = () => {
     setShowModal(false);
     retrieveProductByExternalId();
  }

  const handleDeleteProduct = () => {
    setDeleteModalShow(true);
  }

  const handleHideDeleteModal = async () => {
    setDeleteModalShow(false);
    try {
      const response = await apicall_deleteProduct(productExternalId);
      
      if(response.data.success) {
        setProduct(response.data.responseData);
        setToastType("success");
      }else{
        setToastType("danger");
      }
      setShowToast(true);
      setToastMessage(retrieveMessage(response) + ".. Please wait for few seconds..");
      setTimeout(() => {
        navigate(-1);
      }, 3000); 

    }catch(error) {
      setToastMessage(retrieveErrorMessage(error));
      setShowToast(true);
      setToastType("danger");
    }
    
  }

  const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
        ...prev,
        [name]: value,
        }));
    };



  return (
      <Container className="my-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white text-center">
                <h4 className="mb-0">Product Details</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={5} className="d-flex align-items-center justify-content-center">
                    <Image src={product.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'} fluid rounded style={{maxHeight: '300px'}} />
                  </Col>
                  <Col md={7}>
                    <div className="mb-2">
                      <span className="fw-bold fs-5 text-success">{product.productName}</span>
                    </div>
                    <div className="mb-2">
                      <span className="badge bg-info me-2">${product.price}</span>
                      <span className="badge bg-warning text-dark">Stock: {product.stock}</span>
                    </div>
                    <div className="mb-3 text-secondary">{product.description}</div>
                    {!isAdmin && (
                      <Form.Group as={Row} className="my-3" controlId="quantitySelect">
                        <Form.Label column sm={4} className="fw-semibold">Quantity:</Form.Label>
                        <Col sm={6}>
                          <Form.Control type="number" min={1} max={product.stock} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                        </Col>
                      </Form.Group>
                    )}
                    <div className="d-flex gap-3 justify-content-center mt-4">
                      {!isAdmin && (
                        <>
                          <Button variant="outline-warning" size="lg" onClick={handleAddToCart} disabled={product.stock === 0 || isAnyButtonClicked === true}><i className="bi bi-cart-plus me-1"></i>Add to Cart</Button>
                          <Button variant="outline-danger" size="lg" onClick={handleBuyNow} disabled={product.stock === 0 || isAnyButtonClicked === true}><i className="bi bi-lightning me-1"></i>Buy Now</Button>
                        </>
                      )}
                      {isAdmin && (
                        <>
                          <Button variant="outline-warning" size="lg" onClick={handleEditProduct} disabled={isAnyButtonClicked === true}><i className="bi bi-pencil-square me-1"></i>Edit Product</Button>
                          <Button variant="outline-danger" size="lg" onClick={handleDeleteProduct} disabled={isAnyButtonClicked === true}><i className="bi bi-trash me-1"></i>Delete Product</Button>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <ProductModalComponent
          modalMode={"edit"}
          showModal={showModal}
          selectedProduct={product}
          handleCloseModal={handleCloseForUpdateProduct}
          handleSave={handleSaveForUpdateProduct}
          handleChange={handleChange}
        />

        <ToastComponent isShow={showToast} toastType={toastType} message={toastMessage} onToastClose={() => setShowToast(false)} />

        <DeleteModalComponent deleteModalShow={deleteModalShow} confirmDeleteMessage={"Are you sure you want to delete this product?"} handleHideDeleteModal={handleHideDeleteModal} deleteEntity={product}
      />

      </Container>
  );
};

export default ProductComponent;
