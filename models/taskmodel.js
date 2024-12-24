const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true
    }
}, {timestamps: true});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
