const fs = require('fs');
const path = require('path');

// Tạo thư mục output nếu chưa tồn tại
const outputDir = path.join(process.cwd(), 'output');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    console.log('Đã tạo thư mục output');
}

// Tạo file credentials mẫu
const credentialsPath = path.join(outputDir, 'zalo-credentials.json');
const sampleCredentials = {
    cookie: 'sample_cookie_value_here',
    imei: 'sample_imei_value_here',
    userAgent: 'sample_user_agent_here'
};

fs.writeFileSync(credentialsPath, JSON.stringify(sampleCredentials, null, 2));
console.log('Đã tạo file credentials mẫu tại: ' + credentialsPath);
console.log('Lưu ý: Đây chỉ là dữ liệu mẫu để kiểm tra script. Vui lòng chạy node ZaloLoginViaQRCode để có thông tin đăng nhập thực tế.');
