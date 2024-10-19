import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Đường dẫn nơi lưu trữ file
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Đặt tên file theo thời gian để tránh trùng lặp
    }
});

// Cấu hình upload với các quy tắc
const upload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5 // Giới hạn kích thước file là 5MB
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extname && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error("Only .jpeg, .jpg, .png formats allowed!"));
        }
    }
});

export default upload;