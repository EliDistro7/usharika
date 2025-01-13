

import React from "react";
import { Form } from "react-bootstrap";

const HighlightNameForm = ({ name, setName }) => (
  <Form className="mb-3">
    <Form.Group>
      <Form.Label>Jina la Albamu</Form.Label>
      <Form.Control
        type="text"
        placeholder="Ingiza jina"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </Form.Group>
  </Form>
);

export default HighlightNameForm;
