

import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaTrash, FaPlus } from "react-icons/fa";

const GroupTable = ({ content, onAddContent, onRemoveGroup }) => (
  <>
    {content.length > 0 ? (
      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Group Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {content.map((group, groupIndex) => (
            <tr key={groupIndex}>
              <td>{groupIndex + 1}</td>
              <td>{group.groupName}</td>
              <td>
                <Button size="sm" variant="info" onClick={() => onAddContent(groupIndex)}>
                  <FaPlus className="me-1" />
                  Add Content
                </Button>{" "}
                <Button size="sm" variant="danger" onClick={() => onRemoveGroup(groupIndex)}>
                  <FaTrash className="me-1" />
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <p>No groups added yet.</p>
    )}
  </>
);

export default GroupTable;
