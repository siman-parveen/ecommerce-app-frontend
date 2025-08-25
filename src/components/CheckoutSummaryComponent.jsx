import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup, Form, InputGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import ToastComponent from "./ToastComponent";
import { apicall_addQuantityForCartItem, apicall_addUserAddress, apicall_cancelOrder, apicall_createOrder, apicall_makePaymentForOrder, apicall_removeProductFromCart, apicall_removeQuantityForCartItem, apicall_retrieveAddressForUser, apicall_updateUserAddress, retrieveErrorMessage, retrieveMessage, showErrorMessage } from "../api/ApiCall";

function CheckoutSummaryComponent() {

  const navigate = useNavigate();

  const location = useLocation();
  const initialCartItems = location.state?.selectedItems || [];

  const { isAdmin, userExternalId, isAuthenticated } = useContext(AuthContext);  
  const [isCheckOut, setIsCheckOut] = useState(false);

  const [isFetchRequired, setIsFetchRequired] = useState(true);

  const [addresses, setAddresses] = useState([]);

  const [cartItems, setCartItems] = useState(initialCartItems);
  const [address, setAddress] = useState(null);
  
  useEffect(() => {
      if(!isAuthenticated){
        navigate('/login');
      } else {
        if(isAdmin){
          if(window.history.length > 1) {
            navigate(-1);
          } else {
            navigate('/');
          }
        } else {
          if(isFetchRequired)  {
            if(cartItems.length > 0) {
              retrieveAddressForUser();
            }else{
              navigate('/user/cart');
            }
          }
        } 
      }
  }, [isFetchRequired]);

  useEffect(() => {
    if(isCheckOut === true) {
      navigate(`/user/orders/₹{orderExternalId}`);
    }
  },  [isCheckOut])

  const [isAddOrEditAddress, setIsAddOrEditAddress] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [toastType, setToastType] = useState("");

  //const orderExternalId = "78468544";

  const [addressMode, setAddressMode] = useState(null);

  const initialAddress = {
    userName: "",
    addressName: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phoneNumber: ""
  };

  const retrieveAddressForUser = async () => {
    try{
      const result = await apicall_retrieveAddressForUser(userExternalId);
      if(result.data.success) {
        const fetchedAddresses = result.data.responseData;
        setAddresses(fetchedAddresses);
        setAddress(fetchedAddresses[0]);
      } else {
        setShowToast(true);
        setToastType("danger");
        setToastMessage(retrieveMessage(result));
      }
      setIsFetchRequired(false);
    }catch(error) {
      setShowToast(true);
      setToastType("danger");
      setToastMessage(retrieveErrorMessage(error));
      setIsFetchRequired(false);
    }
  }

  const handleSelect = (addr) => {
    setAddress(addr);
  }

  const updateItemQuantity = (index, quantity) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = Number(quantity);
    setCartItems(updatedItems);
    setIsFetchRequired(true);
  };

  // const updateQuantity = async (cartItemExternalId, mode) => {
  //   try {
  //     if(mode === "remove") {
  //       await apicall_removeQuantityForCartItem(cartItemExternalId, {"quantity" : 1});
  //     } else if (mode === "add") {
  //       await apicall_addQuantityForCartItem(cartItemExternalId, {"quantity" : 1});
  //     }
  //     setIsFetchRequired(true);
  //   } catch(error) {
  //     ///setMessage(retrieveErrorMessage(error));
  //     setIsFetchRequired(false);
  //   }

  // };

  const removeItem = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
  };

  const handleAddOrEditAddress = (mode) => {
    setIsAddOrEditAddress(true);
    setAddressMode(mode);
    if(mode === "add") {
      setAddress(initialAddress);
    }
  }

  const handleAddOrEditAddressSave = async () => {
      try{
        const addressDto = address;
        addressDto.userExternalId = userExternalId;
        if(addressMode === "add") {
          await apicall_addUserAddress(addressDto);
        } else if (addressMode === "edit") {
          await apicall_updateUserAddress(addressDto.addressExternalId, addressDto);
        }
        setIsFetchRequired(true);
        setAddressMode(null);
        setIsAddOrEditAddress(false);
      } catch(error) {
        setShowToast(true);
        setToastType("danger");
        setToastMessage(retrieveErrorMessage(error));
        setIsFetchRequired(false);
      }
    };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const handlePayment = async () => {

    try{

      const orderItems =  cartItems.map(({ productExternalId, quantity }) => ({
                              productExternalId,
                              quantity
                            }));

      const orderRequestDto = {
        "totalAmount": calculateTotal(),
        "deductions": 0,
        "phoneNumber": address.phoneNumber,
        "deliveryAddressExternalId": address.addressExternalId,
        "userExternalId": userExternalId,
        "orderItems": orderItems
      };

      //console.log(orderRequestDto);

      const response_createOrder = await apicall_createOrder(userExternalId, orderRequestDto);

      if(!response_createOrder.data.sucess) {
        setShowToast(true);
        setToastMessage(retrieveMessage(response_createOrder));
        setToastType("danger");
      }

      const orderExternalId = response_createOrder.data.responseData.orderExternalId;

      // const paymentDTO = {};

      // const response_makePayment = await apicall_makePaymentForOrder(orderExternalId, paymentDTO);

      // if(!response_makePayment) {
      //   const deleteOrderResponse = await apicall_cancelOrder(orderExternalId);
      //   setShowToast(true);
      //   setToastMessage(retrieveMessage(response_createOrder));
      //   setToastType("danger");
      // }

      // cartItems.map(async (item) => {
      //   const result = await apicall_removeProductFromCart(item.cartItemExternalId);
      //   if(!result.data.sucess) {
      //     setShowToast(true);
      //     setToastMessage(retrieveMessage(result));
      //     setToastType("danger");
      //   }
      // });

      setShowToast(true);
      setToastMessage("Payment successful!!");
      setToastType("success");

      setTimeout(() => {
        navigate(`/user/order/${orderExternalId}/payment/confirmation`,  { state: { cartItems } })
      }, 1000);

    }catch(error){
      setShowToast(true);
      setToastMessage(retrieveErrorMessage(error));
      setToastType("danger");
    }
  }

  return (
    <Container className="my-5">
      <h3 className="mb-4">Checkout Summary</h3>
      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-3">
            <Card.Header><strong>Shipping Addresses</strong></Card.Header>
            {!isAddOrEditAddress &&
            <Card.Body>
              {addresses.length === 0 && <Card.Text>No addresses yet.</Card.Text>}
              {addresses.map((addr) => (
                <Card key={addr.addressExternalId} className="mb-2">
                  <Card.Body>
                    <Form.Check
                      type="radio"
                      name="address"
                      checked={address?.addressExternalId === addr.addressExternalId}
                      onChange={() => handleSelect(addr)}
                      label={
                        <div>
                          <strong>Delivered To: </strong> {addr.userName}<br />
                          <strong>Address: {addr.addressName}</strong><br />
                          {addr.addressLine}, {addr.city}, {addr.state}, {addr.pincode}, {addr.country}<br />
                          <strong>Phone:</strong> {addr.phoneNumber}
                        </div>
                      }
                    />
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>}
            {isAddOrEditAddress && 
            <Card.Body>
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Receiver Name</Form.Label>
                  <Form.Control type="text" name="userName" value={address.userName} onChange={handleAddressChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Street</Form.Label>
                  <Form.Control type="text" name="addressLine" value={address.addressLine} onChange={handleAddressChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" name="city" value={address.city} onChange={handleAddressChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" name="state" value={address.state} onChange={handleAddressChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>ZIP Code</Form.Label>
                  <Form.Control type="text" name="pincode" value={address.pincode} onChange={handleAddressChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Country</Form.Label>
                  <Form.Control type="text" name="country" value={address.country} onChange={handleAddressChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" name="phoneNumber" value={address.phoneNumber} onChange={handleAddressChange} />
                </Form.Group>
                <Button variant="warning" onClick={() => handleAddOrEditAddressSave(addressMode)}>Done</Button>
              </Form>
            </Card.Body>}
            {!isAddOrEditAddress && 
            <Card.Footer className="d-flex gap-2">
              <Button variant="primary" onClick={() => handleAddOrEditAddress("add")}>Add Address</Button>
              <Button variant="warning" onClick={() => handleAddOrEditAddress("edit")}>Edit Address</Button>
            </Card.Footer>}
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header><strong>Cart Items</strong></Card.Header>
            <ListGroup variant="flush">
              {cartItems.map((item, index) => (
                <ListGroup.Item key={item.cartItemExternalId}>
                  <Row className="align-items-center">
                    <Col xs={5}>{item.productName}</Col>
                    <Col xs={4}>
                      <InputGroup>
                        <Form.Control type="number" value={item.quantity} onChange={(e) => updateItemQuantity(index, e.target.value)} min={1} max={item.productStock} />
                      </InputGroup>
                    </Col>
                    <Col xs={2} className="text-end">₹ {Number(item.price * item.quantity).toFixed(2)}</Col>
                    <Col xs={1}>
                      <Button variant="danger" size="sm" onClick={() => removeItem(index)}>×</Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          <Card className="shadow-sm">
            <Card.Header><strong>Order Total</strong></Card.Header>
            <Card.Body>
              <h5>₹ {calculateTotal()}</h5>
              <Button variant="success" className="mt-3" onClick={handlePayment} disabled={!address || cartItems.length === 0}>Proceed to Payment</Button>
            </Card.Body>
          </Card>

        </Col>
      </Row>

      <ToastComponent 
        isShow={showToast} 
        toastType={toastType} 
        message={toastMessage} 
        onToastClose={() => {
          setShowToast(false);
          setToastMessage("");
          setToastType("");
        }}
      />

    </Container>
  );
}

export default CheckoutSummaryComponent;
