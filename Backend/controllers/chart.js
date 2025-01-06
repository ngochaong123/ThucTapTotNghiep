const db = require('../Data/Database'); // Database connection

// Hàm lấy dữ liệu Biểu đồ phạt quá hạn
const OverduePenaltyChart = (req, res) => { 
    const year = req.params.year; // Lấy giá trị năm từ URL 

    const sql = `
        SELECT 
            rb.PenaltyFees, 
            bb.returnDate 
        FROM 
            returnBook rb 
        JOIN 
            borrowBooks bb 
        ON 
            rb.borrowBooks_id = bb.borrowBooks_id
        WHERE 
            rb.PenaltyFees <> 0 AND
            YEAR(bb.returnDate) = ?  -- Thêm điều kiện lọc theo năm
    `;

    db.query(sql, [year], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).send(err);
        }

        // Chuyển đổi dữ liệu thành tháng
        const formattedData = results.map(item => {
            const month = new Date(item.returnDate).toLocaleString('default', { month: 'long' }); // Lấy tên tháng
            return {
                month: month,
                penaltyFees: item.PenaltyFees
            };
        });

        // Tổng hợp dữ liệu theo tháng
        const aggregatedData = formattedData.reduce((acc, curr) => {
            const found = acc.find(item => item.month === curr.month);
            if (found) {
                found.penaltyFees += curr.penaltyFees;
            } else {
                acc.push(curr);
            }
            return acc;
        }, []);

        res.json(aggregatedData); // Trả về dữ liệu đã tổng hợp
    });
};

// Hàm lấy dữ liệu số lượng sách theo thể loại
const quantityBooksChart = (req, res) => {
    const year = req.params.year; // Lấy giá trị năm từ URL

    const sql = `
        SELECT category, SUM(quantity) AS total_quantity
        FROM books
        WHERE YEAR(received_date) = ?
        GROUP BY category
    `;
    
    // Truy vấn dữ liệu từ bảng books
    db.query(sql, [year], (err, results) => {
        if (err) {
            return res.status(500).send(err); // Nếu có lỗi thì trả về lỗi server
        }
        res.json(results); // Trả về dữ liệu số lượng sách theo thể loại
    });
}; 

// Hàm Tỷ lệ giới tính độc giả đăng ký
const genderRatio = (req, res) => {
    const year = req.params.year; // Lấy giá trị năm từ URL

    const sql = `
        SELECT 
            CASE 
                WHEN gender LIKE '%Nam%' THEN 'Nam'
                WHEN gender LIKE '%Nữ%' THEN 'Nữ'
                ELSE NULL
            END AS genderGroup,
            COUNT(*) AS count
        FROM 
            members
        WHERE 
            (gender LIKE '%Nam%' OR gender LIKE '%Nữ%')
            AND YEAR(registration_date) = ?
        GROUP BY 
            genderGroup
    `;

    // Truyền year vào câu lệnh SQL
    db.query(sql, [year], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }

        // Kiểm tra nếu không có kết quả trả về
        if (results.length === 0) {
            return res.json({
                totalMembers: 0,
                male: { count: 0, percentage: "0%" },
                female: { count: 0, percentage: "0%" },
            });
        }

        const genderData = results.reduce((acc, item) => {
            acc[item.genderGroup.toLowerCase()] = item.count;
            return acc;
        }, {});

        const maleCount = genderData.nam || 0;
        const femaleCount = genderData.nữ || 0;

        const total = maleCount + femaleCount;
        const malePercentage = total ? ((maleCount / total) * 100).toFixed(2) : 0;
        const femalePercentage = total ? ((femaleCount / total) * 100).toFixed(2) : 0;

        res.json({
            totalMembers: total,
            male: {
                count: maleCount,
                percentage: `${malePercentage}%`,
            },
            female: {
                count: femaleCount,
                percentage: `${femalePercentage}%`,
            },
        });
    });
};

// Hàm lấy dữ liệu số lượng sách đã mượn theo thể loại
const borrowedBooksByCategory = (req, res) => {
    const year = req.params.year; // Lấy giá trị năm từ URL

    const query = `
        SELECT b.category AS category, SUM(bb.quantity) AS total_borrowed
        FROM borrowBooks AS bb
        JOIN books AS b ON bb.book_code = b.book_code
        WHERE YEAR(bb.borrowDate) = ?  -- Truyền tham số year vào câu truy vấn
        GROUP BY b.category;
    `;

    // Truyền year vào câu truy vấn
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error('Error fetching borrowed books by category:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json(results); // Trả về dữ liệu số lượng sách đã mượn theo thể loại
    });
};

// Hàm lấy dữ liệu xu hướng đăng ký thành viên theo tháng
const registrationTrends = (req, res) => {
    const year = req.params.year; // Lấy year từ URL params

    if (!year) {
        return res.status(400).send('Year is required');
    }

    const query = `
        SELECT MONTH(registration_date) AS month, COUNT(*) AS registrations
        FROM members
        WHERE YEAR(registration_date) = ?
        GROUP BY MONTH(registration_date)
        ORDER BY month;
    `;

    db.query(query, [year], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error fetching data');
        }

        if (results.length === 0) {
            return res.json([]);
        }

        res.json(results);
    });
};
  
module.exports = {
    OverduePenaltyChart,
    quantityBooksChart,
    genderRatio,
    borrowedBooksByCategory,
    registrationTrends,
};
