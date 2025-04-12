const { Zalo } = require('zca-js');
const fs = require('fs');
const path = require('path');

// Tạo thư mục output nếu chưa tồn tại
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

console.log('Khởi tạo Zalo...');
const zalo = new Zalo({
  selfListen: true,
  logging: true,
});

console.log('Bắt đầu quá trình tạo QR code...');

// Tạo QR code
zalo.loginQR({
  onQR: (event) => {
    console.log('Nhận được sự kiện QR, loại:', event.type);

    if (event.type === 0 && event.data && event.data.image) {
      // QR code đã được tạo
      const qrCodeBase64 = event.data.image;
      console.log('QR code đã được tạo thành công!');

      // Lưu QR code vào thư mục output
      const qrCodeOutputPath = path.join(outputDir, 'zalo-qr-code.png');
      fs.writeFileSync(qrCodeOutputPath, Buffer.from(qrCodeBase64, 'base64'));
      console.log('QR code đã được lưu vào:', qrCodeOutputPath);

      // Lưu chuỗi base64 vào file text để dễ sử dụng
      const base64OutputPath = path.join(outputDir, 'zalo-qr-base64.txt');
      fs.writeFileSync(base64OutputPath, qrCodeBase64);
      console.log('Chuỗi base64 đã được lưu vào:', base64OutputPath);

      console.log('Hãy sử dụng chuỗi base64 này với node "Zalo QR to File" trong n8n');
      console.log('Chọn chế độ "Convert Base64 to File" và nhập chuỗi base64 từ file text');
    } else if (event.type === 1) {
      // QR code đã được quét
      console.log('QR code đã được quét. Đang chờ xác nhận...');
    } else if (event.type === 2) {
      // Đăng nhập thành công
      console.log('Đăng nhập thành công!');

      try {
        // Lấy thông tin đăng nhập
        const context = zalo.getContext ? zalo.getContext() : {};
        const cookie = context.cookie || '';
        const imei = context.imei || '';
        const userAgent = context.userAgent || '';

        console.log('Thông tin đăng nhập:');
        console.log('Cookie:', cookie ? 'Đã nhận' : 'Không có');
        console.log('IMEI:', imei ? 'Đã nhận' : 'Không có');
        console.log('User Agent:', userAgent ? 'Đã nhận' : 'Không có');

        // Lưu thông tin đăng nhập vào file
        const credentialsPath = path.join(outputDir, 'zalo-credentials.json');
        fs.writeFileSync(credentialsPath, JSON.stringify({ cookie, imei, userAgent }, null, 2));
        console.log('Thông tin đăng nhập đã được lưu vào:', credentialsPath);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin đăng nhập:', error);
      }

      process.exit(0);
    } else if (event.type === 3) {
      // QR code hết hạn
      console.log('QR code đã hết hạn. Vui lòng thử lại.');
      process.exit(1);
    }
  },
  onError: (error) => {
    console.error('Lỗi trong quá trình đăng nhập QR:', error);
    process.exit(1);
  },
});

console.log('Đang chờ quét QR code...');
console.log('Nhấn Ctrl+C để hủy.');
