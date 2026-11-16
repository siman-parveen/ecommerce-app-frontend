import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import './App.css';
import FooterComponent from './components/FooterComponent';
import HeaderComponent from './components/HeaderComponent';
import HomeComponent from './components/HomeComponent';
import ErrorPageComponent from './components/ErrorPageComponent';
import ManageProductComponent from './components/ManageProductComponent';
import ManageReviewsComponent from './components/ManageReviewsComponent';
import ManageOrdersComponent from './components/ManageOrdersComponent';
import UserProfileComponent from './components/UserProfileComponent';
import UsersAdminViewComponent from './components/UsersAdminViewComponent';
import CartComponent from './components/CartComponent';
import AuthComponent from './components/AuthComponent';
import LogoutComponent from './components/LogoutComponent';
import CheckoutSummaryComponent from './components/CheckoutSummaryComponent';
import ViewPaymentDetailComponent from './components/ViewPaymentDetailComponent';
import AuthProvider, { AuthContext } from './security/AuthContext';
import ProductComponent from './components/ProductComponent';
import OrderComponent from './components/OrderComponent';
import ReviewComponent from './components/ReviewComponent';
import PaymentConfirmationPage from './components/PaymentConfirmationComponent';

function ProtectedRoute({ children, adminOnly = false, userOnly = false }) {
  const { isAuthenticated, isAdmin, isAuthLoading, authLoadError } = useContext(AuthContext);

  if (isAuthLoading) {
    return <div className="text-center my-5">Checking session...</div>;
  }
  if (authLoadError) {
    return <div className="alert alert-danger m-4" role="alert">{authLoadError}</div>;
  }
  if (!isAuthenticated || (adminOnly && !isAdmin) || (userOnly && isAdmin)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {

  //const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100">
      <AuthProvider>
        <BrowserRouter>
          <HeaderComponent />
          <Routes>
            <Route path='/' element={<HomeComponent/>}/>

            {/* Viewable to all */}
            <Route path='/products' element={<HomeComponent/>}/>
            <Route path='/products/:productExternalId' element={<ProductComponent />} />

            <Route path='/login' element={<AuthComponent />}/>

            {/* Admin Routes */}
            <Route path='/admin/manage/products' element={<ProtectedRoute adminOnly><ManageProductComponent/></ProtectedRoute>} />

            <Route path='/admin/manage/reviews' element={<ProtectedRoute adminOnly><ManageReviewsComponent /></ProtectedRoute>} />
            <Route path='/admin/manage/reviews/:reviewExternalId' element={<ProtectedRoute adminOnly><ReviewComponent /></ProtectedRoute>} />

            <Route path='/admin/manage/orders' element={<ProtectedRoute adminOnly><ManageOrdersComponent /></ProtectedRoute>} />
            <Route path='/admin/manage/orders/:orderExternalId' element={<ProtectedRoute adminOnly><OrderComponent /></ProtectedRoute>} />

            <Route path='/admin/users' element={<ProtectedRoute adminOnly><UsersAdminViewComponent /></ProtectedRoute>}/>

            <Route path='/admin/user/:userExternalId/details' element={<ProtectedRoute adminOnly><UserProfileComponent /></ProtectedRoute>}/>

            {/* User Routes */}
            <Route path='/user/reviews' element={<ProtectedRoute userOnly><ManageReviewsComponent /></ProtectedRoute>} />
            <Route path='/user/reviews/:reviewExternalId' element={<ProtectedRoute userOnly><ReviewComponent /></ProtectedRoute>} />

            <Route path='/user/orders' element={<ProtectedRoute userOnly><ManageOrdersComponent /></ProtectedRoute>} />
            <Route path='/user/orders/:orderExternalId' element={<ProtectedRoute userOnly><OrderComponent /></ProtectedRoute>} />

            <Route path='/user/profile' element={<ProtectedRoute userOnly><UserProfileComponent /></ProtectedRoute>}/>
            <Route path='/user/cart' element={<ProtectedRoute userOnly><CartComponent /></ProtectedRoute>}/>

            <Route path='/user/product/:productExternalId/checkout' element={<ProtectedRoute userOnly><CheckoutSummaryComponent /></ProtectedRoute>} />
            <Route path='/user/cart/checkout' element={<ProtectedRoute userOnly><CheckoutSummaryComponent /></ProtectedRoute>}/>

            <Route path='/order/:orderExternalId/payment/details' element={<ProtectedRoute userOnly><ViewPaymentDetailComponent /></ProtectedRoute>} />

            <Route path='/user/order/:orderExternalId/payment/confirmation' element={<ProtectedRoute userOnly><PaymentConfirmationPage /></ProtectedRoute>} />

            <Route path='/logout' element={<ProtectedRoute><LogoutComponent /></ProtectedRoute>}/>

            <Route path='*' element={<ErrorPageComponent/>}/>
          </Routes>
          <FooterComponent />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
