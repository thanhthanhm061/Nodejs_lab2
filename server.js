const { writeFile } = require('fs');
const { createServer } = require('http');
const Logger = require('./logger'); 
const { type, platform, totalmem, freemem, cpus } = require('os');

// Tạo một instance của Logger
const logger = new Logger();

// Địa chỉ hostname và port cho server
const hostname = '127.0.0.1';
const port = 3000;

// Lắng nghe sự kiện 'print computer\'s infos'
logger.on('print computer\'s infos', () => {
    console.log('Hoàn thành nhiệm vụ ghi thông tin hệ thống.');
});

// Thu thập thông tin hệ thống
const information = {
    osType: type(),
    platform: platform(),
    totalRAM: (totalmem() / (1024 ** 3)).toFixed(2) + ' GB',
    usedRAM: ((totalmem() - freemem()) / (1024 ** 3)).toFixed(2) + ' GB',
    CPU: cpus().map(cpu => ({
        model: cpu.model,
        speed: cpu.speed + ' MHz'
    }))
};

// Tạo HTTP server
const server = createServer((req, res) => {
    if (req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(information, null, 2));
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Page not found');
    }
});

// Khởi động server và xử lý lỗi
server.listen(port, hostname, (err) => {
    if (err) {
        logger.info('Lỗi khi khởi động server: ' + err.message);
        return;
    }
    console.log(`Server đang chạy tại http://${hostname}:${port}/`);
    logger.info('Server khởi động thành công');
});

// Ghi thông tin hệ thống vào file
writeFile('D:\DaiHocDongA\FILE HOC\N3\LTMN_1\Lab2', JSON.stringify(information, null, 2), (err) => {
    if (err) {
        console.log('Lỗi ghi file: ', err);
        return;
    }
    // Phát sự kiện sau khi ghi file thành công
    logger.emit('print computer\'s infos');
    logger.info('Thông tin hệ thống đã được ghi vào file');
});
