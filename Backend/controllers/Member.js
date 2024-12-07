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
    const { member_code, name, age, gender, email, phone } = data;
    return member_code && name && gender && age && email && phone;
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
            return res.status(400).json({ error: "Lỗi đình dạng ngày/tháng/năm" });
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

const addMember = (req, res) => {
    const { member_code, name, age, gender, email, phone } = req.body;
    const avatar_link = req.file ? req.file.filename : null; // Kiểm tra nếu file ảnh đã được tải lên

    // Kiểm tra dữ liệu đầu vào
    if (!validateMemberData(req.body)) {
        return res.status(400).json({ message: 'Tất cả các trường là bắt buộc!' });
    }

    // Kiểm tra xem age có phải là số hợp lệ không
    if (isNaN(age) || age <= 0) {
        return res.status(400).json({ message: 'Tuổi phải là một số hợp lệ và lớn hơn 0!' });
    }

    const sql = `INSERT INTO members (member_code, name, email, phone, registration_date, age, avatar_link, gender) 
                 VALUES (?, ?, ?, ?, CURRENT_DATE, ?, ?, ?)`;

    const values = [member_code, name, email, phone, age, avatar_link, gender];

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


const DeleteMember = async (req, res) => {
    const { member_code } = req.params;
  
    try {
      if (!member_code) {
        return res.status(400).json({ message: "Mã thành viên không hợp lệ." });
      }
  
      // Lấy avatar_link từ cơ sở dữ liệu
      const [rows] = await db.promise().query('SELECT avatar_link FROM members WHERE member_code = ?', [member_code]);
      
      if (rows.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy thành viên với mã này." });
      }
  
      const avatarLink = rows[0].avatar_link;
      const avatarPath = path.join(__dirname, '../Public/Members', path.basename(avatarLink)); 
      // Kiểm tra sự tồn tại của file trước khi xóa
      if (fs.existsSync(avatarPath)) {
        fs.unlink(avatarPath, (err) => {
          if (err) {
            console.error("Lỗi khi xóa ảnh:", err);
            return res.status(500).json({ message: "Có lỗi xảy ra khi xóa ảnh." });
          }
        });
      } else {
        console.log("File ảnh đại diện không tồn tại, bỏ qua bước xóa ảnh.");
      }
  
      // Xóa thành viên khỏi database
      const result = await db.promise().query('DELETE FROM members WHERE member_code = ?', [member_code]);
  
      if (result[0].affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy thành viên với mã này." });
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      res.status(500).json({ message: "Có lỗi xảy ra khi xóa thành viên và ảnh đại diện." });
    }
};  

const editMember = (req, res) => {
    const { member_code } = req.params;
    const { name, age, gender, email, phone } = req.body;
    const new_avatar_link = req.file ? req.file.filename : null;

    // Kiểm tra các trường cần thiết
    if (!member_code || !name || !age || !gender || !email || !phone) {
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
                gender = ?,
                email = ?, 
                phone = ?, 
                avatar_link = COALESCE(?, avatar_link) 
            WHERE 
                member_code = ?`;

        const values = [name, age, gender, email, phone, new_avatar_link, member_code];

        db.query(updateSql, values, (err, result) => {
            if (err) {
                console.error('Error updating member:', err);
                return res.status(500).json({ error: 'Lỗi cập nhật thành viên' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Không tìm thấy thành viên với mã này.' });
            }

            // Xóa ảnh cũ nếu cập nhật thành công và có ảnh mới
            if (new_avatar_link && old_avatar_link) {
                const oldAvatarPath = path.join(__dirname, '..', 'Public', 'Members', old_avatar_link);
                fs.unlink(oldAvatarPath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting old avatar:', unlinkErr);
                    } else {
                        console.log('Old avatar deleted successfully.');
                    }
                });
            }

            res.status(200).json({ message: 'Thành viên đã được cập nhật thành công' });
        });
    });
};


// Export hàm xử lý
module.exports = { getAllMembers, addMember, editMember, DeleteMember, memberUpload };

