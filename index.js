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

app.get('/', (req, res) => {
    res.render('index', { specs: specs });
});

app.get('/test', (req, res) => {
    res.send('Test')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
