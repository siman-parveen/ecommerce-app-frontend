import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

export default function DeleteModalComponent({deleteModalShow, confirmDeleteMessage, handleHideDeleteModal, deleteEntity}) {

    /*example of usage:

    <DeleteModalComponent 
            deleteModalShow={deleteModalShow}
            confirmDeleteMessage={"Are you sure you want to delete this product?"} 
            handleHideDeleteModal={handleHideDeleteModal} 
            deleteEntity={deleteEntity}
          />
    */

    return (
        <Modal show={deleteModalShow} centered>
            <Modal.Header closeButton className="bg-danger text-white">
                <Modal.Title><i className="bi bi-exclamation-triangle-fill me-2"></i>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-center text-danger fw-bold fs-5">{confirmDeleteMessage}</p>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="outline-secondary" onClick={handleHideDeleteModal} className="px-4">Cancel</Button>
                <Button variant="danger" onClick={deleteEntity} className="px-4">Delete</Button>
            </Modal.Footer>
        </Modal>
    )
}