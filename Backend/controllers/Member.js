const db = require('../Data/Database'); // Kết nối đến cơ sở dữ liệu
const multer = require('multer'); // Thư viện multer để xử lý upload file
const path = require('path'); // Thư viện path để xử lý đường dẫn
const fs = require('fs'); // Thư viện fs để làm việc với file hệ thống
const { v4: uuidv4 } = require('uuid'); // Thư viện để tạo UUID

// Hàm lấy danh sách tất cả thành viên
const getAllMembers = (req, res) => {
    const { registrationDate } = req.query; // Lấy tham số registrationDate từ query
    let sql = 'SELECT * FROM members'; // Khởi tạo câu truy vấn
    const params = []; // Mảng chứa các tham số cho câu truy vấn

    // Kiểm tra registrationDate
    if (registrationDate) {
        const dateParts = registrationDate.split('-'); // Chia ngày theo dấu '-'
        if (dateParts.length === 3) {
            const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`; // Định dạng lại ngày
            sql += ' WHERE registration_date < ?'; 
            params.push(formattedDate); // Thêm ngày đã định dạng vào params
        } else {
            console.log("Invalid date format. Expected 'YYYY-MM-DD'");
        }
    }

    // Thực hiện truy vấn
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error retrieving members: ', err);
            return res.status(500).send(err);
        }

        // Cập nhật link avatar cho mỗi thành viên
        results.forEach(member => {
            member.avatar_link = `/Avatar/${member.avatar_link}`;
        });

        // Trả về kết quả
        res.json(results);
    });
};


// Hàm tìm kiếm thành viên theo từ khóa
const searchMembers = (req, res) => {
    const { keyword } = req.query; // Lấy tham số keyword từ query
    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);

    const sql = 'SELECT * FROM members WHERE name LIKE ? OR phone LIKE ? OR age LIKE ? OR email LIKE ? OR country LIKE ?'; // Câu truy vấn tìm kiếm
    const params = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]; // Tạo các tham số tìm kiếm

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error searching members: ', err);
            return res.status(500).json({ error: 'Error searching members' });
        }
        
        results.forEach(member => {
            member.avatar_link = `/Avatar/${member.avatar_link}`;
        });

        res.json(results); // Trả về kết quả tìm kiếm
    });
};

// Exports các hàm xử lý
module.exports = {getAllMembers,searchMembers};
