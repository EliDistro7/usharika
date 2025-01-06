

import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddGroupModal = ({ show, onClose, onAddGroup, newGroupName, setNewGroupName }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Add Group</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group>
          <Form.Label>Group Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
      <Button variant="primary" onClick={onAddGroup}>
        Add Group
      </Button>
    </Modal.Footer>
  </Modal>
);

export default AddGroupModal;
