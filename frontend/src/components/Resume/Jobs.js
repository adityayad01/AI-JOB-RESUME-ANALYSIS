import React, { useState, useEffect } from "react";
import { Tab, Tabs, Card, Row, Col, Badge, Table, Button, Spinner, Alert } from "react-bootstrap";
import { FaBriefcase, FaMapMarkerAlt, FaGraduationCap, FaEnvelope, FaPhone, FaLinkedin } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom"; // Import useParams to get URL parameters

const Jobs = () => {
    // Get the resume ID from the URL. It will be undefined if not present.
    const { resumeId } = useParams();

    const [jobRecommendations, setJobRecommendations] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResumeData = async () => {
            setLoading(true);
            setError(null);

            try {
                if (resumeId) {
                    // Fetch the entire resume document by ID from the backend
                    const response = await axios.get(`${API_URL}/api/resume/${resumeId}`, { withCredentials: true });
                    
                    // Extract the specific fields from the single document's data
                    setJobRecommendations(response.data.jobRecommendations || []);
                    setAnalysis(response.data.analysis || null);
                } else {
                    // Fallback: If no resumeId is provided, fetch the latest resume's data
                    const [recommendationsRes, analysisRes] = await Promise.all([
                        axios.get(`${API_URL}/api/resume/recommendations`, { withCredentials: true }),
                        axios.get(`${API_URL}/api/resume/analysis`, { withCredentials: true }),
                    ]);

                    setJobRecommendations(recommendationsRes.data || []);
                    setAnalysis(analysisRes.data || null);
                }
            } catch (err) {
                console.error("Failed to fetch resume data:", err);
                // The error message is now more descriptive
                setError("Failed to load resume data. It may not exist or you don't have access.");
                toast.error("Failed to load resume data.");
            } finally {
                setLoading(false);
            }
        };

        fetchResumeData();
    }, [resumeId]); // The effect now re-runs whenever the URL parameter (resumeId) changes

    // The rest of the component's JSX (render logic) remains the same
    // as it is already written to handle the data in the `analysis` and `jobRecommendations` states.
    
    if (loading) {
        return (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="ms-3">Fetching resume data...</p>
          </div>
        );
      }
    
      if (error) {
        return (
          <div className="container my-5">
            <Alert variant="danger" className="text-center">{error}</Alert>
          </div>
        );
      }
    
      return (
        <div className="container my-5">
          <Tabs defaultActiveKey="analysis" id="resume-tabs" className="mb-4 d-flex justify-content-center tabs-styled" fill>
            {/* ------------------------- */}
            {/* View Analysis Tab */}
            {/* ------------------------- */}
            <Tab eventKey="analysis" title="View Analysis">
              {!analysis ? (
                <h5 className="text-center mt-4">No analysis available.</h5>
              ) : (
                <div className="mt-4">
                  <h4 className="mb-3" style={{ fontWeight: "600", color: "#333" }}>📄 Extracted Data</h4>
                  
                  {/* Contact */}
                  {analysis.contact && (
                    <Card className="mb-4 shadow-lg border-0 rounded-4">
                      <Card.Header style={{ backgroundColor: "#e3f2fd", borderTopLeftRadius: "16px", borderTopRightRadius: "16px", fontWeight: "bold" }}>
                        Contact Information
                      </Card.Header>
                      <Card.Body>
                        {analysis.contact.email && (
                          <p className="mb-1"><FaEnvelope className="me-2 text-primary" /> Email: {analysis.contact.email}</p>
                        )}
                        {analysis.contact.phone && (
                          <p className="mb-1"><FaPhone className="me-2 text-primary" /> Phone: {analysis.contact.phone}</p>
                        )}
                        {analysis.contact.linkedin && (
                          <p className="mb-1">
                            <FaLinkedin className="me-2 text-primary" /> LinkedIn:{" "}
                            <a href={analysis.contact.linkedin} target="_blank" rel="noopener noreferrer">
                              {analysis.contact.linkedin}
                            </a>
                          </p>
                        )}
                      </Card.Body>
                    </Card>
                  )}
    
                  {/* Skills */}
                  {analysis.skills?.length > 0 && (
                    <Card className="mb-4 shadow-lg border-0 rounded-4">
                      <Card.Header style={{ backgroundColor: "#e3f2fd", borderTopLeftRadius: "16px", borderTopRightRadius: "16px", fontWeight: "bold" }}>
                        Skills
                      </Card.Header>
                      <Card.Body>
                        {analysis.skills.map((skill, i) => (
                          <Badge key={i} bg="primary" className="me-1 mb-1" style={{ backgroundColor: "#2179f5", color: "white" }}>
                            {skill}
                          </Badge>
                        ))}
                      </Card.Body>
                    </Card>
                  )}
    
                  {/* Education */}
                  {analysis.education && (
                    <Card className="mb-4 shadow-lg border-0 rounded-4">
                      <Card.Header style={{ backgroundColor: "#e3f2fd", borderTopLeftRadius: "16px", borderTopRightRadius: "16px", fontWeight: "bold" }}>
                        Education
                      </Card.Header>
                      <Card.Body>
                        <p className="mb-1"><FaGraduationCap className="me-2 text-primary" /> {analysis.education.degree} from {analysis.education.institution}</p>
                        {analysis.education.graduationYear && <p className="mb-1">Graduation Year: {analysis.education.graduationYear}</p>}
                        {analysis.education.gpa && <p className="mb-1">GPA: {analysis.education.gpa}</p>}
                      </Card.Body>
                    </Card>
                  )}
    
                  {/* Experience */}
                  {analysis.experience?.length > 0 && (
                    <Card className="mb-4 shadow-lg border-0 rounded-4">
                      <Card.Header style={{ backgroundColor: "#e3f2fd", borderTopLeftRadius: "16px", borderTopRightRadius: "16px", fontWeight: "bold" }}>
                        Experience
                      </Card.Header>
                      <Card.Body>
                        {analysis.experience.map((exp, i) => (
                          <div key={i} className="mb-3">
                            <strong className="text-primary">{exp.position}</strong> at {exp.company} ({exp.duration})
                            {exp.description && <p className="mt-1 mb-0">{exp.description}</p>}
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  )}
    
                  {/* Quality Score */}
                  {analysis?.qualityScore?.details ? (
                    <Card className="mb-4 shadow-lg border-0 rounded-4">
                      <Card.Header style={{ backgroundColor: "#e3f2fd", borderTopLeftRadius: "16px", borderTopRightRadius: "16px", fontWeight: "bold" }}>
                        📊 Quality Score
                      </Card.Header>
                      <Card.Body>
                        <p className="mb-2">Overall Score: <strong>{analysis.qualityScore.overall}/100</strong></p>
                        <Table striped bordered hover size="sm" className="rounded-3 overflow-hidden">
                          <thead>
                            <tr>
                              <th>Aspect</th>
                              <th>Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(analysis.qualityScore.details).map(([key, value], i) => (
                              <tr key={i}>
                                <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                                <td>{value}/100</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  ) : (
                    <p>No quality score available.</p>
                  )}
    
                  {/* Improvement Tips */}
                  {analysis.improvementTips?.length > 0 && (
                    <Card className="mb-4 shadow-lg border-0 rounded-4">
                      <Card.Header style={{ backgroundColor: "#e3f2fd", borderTopLeftRadius: "16px", borderTopRightRadius: "16px", fontWeight: "bold" }}>
                        📈 Improvement Tips
                      </Card.Header>
                      <Card.Body>
                        {analysis.improvementTips.map((tip, i) => (
                          <div key={i} className="mb-2">
                            <strong>{tip.section} ({tip.priority} priority)</strong>: {tip.suggestion}
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  )}
                </div>
              )}
            </Tab>
    
            {/* ------------------------- */}
            {/* Job Recommendations Tab */}
            {/* ------------------------- */}
            <Tab eventKey="jobs" title="Job Recommendations">
              {!jobRecommendations.length ? (
                <h4 className="text-center mt-5">No job recommendations found.</h4>
              ) : (
                <Row className="mt-4">
                  {jobRecommendations.map((job, index) => (
                    <Col md={6} lg={4} key={index} className="mb-4">
                      <Card className="h-100 shadow-lg border-0 rounded-4">
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{ backgroundColor: "#e3f2fd", height: "80px", borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}
                        >
                          <FaBriefcase size={36} color="#1976d2" />
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="mb-2 text-primary" style={{ fontWeight: "600", fontSize: "1.2rem" }}>{job.title}</Card.Title>
                          {job.location && <div className="mb-2 text-muted d-flex align-items-center"><FaMapMarkerAlt className="me-1" /> {job.location}</div>}
                          {job.education && <div className="mb-2 text-muted d-flex align-items-center"><FaGraduationCap className="me-1" /> {job.education}</div>}
                          <Card.Text className="flex-grow-1">{job.description}</Card.Text>
                          {job.skills?.length > 0 && (
                            <div className="mb-3">
                              {job.skills.map((skill, i) => (
                                <Badge 
                                  key={i} 
                                  className="me-1 mb-1" 
                                  style={{ 
                                    backgroundColor: "#2179f5", 
                                    color: "white", 
                                    fontSize: "0.8rem", 
                                    fontWeight: "normal" 
                                  }}
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="mt-auto">
                            <Button variant="primary" className="w-100" style={{ backgroundColor: "#2179f5", borderColor: "#2179f5" }}>Apply Now</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Tab>
          </Tabs>
        </div>
      );
};
    
export default Jobs;