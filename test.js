const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
// เชื่อมต่อกับ MongoDBmongodb+srv://kenny:Bihbk4EGAj6JwqxZ@cluster0.olj3q.mongodb.net/
mongoose.connect('mongodb+srv://kenny:Bihbk4EGAj6JwqxZ@cluster0.olj3q.mongodb.net/spec?retryWrites=true&w=majority&appName=Cluster0', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to MongoDB:", error);
});

// กำหนด Schema
const computerSchema = new mongoose.Schema({
    BrandCPU: String,
    SeriesCPU: String,
    ModelCPU: String,
  });

// สร้างโมเดลจาก Schema
const Spec = mongoose.model("spec_com", computerSchema);

// สร้าง route เพื่อแสดงข้อมูลจาก MongoDB
app.get('/', async (req, res) => {
  try {
    const specs = await Spec.find(); // ดึงข้อมูลทั้งหมดจากคอลเลกชัน comments
    console.log('Data fetched from MongoDB:', specs); // แสดงข้อมูลที่ดึงมาในคอนโซล

    if (specs.length === 0) {
      return res.send('ไม่มีข้อมูลในคอลเลกชัน comments');
    }

    // ส่งข้อมูลทั้งหมดในรูป JSON
    res.json(specs); 

  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err); // แสดงข้อผิดพลาดใน console
    res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
