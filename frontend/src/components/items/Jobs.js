import React from "react";
import { useLocation } from "react-router-dom";
import { Tab, Tabs, Card, Row, Col, Badge, Table, Button } from "react-bootstrap";
import { FaBriefcase, FaMapMarkerAlt, FaGraduationCap, FaEnvelope, FaPhone, FaLinkedin } from "react-icons/fa";

const Jobs = () => {
  const location = useLocation();
  const jobRecommendations = location.state?.jobRecommendations || [];
  const analysis = location.state?.analysis || null;

  return (
    <div className="container mt-5">
      <Tabs defaultActiveKey="analysis" id="resume-tabs" className="mb-4" fill>
        {/* ------------------------- */}
        {/* View Analysis Tab */}
        {/* ------------------------- */}
        <Tab eventKey="analysis" title="View Analysis">
          {!analysis ? (
            <h5 className="text-center mt-4">No analysis available.</h5>
          ) : (
            <div className="mt-4">
              <h4 className="mb-3">📄 Extracted Data</h4>

              {/* Contact */}
              {analysis.contact && (
                <Card className="mb-3 shadow-sm">
                  <Card.Header>Contact Information</Card.Header>
                  <Card.Body>
                    {analysis.contact.email && (
                      <p><FaEnvelope className="me-2" /> Email: {analysis.contact.email}</p>
                    )}
                    {analysis.contact.phone && (
                      <p><FaPhone className="me-2" /> Phone: {analysis.contact.phone}</p>
                    )}
                    {analysis.contact.linkedin && (
                      <p>
                        <FaLinkedin className="me-2" /> LinkedIn:{" "}
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
                <Card className="mb-3 shadow-sm">
                  <Card.Header>Skills</Card.Header>
                  <Card.Body>
                    {analysis.skills.map((skill, i) => (
                      <Badge key={i} bg="info" className="me-1 mb-1">{skill}</Badge>
                    ))}
                  </Card.Body>
                </Card>
              )}

              {/* Education */}
              {analysis.education && (
                <Card className="mb-3 shadow-sm">
                  <Card.Header>Education</Card.Header>
                  <Card.Body>
                    <p><FaGraduationCap className="me-2" /> {analysis.education.degree} from {analysis.education.institution}</p>
                    {analysis.education.graduationYear && <p>Graduation Year: {analysis.education.graduationYear}</p>}
                    {analysis.education.gpa && <p>GPA: {analysis.education.gpa}</p>}
                  </Card.Body>
                </Card>
              )}

              {/* Experience */}
              {analysis.experience?.length > 0 && (
                <Card className="mb-3 shadow-sm">
                  <Card.Header>Experience</Card.Header>
                  <Card.Body>
                    {analysis.experience.map((exp, i) => (
                      <div key={i} className="mb-2">
                        <strong>{exp.position}</strong> at {exp.company} ({exp.duration})
                        {exp.description && <p>{exp.description}</p>}
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              )}

              {/* Quality Score */}
              {analysis?.qualityScore?.details ? (
                <Card className="mb-3 shadow-sm">
                  <Card.Header>📊 Quality Score</Card.Header>
                  <Card.Body>
                    <p>Overall Score: <strong>{analysis.qualityScore.overall}/100</strong></p>
                    <Table striped bordered hover size="sm">
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
                <Card className="mb-3 shadow-sm">
                  <Card.Header>📈 Improvement Tips</Card.Header>
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
                      <Card.Title className="mb-2" style={{ fontWeight: "600", fontSize: "1.2rem" }}>{job.title}</Card.Title>
                      {job.location && <div className="mb-2 text-muted d-flex align-items-center"><FaMapMarkerAlt className="me-1" /> {job.location}</div>}
                      {job.education && <div className="mb-2 text-muted d-flex align-items-center"><FaGraduationCap className="me-1" /> {job.education}</div>}
                      <Card.Text className="flex-grow-1">{job.description}</Card.Text>
                      {job.skills?.length > 0 && (
                        <div className="mb-3">
                          {job.skills.map((skill, i) => (
                            <Badge key={i} bg="info" className="me-1 mb-1" style={{ fontSize: "0.8rem" }}>{skill}</Badge>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto">
                        <Button variant="primary" className="w-100">Apply Now</Button>
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
