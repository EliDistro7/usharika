import React, { useEffect, useState } from "react";
import { fetchUsersBornThisMonth } from "@/actions/users";
import { Card, Row, Col, Container, Spinner, Alert } from "react-bootstrap";

const formatDate = (dob) => {
  const date = new Date(dob);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "long" }); // Removed year
};

const UserCards = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsersBornThisMonth();
        setUsers(data.users || []);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  return (
    <Container className="mt-5">
      <h2
        className="text-center fw-bold mb-4"
        style={{
          fontSize: "2rem",
          color: "#6a0dad",
          textShadow: "2px 2px 4px rgba(106, 13, 173, 0.3)",
        }}
      >
        🎂 Birthdays This Month 🎉
      </h2>

      {loading && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger" className="text-center">{error}</Alert>}

      {!loading && !error && users.length === 0 && (
        <Alert variant="info" className="text-center">No users found for this month.</Alert>
      )}

      <Row className="g-4">
        {users.map((user) => (
          <Col key={user._id} md={4} sm={6} xs={12}>
            <Card
              className="shadow-lg border-0 rounded-4 text-center overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #d4a5ff 0%, #e2c2ff 100%)",
                color: "#fff",
              }}
            >
              <div>
                <img
                  src={user.profilePicture || "https://via.placeholder.com/600x300"}
                  alt={user.name}
                  className="w-100"
                  style={{
                    objectFit: "cover",
                    height: "200px",
                  }}
                />
              </div>
              <Card.Body>
                <Card.Title className="fw-bold" style={{ fontSize: "1.5rem", color: "#4b0082" }}>
                  {user.name}
                </Card.Title>
                <Card.Text className="fw-semibold" style={{ color: "#4b0082" }}>
                  <i className="bi bi-calendar-event me-1"></i>
                  {formatDate(user.dob)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default UserCards;
