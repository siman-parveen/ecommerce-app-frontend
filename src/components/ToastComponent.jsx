import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

function ToastComponent({isShow, toastType, message, onToastClose}) {


    /*
    <ToastComponent 
            isShow={showToast} 
            toastType={toastType} 
            message={toastMessage} 
            onToastClose={onToastClose} //this function will run after the toast has auto hidden
          />
    */

    const [showToast, setShowToast] = useState(isShow);

    useEffect(() => {
        setShowToast(isShow);
    }, [isShow]);

    function onClose() {
        setShowToast(false);
        onToastClose?.();
    }

    return (
        <ToastContainer position="top-center" className="p-3">
            {toastType === "success" && 
            <Toast bg="success" onClose={() => onClose()} show={showToast} delay={5000} autohide>
                <Toast.Body className="text-white">
                    <p>{message}</p>
                </Toast.Body>
            </Toast>}
            {toastType === "danger" && 
            <Toast bg="danger" onClose={() => onClose()} show={showToast} delay={5000} autohide>
                <Toast.Body className="text-white">
                    <p>{message}</p>
                </Toast.Body>
            </Toast>}
        </ToastContainer>
    );
}

export default ToastComponent;