const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    originalFileName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    jobRecommendations: [
        {
            title: String,
            description: String,
            skills: [String],
            education: String,
            location: String,
        },
    ],
    analysis: {
        contact: {
            email: { type: String, default: "N/A" },
            phone: { type: String, default: "N/A" },
            linkedin: { type: String, default: "N/A" },
        },
        skills: [String],
        education: {
            degree: { type: String, default: "N/A" },
            institution: { type: String, default: "N/A" },
            graduationYear: { type: String, default: "N/A" },
            gpa: { type: String, default: "N/A" },
        },
        experience: [
            {
                position: String,
                company: String,
                duration: String,
                description: String,
            },
        ],
        qualityScore: {
            overall: { type: Number, default: 0 },
            details: {
                content: { type: Number, default: 0 },
                skills: { type: Number, default: 0 },
                experience: { type: Number, default: 0 },
                format: { type: Number, default: 0 },
            },
        },
        improvementTips: [
            {
                section: String,
                priority: String,
                suggestion: String,
            },
        ],
    },
}, { timestamps: true });

const Resume = mongoose.model('Resume', ResumeSchema);

module.exports = Resume;