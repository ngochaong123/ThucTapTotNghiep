const mysql = require('mysql2/promise');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const downloadExcel = async (req, res) => {
    // Kết nối đến cơ sở dữ liệu
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456789',
        database: 'library_management'
    });

    try {
        // Truy vấn dữ liệu từ các bảng
        const [books] = await db.query('SELECT * FROM books');
        const [members] = await db.query('SELECT * FROM members');
        const [borrowBooks] = await db.query('SELECT * FROM borrowBooks');
        const [returnBook] = await db.query('SELECT * FROM returnBook');

        // Kiểm tra nếu không có dữ liệu trong các bảng
        if (books.length === 0 && members.length === 0 && borrowBooks.length === 0 && returnBook.length === 0) {
            console.log('No data found in any table');
            return res.status(404).send('Không tìm thấy dữ liệu bảng');
        }

        // Tạo workbook mới
        const workbook = new ExcelJS.Workbook();

        // Thêm sheet Books
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

        // Thêm sheet Members
        const worksheetMembers = workbook.addWorksheet('Members Data');
        worksheetMembers.columns = [
            { header: 'Member Code', key: 'member_code', width: 15 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Registration Date', key: 'registration_date', width: 15 },
            { header: 'Age', key: 'age', width: 5 },
            { header: 'Avatar Link', key: 'avatar_link', width: 30 },
            { header: 'Gender', key: 'gender', width: 10 }
        ];
        worksheetMembers.addRows(members);

        // Thêm sheet BorrowBooks
        const worksheetBorrowBooks = workbook.addWorksheet('BorrowBooks Data');
        worksheetBorrowBooks.columns = [
            { header: 'BorrowBooks ID', key: 'borrowBooks_id', width: 20 },
            { header: 'Member Code', key: 'member_code', width: 15 },
            { header: 'Book Code', key: 'book_code', width: 15 },
            { header: 'Quantity', key: 'quantity', width: 10 },
            { header: 'Borrow Date', key: 'borrowDate', width: 15 },
            { header: 'Return Date', key: 'returnDate', width: 15 },
        ];
        worksheetBorrowBooks.addRows(borrowBooks);

        // Thêm sheet ReturnBook
        const worksheetReturnBook = workbook.addWorksheet('ReturnBook Data');
        worksheetReturnBook.columns = [
            { header: 'ReturnBook ID', key: 'returnBook_id', width: 20 },
            { header: 'BorrowBooks ID', key: 'borrowBooks_id', width: 20 },
            { header: 'Fee', key: 'Fee', width: 10 },
            { header: 'Penalty Fees', key: 'PenaltyFees', width: 15 },
            { header: 'Late Payment Days', key: 'latePaymDate', width: 20 },
            { header: 'Status', key: 'Status', width: 15 }
        ];
        worksheetReturnBook.addRows(returnBook);

        // Ghi workbook vào file
        const filePath = path.join(__dirname, 'library_data.xlsx');
        await workbook.xlsx.writeFile(filePath);
        console.log('Excel file was written successfully');

        // Gửi file Excel để tải về
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="library_data.xlsx"');
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
            } else {
                console.log('File sent successfully');
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
        console.error(error.stack);
        res.status(500).send('Lỗi in file excel: ' + error.message);
    } finally {
        await db.end();
    }
};

module.exports = { downloadExcel };