import React, { useState, useContext, useRef } from "react";
import { Form, Button, Card, Alert, ProgressBar, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import { FaCloudUploadAlt, FaFileAlt, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UploadResume = () => {
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  // Handle file selection
  const handleFileChange = (file) => {
    if (!file) return;

    const allowed = [".pdf", ".doc", ".docx"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      toast.warning("Only PDF, DOC, or DOCX files are allowed");
      return;
    }
    setResume(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = () => setResume(null);

  // Submit resume to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return setError("Please select a resume file");

    setLoading(true);
    setError("");
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      if (user) formData.append("userId", user._id);

      const res = await axios.post(`${API_URL}/api/resume/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      });

      toast.success("✓ Resume uploaded successfully!");

      // Navigate to Jobs page with both jobRecommendations and analysis
      navigate("/jobs", {
        state: { 
          jobRecommendations: res.data.jobRecommendations || [],
          analysis: res.data.analysis || null, // Pass analysis here
        },
      });
    } catch (err) {
      setError(err.response?.data?.error || "Error uploading resume");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh", backgroundColor: "#f8f9fa", padding: "20px" }}
    >
      <div className="w-100" style={{ maxWidth: "1100px" }}>
        <Card className="p-5 shadow-lg rounded">
          <Row>
            {/* Upload Section */}
            <Col md={7}>
              <Card.Body>
                <h1 className="text-center mb-3">
                  <FaCloudUploadAlt /> Upload Your Resume
                </h1>
                <p className="text-muted text-center mb-4">
                  Upload your resume and let our AI recommend the best job opportunities for you.
                </p>
                {error && <Alert variant="danger">{error}</Alert>}

                <div
                  className="mb-3 p-5 text-center border rounded"
                  style={{ borderStyle: "dashed", cursor: "pointer", backgroundColor: "#fefefe" }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current.click()}
                >
                  {resume ? (
                    <div className="d-flex align-items-center justify-content-center gap-3">
                      <FaFileAlt size={28} />
                      <span>
                        {resume.name} ({(resume.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                      >
                        <FaTimes />
                      </Button>
                    </div>
                  ) : (
                    <div style={{ fontSize: "1rem", color: "#6c757d" }}>
                      Drag & drop your resume here, or click to select a file
                    </div>
                  )}
                </div>

                <Form.Control
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />

                <div className="d-grid mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading || !resume}
                  >
                    {loading ? "Uploading..." : "Upload Resume"}
                  </Button>
                </div>

                {loading && (
                  <ProgressBar
                    animated
                    now={progress}
                    label={`${progress}%`}
                    className="mt-3"
                  />
                )}
              </Card.Body>
            </Col>

            {/* Tips Section */}
            <Col md={5}>
              <Card className="p-4 bg-light h-100">
                <h4>Pro Tips for a Great Resume</h4>
                <ul>
                  <li>Keep your resume updated with latest skills.</li>
                  <li>Highlight achievements and measurable results.</li>
                  <li>Use clear headings and concise bullet points.</li>
                  <li>Tailor your resume to match job requirements.</li>
                  <li>Check formatting and grammar before uploading.</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default UploadResume;
