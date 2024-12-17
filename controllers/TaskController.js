const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try {
        const { title, assignee, reporter, team, priority, stage, startDate, endDate } = req.query;

        const filters = {};
        if (title) filters.title = new RegExp(title, 'i'); // Case-insensitive search
        if (assignee) filters.assignees = assignee;
        if (reporter) filters.reporter = reporter;
        if (team) filters.team = team;
        if (priority) filters.priority = priority;
        if (stage) filters.stage = stage;
        if (startDate || endDate) {
            filters.date = {};
            if (startDate) filters.date.$gte = new Date(startDate);
            if (endDate) filters.date.$lte = new Date(endDate);
        }

        const tasks = await Task.find(filters);
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, description, assignees, reporter, team, date, priority, stage } = req.body;
        
        const newTask = new Task({
            title,
            description,
            assignees,
            reporter,
            team,
            date,
            priority,
            stage
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(500).json({ message: 'Error creating task', error: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });

        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Error updating task', error: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
};

