const db = require('../Data/Database'); // Kết nối đến cơ sở dữ liệu
const multer = require('multer'); // Thư viện multer để xử lý upload file
const path = require('path'); // Thư viện path để xử lý đường dẫn
const fs = require('fs'); // Thư viện fs để làm việc với file hệ thống
const { v4: uuidv4 } = require('uuid'); // Thư viện để tạo UUID

// Cấu hình multer để lưu hình ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'Public', 'Book')); // Đường dẫn lưu file
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`); // Tạo tên file duy nhất
    }
});

// Đảm bảo rằng trường 'image_link' tồn tại trong form gửi lên
const bookUpload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'image_link') {
            cb(null, true); // Chấp nhận file
        } else {
            cb(new multer.MulterError('Unexpected field')); // Trả về lỗi nếu không đúng tên trường
        }
    }
});

// Hàm kiểm tra dữ liệu đầu vào
const validateBookData = (data) => {
    const { book_name, book_code, author, category, quantity, location, language } = data;
    return book_name && book_code && author && category && quantity && location && language;
};

// Hàm lấy tất cả sách
const getAllBooks = (req, res) => {
    const { category } = req.query; // Lấy tham số category từ query
    let sql = 'SELECT * FROM books'; // Câu truy vấn cơ bản
    const params = [];

    if (category) {
        sql += ' WHERE category = ?'; // Thêm điều kiện nếu có category
        params.push(category);
    }

    sql += ' ORDER BY location'; // Sắp xếp theo location

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error fetching books data: ', err);
            return res.status(500).json({ error: 'Error fetching books data' });
        }
        
        results.forEach(book => {
            book.image_link = `/Book/${book.image_link}`; // Cập nhật link hình ảnh
        });

        res.json(results); // Trả về danh sách sách
    });
};

// Hàm thêm sách
const addBook = (req, res) => {
    if (!validateBookData(req.body)) { // Kiểm tra dữ liệu đầu vào
        return res.status(400).json({ message: 'Tất cả các trường là bắt buộc!' });
    }

    const { book_name, book_code, author, category, quantity, location, language, received_date } = req.body;
    const image_link = req.file ? req.file.filename : null; // Lấy tên file hình ảnh

    const sql = `INSERT INTO books (book_code, book_name, author, category, quantity, location, language, received_date, image_link) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [book_code, book_name, author, category, quantity, location, language, received_date, image_link];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting book:', err);
            if (req.file) { // Xóa file đã upload nếu có lỗi
                const filePath = path.join(__dirname, '..', 'Public', 'Book', req.file.filename);
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
                });
            }
            return res.status(500).json({ error: 'Lỗi nhập thông tin sách' });
        }
        res.status(201).json({ message: 'Thêm sách thành công ', bookId: result.insertId }); // Trả về thông báo thành công
    });
};

const DeleteBook = async (req, res) => {
  const { book_code } = req.params;

  try {
    if (!book_code) {
      return res.status(400).json({ message: "Mã sách không hợp lệ." });
    }

    const [rows] = await db.promise().query('SELECT image_link FROM books WHERE book_code = ?', [book_code]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sách với mã này." });
    }

    const imageLink = rows[0].image_link;
    const imagePath = path.join(__dirname, '../Public/Book', path.basename(imageLink));

    // Kiểm tra sự tồn tại của file trước khi xóa
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Lỗi khi xóa ảnh:", err);
          return res.status(500).json({ message: "Có lỗi xảy ra khi xóa ảnh." });
        }
        console.log("Ảnh đã được xóa thành công.");
      });
    } else {
      console.log("File ảnh không tồn tại, bỏ qua bước xóa ảnh.");
    }

    // Xóa sách khỏi database
    const result = await db.promise().query('DELETE FROM books WHERE book_code = ?', [book_code]);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy sách với mã này." });
    }

    res.status(200).json({ message: "Đã hủy sách thành công." });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi hủy sách và ảnh." });
  }
};


// Hàm chỉnh sửa sách
const editBook = (req, res) => {
    const { book_code } = req.params;
    const { book_name, author, category, quantity, location, language, received_date } = req.body;
    const new_image_link = req.file ? req.file.filename : null;

    if (!book_code || !book_name || !author) {
        return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    if (!validateBookData(req.body)) {
        return res.status(400).json({ message: 'Tất cả các trường là bắt buộc!' });
    }

    let formattedReceivedDate = null;
    if (received_date) {
        const date = new Date(received_date);
        formattedReceivedDate = date.toISOString().split('T')[0];
    }

    const sql = `SELECT image_link FROM books WHERE book_code = ?`;

    db.query(sql, [book_code], (err, results) => {
        if (err) {
            console.error('Error finding book:', err);
            return res.status(500).json({ error: 'Error finding book' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sách với mã này.' });
        }

        const old_image_link = results[0].image_link;

        const updateSql = `
            UPDATE books 
            SET 
                book_name = ?, 
                author = ?, 
                category = ?, 
                quantity = ?, 
                location = ?, 
                language = ?, 
                received_date = COALESCE(?, received_date), 
                image_link = COALESCE(?, image_link) 
            WHERE 
                book_code = ?`;

        const values = [book_name, author, category, quantity, location, language, formattedReceivedDate, new_image_link, book_code];

        db.query(updateSql, values, (err, result) => {
            if (err) {
                console.error('Error updating book:', err);
                return res.status(500).json({ error: 'Error updating book' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Không tìm thấy sách với mã này.' });
            }

            // Xóa ảnh cũ nếu có ảnh mới
            if (new_image_link) {
                const oldImagePath = path.join(__dirname, '..', 'Public', 'Book', old_image_link);
                fs.unlink(oldImagePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting old image:', unlinkErr);
                });
            }

            res.status(200).json({ message: 'Chỉnh sửa thông tin sách thành công ' });
        });
    });
};

const categories = (req, res) => {
    db.query(
        `SELECT DISTINCT category 
        FROM books 
        ORDER BY category ASC`,
        (error, results) => {
            if (error) {
                console.error('Error fetching categories:', error);
                return res.status(500).json({ message: 'Lỗi khi lấy danh sách thể loại' });
            }
            const categories = results.map(row => row.category); // Chuyển dữ liệu thành danh sách thể loại
            res.json(categories);
        }
    );
};  

const location = (req, res) => {
    db.query(
        `SELECT DISTINCT location 
        FROM books 
        ORDER BY location ASC`,
        (error, results) => {
            if (error) {
                console.error('Error fetching location:', error);
                return res.status(500).json({ message: 'Lỗi khi lấy danh vị trí sách' });
            }
            const location = results.map(row => row.location); // Chuyển dữ liệu thành danh vị trí sách
            res.json(location);
        }
    );
};

const language = (req, res) => {
    db.query(
        `SELECT DISTINCT language 
        FROM books 
        ORDER BY language ASC`,
        (error, results) => {
            if (error) {
                console.error('Error fetching language:', error);
                return res.status(500).json({ message: 'Lỗi khi lấy ngôn ngữ' });
            }
            const language = results.map(row => row.language); // Chuyển dữ liệu thành ngôn ngữ
            res.json(language);
        }
    );
};
 
// Xuất các hàm và middleware
module.exports = { getAllBooks, addBook, editBook, DeleteBook, categories, location, language, bookUpload };
