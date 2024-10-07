const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

const specs = [
    {
        "CPU": "Intel Core i7-12700K",
        "MB": "ASUS ROG Strix Z690-E",
        "VGA": "NVIDIA GeForce RTX 3080",
        "RAM": "16GB DDR4",
        "SSD": "1TB NVMe",
        "HDD": "2TB SATA",
        "PSU": "750W 80+ Gold",
        "CASE": "Corsair 4000D Airflow",
        "COOLING": "Cooler Master Hyper 212",
        "MONITOR": "27 inch 144Hz"
    },
    {
        "CPU": "AMD Ryzen 5 5600X",
        "MB": "MSI B550-A PRO",
        "VGA": "AMD Radeon RX 6700 XT",
        "RAM": "16GB DDR4",
        "SSD": "500GB NVMe",
        "HDD": "1TB SATA",
        "PSU": "650W 80+ Bronze",
        "CASE": "NZXT H510",
        "COOLING": "Cooler Master Hyper 212",
        "MONITOR": "24 inch 144Hz"
    },
    {
        "CPU": "AMD Ryzen 5 5600X",
        "MB": "MSI B550-A PRO",
        "VGA": "AMD Radeon RX 6700 XT",
        "RAM": "16GB DDR4",
        "SSD": "500GB NVMe",
        "HDD": "1TB SATA",
        "PSU": "650W 80+ Bronze",
        "CASE": "NZXT H510",
        "COOLING": "Cooler Master Hyper 212",
        "MONITOR": "24 inch 144Hz"
    },
    {
        "CPU": "AMD Ryzen 5 5600X",
        "MB": "MSI B550-A PRO",
        "VGA": "AMD Radeon RX 6700 XT",
        "RAM": "16GB DDR4",
        "SSD": "500GB NVMe",
        "HDD": "1TB SATA",
        "PSU": "650W 80+ Bronze",
        "CASE": "NZXT H510",
        "COOLING": "Cooler Master Hyper 212",
        "MONITOR": "24 inch 144Hz"
    },
    {
        "CPU": "AMD Ryzen 5 5600X",
        "MB": "MSI B550-A PRO",
        "VGA": "AMD Radeon RX 6700 XT",
        "RAM": "16GB DDR4",
        "SSD": "500GB NVMe",
        "HDD": "1TB SATA",
        "PSU": "650W 80+ Bronze",
        "CASE": "NZXT H510",
        "COOLING": "Cooler Master Hyper 212",
        "MONITOR": "24 inch 144Hz"
    },
    {
        "CPU": "AMD Ryzen 5 5600X",
        "MB": "MSI B550-A PRO",
        "VGA": "AMD Radeon RX 6700 XT",
        "RAM": "16GB DDR4",
        "SSD": "500GB NVMe",
        "HDD": "1TB SATA",
        "PSU": "650W 80+ Bronze",
        "CASE": "NZXT H510",
        "COOLING": "Cooler Master Hyper 212",
        "MONITOR": "24 inch 144Hz"
    },
    {
        "CPU": "Intel Core i7-12700K",
        "MB": "ASUS ROG Strix Z690-E",
        "VGA": "NVIDIA GeForce RTX 3080",
        "RAM": "16GB DDR4",
        "SSD": "1TB NVMe",
        "HDD": "2TB SATA",
        "PSU": "750W 80+ Gold",
        "CASE": "Corsair 4000D Airflow",
        "COOLING": "Cooler Master Hyper 212",
        "MONITOR": "27 inch 144Hz"
    },
    {
        "CPU": "AMD Ryzen 5 5600X",
        "MB": "MSI B550-A PRO",
        "VGA": "AMD Radeon RX 6700 XT",
        "RAM": "16GB DDR4",
        "SSD": "500GB NVMe",
        "HDD": "1TB SATA",
        "PSU": "650W 80+ Bronze",
        "CASE": "NZXT H510",
        "COOLING": "Cooler Master Hyper 212",
        "MONITOR": "24 inch 144Hz"
    },
    {
        "CPU": "AMD Ryzen 5 5600X",
        "MB": "MSI B550-A PRO",
        "VGA": "AMD Radeon RX 6700 XT",
        "RAM": "16GB DDR4",
        "SSD": "500GB NVMe",
        "HDD": "1TB SATA",
        "PSU": "650W 80+ Bronze",
        "CASE": "NZXT H510",
        "COOLING": "Cooler Master Hyper 212",
        "MONITOR": "24 inch 144Hz"
    },
    {
        "CPU": "AMD Ryzen 5 5600X",
        "MB": "MSI B550-A PRO",
        "VGA": "AMD Radeon RX 6700 XT",
        "RAM": "16GB DDR4",
        "SSD": "500GB NVMe",
        "HDD": "1TB SATA",
        "PSU": "650W 80+ Bronze",
        "CASE": "NZXT H510",
        "COOLING": "Cooler Master Hyper 212",
        "MONITOR": "24 inch 144Hz"
    },
    {
        "CPU": "AMD Ryzen 5 5600X",
        "MB": "MSI B550-A PRO",
        "VGA": "AMD Radeon RX 6700 XT",
        "RAM": "16GB DDR4",
        "SSD": "500GB NVMe",
        "HDD": "1TB SATA",
        "PSU": "650W 80+ Bronze",
        "CASE": "NZXT H510",
        "COOLING": "Cooler Master Hyper 212",
        "MONITOR": "24 inch 144Hz"
    },
    {
        "CPU": "AMD Ryzen 5 5600X",
        "MB": "MSI B550-A PRO",
        "VGA": "AMD Radeon RX 6700 XT",
        "RAM": "16GB DDR4",
        "SSD": "500GB NVMe",
        "HDD": "1TB SATA",
        "PSU": "650W 80+ Bronze",
        "CASE": "NZXT H510",
        "COOLING": "Cooler Master Hyper 212",
        "MONITOR": "24 inch 144Hz"
    }
];

app.get('/page/:pageNumber', (req, res) => {
    const page = parseInt(req.params.pageNumber) || 1; // หน้าที่ผู้ใช้ขอ
    const limit = 10; // จำนวนรายการต่อหน้า
    const skip = (page - 1) * limit; // จำนวนรายการที่ข้าม

    // แบ่งข้อมูลตามหน้าที่เลือก
    const paginatedSpecs = specs.slice(skip, skip + limit);
    
    // คำนวณจำนวนหน้าทั้งหมด
    const totalPages = Math.ceil(specs.length / limit);

    // ส่งข้อมูลไปยังหน้า index
    res.render('index', { 
        specs: paginatedSpecs, 
        currentPage: page, 
        totalPages: totalPages 
    });
});

app.get('/', (req, res) => {
    res.redirect('/page/1'); // เริ่มที่หน้าแรก
});


app.get('/test', (req, res) => {
    res.send('Test')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
