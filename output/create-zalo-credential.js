
// Script để tạo Zalo credentials trong n8n
// Bạn có thể sử dụng script này trong n8n Execute JavaScript node

// Thông tin đăng nhập
const credentialData = {
    cookie: "sample_cookie_value_here",
    imei: "sample_imei_value_here",
    userAgent: "sample_user_agent_here"
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
