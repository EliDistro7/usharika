

import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddGroupModal = ({ show, onClose, onAddGroup, newGroupName, setNewGroupName }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Ongeza chapter kwenye Albamu</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group>
          <Form.Label>Jina la Chapter</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingiza jina na Chapter"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Funga
      </Button>
      <Button variant="primary" onClick={onAddGroup}>
        Wasilisha
      </Button>
    </Modal.Footer>
  </Modal>
);

export default AddGroupModal;
