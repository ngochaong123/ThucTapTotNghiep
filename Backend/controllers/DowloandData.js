const mysql = require('mysql2/promise');
const ExcelJS = require('exceljs');
const path = require('path'); // Để xử lý đường dẫn
const fs = require('fs');

const downloadExcel = async (req, res) => {
    // Tạo kết nối cơ sở dữ liệu trực tiếp từ mysql2/promise
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456789',
        database: 'library_management'
    });

    try {
        // Truy vấn tất cả các bảng
        const [books] = await db.query('SELECT * FROM books');
        const [members] = await db.query('SELECT * FROM members');
        const [borrowBooks] = await db.query('SELECT * FROM borrowBooks');
        const [revenueExpenses] = await db.query('SELECT * FROM revenue_expenses');

        if (books.length === 0 && members.length === 0 && borrowBooks.length === 0 && revenueExpenses.length === 0) {
            console.log('No data found in any table');
            return res.status(404).send('Không tìm thấy dữ liệu bảng');
        }

        // Tạo một workbook mới
        const workbook = new ExcelJS.Workbook();
        
        // Tạo sheet cho bảng Books
        const worksheetBooks = workbook.addWorksheet('Books Data');
        worksheetBooks.columns = [
            { header: 'Book Code', key: 'book_code', width: 15 },
            { header: 'Book Name', key: 'book_name', width: 30 },
            { header: 'Author', key: 'author', width: 20 },
            { header: 'Quantity', key: 'quantity', width: 10 },
            { header: 'Category', key: 'category', width: 15 },
            { header: 'Language', key: 'language', width: 15 },
            { header: 'Location', key: 'location', width: 20 },
            { header: 'Received Date', key: 'received_date', width: 15 },
            { header: 'Image Link', key: 'image_link', width: 30 }
        ];
        worksheetBooks.addRows(books);

        // Tạo sheet cho bảng Members
        const worksheetMembers = workbook.addWorksheet('Members Data');
        worksheetMembers.columns = [
            { header: 'Member Code', key: 'member_code', width: 15 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Registration Date', key: 'registration_date', width: 15 },
            { header: 'Age', key: 'age', width: 5 },
            { header: 'Avatar Link', key: 'avatar_link', width: 30 },
            { header: 'Country', key: 'country', width: 15 }
        ];
        worksheetMembers.addRows(members);

        // Tạo sheet cho bảng BorrowBooks
        const worksheetBorrowBooks = workbook.addWorksheet('BorrowBooks Data');
        worksheetBorrowBooks.columns = [
            { header: 'ID', key: 'id', width: 5 },
            { header: 'Member Code', key: 'member_code', width: 15 },
            { header: 'Book Code', key: 'book_code', width: 15 },
            { header: 'Quantity', key: 'quantity', width: 10 },
            { header: 'Borrow Date', key: 'borrowDate', width: 15 },
            { header: 'Return Date', key: 'returnDate', width: 15 }
        ];
        worksheetBorrowBooks.addRows(borrowBooks);

        // Tạo sheet cho bảng RevenueExpenses
        const worksheetRevenueExpenses = workbook.addWorksheet('RevenueExpenses Data');
        worksheetRevenueExpenses.columns = [
            { header: 'ID', key: 'id', width: 5 },
            { header: 'Time', key: 'Time', width: 15 },
            { header: 'Revenue', key: 'revenue', width: 10 },
            { header: 'Expenses', key: 'expenses', width: 10 },
            { header: 'Profit', key: 'profit', width: 10 }
        ];
        worksheetRevenueExpenses.addRows(revenueExpenses);

        // Định nghĩa đường dẫn file Excel
        const filePath = path.join(__dirname, 'library_data.xlsx');

        // Ghi workbook vào file
        await workbook.xlsx.writeFile(filePath);
        console.log('Excel file was written successfully');

        // Gửi file Excel dưới dạng response để tải về
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="library_data.xlsx"');
        res.sendFile(filePath, (err) => {
            // Xử lý khi gửi xong file
            if (err) {
                console.error('Error sending file:', err);
            } else {
                console.log('File sent successfully');
                // Xóa file sau khi gửi
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting file:', unlinkErr);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            }
        });

    } catch (error) {
        console.error('Error generating Excel file:', error.message);
        console.error(error.stack); // Hiển thị chi tiết lỗi
        res.status(500).send('Lỗi in file excel: ' + error.message);
    } finally {
        // Đóng kết nối cơ sở dữ liệu sau khi sử dụng
        await db.end();
    }
};

module.exports = { downloadExcel };
