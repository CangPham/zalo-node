const fs = require('fs');
const path = require('path');

// Đường dẫn đến file credentials
const credentialsPath = path.join(process.cwd(), 'output', 'zalo-credentials.json');

// Kiểm tra xem file có tồn tại không
if (fs.existsSync(credentialsPath)) {
    try {
        // Đọc và parse file JSON
        const credentialsData = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        
        console.log('=== THÔNG TIN ĐĂNG NHẬP ZALO ===');
        console.log('File: ' + credentialsPath);
        console.log('----------------------------');
        
        // Hiển thị thông tin
        if (credentialsData.cookie) {
            console.log('Cookie: ' + (credentialsData.cookie ? 'Đã lưu (độ dài: ' + credentialsData.cookie.length + ' ký tự)' : 'Không có'));
        } else {
            console.log('Cookie: Không có');
        }
        
        if (credentialsData.imei) {
            console.log('IMEI: ' + (credentialsData.imei ? credentialsData.imei : 'Không có'));
        } else {
            console.log('IMEI: Không có');
        }
        
        if (credentialsData.userAgent) {
            console.log('User Agent: ' + (credentialsData.userAgent ? credentialsData.userAgent : 'Không có'));
        } else {
            console.log('User Agent: Không có');
        }
        
        console.log('----------------------------');
        console.log('Thông tin này có thể được sử dụng để tạo credentials trong n8n');
        
        // Kiểm tra tính hợp lệ của thông tin
        const isValid = credentialsData.cookie && credentialsData.imei && credentialsData.userAgent;
        console.log('Trạng thái: ' + (isValid ? 'Hợp lệ ✅' : 'Không đầy đủ ❌'));
        
        if (!isValid) {
            console.log('Lưu ý: Thông tin đăng nhập không đầy đủ. Vui lòng chạy lại node ZaloLoginViaQRCode và đăng nhập thành công.');
        }
    } catch (error) {
        console.error('Lỗi khi đọc file credentials:', error.message);
    }
} else {
    console.log('=== THÔNG TIN ĐĂNG NHẬP ZALO ===');
    console.log('Không tìm thấy file credentials tại: ' + credentialsPath);
    console.log('----------------------------');
    console.log('Vui lòng thực hiện các bước sau:');
    console.log('1. Mở n8n và tạo một workflow mới');
    console.log('2. Thêm node ZaloLoginViaQRCode vào workflow');
    console.log('3. Chạy node và quét mã QR bằng ứng dụng Zalo');
    console.log('4. Đăng nhập thành công để lưu thông tin đăng nhập');
    console.log('5. Chạy lại script này để kiểm tra thông tin đăng nhập');
}

// Tạo một script để tạo credentials trong n8n
if (fs.existsSync(credentialsPath)) {
    try {
        const credentialsData = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        if (credentialsData.cookie && credentialsData.imei && credentialsData.userAgent) {
            const createCredentialsScript = `
// Script để tạo Zalo credentials trong n8n
// Bạn có thể sử dụng script này trong n8n Execute JavaScript node

// Thông tin đăng nhập
const credentialData = {
    cookie: "${credentialsData.cookie}",
    imei: "${credentialsData.imei}",
    userAgent: "${credentialsData.userAgent}"
};

// Tên credential
const credentialName = "Zalo API Credentials";

// Tạo credential
const credential = await $node.createCredential(
    "zaloApi",
    credentialName,
    credentialData
);

// Trả về kết quả
return {
    credentialId: credential.id,
    credentialName: credential.name,
    success: true
};
`;
            
            // Lưu script vào file
            const scriptPath = path.join(process.cwd(), 'output', 'create-zalo-credential.js');
            fs.writeFileSync(scriptPath, createCredentialsScript);
            console.log('\nĐã tạo script để tạo credentials trong n8n tại: ' + scriptPath);
            console.log('Bạn có thể sử dụng script này trong n8n Execute JavaScript node');
        }
    } catch (error) {
        // Bỏ qua lỗi khi tạo script
    }
}
