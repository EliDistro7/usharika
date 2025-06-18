import React from "react";
import { Card, Badge, Button, Form, Row, Col, Modal } from "react-bootstrap";
import { FaCheckCircle, FaCreditCard, FaUser, FaPhone, FaDollarSign, FaTimes } from "react-icons/fa";
import Link from 'next/link';
import { colors, playfair, cormorant, cinzel, paymentOptions, formatCurrency } from './constants';

// Input Field Component
export const InputField = ({ label, type, placeholder, value, onChange, required, icon }) => (
  <div className="mb-4">
    <label className={`form-label fw-semibold ${cormorant.className}`} style={{ 
      fontSize: "1.1rem", 
      color: colors.text,
      marginBottom: "8px"
    }}>
      {label} {required && <span style={{ color: colors.secondary }}>*</span>}
    </label>
    <div className="position-relative">
      {icon && (
        <div className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ 
          color: colors.textSecondary,
          zIndex: 2
        }}>
          {icon}
        </div>
      )}
      <input
        type={type}
        className={`form-control ${cormorant.className} ${icon ? 'ps-5' : ''}`}
        style={{ 
          fontSize: "1rem",
          padding: "16px 20px",
          border: `2px solid ${colors.border}`,
          borderRadius: "12px",
          transition: "all 0.3s ease",
          backgroundColor: colors.surface,
          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          color: colors.text
        }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={(e) => {
          e.target.style.borderColor = colors.borderFocus;
          e.target.style.boxShadow = `0 0 0 3px rgba(59, 130, 246, 0.1)`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.border;
          e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
        }}
      />
    </div>
  </div>
);

// Donation Card Component
export const DonationCard = ({ option, index, onCardClick }) => (
  <Card
    onClick={() => onCardClick(option)}
    className="h-100 border-0 cursor-pointer animate__animated animate__fadeInUp shadow-sm"
    style={{
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      borderRadius: "20px",
      background: colors.surface,
      color: colors.text,
      cursor: "pointer",
      animationDelay: `${index * 0.1}s`
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-8px)";
      e.currentTarget.style.boxShadow = "0 20px 40px rgba(59, 130, 246, 0.15)";
      e.currentTarget.style.background = option.gradient;
      e.currentTarget.style.color = "white";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
      e.currentTarget.style.background = colors.surface;
      e.currentTarget.style.color = colors.text;
    }}
  >
    <Card.Body className="p-4">
      <div className="d-flex align-items-start">
        <div className="me-4 p-3 rounded-circle" style={{
          background: colors.gradientCard,
          color: colors.primary,
          backdropFilter: "blur(10px)"
        }}>
          {option.icon}
        </div>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h4 className={`fw-bold ${playfair.className}`} style={{ 
              fontSize: "1.4rem",
              marginBottom: "8px",
              lineHeight: "1.3"
            }}>
              {option.title}
            </h4>
            <Badge 
              className="ms-2" 
              style={{ 
                backgroundColor: colors.secondary,
                fontSize: "0.75rem",
                padding: "4px 8px"
              }}
            >
              Target: {option.target}
            </Badge>
          </div>
          <p className={`mb-0 ${cormorant.className}`} style={{ 
            fontSize: "1.1rem",
            lineHeight: "1.5",
            opacity: 0.8
          }}>
            {option.description}
          </p>
        </div>
      </div>
    </Card.Body>
  </Card>
);

