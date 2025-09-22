import React from "react";
import { useLocation } from "react-router-dom";
import { Card, Row, Col, ProgressBar, Badge } from "react-bootstrap";
import { FaStar, FaLightbulb } from "react-icons/fa";

const ResumeAnalysis = () => {
  const location = useLocation();
  const { qualityScore, improvementTips, extractedData } = location.state || {};

  // If no data passed, show message
  if (!qualityScore || !improvementTips) {
    return <h4 className="text-center mt-5">No resume analysis data available.</h4>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5" style={{ fontWeight: 700 }}>
        📊 Resume Analysis
      </h2>

      {/* Quality Score Section */}
      <Card className="mb-5 shadow-lg rounded-4 p-4">
        <h4 className="mb-3">
          <FaStar className="me-2" /> Quality Score
        </h4>
        <p>Overall Resume Score: <strong>{qualityScore.overall}/100</strong></p>
        <ProgressBar now={qualityScore.overall} label={`${qualityScore.overall}%`} className="mb-4" />

        <Row>
          {["content", "skills", "experience", "format"].map((key) => (
            <Col md={6} className="mb-3" key={key}>
              <Card className="p-3 h-100 border-0 shadow-sm">
                <h6>{key.charAt(0).toUpperCase() + key.slice(1)}</h6>
                <ProgressBar now={qualityScore[key]} label={`${qualityScore[key]}%`} />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Improvement Tips Section */}
      <Card className="shadow-lg rounded-4 p-4">
        <h4 className="mb-4">
          <FaLightbulb className="me-2" /> Improvement Tips
        </h4>
        {improvementTips.map((tip, index) => (
          <Card key={index} className="mb-3 p-3 border-0 shadow-sm">
            <Row className="align-items-center">
              <Col md={3}>
                <Badge
                  bg={tip.priority === "High" ? "danger" : tip.priority === "Medium" ? "warning" : "secondary"}
                  className="fs-6"
                >
                  {tip.priority} Priority
                </Badge>
              </Col>
              <Col md={9}>
                <h6 className="mb-1">{tip.category}</h6>
                <p className="mb-0">{tip.suggestion}</p>
              </Col>
            </Row>
          </Card>
        ))}
      </Card>

      {/* Optional Extracted Data Section */}
      {extractedData && (
        <Card className="mt-5 shadow-lg rounded-4 p-4">
          <h4 className="mb-4">📋 Extracted Data</h4>
          <pre>{JSON.stringify(extractedData, null, 2)}</pre>
        </Card>
      )}
    </div>
  );
};

export default ResumeAnalysis;
