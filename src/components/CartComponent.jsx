import { useContext, useEffect, useState } from "react";
import { Container, Card, Button, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../security/AuthContext";
import { apicall_addQuantityForCartItem, apicall_removeProductFromCart, apicall_removeQuantityForCartItem, apicall_retrieveCartItemsForUserCart, retrieveErrorMessage, retrieveMessage } from "../api/ApiCall";
import MessageComponent from "./MessageComponent";
import ToastComponent from "./ToastComponent";

const CartComponent = () => {

  const navigate = useNavigate();

  const { isAdmin, userExternalId, isAuthenticated } = useContext(AuthContext);  

  const [isFetchRequired, setIsFetchRequired] = useState(true);

  const [selectedTotal, setSelectedTotal] = useState(0);

  const [cartItems, setCartItems] = useState([]);

  const [message, setMessage] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");


  useEffect(() => {
      if(!isAuthenticated){
        navigate('/login'); 
      } else {
        if(isAdmin) {
          if(window.history.length > 1) {
            navigate(-1);
          } else {
            navigate('/');
          }
        } else {
          if(isFetchRequired) {
            retrieveCartItemsForUserCart();
          }
        }
      }
  }, [isFetchRequired]);


  // useEffect(() => {
  //   if(!isAuthenticated){
  //     navigate('/login'); 
  //   }else{
  //     const total = cartItems
  //     .filter(item => item.selected)
  //     .reduce((sum, item) => sum + item.price * item.quantity, 0);

  //     setSelectedTotal(Number(total.toFixed(2)));
  //   }
  // }, [cartItems]);


  const retrieveCartItemsForUserCart = async () => {

    try {
      const response = await apicall_retrieveCartItemsForUserCart(userExternalId);
      if(response.data.success) {
        const items = response.data.responseData.cartItemResponseDto.map(item => ({...item,selected: false}));
        setCartItems(items);
        setSelectedTotal(response.data.responseData.totalAmount);
      } else {
        setCartItems([]);
        setMessage(retrieveMessage(response));
      }
    }catch(error) {
      setMessage(retrieveErrorMessage(error));
    }finally{
      setIsFetchRequired(false);
    }

  }

  const [allSelected, setAllSelected] = useState(false);

  const toggleSelect = (cartItemExternalId) => {
    setCartItems(prev =>
      prev.map(item => item.cartItemExternalId === cartItemExternalId ? { ...item, selected: !item.selected } : item)
    );
  };

  const toggleSelectAll = () => {
    const newAllSelected = !allSelected;
    setAllSelected(newAllSelected);
    setCartItems(prev => prev.map(item => ({ ...item, selected: newAllSelected })));
  };

  const updateQuantity = async (cartItemExternalId, mode) => {
    try {
      let response = null;
      if(mode === "remove") {
        response = await apicall_removeQuantityForCartItem(cartItemExternalId, {"quantity" : 1});
      } else if (mode === "add") {
        response = await apicall_addQuantityForCartItem(cartItemExternalId, {"quantity" : 1});
      }
       if(response.data.success) {
        setIsFetchRequired(true);
        setToastType("success");
       }else{
        setToastType("danger");
       }
      setToastMessage(retrieveMessage(response));
      setShowToast(true);
      
    } catch(error) {
      setToastMessage(retrieveErrorMessage(error));
      //setIsFetchRequired(false);
      setToastType("danger");
      setShowToast(true);
    }

  };

  const removeItem = async (cartItemExternalId) => {
    try {
      const response = await apicall_removeProductFromCart(cartItemExternalId);
      if(response.data.success) {
        setIsFetchRequired(true);
        setToastType("success");
       }else{
        setToastType("danger");
       }
      setToastMessage(retrieveMessage(response));
      setShowToast(true);
    } catch(error) {
      setToastMessage(retrieveErrorMessage(error));
      //setIsFetchRequired(false);
      setToastType("danger");
      setShowToast(true);
    }

  };

  const proceedToCheckout = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    navigate("/user/cart/checkout", { state: { selectedItems } });
  }

  

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Cart</h3>
        <Form.Check type="checkbox" label="Select All" checked={allSelected} onChange={toggleSelectAll} className="bordered-checkbox" />
      </div>

      {message !== null && <MessageComponent message={message} />}

      <Row className="g-4">
        <Col md={8} className="mb-2" >
          {cartItems.map(item => (
            <Card className="mb-2" key={item.cartItemExternalId}>
              <Card.Body>
                
                {/* <Image src={item.image} fluid rounded className="my-2" /> */}
                <Card.Title>
                  <div className="d-flex justify-content-between">
                    {item.productName}
                    <Form.Check type="checkbox" className="bordered-checkbox" checked={item.selected} onChange={() => toggleSelect(item.cartItemExternalId)} />
                    {/* <small className="text-muted">#{item.id}</small> */}
                </div>
                </Card.Title>
                <Card.Text>
                  <strong>Price:</strong> ${item.price.toFixed(2)} <br />
                  <strong>Quantity:</strong>{" "}
                  <Button size="sm" variant="light" onClick={() => updateQuantity(item.cartItemExternalId, "remove")}>-</Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button size="sm" variant="light" onClick={() => updateQuantity(item.cartItemExternalId, "add")}>+</Button>
                  <br />
                  <strong>Total:</strong> ${(item.price * item.quantity).toFixed(2)}
                </Card.Text>
                <Button variant="danger" size="sm" onClick={() => removeItem(item.cartItemExternalId)}>Remove</Button>
              </Card.Body>
            </Card>
          ))}
        </Col>

        <Col style={{ position: "sticky", top: "100px" }}>
          <Card>
            <Card.Header><strong>Selected Total: ${selectedTotal}</strong></Card.Header>
            <Card.Body>
              <Button variant="success" disabled={selectedTotal <= 0} onClick={proceedToCheckout}>Proceed to Checkout</Button>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      <ToastComponent isShow={showToast} toastType={toastType} message={toastMessage} onToastClose={() => setShowToast(false)} />

      </Container>
  );
}

export default CartComponent;
