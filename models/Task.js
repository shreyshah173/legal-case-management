const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignees: [{ type: String }],
    reporter: { type: String },
    team: { type: String },
    date: { type: Date },
    priority: { type: String, enum: ['Low', 'Medium', 'High'] },
    stage: { type: String }
});

module.exports = mongoose.model('Task', TaskSchema);
