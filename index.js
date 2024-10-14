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
    CPU_Base_Clock: Number,
    PriceCPU: Number,
    BrandMainboard: String,
    ModelMainboard: String,
    Mainboard_CPU_Support: String,
    MemoryMainboard: Number,
    Mainboard_Memory_Support: String,
    PriceMainboard: Number,
    BrandVGA: String,
    ChipsetVGA: String,
    SeriesVGA: String,
    ModelVGA: String,
    VGA_Base_Clock: Number,
    VGA_Boost_Clock: Number,
    VGA_Memory_Clock: Number,
    VGA_Memory_Size: Number,
    PriceVGA: Number,
    RAM_Size: Number,
    RAM_Speed: Number,
    PriceRAM: Number,
    CapacitySSD: Number,
    Read_SSD: Number,
    Write_SSD: Number,
    PriceSSD: Number,
    CapacitySSD2: Number,
    Read_SSD2: Number,
    Write_SSD2: Number,
    PriceSSD2: Number,
    CapacityHDD: Number,
    Speed_HDD: Number,
    PriceHDD: Number,
    PS: Number,
    PricePS: Number,
    BrandCASE: String,
    ModelCASE: String,
    WeightCASE: Number,
    I_O_Ports_CASE: String,
    PriceCASE: Number,
    BrandCOOLING: String,
    ModelCOOLING: String,
    Fan_Built_In_COOLING: String,
    PriceCOOLING: Number,
    BrandMONITOR: String,
    ModelMONITOR: String,
    Display_Size_MONITOR: Number,
    Max_Resolution_MONITOR: String,
    Refresh_Rate_MONITOR: Number,
    PriceMONITOR: Number,
    Rank1: String,
    Rank2: String,
    Rank3: String
  });

// สร้างโมเดลจาก Schema
const Spec = mongoose.model('spec_com', computerSchema, 'spec_com');

app.set('view engine', 'ejs');

app.use(express.static('public'));

// Route สำหรับแสดงรายการในรูปแบบ pagination


// หน้าแรก
app.get('/', (req, res) => {
    const specs = []; // กำหนดค่าเริ่มต้นเป็นว่างเปล่า
    res.render('index', { specs: specs, query: '' }); // เริ่มที่หน้าแรก
});

app.get('/search', async (req, res) => {
    const query = req.query.query || ''; // รับคำค้นจากฟอร์ม

    try {
        // ค้นหาใน MongoDB โดยเช็คจาก ModelCPU หรือ ModelMainboard หรือ ModelVGA
        const specs = await Spec.find({
            $or: [
                { ModelCPU: { $regex: query, $options: 'i' } },
                { ModelVGA: { $regex: query, $options: 'i' } },
            ]
        });

        // ส่งข้อมูลผลการค้นหากลับไปที่หน้า index
        res.render('index', { specs: specs, query: query });
    } catch (err) {
        res.status(500).send('Error retrieving specs');
    }
});

// หน้า com_list
app.get('/com_list', (req, res) => {
    res.redirect('/com_list/page/1');
});

app.get('/com_list/page/:pageNumber', async (req, res) => {
    const page = parseInt(req.params.pageNumber) || 1; // หน้าที่ผู้ใช้ขอ
    const limit = 10; // จำนวนรายการต่อหน้า
    const skip = (page - 1) * limit;

    try {
        // ดึงข้อมูลจาก MongoDB collection 'speccom' พร้อม pagination
        const specs = await Spec.find().skip(skip).limit(limit);

        // ดึงข้อมูลทั้งหมดเพื่อคำนวณจำนวนหน้า
        const totalSpecs = await Spec.countDocuments();

        const totalPages = Math.ceil(totalSpecs / limit); // คำนวณจำนวนหน้าทั้งหมด

        // ส่งข้อมูลไปยังหน้า com_list
        res.render('com_list', { 
            specs: specs, 
            currentPage: page, 
            totalPages: totalPages, 
            query: ''
        });
    } catch (err) {
        res.status(500).send('Error retrieving specs');
    }
});

app.get('/com_list/search', async (req, res) => {
    const query = req.query.query || ''; // รับคำค้น
    const page = parseInt(req.query.page) || 1; // หน้าที่ผู้ใช้ขอ
    const limit = 10; // จำนวนรายการต่อหน้า
    const skip = (page - 1) * limit;

    if (!query) {
        return res.redirect('/com_list/page/1');
    }

    try {
        // ค้นหาจากชื่อคอมพิวเตอร์หรือซีพียู
        const specs = await Spec.find({
            $or: [
                { ModelCPU: { $regex: query, $options: 'i' } },
                { ModelVGA: { $regex: query, $options: 'i' } },
            ]
        })
        .skip(skip)
        .limit(limit);

        const totalSpecs = await Spec.countDocuments({
            $or: [
                { ModelCPU: { $regex: query, $options: 'i' } },
                { ModelVGA: { $regex: query, $options: 'i' } },
            ]
        });

        const totalPages = Math.ceil(totalSpecs / limit);

        res.render('com_list', {
            specs: specs,
            currentPage: page,
            totalPages: totalPages,
            query: query // ส่งคำค้นไปยังหน้าผลลัพธ์
        });
    } catch (err) {
        res.status(500).send('Error searching specs');
    }
});

app.get('/companent', (req, res) => {
    res.render('components')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
