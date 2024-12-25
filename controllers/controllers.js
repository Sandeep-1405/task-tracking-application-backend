const Task = require("../models/taskmodel");
const Register = require("../models/registermodel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Signup
const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    console.log(req.body);

    try {
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Register({ name, email, password: hashedPassword });
        await newUser.save();
        
        //console.log(newUser);

        res.status(200).json({ message: "User registered successfully!" });
    } catch (error) {
        console.log("error :", error.message);
        res.status(500).json({ message: error.message });
    }
};

//login
const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userDetails = await Register.findOne({ email });
        if (!userDetails) {
            return res.status(404).json({ message: "Invalid email" });
        }

        const isPasswordValid = await bcrypt.compare(password, userDetails.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        //console.log(userDetails._id.toString())
        console.log("User logged in successfully");

        const jwtToken = jwt.sign({userId: userDetails._id.toString(), email }, process.env.JWT_SECRET);
        
        return res.status(200).json({ message: "Login successful" , jwtToken});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
};

//authentication
const authentication = async (req, res, next) => {
    let jwtToken;
    const authHeader = req.headers["authorization"];
    if(authHeader !== undefined){
        jwtToken = authHeader.split(' ')[1];
    }

    if (jwtToken === undefined){
        return res.status(401).json({message: "Invalid Jwt Token"})
    }

    try{
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
        //console.log(payload.userId);
        req.userId = payload.userId;
        next();

    }catch(error){
        console.log(error.message);
        return res.status(500).json({error: error.message})
    }

}

const getAllTasks = async (req,res) => {
    const userId = req.userId;

    try{
        const taskList = await Task.find({userId});
        //console.log(taskList);
        res.status(200).json({taskList})
    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
}

const createTask = async (req, res) => {
    const userId = req.userId; 
    const data = { ...req.body, userId };

    try {
        
        const task = new Task(data);
        await task.save();

        res.status(201).json({ message: 'Task Added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getTaskById = async(req,res) => {
    const {id} = req.params;

    try{
        const task = await Task.findById({_id:id});
        res.status(200).json({task});
    }catch(error){
        console.log(error);
        res.status(500).json({error});
    }
}

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { name, description, dueDate, status, priority } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { name, description, dueDate, status, priority },
            { new: true }
        );

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

const deleteTask = async (req,res)=>{
    const {id} = req.params;
    try{
        await Task.findByIdAndDelete(id);
        res.status(200).json({message:"Task Deleted"});
    }catch(error){
        console.log(error);
        res.status(500).json({ error });
    }
}

const getTaskByCategory = async (req,res) => {
    const {value} = req.params;
    const userId = req.userId
    try{
        const task = await Task.find({userId,status:value});
        res.status(200).json(task);
    }catch(error){
        console.log(error);
        res.status(500).json({ error });
    }
}

const getTaskBySearchValue = async (req, res) => {
    const { value } = req.params; 
    const userId = req.userId;

    try {
        const tasks = await Task.find({
            userId,
            $or: [
                { name: { $regex: value, $options: 'i' } },
                { description: { $regex: value, $options: 'i' } }
            ]
        });

        res.status(200).json(tasks);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error});
    }
};

module.exports = getTaskBySearchValue;


module.exports = {
    createUser,
    userLogin,
    authentication,
    getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskByCategory,
    getTaskBySearchValue
}