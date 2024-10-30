// Import các thư viện và thiết lập kết nối cơ sở dữ liệu
const db = require('../Data/Database'); // Kết nối đến cơ sở dữ liệu
const multer = require('multer'); // Thư viện multer để xử lý upload file
const path = require('path'); // Thư viện path để xử lý đường dẫn
const fs = require('fs'); // Thư viện fs để làm việc với file hệ thống
const { v4: uuidv4 } = require('uuid'); // Thư viện để tạo UUID

// Thiết lập thư mục lưu trữ avatar và multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'Public', 'Members')); // Đường dẫn lưu file
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`); // Tạo tên file duy nhất
    }
});

// Đảm bảo rằng trường 'avatar_link' tồn tại trong form gửi lên
const memberUpload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'avatar_link') {
            cb(null, true); // Chấp nhận file
        } else {
            cb(new multer.MulterError('Unexpected field')); // Trả về lỗi nếu không đúng tên trường
        }
    }
});

// Hàm kiểm tra dữ liệu đầu vào cho thành viên mới
const validateMemberData = (data) => {
    const { member_code, name, age, country, email, phone } = data;
    return member_code && name && age && country && email && phone;
};

// Hàm lấy danh sách tất cả thành viên
const getAllMembers = (req, res) => {
    const { registrationDate } = req.query;
    let sql = 'SELECT * FROM members';
    const params = [];

    // Kiểm tra registrationDate
    if (registrationDate) {
        const dateParts = registrationDate.split('-');
        if (dateParts.length === 3) {
            const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
            sql += ' WHERE registration_date < ?';
            params.push(formattedDate);
        } else {
            console.log("Invalid date format. Expected 'YYYY-MM-DD'");
            return res.status(400).json({ error: "Invalid date format. Expected 'YYYY-MM-DD'" });
        }
    }

    // Thực hiện truy vấn
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error retrieving members: ', err);
            return res.status(500).send(err);
        }

        results.forEach(member => {
            member.avatar_link = `/Members/${member.avatar_link}`; // Thiết lập đường dẫn cho ảnh đại diện
        });

        res.json(results);
    });
};

// Hàm tìm kiếm thành viên theo từ khóa
const searchMembers = (req, res) => {
    const { keyword } = req.query;
    const sql = 'SELECT * FROM members WHERE name LIKE ? OR phone LIKE ? OR age LIKE ? OR email LIKE ? OR country LIKE ?';
    const params = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`];

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error searching members: ', err);
            return res.status(500).json({ error: 'Error searching members' });
        }

        results.forEach(member => {
            member.avatar_link = `/Members/${member.avatar_link}`; // Thiết lập đường dẫn cho ảnh đại diện
        });

        res.json(results);
    });
};

const addMember = (req, res) => {
    const { member_code, name, age, country, email, phone } = req.body;
    const avatar_link = req.file ? req.file.filename : null; // Kiểm tra nếu file ảnh đã được tải lên
    
    // Kiểm tra dữ liệu đầu vào
    if (!validateMemberData(req.body)) {
        return res.status(400).json({ message: 'Tất cả các trường là bắt buộc!' });
    }

    console.log("Data: ", req.body);
    console.log("Image: ", avatar_link);

    const sql = `INSERT INTO members (member_code, name, email, phone, registration_date, age, avatar_link, country) 
                 VALUES (?, ?, ?, ?, CURRENT_DATE, ?, ?, ?)`;
    
    const values = [member_code, name, email, phone, age, avatar_link, country];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting member:', err);

            // Nếu có lỗi, xóa file ảnh đã upload nếu có
            if (req.file) {
                const filePath = path.join(__dirname, '..', 'Public', 'Members', req.file.filename);
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
                });
            }
            return res.status(500).json({ error: 'Lỗi khi thêm thành viên vào database' });
        }

        res.status(201).json({ message: 'Thành viên đã được thêm thành công', memberId: result.insertId });
    });
};

const editMember = (req, res) => {
    const { member_code } = req.params;
    const { name, age, country, email, phone } = req.body;
    const new_avatar_link = req.file ? req.file.filename : null;

    // Kiểm tra các trường cần thiết
    if (!member_code || !name || !age || !country || !email || !phone) {
        return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    // Kiểm tra dữ liệu đầu vào
    if (!validateMemberData(req.body)) {
        return res.status(400).json({ message: 'Tất cả các trường là bắt buộc!' });
    }

    const sql = `SELECT avatar_link FROM members WHERE member_code = ?`;

    db.query(sql, [member_code], (err, results) => {
        if (err) {
            console.error('Error finding member:', err);
            return res.status(500).json({ error: 'Error finding member' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thành viên với mã này.' });
        }

        const old_avatar_link = results[0].avatar_link;

        const updateSql = `
            UPDATE members 
            SET 
                name = ?, 
                age = ?, 
                country = ?, 
                email = ?, 
                phone = ?, 
                avatar_link = COALESCE(?, avatar_link) 
            WHERE 
                member_code = ?`;

        const values = [name, age, country, email, phone, new_avatar_link, member_code];

        db.query(updateSql, values, (err, result) => {
            if (err) {
                console.error('Error updating member:', err);
                return res.status(500).json({ error: 'Error updating member' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Không tìm thấy thành viên với mã này.' });
            }

            // Xóa ảnh cũ nếu có ảnh mới
            if (new_avatar_link) {
                const oldAvatarPath = path.join(__dirname, '..', 'Public', 'Members', old_avatar_link);
                fs.unlink(oldAvatarPath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting old avatar:', unlinkErr);
                });
            }

            res.status(200).json({ message: 'Thành viên đã được cập nhật thành công' });
        });
    });
};

// Export hàm xử lý
module.exports = { getAllMembers, searchMembers, addMember, editMember, memberUpload };

