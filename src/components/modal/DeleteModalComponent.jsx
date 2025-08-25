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
            <Modal show={deleteModalShow}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{confirmDeleteMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleHideDeleteModal}>No</Button>
                    <Button variant="primary" onClick={deleteEntity}>Yes</Button>
                </Modal.Footer>
            </Modal>
    )
}