// Auth Notice Component
export const AuthNotice = ({ username }) => {
  if (username) return null;
  
  return (
    <div className="text-center mb-5">
      <Card className="border-0 shadow-sm mx-auto" style={{ 
        maxWidth: "500px",
        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
        borderRadius: "16px"
      }}>
        <Card.Body className="p-4">
          <div className="mb-3">
            <FaCheckCircle size={32} style={{ color: colors.secondary }} />
          </div>
          <p className={`mb-3 ${playfair.className}`} style={{ 
            fontSize: "1.2rem", 
            color: colors.text,
            lineHeight: "1.6"
          }}>
            Tafadhali{" "}
            <Link href="/auth" className="fw-bold text-decoration-none" style={{ 
              color: colors.primary
            }}>
              ingia kwenye akaunti yako
            </Link>{" "}
            ili uweze kuweka ahadi.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

// Pledge Modal Component
export const PledgeModal = ({ 
  showModal, 
  selectedOption, 
  onCloseModal,
  isPledge,
  setIsPledge,
  amount,
  setAmount,
  username,
  setUsername,
  phoneNumber,
  setPhoneNumber,
  paymentMethod,
  setPaymentMethod,
  error,
  isLoading,
  onSubmit
}) => (
  <Modal 
    show={showModal} 
    onHide={onCloseModal}
    size="lg"
    centered
    backdrop="static"
    className="animate__animated animate__fadeIn"
  >
    <div style={{
      background: colors.surface,
      borderRadius: "20px",
      overflow: "hidden",
      border: "none"
    }}>
      {/* Modal Header */}
      <div style={{
        background: selectedOption?.gradient || colors.gradient,
        padding: "2rem",
        color: "white",
        position: "relative"
      }}>
        <Button
          onClick={onCloseModal}
          className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
          style={{ 
            opacity: 0.8,
            fontSize: "1.2rem"
          }}
        />
        
        <div className="text-center">
          <div className="mb-3">
            {selectedOption?.icon}
          </div>
          <h3 className={`fw-bold mb-2 ${playfair.className}`} style={{ 
            fontSize: "1.8rem"
          }}>
            {selectedOption?.title}
          </h3>
          <p className="mb-0 opacity-90" style={{ fontSize: "1.1rem" }}>
            Chagua aina ya mchango wako
          </p>
        </div>
      </div>

      {/* Modal Body */}
      <Modal.Body className="p-4" style={{ backgroundColor: colors.surface }}>
        {/* Toggle Buttons */}
        <div className="d-flex gap-2 mb-4 p-1" style={{
          backgroundColor: colors.surfaceElevated,
          borderRadius: "12px"
        }}>
          <Button
            onClick={() => setIsPledge(true)}
            className="flex-fill border-0 fw-semibold d-flex align-items-center justify-content-center"
            style={{ 
              backgroundColor: isPledge ? colors.primary : "transparent",
              color: isPledge ? "white" : colors.textSecondary,
              borderRadius: "8px",
              padding: "12px",
              fontSize: "1rem",
              transition: "all 0.3s ease"
            }}
          >
            <FaCheckCircle className="me-2" />
            Weka Ahadi
          </Button>
          <Button
            onClick={() => setIsPledge(false)}
            className="flex-fill border-0 fw-semibold d-flex align-items-center justify-content-center"
            style={{ 
              backgroundColor: !isPledge ? colors.primary : "transparent",
              color: !isPledge ? "white" : colors.textSecondary,
              borderRadius: "8px",
              padding: "12px",
              fontSize: "1rem",
              transition: "all 0.3s ease"
            }}
          >
            <FaCreditCard className="me-2" />
            Lipa Sasa
          </Button>
        </div>

        <Form>
          {isPledge && (
            <Row>
              <Col md={6}>
                <InputField
                  label="Jina Lako"
                  type="text"
                  placeholder="Ingiza jina lako kamili"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  icon={<FaUser />}
                />
              </Col>
              <Col md={6}>
                <InputField
                  label="Namba ya Simu"
                  type="tel"
                  placeholder="+255 xxx xxx xxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  icon={<FaPhone />}
                />
              </Col>
            </Row>
          )}

          <InputField
            label="Kiasi"
            type="number"
            placeholder="Ingiza kiasi kwa TZS (mfano: 50000)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            icon={<FaDollarSign />}
          />

          {!isPledge && (
            <Form.Group className="mb-4">
              <Form.Label className={`fw-semibold ${cormorant.className}`} style={{ 
                fontSize: "1.1rem", 
                color: colors.text,
                marginBottom: "8px"
              }}>
                Njia ya Malipo <span style={{ color: colors.secondary }}>*</span>
              </Form.Label>
              <Form.Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
                style={{ 
                  fontSize: "1rem",
                  padding: "16px 20px",
                  border: `2px solid ${colors.border}`,
                  borderRadius: "12px",
                  backgroundColor: colors.surface,
                  transition: "all 0.3s ease",
                  color: colors.text
                }}
              >
                <option value="" disabled>
                  Chagua njia ya malipo
                </option>
                {paymentOptions.map((method) => (
                  <option key={method.id} value={method.name}>
                    {method.icon} {method.name} - {method.number}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
        </Form>

        {error && (
          <div className="alert alert-danger border-0 rounded-3 mb-4" style={{ 
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#dc2626",
            fontSize: "1rem"
          }}>
            <strong>Hitilafu:</strong> {error}
          </div>
        )}

        {/* Amount Preview */}
        {amount && (
          <div className="text-center mb-4 p-3 rounded-3" style={{
            background: colors.gradientCard,
            border: `1px solid ${colors.border}`
          }}>
            <h5 className={`mb-0 ${playfair.className}`} style={{ color: colors.primary }}>
              Jumla: {formatCurrency(Number(amount))}
            </h5>
          </div>
        )}

        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="w-100 border-0 fw-bold text-white position-relative overflow-hidden"
          style={{ 
            background: colors.gradient,
            borderRadius: "12px",
            padding: "16px",
            fontSize: "1.2rem",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 25px rgba(59, 130, 246, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)";
          }}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Inawasilisha...
            </>
          ) : (
            <>
              {isPledge ? "Weka Ahadi Yangu" : "Lipa Sasa"}
              {amount && (
                <span className="ms-2 opacity-75">
                  ({formatCurrency(Number(amount))})
                </span>
              )}
            </>
          )}
        </Button>
      </Modal.Body>
    </div>
  </Modal>
);