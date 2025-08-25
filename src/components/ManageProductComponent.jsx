import { useContext, useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../security/AuthContext';
import DeleteModalComponent from './modal/DeleteModalComponent';
import ProductModalComponent from './modal/ProductModalComponent';
import { apicall_addProductDetails, apicall_deleteProduct, apicall_retrieveAllProducts, apicall_updateProductDetails, retrieveErrorMessage, retrieveMessage } from '../api/ApiCall';
import MessageComponent from './MessageComponent';

const ManageProductComponent = () => {

  const navigate = useNavigate();

  const { isAuthenticated } = useContext(AuthContext);

  const [products, setProducts] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState({ productName: '', description: '', price: '', stock: '' });

  const [productExternalId, setProductExternalId] = useState(-1);

  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const [isFetchRequired, setIsFetchRequired] = useState(true);

  const [message, setMessage] = useState(null);

  const productRequestDTO = {};

   useEffect(() => {
      if(!isAuthenticated){
          navigate('/login');
      } else {
        if(isFetchRequired){
          retrieveAllProducts();
        }
      }
  }, [isFetchRequired]);


  const retrieveAllProducts = async () => {
    try{
      const response = await apicall_retrieveAllProducts();

       if(response.data.success) {
            setProducts(response.data.responseData);
            setMessage(null);
        } else {
            setProducts([]);
            setMessage(retrieveMessage(response));
        }
    }catch(error) {
        setMessage(retrieveErrorMessage(error));
    } finally {
      setIsFetchRequired(false);
    }
  }

  const handleOpenModal = (mode, product = null) => {
    setModalMode(mode);
    setSelectedProduct(product || { productName: '', description: '', price: '', stock: '' });
    setProductExternalId(product?.productExternalId || null);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prev) => ({
    ...prev,
    [name]: value,
    }));
  };

  const createProductRequestDTO = () => {
    productRequestDTO.productName = selectedProduct.productName;
    productRequestDTO.description = selectedProduct.description;
    productRequestDTO.price =  selectedProduct.price;
    productRequestDTO.stock =  selectedProduct.stock;
    productRequestDTO.discountPercentage =  0;
  }

  const handleSave = async () => {
    try {
      createProductRequestDTO();
      let response;
      if (modalMode === 'add') {
        response = await apicall_addProductDetails(productRequestDTO);
      } else {
        response = await apicall_updateProductDetails(productExternalId, productRequestDTO);
      }
      if(!response?.data?.success){
        setMessage(retrieveMessage(response));
      }
    }catch(error) {
      setMessage(retrieveErrorMessage(error));
    } finally {
      handleCloseModal();
      setIsFetchRequired(true);
    }
  };

  const handleDelete = (id) => {
    setDeleteModalShow(true);
    setProductExternalId(id);
  };

  const deleteProduct = async () => {
    try {
      const response = await apicall_deleteProduct(productExternalId);

      if(!response.data.success){
        //setMessage(retrieveMessage(response));
      }

    }catch(error) {
      setMessage(retrieveErrorMessage(error));
    } finally {
      handleHideDeleteModal();
      setProductExternalId(-1);
      setDeleteModalShow(false);
      setIsFetchRequired(true);
    }
  }

  const handleHideDeleteModal = () => {
    setDeleteModalShow(false);
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Manage Products</h3>
        <Button variant="success" onClick={() => handleOpenModal('add')}><i className="bi bi-plus-lg me-1"></i>Add Product</Button>
      </div>

      {message !== null && <MessageComponent message={message} />}

      <Row>
        {products.length === 0 ? (
          <Col className="text-center text-muted py-5">No products found.</Col>
        ) : (
          products.map((product) => (
            <Col key={product.productExternalId} md={6} lg={4} className="mb-4">
              <Card className="shadow-sm h-100 border-0">
                <Card.Body>
                  <Card.Title className="mb-2 text-success fw-bold">{product.productName}</Card.Title>
                  <Card.Text className="mb-1 text-secondary">{product.description}</Card.Text>
                  <div className="mb-2">
                    <span className="badge bg-info me-2">${product.price}</span>
                    <span className="badge bg-warning text-dark">Stock: {product.stock}</span>
                  </div>
                  <Button variant="outline-warning" className="me-2" onClick={() => handleOpenModal('edit', product)}><i className="bi bi-pencil-square me-1"></i>Edit</Button>
                  <Button variant="outline-danger" onClick={() => handleDelete(product.productExternalId)}><i className="bi bi-trash me-1"></i>Delete</Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <DeleteModalComponent 
        deleteModalShow={deleteModalShow}
        confirmDeleteMessage={"Are you sure you want to delete this product?"} 
        handleHideDeleteModal={handleHideDeleteModal} 
        deleteEntity={deleteProduct}
      />

      <ProductModalComponent 
        modalMode = {modalMode}
        showModal = {showModal}
        selectedProduct =  {selectedProduct}
        handleCloseModal = {handleCloseModal}
        handleSave = {handleSave}
        handleChange = {handleChange} 
      />

    </Container>
  );
};

export default ManageProductComponent;
