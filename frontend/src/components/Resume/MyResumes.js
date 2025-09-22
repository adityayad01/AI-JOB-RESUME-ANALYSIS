import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert, ProgressBar, Form } from "react-bootstrap";
import { FaPlus, FaEye, FaTrash, FaDownload } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import moment from "moment";

const MyResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-newest"); // New state for sorting
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/resume/all`, { withCredentials: true });
      setResumes(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
      setError("Failed to load your resumes. Please try again.");
      toast.error("Failed to load resumes.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDeleteResume = async (resumeId) => {
    if (window.confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      try {
        setLoading(true);
        await axios.delete(`${API_URL}/api/resume/${resumeId}`, { withCredentials: true });
        toast.success("Resume deleted successfully!");
        fetchResumes(); // Re-fetch the list
      } catch (err) {
        console.error("Failed to delete resume:", err);
        toast.error(err.response?.data?.message || "Failed to delete resume.");
        setLoading(false);
      }
    }
  };

  // Step 1: Filter the resumes based on the search term
  const filteredResumes = resumes.filter(resume =>
    resume.originalFileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Step 2: Sort the filtered resumes based on the sortBy state
  const sortedResumes = [...filteredResumes].sort((a, b) => {
    if (sortBy === "date-newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "score-highest") {
        const scoreA = a.analysis?.qualityScore?.overall || 0;
        const scoreB = b.analysis?.qualityScore?.overall || 0;
        return scoreB - scoreA;
    }
    return 0; // Return 0 if no sort option is selected
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="ms-3">Fetching your resume history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: "700", color: "#333" }}>My Resumes</h2>
        <Button
          variant="primary"
          onClick={() => navigate("/upload/resume")}
          style={{ backgroundColor: "#2179f5", borderColor: "#2179f5", display: "flex", alignItems: "center" }}
        >
          <FaPlus className="me-2" /> Upload New
        </Button>
      </div>

      {/* Search and Sort Controls */}
      <Form className="mb-4">
        <Row className="align-items-center">
          <Col md={8} lg={9} className="mb-2 mb-md-0">
            <Form.Control
              type="text"
              placeholder="Search by file name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: "50px", paddingLeft: "20px" }}
            />
          </Col>
          <Col md={4} lg={3}>
            <Form.Select
              aria-label="Sort by"
              style={{ borderRadius: "50px" }}
              value={sortBy} // Connected to new state
              onChange={(e) => setSortBy(e.target.value)} // Updates the sort state
            >
              <option value="date-newest">Upload Date (Newest)</option>
              <option value="score-highest">Score (Highest)</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      <Row>
        {sortedResumes.length === 0 ? ( // Check the length of the sorted array
          <Col xs={12} className="text-center mt-5">
            <h4 className="text-muted">No resumes found.</h4>
            {resumes.length > 0 && searchTerm && (
              <p className="text-muted">Your search did not match any resumes.</p>
            )}
            {resumes.length === 0 && !searchTerm && (
              <p className="text-muted">Click "Upload New" to get started!</p>
            )}
          </Col>
        ) : (
          sortedResumes.map((resume) => ( // ✅ Maps over the sorted and filtered array
            <Col md={6} lg={4} key={resume._id} className="mb-4">
              <Card className="h-100 shadow-sm border-0 rounded-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Card.Title className="mb-0 text-primary" style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                      {resume.originalFileName}
                    </Card.Title>
                    {resume.analysis?.qualityScore?.overall !== undefined && (
                      <span className="text-success" style={{ fontWeight: "bold" }}>
                        {resume.analysis.qualityScore.overall}/100
                      </span>
                    )}
                  </div>
                  <Card.Text className="text-muted" style={{ fontSize: "0.9rem" }}>
                    Uploaded {moment(resume.createdAt).format("MMMM D, YYYY")}
                  </Card.Text>

                  {resume.analysis?.qualityScore?.overall !== undefined && (
                    <ProgressBar
                      now={resume.analysis.qualityScore.overall}
                      variant={
                        resume.analysis.qualityScore.overall >= 80 ? "success" :
                        resume.analysis.qualityScore.overall >= 60 ? "warning" : "danger"
                      }
                      className="mb-3"
                      style={{ height: "8px" }}
                    />
                  )}
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <Button
                      as={Link}
                      to={`/ai-insights/${resume._id}`}
                      variant="primary"
                      className="flex-grow-1 me-2"
                      style={{ backgroundColor: "#2179f5", borderColor: "#2179f5", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <FaEye className="me-2" /> View Analysis
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => window.open(`${API_URL}/api/resume/download/${resume._id}`, '_blank')}
                      style={{ border: "none", background: "transparent", color: "#6c757d" }}
                      title="Download"
                    >
                      <FaDownload size={20} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDeleteResume(resume._id)}
                      style={{ border: "none", background: "transparent", color: "#dc3545" }}
                      title="Delete"
                    >
                      <FaTrash size={20} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default MyResumes;