import { Card, Col } from "react-bootstrap";

const MessageComponent = ({message}) => {
    return (
        <Col md={12}>
            <Card className="text-center my-4">
            <Card.Body>
                <Card.Title>{message}</Card.Title>
                <Card.Text>Please check back later..</Card.Text>
            </Card.Body>
            </Card>
        </Col>
    )
}


export default MessageComponent;