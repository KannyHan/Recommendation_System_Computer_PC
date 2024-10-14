const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const { Parser } = require('json2csv');
const fs = require('fs');
const puppeteer = require('puppeteer');
// เชื่อมต่อกับ MongoDBmongodb+srv://kenny:Bihbk4EGAj6JwqxZ@cluster0.olj3q.mongodb.net/
mongoose.connect('mongodb+srv://kenny:Bihbk4EGAj6JwqxZ@cluster0.olj3q.mongodb.net/spec?retryWrites=true&w=majority&appName=Cluster0', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to MongoDB:", error);
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));
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


// หน้าแอคมิน
app.use(session({
    secret: 'KennyKey', // ใช้เป็นความลับในการเข้ารหัสเซสชัน
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://kenny:Bihbk4EGAj6JwqxZ@cluster0.olj3q.mongodb.net/spec?retryWrites=true&w=majority&appName=Cluster0' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // อายุของคุกกี้ (1 วัน)
}));

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const Admin = mongoose.model('com_admin', adminSchema, 'com_admin');

app.get('/register', (req, res) => {
    res.render('registerAdmin'); // หน้าลงทะเบียนสำหรับแอดมิน
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // เข้ารหัสรหัสผ่าน
    const newAdmin = new Admin({
        username: username,
        password: hashedPassword
    });

    try {
        await newAdmin.save();
        res.redirect('/Adminlogin'); // หลังจากสมัครสำเร็จ ให้ไปหน้าล็อกอิน
    } catch (error) {
        res.status(500).send('Error creating admin');
    }
});

app.get('/Adminlogin', (req, res) => {
    res.render('loginAsmin'); // แสดงหน้าล็อกอิน
});

app.post('/Adminlogin', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username: username });
    
    if (admin) {
        const validPassword = await bcrypt.compare(password, admin.password);
        if (validPassword) {
            req.session.adminId = admin._id; // เก็บ session เมื่อเข้าสู่ระบบสำเร็จ
            res.redirect('/admin/dashboard'); // ไปยังหน้าแอดมิน
        } else {
            res.status(400).send('Invalid username or password');
        }
    } else {
        res.status(400).send('Invalid username or password');
    }
});

function requireLogin(req, res, next) {
    if (!req.session.adminId) {
        return res.redirect('/Adminlogin'); // ถ้าไม่ได้ล็อกอินให้กลับไปหน้า login
    }
    next();
}

app.get('/admin/dashboard', requireLogin, (req, res) => {
    res.render('scraping'); // หน้าหลักของแอดมิน
});

async function scrapeLinks(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // ดึงข้อมูลลิงก์จากหน้า
    const productLinks = await page.evaluate(() => {
        const products = [];
        document.querySelectorAll('div.my-list-wrapper ul.my-list-item li.spec-item').forEach(item => {
            const product = {
                link: item.querySelector('.name a').href,
            };
            products.push(product);
        });
        return products;
    });

    await browser.close();
    return productLinks;
}

// ฟังก์ชันดึงข้อมูลจากลิงก์ของอุปกรณ์
async function scrapeProductDetails(productUrl) {
    try {
        const response = await axios.get(productUrl);  // ใช้ productUrl
        const $ = cheerio.load(response.data);

        // ดึงข้อมูลที่ต้องการ
        const specifications = {};
        $('.specificate-list').each((index, element) => {
            const title = $(element).find('.specificate-title').text().trim();
            const info = $(element).find('.specificate-info').text().trim();
            if (title && info) {
                specifications[title] = info;
            }
        });
        return specifications;
    } catch (error) {
        console.error(`Error scraping ${productUrl}:`, error.message); // แสดงข้อมูลผิดพลาด
        return null;
    }
}


// ฟังก์ชันหลักในการดึงข้อมูลและบันทึกเป็น CSV
async function scrapeData(url, res) {
    const productLinks = await scrapeLinks(url); // ดึงลิงก์ทั้งหมด
    const productData = [];

    for (let index = 0; index < productLinks.length; index++) {
        const link = productLinks[index];
        const productDetails = await scrapeProductDetails(link.link);  // ส่งค่าลิงก์เข้าไป
        productData.push(productDetails);

        // แปลงข้อมูลเป็น CSV
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(productDetails);

        // สร้างชื่อไฟล์ตามลิงก์ หรือ index
        const filePath = `products_${index + 1}.csv`;  // ตั้งชื่อไฟล์โดยใช้ index

        // บันทึกไฟล์ CSV
        fs.writeFileSync(filePath, csv);

        // ตรวจสอบไฟล์ที่ถูกสร้าง
        if (fs.existsSync(filePath)) {
            console.log(`File ${filePath} has been created successfully.`);
        } else {
            console.error(`File ${filePath} was not created.`);
        }

        // ส่งไฟล์ให้ผู้ใช้ดาวน์โหลด
        res.download(filePath, (err) => {
            if (err) {
                console.log('Error downloading file:', err);
            } else {
                console.log('File downloaded:', filePath);
            }
        });
    }

    // ส่งข้อมูลทั้งหมดเมื่อเสร็จสิ้น
    return productData; // หรือคืนค่ารายชื่อไฟล์
}

// ใน route handler ส่ง `res` ไปยังฟังก์ชัน scrapeData
app.post('/scrape', async (req, res) => {
    const url = req.body.url; // รับ URL ที่ผู้ใช้กรอก

    try {
        // เรียกใช้ฟังก์ชัน scrapeData และส่ง `res` ไป
        await scrapeData(url, res); // ส่ง `res` ไปที่ scrapeData

    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).send('Error during scraping');
    }
});


app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/Adminlogin'); // เมื่อออกจากระบบแล้วให้กลับไปที่หน้า login
    });
});


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

        const totalPages = Math.ceil(totalSpecs / limit); // คำนวณจำนวนหน้าทั้งหมด
        const maxPagesToShow = 5; // จำนวนหน้าที่จะแสดง
        let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // ถ้าหน้าสุดท้ายเกิน totalPages ให้ขยับ startPage
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        res.render('com_list', {
            specs: specs,
            currentPage: page,
            totalPages: totalPages,
            query: query,
            startPage: startPage,
            endPage: endPage,
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
