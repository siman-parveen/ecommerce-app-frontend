import axios from "axios"

const API_CALLER = 'http://localhost:8080/api';

/* USERS API CALL */

export const apicall_retrieveAllUsers = async () => {
    return await axios.get(API_CALLER + '/user/all');
}

export const apicall_retrieveUserByUserId = async (userExternalId) => {
    return await axios.get(API_CALLER + `/user/${userExternalId}`);
}

export const apicall_registerUser = async (userRequestDTO) => {
    return await axios.post(API_CALLER + '/user/signup', userRequestDTO);
}

export const apicall_loginuser = async (userRequestDTO) => {
    return await axios.post(API_CALLER + '/user/login', userRequestDTO);
}

export const apicall_updateUser = async (userExternalId, userRequestDTO)  => {
        return await axios.patch(API_CALLER + `/user/${userExternalId}`, userRequestDTO);
}

/* USER ADDRESS API CALL */

export const apicall_retrieveAddressForUser = async (userExternalId) => {
    return await axios.get(API_CALLER + `/user/${userExternalId}/address`);
}

export const apicall_addUserAddress = async (addressRequestDTO) => {
    return await axios.post(API_CALLER + '/user/address', addressRequestDTO);
}

export const apicall_updateUserAddress = async (addressExternalId, addressRequestDTO) => {
    return await axios.patch(API_CALLER + `/user/address/${addressExternalId}`, addressRequestDTO);
}

export const apicall_deleteUserAddress = async (addressExternalId) => {
    return await axios.delete(API_CALLER + `/user/address/${addressExternalId}`);
}

/* PRODUCTS API CALL */

export const apicall_retrieveAllProducts = async () => {
    return await axios.get(API_CALLER + '/public/product');
}

export const apicall_retrieveProductByProductId = async (productId) => {
    return await axios.get(API_CALLER + `/public/product/${productId}`);
}

export const apicall_addProductDetails = async (productRequestDTO) => {
    return await axios.post(API_CALLER + '/admin/product', productRequestDTO);
}

export const apicall_updateProductDetails = async (productId, productRequestDTO) => {
    return await axios.patch(API_CALLER + `/admin/product/${productId}`, productRequestDTO);
}

export const apicall_deleteProduct = async (productId) => {
    return await axios.delete(API_CALLER + `/admin/product/${productId}`);
}

/* PAYMENT API CALL */

export const apicall_retrievePaymentByOrderId = async (orderExternalId) => {
    return await axios.get(API_CALLER + `/api/user/order/${orderExternalId}/payment`);
}


/* ORDERS API CALL */

export const apicall_retrieveAllOrders = async () =>{
    return await axios.get(API_CALLER + '/admin/orders');
}

export const apicall_retrieveOrderByOrderExternalId = async (orderExternalId) => {
    return await axios.get(API_CALLER + `/api/user/order/${orderExternalId}`);
}

export const apicall_retrieveOrdersGivenByUser = async (userExternalId) => {
   return await axios.get(API_CALLER +  `/user/${userExternalId}/order`);
}

export const apicall_createOrder = async (userExternalId, orderRequestDto) => {
    return await axios.post(API_CALLER +  `/user/${userExternalId}/order`, orderRequestDto);
}

export const apicall_updateOrderStatusByAdmin = async (orderExternalId, status) => {
    //return await axios.patch(API_CALLER +  `/user/${userExternalId}/order`);
}

export const apicall_cancelOrder = async (orderExternalId) => {
    return await axios.patch(API_CALLER + `/api/user/order/${orderExternalId}`);
}

export const apicall_deleteOrder = async (orderExternalId) => {
    return await axios.delete(API_CALLER + `/api/user/order/${orderExternalId}`);
}


/* */

export const apicall_makePaymentForOrder = async (orderExternalId, paymentDTO) => {
    return await axios.post(API_CALLER +  `/user/order/${orderExternalId}/payment`, paymentDTO);
}


/* REVIEW API CALLS */

export const apicall_retrieveAllReviews = async () => {
    return await axios.get(API_CALLER + '/admin/reviews');
}

export const apicall_retrieveAllReviewGivenByUser = async (userExternalId) => {
    return await axios.get(API_CALLER + `/user/${userExternalId}/reviews`);
}

export const apicall_retrieveReviewsGivenToTheProduct = async (productExternalId) => {
    return await axios.get(API_CALLER + `/product/${productExternalId}/reviews`);
}

export const apicall_addReview = async (reviewDto) => {
    return await axios.post(API_CALLER + '/user/product/review', reviewDto)
}

export const apicall_updateReview = async (reviewExternalId, reviewDto) => {
    return await axios.post(API_CALLER + `/user/product/review/${reviewExternalId}`, reviewDto);

}

export const apicall_deleteReviewByExternalId = async (reviewExternalId) => {
    return await axios.get(API_CALLER + `/user/product/review/${reviewExternalId}`)
}


/* CART API CALLS */

export const apicall_addProductToCart = async (userExternalId, productQuantityDto) => {
    return await axios.post(API_CALLER + `/user/${userExternalId}/cart`, productQuantityDto);
}

export const apicall_retrieveCartItemsForUserCart = async (userExternalId) => {
    return await axios.get(API_CALLER + `/user/${userExternalId}/cart`);
}

export const apicall_removeQuantityForCartItem = async (cartItemExternalId, quantity) => {
    return await axios.patch(API_CALLER + `/user/cart/items/${cartItemExternalId}/remove`, quantity);
}

export const apicall_addQuantityForCartItem = async (cartItemExternalId, quantity) => {
    return await axios.patch(API_CALLER + `/user/cart/items/${cartItemExternalId}/add`, quantity);
}

export const apicall_removeProductFromCart = async (cartItemExternalId) => {
    return await axios.delete(API_CALLER + `/user/cart/items/${cartItemExternalId}`);
}

/* MESSAGES */

export const retrieveMessage = (response) => {
  if (response && response.data) {
    return response.data.message;
  }
  return "Operation may not have completed successfully.";
};


export const retrieveErrorMessage = (error) => {
  if (!error) return "An unknown error occurred.";

  // Axios error with response from server
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    // Case 1: Spring Boot sends error in a message field
    if (data && typeof data === "object") {
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (typeof data === "string") return data;
    }

    // Fallback by status code
    if (status === 400) return "Bad Request. Please check your input.";
    if (status === 401) return "Unauthorized. Please log in.";
    if (status === 403) return "Forbidden. You don't have permission.";
    if (status === 404) return "Not found.";
    if (status === 500) return "Internal Server Error. Please try again later.";

    return `Error ${status}: ${error.response.statusText}`;
  }

  // Axios error without a response (e.g., network error)
  if (error.request) {
    return "No response from server. Please check your network.";
  }

  // Something else (like a thrown JS error)
  return error.message || "An unknown error occurred.";
};


