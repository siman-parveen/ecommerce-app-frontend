import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import AuthProvider from './security/AuthContext';
import ProductComponent from './components/ProductComponent';
import OrderComponent from './components/OrderComponent';
import ReviewComponent from './components/ReviewComponent';

function App() {

  //const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100">
      <AuthProvider>
        <BrowserRouter>
        {/* <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}> */}
          <HeaderComponent />
          {/* <main
            style={{
              //flex: '1 1 auto',
              overflowY: 'auto',
              //paddingTop: '30px', // Height of fixed header
              //paddingBottom: '30px', // Height of fixed footer
            }}
          ></main> */}
          <Routes>
            <Route path='/' element={<HomeComponent/>}/>

            {/* Viewable to all */}
            <Route path='/products' element={<HomeComponent/>}/>
            <Route path='/products/:productExternalId' element={<ProductComponent />} />

            <Route path='/login' element={<AuthComponent />}/>

            {/* Admin Routes */}
            <Route path='/admin/manage/products' element={<ManageProductComponent/>} />

            <Route path='/admin/manage/reviews' element={<ManageReviewsComponent />} />
            <Route path='/admin/manage/reviews/:reviewExternalId' element={<ReviewComponent />} />

            <Route path='/admin/manage/orders' element={<ManageOrdersComponent />} />
            <Route path='/admin/manage/orders/:orderExternalId' element={<OrderComponent />} />

            <Route path='/admin/users' element={<UsersAdminViewComponent />}/>

            <Route path='/admin/user/:userExternalId/details' element={<UserProfileComponent />}/>

            {/* User Routes */}
            <Route path='/user/reviews' element={<ManageReviewsComponent />} />
            <Route path='/user/reviews/:reviewExternalId' element={<ReviewComponent />} />

            <Route path='/user/orders' element={<ManageOrdersComponent />} />
            <Route path='/user/orders/:orderExternalId' element={<OrderComponent />} />

            <Route path='/user/profile' element={<UserProfileComponent />}/>
            <Route path='/user/cart' element={<CartComponent />}/>

            <Route path='/user/product/:productExternalId/checkout' element={<CheckoutSummaryComponent />} />
            <Route path='/user/cart/checkout' element={<CheckoutSummaryComponent />}/>

            <Route path='/order/:orderExternalId/payment/details' element={<ViewPaymentDetailComponent />} />

            <Route path='/logout' element={<LogoutComponent />}/>

            <Route path='*' element={<ErrorPageComponent/>}/>
          </Routes>
          <FooterComponent />
        {/* </div> */}
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
