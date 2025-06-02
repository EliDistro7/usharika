
'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Badge, Button, Modal, Form } from 'react-bootstrap';
import { Eye, Calendar, User, Plus, Edit3, Trash2, Video, Image as ImageIcon } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';

const HighlightsPage = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'highlight', 'tab', 'content'
  const [activeTab, setActiveTab] = useState('');

  // Mock data - replace with your API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHighlights([
        {
          _id: '1',
          name: 'Travel Adventures',
          author: 'John Doe',
          createdAt: new Date('2024-01-15'),
          lastUpdated: new Date('2024-02-20'),
          content: [
            {
              _id: 'tab1',
              groupName: 'Europe Trip',
              lastUpdated: new Date('2024-02-20'),
              content: [
                {
                  _id: 'content1',
                  description: 'Amazing sunset in Santorini',
                  author: 'John Doe',
                  imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
                  videoUrl: null
                },
                {
                  _id: 'content2',
                  description: 'Exploring the streets of Paris',
                  author: 'Jane Smith',
                  imageUrl: null,
                  videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
                }
              ]
            },
            {
              _id: 'tab2',
              groupName: 'Asia Adventures',
              lastUpdated: new Date('2024-01-30'),
              content: [
                {
                  _id: 'content3',
                  description: 'Temple visits in Kyoto',
                  author: 'Mike Johnson',
                  imageUrl: 'https://images.unsplash.com/photo-1493236450119-0566cb9bad5f?w=800',
                  videoUrl: null
                }
              ]
            }
          ]
        },
        {
          _id: '2',
          name: 'Food & Culture',
          author: 'Sarah Wilson',
          createdAt: new Date('2024-01-10'),
          lastUpdated: new Date('2024-02-15'),
          content: [
            {
              _id: 'tab3',
              groupName: 'Street Food',
              lastUpdated: new Date('2024-02-15'),
              content: [
                {
                  _id: 'content4',
                  description: 'Delicious ramen in Tokyo',
                  author: 'Sarah Wilson',
                  imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
                  videoUrl: null
                }
              ]
            }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleShowModal = (type, data = null) => {
    setModalType(type);
    setShowModal(true);
  };

  const ContentItem = ({ item }) => (
    <Card className="mb-3 shadow-sm border-0 animate__animated animate__fadeInUp">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <p className="mb-2 text-muted small">
              <User size={14} className="me-1" />
              {item.author}
            </p>
            <p className="mb-0">{item.description}</p>
          </div>
          <div className="d-flex gap-2">
            {item.imageUrl && <Badge bg="success" className="d-flex align-items-center gap-1">
              <ImageIcon size={12} /> Image
            </Badge>}
            {item.videoUrl && <Badge bg="primary" className="d-flex align-items-center gap-1">
              <Video size={12} /> Video
            </Badge>}
          </div>
        </div>
        
        {item.imageUrl && (
          <div className="mb-3">
            <img 
              src={item.imageUrl} 
              alt={item.description}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        
        {item.videoUrl && (
          <div className="mb-3">
            <video 
              controls 
              className="w-100 rounded shadow-sm"
              style={{ maxHeight: '300px' }}
            >
              <source src={item.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  const HighlightCard = ({ highlight }) => {
    const firstTabKey = highlight.content[0]?._id || '';
    const [currentActiveTab, setCurrentActiveTab] = useState(firstTabKey);

    return (
      <Card className="h-100 shadow border-0 animate__animated animate__fadeIn">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{highlight.name}</h5>
            <div className="d-flex gap-2">
              <Button variant="outline-light" size="sm" onClick={() => handleShowModal('content')}>
                <Plus size={16} />
              </Button>
              <Button variant="outline-light" size="sm">
                <Edit3 size={16} />
              </Button>
            </div>
          </div>
        </Card.Header>
        
        <Card.Body className="p-0">
          <div className="p-3 bg-light border-bottom">
            <div className="d-flex justify-content-between align-items-center text-muted small">
              <span>
                <User size={14} className="me-1" />
                {highlight.author}
              </span>
              <span>
                <Calendar size={14} className="me-1" />
                Updated {formatDate(highlight.lastUpdated)}
              </span>
            </div>
          </div>

          {highlight.content.length > 0 ? (
            <Tab.Container activeKey={currentActiveTab} onSelect={setCurrentActiveTab}>
              <Nav variant="tabs" className="border-0 bg-light px-3">
                {highlight.content.map((tab) => (
                  <Nav.Item key={tab._id}>
                    <Nav.Link 
                      eventKey={tab._id}
                      className="border-0 text-primary fw-semibold"
                    >
                      {tab.groupName}
                      <Badge bg="secondary" className="ms-2">
                        {tab.content.length}
                      </Badge>
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              <Tab.Content className="p-3" style={{ minHeight: '400px' }}>
                {highlight.content.map((tab) => (
                  <Tab.Pane eventKey={tab._id} key={tab._id}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-muted mb-0">
                        Last updated: {formatDate(tab.lastUpdated)}
                      </h6>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleShowModal('content')}
                      >
                        <Plus size={16} className="me-1" />
                        Add Content
                      </Button>
                    </div>
                    
                    {tab.content.length > 0 ? (
                      tab.content.map((item) => (
                        <ContentItem key={item._id} item={item} />
                      ))
                    ) : (
                      <div className="text-center py-5 text-muted">
                        <Eye size={48} className="mb-3 opacity-50" />
                        <p>No content in this tab yet</p>
                        <Button variant="primary" onClick={() => handleShowModal('content')}>
                          Add First Content
                        </Button>
                      </div>
                    )}
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Tab.Container>
          ) : (
            <div className="text-center py-5 text-muted">
              <Plus size={48} className="mb-3 opacity-50" />
              <p>No tabs created yet</p>
              <Button variant="primary" onClick={() => handleShowModal('tab')}>
                Create First Tab
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading highlights...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container fluid className="bg-primary text-white py-5">
        <Container>
          <Row>
            <Col>
              <h1 className="display-4 fw-bold mb-3 animate__animated animate__fadeInDown">
                Content Highlights
              </h1>
              <p className="lead animate__animated animate__fadeInUp">
                Discover and manage your curated content collections
              </p>
              <Button 
                variant="light" 
                size="lg" 
                className="animate__animated animate__fadeInUp animate__delay-1s"
                onClick={() => handleShowModal('highlight')}
              >
                <Plus className="me-2" />
                New Highlight
              </Button>
            </Col>
          </Row>
        </Container>
      </Container>

      <Container className="py-5">
        {highlights.length > 0 ? (
          <Row className="g-4">
            {highlights.map((highlight) => (
              <Col lg={6} xl={4} key={highlight._id}>
                <HighlightCard highlight={highlight} />
              </Col>
            ))}
          </Row>
        ) : (
          <Row>
            <Col>
              <div className="text-center py-5">
                <Eye size={64} className="text-muted mb-4" />
                <h3 className="text-muted">No highlights yet</h3>
                <p className="text-muted mb-4">Create your first highlight to get started</p>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => handleShowModal('highlight')}
                >
                  <Plus className="me-2" />
                  Create First Highlight
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </Container>

      {/* Modal for creating/editing content */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'highlight' && 'Create New Highlight'}
            {modalType === 'tab' && 'Create New Tab'}
            {modalType === 'content' && 'Add New Content'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {modalType === 'highlight' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Highlight Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter highlight name" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control type="text" placeholder="Enter author name" />
                </Form.Group>
              </>
            )}
            
            {modalType === 'tab' && (
              <Form.Group className="mb-3">
                <Form.Label>Tab Name</Form.Label>
                <Form.Control type="text" placeholder="Enter tab name" />
              </Form.Group>
            )}
            
            {modalType === 'content' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Enter content description" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control type="text" placeholder="Enter author name" />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Image URL (optional)</Form.Label>
                      <Form.Control type="url" placeholder="Enter image URL" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Video URL (optional)</Form.Label>
                      <Form.Control type="url" placeholder="Enter video URL" />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            {modalType === 'highlight' && 'Create Highlight'}
            {modalType === 'tab' && 'Create Tab'}
            {modalType === 'content' && 'Add Content'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default HighlightsPage;