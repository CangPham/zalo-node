# Hướng dẫn sử dụng Zalo Integration cho n8n

## Giới thiệu

Đây là hướng dẫn sử dụng các node Zalo cho n8n, cho phép bạn tích hợp Zalo vào các workflow của mình.

## Cài đặt

1. Đảm bảo bạn đã cài đặt n8n
2. Sao chép các file trong thư mục này vào thư mục n8n của bạn
3. Cài đặt thư viện axios nếu chưa có: `npm install axios`
4. Chạy lệnh `npm run build` để biên dịch các node
5. Khởi động n8n với lệnh `n8n start`

## Đăng nhập Zalo và tạo credentials

### Cách 1: Hoàn toàn tự động (Khuyến nghị)

1. Tạo một workflow mới trong n8n
2. Thêm node **ZaloLoginViaQRCode**
3. Cấu hình node:
   - **Create Zalo Credentials**: Đặt là `true`
   - **Credential Name**: Nhập tên cho credentials (ví dụ: "Zalo API Credentials")
   - **Proxy**: Để trống hoặc nhập proxy nếu cần
   - **Timeout**: Mặc định là 30 giây
   - **Output File Name**: Mặc định là "zalo-qr-code.png"
4. Chạy node
5. Quét mã QR bằng ứng dụng Zalo trên điện thoại
6. Đợi quá trình đăng nhập hoàn tất
7. Sau khi đăng nhập thành công, thông tin đăng nhập sẽ được lưu vào file `output/zalo-credentials.json` và `output/zalo-credential-info.json`
8. Mở một terminal mới và chạy script tự động tạo credentials:
   ```
   node auto-create-zalo-credential.js
   ```
9. Script sẽ tự động kiểm tra xem n8n đã khởi động chưa, sau đó tạo credentials trong n8n
10. Credentials sẽ được tạo tự động trong n8n và sẵn sàng để sử dụng

### Cách 2: Thủ công

1. Tạo một workflow mới trong n8n
2. Thêm node **ZaloLoginViaQRCode**
3. Cấu hình node như trên
4. Chạy node và quét mã QR
5. Sau khi đăng nhập thành công, vào n8n Settings > Credentials
6. Nhấp "Add Credential"
7. Chọn "Zalo API" làm loại credential
8. Nhập tên cho credential
9. Sao chép các giá trị từ `output/zalo-credentials.json`:
   - **Cookie**: Sao chép giá trị cookie
   - **IMEI**: Sao chép giá trị imei
   - **User Agent**: Sao chép giá trị userAgent
10. Nhấp "Save"

## Sử dụng credentials trong các node Zalo

1. Thêm một node Zalo vào workflow của bạn (ví dụ: "Zalo Send Message")
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

## Các file quan trọng

- `output/zalo-credentials.json`: Chứa thông tin đăng nhập Zalo
- `output/zalo-credential-info.json`: Chứa thông tin để tạo credential trong n8n
- `output/zalo-debug.txt` và `output/zalo-debug-login.txt`: Thông tin debug
- `data/cookies/cred_[timestamp].json`: Bản sao lưu thông tin đăng nhập với timestamp
- `create-zalo-credential.js`: Script để tạo credential trong n8n
- `auto-create-zalo-credential.js`: Script để tự động tạo credential khi n8n khởi động
