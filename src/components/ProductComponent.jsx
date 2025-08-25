import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Image, Button, Form, Card } from "react-bootstrap";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import ProductModalComponent from "./modal/ProductModalComponent";
import { apicall_addProductToCart, apicall_retrieveProductByProductId, apicall_updateProductDetails } from "../api/ApiCall";

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

  //const [isProductUpdated, setIsProductUpdated] = useState(false);

  useEffect(() => {
      if(!isAuthenticated){
          navigate('/login');
      } else {
          if(!showModal) {
            retrieveProductByExternalId();
          }
      }
  }, [showModal]);

  const retrieveProductByExternalId = () => {
    const productPromise = apicall_retrieveProductByProductId(productExternalId);
    productPromise.then((response) => {
      if(response.data.responseData === null) {}
      setProduct(response.data.responseData);
    })
  }

  const handleAddToCart = async () => {
    try {
      const productQuantityDto = { productExternalId, quantity }
      const result = await apicall_addProductToCart(userExternalId, productQuantityDto);

      if(result.data.responseData === null || result.data.responseData === undefined) {
        return;
      }

      navigate('/user/cart');

    } catch (error) {
      console.log(error);
    }
  };

  const handleBuyNow = () => {
    setTimeout(() => {
      navigate(`/user/product/${productExternalId}/checkout`);
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

  const handleSaveForUpdateProduct = () => {
    setShowModal(false);
    createProductRequestDTO();
    const productPromise = apicall_updateProductDetails(productExternalId, productRequestDTO);
    productPromise.then((response) => {
      if(response.data.responseData === null) {}
      setProduct(response.data.responseData);
    }).catch(err => {
      console.log(err);
    })
  }

  const handleCloseForUpdateProduct = () => {
     setShowModal(false);
     retrieveProductByExternalId();
  }

  const handleDeleteProduct = () => {

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

      <Row>
        <Col md={5}>
          {/* <Image src={product.imageUrl} fluid rounded /> */}
          <Image src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' fluid rounded />
        </Col>

        <Col md={7}>
          <Card className="p-3">
            <Card.Body>
              <Card.Title as="h4">{product.productName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
              <Card.Text>
                <span className="fs-4 text-success fw-bold">{product.price}</span>
              </Card.Text>
              <Card.Text>{product.description}</Card.Text>

              <Form.Group as={Row} className="my-3" controlId="quantitySelect">
                <Form.Label column sm={3}>
                  Quantity:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control type="number" min={1} max={product.stock} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}></Form.Control>
                </Col>
              </Form.Group>

              <div className="d-flex gap-3 justify-content-center">
                {!isAdmin && 
                <>
                  <Button variant="warning" size="lg" onClick={handleAddToCart}>Add to Cart</Button>
                  <Button variant="danger" size="lg" onClick={handleBuyNow}>Buy Now</Button>
                </>
                }
                {isAdmin && 
                  <>
                  <Button variant="warning" size="lg" onClick={handleEditProduct}>Edit Product</Button>
                  <Button variant="danger" size="lg" onClick={handleDeleteProduct}>Delete Product</Button>
                  </>
                }
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ProductModalComponent 
            modalMode = {"edit"}
            showModal = {showModal}
            selectedProduct =  {product}
            handleCloseModal = {handleCloseForUpdateProduct} //function to close the modal
            handleSave = {handleSaveForUpdateProduct} //function to save the edited/added product
            handleChange = {handleChange} //function to change the selectedProduct attributes
         />

    </Container>
  );
};

export default ProductComponent;
