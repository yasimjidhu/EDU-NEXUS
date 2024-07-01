import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface DeletionConfirmationProps {
  categoryName: string;
  onClose: () => void;
  onDelete: () => void;
}

const DeletionConfirmation: React.FC<DeletionConfirmationProps> = ({ categoryName, onClose, onDelete }) => {
  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>Confirm block</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to block the category <strong>{categoryName}</strong>?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletionConfirmation;
