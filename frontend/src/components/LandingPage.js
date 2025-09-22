import React, { useContext } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFileAlt, FaChartLine, FaUserTie, FaRobot } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const LandingPage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section py-5 bg-primary text-white">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold">SmartHire</h1>
              <h2 className="mb-4">Your AI-powered Career Companion</h2>
              <p className="lead mb-4">
                Upload your resume, get AI-driven insights, improve your skills,
                and discover job opportunities tailored for you.
              </p>
              <div className="d-flex gap-3">
                {isAuthenticated ? (
                  <Link to="/upload-resume">
                    <Button variant="light" size="lg">Upload Resume</Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button variant="outline-light" size="lg">Get Started</Button>
                  </Link>
                )}
              </div>
            </Col>

          </Row>
        </Container>
      </div>

      {/* How It Works Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5">How SmartHire Works</h2>
        <Row>
          <Col md={3} className="mb-4">
            <Card className="h-100 text-center p-3">
              <div className="text-primary mb-3">
                <FaFileAlt size={50} />
              </div>
              <Card.Body>
                <Card.Title>Upload Resume</Card.Title>
                <Card.Text>
                  Students and freshers upload resumes for AI-based parsing and analysis.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="h-100 text-center p-3">
              <div className="text-primary mb-3">
                <FaChartLine size={50} />
              </div>
              <Card.Body>
                <Card.Title>AI Insights</Card.Title>
                <Card.Text>
                  Get detailed analysis of skills, gaps, and resume quality scores.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="h-100 text-center p-3">
              <div className="text-primary mb-3">
                <FaUserTie size={50} />
              </div>
              <Card.Body>
                <Card.Title>Job Matching</Card.Title>
                <Card.Text>
                  Discover job opportunities intelligently matched to your profile.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="h-100 text-center p-3">
              <div className="text-primary mb-3">
                <FaRobot size={50} />
              </div>
              <Card.Body>
                <Card.Title>Mock Interview Bot</Card.Title>
                <Card.Text>
                  Practice interviews with an AI bot tailored to your skills and resume.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Impact / Statistics Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-5">Why Choose SmartHire?</h2>
          <Row className="text-center">
            <Col md={4} className="mb-4">
              <h2 className="display-4 fw-bold text-primary">1000+</h2>
              <p className="lead">Resumes Analyzed</p>
            </Col>
            <Col md={4} className="mb-4">
              <h2 className="display-4 fw-bold text-primary">85%</h2>
              <p className="lead">Improved Interview Outcomes</p>
            </Col>
            <Col md={4} className="mb-4">
              <h2 className="display-4 fw-bold text-primary">500+</h2>
              <p className="lead">Job Matches Provided</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <Container className="py-5 text-center">
        <h2 className="mb-4">Boost Your Career with SmartHire</h2>
        <p className="lead mb-4">
          Leverage AI to polish your resume, close skill gaps, and secure your dream job.
        </p>
        <div className="d-flex justify-content-center gap-3">
          {isAuthenticated ? (
            <Link to="/upload-resume">
              <Button variant="primary" size="lg">Upload Resume</Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button variant="primary" size="lg">Sign Up Free</Button>
            </Link>
          )}
          <Link to="/dashboard">
            <Button variant="outline-primary" size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </Container>

      {/* Custom CSS */}
      <style>{`
        .landing-page .hero-section {
          background: linear-gradient(135deg, #4a6bff 0%, #2541b2 100%);
        }
        .landing-page .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 10px;
        }
        .landing-page .card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
