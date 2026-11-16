import { Container, Row, Col, Card, Pagination } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apicall_retrieveAllProducts, retrieveErrorMessage, retrieveMessage } from "../api/ApiCall";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import MessageComponent from "./MessageComponent";
import ToastComponent from "./ToastComponent";


function HomeComponent() {

    const [message, setMessage] = useState(null);

    const [products, setProducts] = useState([]);

    const [isFetchRequired, setIsFetchRequired] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / productsPerPage);

    useEffect(() => {
        if(isFetchRequired) {
            retrieveAllProducts();
        }
    }, [isFetchRequired]);

    const retrieveAllProducts = async () => {
        try {
            const response = await apicall_retrieveAllProducts();

            if(response.data.success) {
                setProducts(response.data.responseData);
                setMessage(null);
            } else {
                setProducts([]);
                setMessage(retrieveMessage(response));
            }
        }catch(error){
            setMessage(retrieveErrorMessage(error));
        }finally {
            setIsFetchRequired(false);
        }
    }

    return (
        <Container className="mt-4">
            
            {(products.length >= 1 && totalPages > 1) && 
                <Pagination> 
                    <Pagination.Prev
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    />
                    <Pagination.Item>{currentPage}</Pagination.Item> 
                    <Pagination.Item>of</Pagination.Item>
                    <Pagination.Item>{totalPages}</Pagination.Item>
                    <Pagination.Next
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    />
                </Pagination> 
            }

            {message !== null && 
                <MessageComponent message={message} />
            }

            <Row>
                {currentProducts.map(product => (
                    <Col sm={12} md={6} lg={4} className="mb-4" key={product.productExternalId}>
                        <Link to={`/products/${product.productExternalId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>{product.productName}</Card.Title>
                                    <Card.Text>
                                        {product.description && product.description.length > 40
                                            ? product.description.substring(0, 40) + '...'
                                            : product.description}
                                    </Card.Text>
                                    <Card.Text><strong>Price:</strong> ${product.price}</Card.Text>
                                    <Card.Text><strong>Stock:</strong> {product.stock}</Card.Text>
                                    <Card.Text>
                                        {Array.from({ length: 5 }, (_, index) => {
                                            const rating = product.totalRating;
                                            if (index + 1 <= Math.floor(rating)) {
                                            return <FaStar key={index} className="text-warning" />;
                                            } else if (index + 0.5 <= rating) {
                                            return <FaStarHalfAlt key={index} className="text-warning" />;
                                            } else {
                                            return <FaRegStar key={index} className="text-warning" />;
                                            }
                                        })}
                                        <strong className="ms-2">({product.ratingsCount})</strong>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>

        </Container>
    );
};


export default HomeComponent;
