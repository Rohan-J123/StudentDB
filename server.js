const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    rollNo: String,
    name: String,
    degree: String,
    city: String
});

const Student = mongoose.model('Student', studentSchema); // Added this line

mongoose.connect('mongodb://localhost:27017/StudentDB', {
    useNewUrlParser: true, // Corrected typo here
    useUnifiedTopology: true
})

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended:true}))

app.get('/', async (req, res)=>{
    const students = await Student.find()
    res.render('index', {students})
})

app.post('/save', async (req, res)=>{
    const {rollNo, name, degree, city} = req.body
    const students = new Student({rollNo, name, degree, city})
    await students.save()
    res.redirect('/')
})

app.use(express.json());

app.put('/students/:rollNo', async (req, res) => {
    const rollNo = req.params.rollNo;
    const newData = req.body;

    console.log(newData);

    try {
        const updatedStudent = await Student.findOneAndUpdate({ rollNo: rollNo }, newData, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student record updated successfully', updatedStudent });
    } catch (error) {
        console.error('Error updating student record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/students/:rollNo', async (req, res) => {
    const rollNo = req.params.rollNo;

    try {
        const deletedStudent = await Student.findOneAndDelete({ rollNo: rollNo });

        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully', deletedStudent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port);
