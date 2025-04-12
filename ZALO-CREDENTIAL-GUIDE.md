# Hướng dẫn tạo và sử dụng Zalo Credentials

## Bước 1: Tạo credentials bằng node ZaloLoginViaQRCode

1. Mở n8n trong trình duyệt tại địa chỉ http://localhost:5678
2. Tạo một workflow mới
3. Thêm node **ZaloLoginViaQRCode**
4. Cấu hình node:
   - **Create Zalo Credentials**: Đặt là `true`
   - **Credential Name**: Nhập tên cho credentials (ví dụ: "Zalo API Credentials")
   - **Proxy**: Để trống hoặc nhập proxy nếu cần
   - **Timeout**: Mặc định là 30 giây
   - **Output File Name**: Mặc định là "zalo-qr-code.png"
5. Chạy node
6. Quét mã QR bằng ứng dụng Zalo trên điện thoại
7. Đợi quá trình đăng nhập hoàn tất

## Bước 2: Tạo credentials trong n8n

### Cách 1: Sử dụng script hỗ trợ (Khuyến nghị)

1. Cài đặt axios nếu bạn chưa có:
   ```
   npm install axios
   ```

2. Chạy script hỗ trợ:
   ```
   node create-zalo-credential.js
   ```

### Cách 2: Tạo thủ công

1. Vào n8n Settings > Credentials
2. Nhấp "Add Credential"
3. Chọn "Zalo API" làm loại credential
4. Nhập tên cho credential
5. Sao chép các giá trị từ `output/zalo-credentials.json`:
   - **Cookie**: Sao chép giá trị cookie
   - **IMEI**: Sao chép giá trị imei
   - **User Agent**: Sao chép giá trị userAgent
6. Nhấp "Save"

## Bước 3: Sử dụng credentials trong các node Zalo

1. Thêm một node Zalo vào workflow của bạn (ví dụ: "Zalo Send Message (Cookie)")
2. Trong cài đặt node, chọn credential bạn đã tạo từ dropdown "Credential to connect with"
3. Cấu hình các tham số khác của node theo nhu cầu
4. Chạy node

## Xử lý sự cố

Nếu bạn gặp vấn đề:

1. **Đăng nhập QR Code thất bại**:
   - Đảm bảo ứng dụng Zalo của bạn đã được cập nhật
   - Thử chạy lại node ZaloLoginViaQRCode

2. **Tạo credential thất bại**:
   - Đảm bảo n8n đang chạy
   - Kiểm tra xem loại credential "zaloApi" có tồn tại trong n8n không
   - Thử tạo credential thủ công

3. **Các node Zalo không thể sử dụng credential**:
   - Đảm bảo credential đã được tạo thành công
   - Kiểm tra xem credential có phải loại "zaloApi" không
   - Thử chọn credential từ dropdown trong cài đặt node

4. **Credential hết hạn**:
   - Credentials Zalo có thể hết hạn sau một thời gian
   - Nếu một node ngừng hoạt động, hãy tạo credentials mới bằng node ZaloLoginViaQRCode
