

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
            <th>Chapter</th>
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
                  Ongeza Maudhui
                </Button>{" "}
                <Button size="sm" variant="danger" onClick={() => onRemoveGroup(groupIndex)}>
                  <FaTrash className="me-1" />
                  Ondoa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <p>Hakuna alabamu yoyote kwa sasa.</p>
    )}
  </>
);

export default GroupTable;
