const db = require('../Data/Database'); // Database connection

// Hàm lấy dữ liệu doanh thu và chi phí từ bảng revenue_expenses
const revenueChart = (req, res) => {
    const sql = 'SELECT * FROM revenue_expenses';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);

        // Chuyển đổi dữ liệu từ 'Time' thành tên tháng
        const formattedData = results.map(item => {
            const month = new Date(item.Time).toLocaleString('default', { month: 'long' }); // Chỉ lấy tháng
            return {
                month: month,
                revenue: item.revenue,
                expenses: item.expenses
            }; 
        });

        res.json(formattedData); // Trả về dữ liệu theo tháng
    });
};

// Hàm lấy dữ liệu số lượng sách theo thể loại
const quantityBooksChart = (req, res) => {
    const sql = `
        SELECT category, SUM(quantity) as total_quantity
        FROM books
        GROUP BY category
    `;
    
    // Truy vấn dữ liệu từ bảng books
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err); // Nếu có lỗi thì trả về lỗi server
        }
        res.json(results); // Trả về dữ liệu số lượng sách theo thể loại
    });
};

// Hàm lấy số lượng thành viên theo quốc gia
const foreignMemberChart = (req, res) => {
    const sql = `
        SELECT country, COUNT(*) as total_members
        FROM members
        GROUP BY country
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err); // Nếu có lỗi, trả về lỗi 500
        }
        res.json(results);  // Trả về dữ liệu số lượng thành viên theo quốc gia
    });
};

// Hàm lấy dữ liệu số lượng sách đã mượn theo thể loại
const borrowedBooksByCategory = (req, res) => {
    const query = `
        SELECT b.category AS category, SUM(bb.quantity) AS total_borrowed
        FROM borrowBooks AS bb
        JOIN books AS b ON bb.book_code = b.book_code
        GROUP BY b.category;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching borrowed books by category:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json(results); // Trả về dữ liệu số lượng sách đã mượn theo thể loại
    });
};

// Hàm lấy dữ liệu xu hướng đăng ký thành viên theo tháng
const registrationTrends = (req, res) => {
    const query = `
        SELECT MONTH(registration_date) AS month, COUNT(*) AS registrations
        FROM members
        GROUP BY MONTH(registration_date)
        ORDER BY month;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error fetching data');
            return;
        }

        res.json(results); // Trả về dữ liệu xu hướng đăng ký thành viên theo tháng
    });
};

// Hàm tính toán doanh thu và tỷ lệ thay đổi giữa 2 tháng gần nhất
const revenueGrowth = (req, res) => {
    // Truy vấn để lấy doanh thu theo từng tháng từ bảng revenue_expenses
    const query = `
        SELECT MONTH(Time) AS month, revenue
        FROM revenue_expenses
        ORDER BY Time DESC
        LIMIT 2;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error fetching data');
            return;
        }

        if (results.length < 2) {
            return res.json({ revenue: 0, growth: 0 }); // Trả về 0 nếu không đủ dữ liệu
        }

        const [latestMonth, previousMonth] = results;
        const revenueThisMonth = latestMonth.revenue;
        const revenueLastMonth = previousMonth.revenue;

        // Tính tỷ lệ thay đổi doanh thu
        const growth = ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100;

        // Trả về doanh thu và tỷ lệ thay đổi
        res.json({
            revenue: revenueThisMonth,
            growth: growth.toFixed(2), // Chỉ lấy 2 chữ số thập phân
        });
    });
};
 
// Hàm lấy số lượng thành viên đăng ký trong tháng lớn nhất và tỷ lệ thay đổi so với tháng trước
const memberRegistrationGrowth = (req, res) => {
    const query = `
        SELECT MONTH(registration_date) AS month, COUNT(*) AS registrations
        FROM members
        GROUP BY MONTH(registration_date)
        ORDER BY month DESC
        LIMIT 2;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error fetching data');
            return;
        }

        if (results.length < 2) {
            return res.json({ registrations: 0, growth: 0 }); // Trả về 0 nếu không đủ dữ liệu
        }

        const [latestMonth, previousMonth] = results;
        const registrationsThisMonth = latestMonth.registrations;
        const registrationsLastMonth = previousMonth.registrations;

        // Tính tỷ lệ thay đổi
        const growth = ((registrationsThisMonth - registrationsLastMonth) / registrationsLastMonth) * 100;

        // Trả về số lượng thành viên đăng ký và tỷ lệ thay đổi
        res.json({
            registrations: registrationsThisMonth,
            growth: growth.toFixed(2), // Chỉ lấy 2 chữ số thập phân
        });
    });
};

const bookCountByMonth = async (req, res) => {
    try {
        const query = `
           SELECT 
                SUM(CASE WHEN MONTH(received_date) = MONTH(CURDATE()) AND YEAR(received_date) = YEAR(CURDATE()) THEN quantity ELSE 0 END) AS currentMonthBooks,
                SUM(CASE WHEN MONTH(received_date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(received_date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) THEN quantity ELSE 0 END) AS previousMonthBooks,
                ROUND(
                    (SUM(CASE WHEN MONTH(received_date) = MONTH(CURDATE()) AND YEAR(received_date) = YEAR(CURDATE()) THEN quantity ELSE 0 END) 
                    - 
                    SUM(CASE WHEN MONTH(received_date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(received_date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) THEN quantity ELSE 0 END)) 
                    * 100.0 / 
                    NULLIF(SUM(CASE WHEN MONTH(received_date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(received_date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) THEN quantity ELSE 0 END), 0), 
                    2
                ) AS percentageChange
            FROM books;
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ message: 'Error fetching book counts' });
            }

            // Kiểm tra nếu không có kết quả trả về
            if (!results || results.length === 0) {
                return res.status(500).json({ message: 'No data found' });
            }

            // Trả về kết quả
            res.json({
                currentMonthBooks: results[0].currentMonthBooks || 0,
                previousMonthBooks: results[0].previousMonthBooks || 0,
                percentageChange: results[0].percentageChange !== null ? results[0].percentageChange : "N/A"
            });
        });
    } catch (err) {
        console.error('Error fetching book counts:', err);
        res.status(500).json({ message: 'Error fetching book counts' });
    }
};

const memberBorrowGrowth = (req, res) => {
    const query = `
        SELECT MONTH(borrowDate) AS month, COUNT(DISTINCT member_code) AS unique_members
        FROM borrowBooks
        WHERE borrowDate IS NOT NULL
        GROUP BY MONTH(borrowDate)
        ORDER BY month DESC
        LIMIT 2;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error fetching data');
        }

        if (results.length < 2) {
            return res.json({ membersThisMonth: 0, growth: 0 }); // Trả về 0 nếu không đủ dữ liệu
        }

        const [latestMonth, previousMonth] = results;
        const membersThisMonth = latestMonth.unique_members;
        const membersLastMonth = previousMonth.unique_members;

        // Tính tỷ lệ thay đổi
        const growth = ((membersThisMonth - membersLastMonth) / membersLastMonth) * 100;

        // Trả về số lượng thành viên mượn sách trong tháng mới nhất và tỷ lệ thay đổi
        res.json({
            membersThisMonth,
            growth: growth.toFixed(2), // Chỉ lấy 2 chữ số thập phân
        });
    });
};
  
module.exports = {
    revenueChart,
    quantityBooksChart,
    foreignMemberChart,
    borrowedBooksByCategory,
    registrationTrends,
    revenueGrowth,
    memberRegistrationGrowth,
    bookCountByMonth,
    memberBorrowGrowth 
};
