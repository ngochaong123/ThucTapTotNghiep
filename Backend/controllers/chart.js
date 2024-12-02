const db = require('../Data/Database'); // Database connection

// Hàm lấy dữ liệu Biểu đồ phạt quá hạn
const OverduePenaltyChart = (req, res) => {
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
            rb.PenaltyFees <> 0
    `;

    db.query(sql, (err, results) => {
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

// Hàm Tỷ lệ giới tính độc giả đăng ký
const genderRatio = (req, res) => {
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
            gender LIKE '%Nam%' OR gender LIKE '%Nữ%'
        GROUP BY 
            genderGroup
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
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
    
    // const query = `
    //     SELECT MONTH(Time) AS month, revenue
    //     FROM revenue_expenses
    //     ORDER BY Time DESC
    //     LIMIT 2;
    // `;

    // db.query(query, (err, results) => {
    //     if (err) {
    //         console.error('Error executing query:', err);
    //         res.status(500).send('Error fetching data');
    //         return;
    //     }

    //     if (results.length < 2) {
    //         return res.json({ revenue: 0, growth: 0 }); // Trả về 0 nếu không đủ dữ liệu
    //     }

    //     const [latestMonth, previousMonth] = results;
    //     const revenueThisMonth = latestMonth.revenue;
    //     const revenueLastMonth = previousMonth.revenue;

    //     // Tính tỷ lệ thay đổi doanh thu
    //     const growth = ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100;

    //     // Trả về doanh thu và tỷ lệ thay đổi
    //     res.json({
    //         revenue: revenueThisMonth,
    //         growth: growth.toFixed(2), // Chỉ lấy 2 chữ số thập phân
    //     });
    // });
};
 
const profitGrowth = (req, res) => {
    // const query = `
    //     SELECT 
    //         a.profit AS latest_profit,  
    //         ((a.profit - b.profit) / b.profit) * 100 AS growth_percentage
    //     FROM revenue_expenses a
    //     JOIN revenue_expenses b
    //         ON MONTH(a.Time) = MONTH(b.Time) + 1
    //         AND YEAR(a.Time) = YEAR(b.Time)  -- Đảm bảo chỉ tính tháng liền kề trong cùng năm
    //     ORDER BY a.Time DESC
    //     LIMIT 1;  -- Lấy tháng mới nhất và tháng trước đó
    // `;
    
    // db.query(query, (err, results) => {
    //     if (err) {
    //         console.error('Error executing query:', err);
    //         return res.status(500).send('Error fetching data');
    //     }

    //     if (results.length === 0) {
    //         return res.json({ profit: 0, growth: 0 });
    //     }

    //     const { latest_profit, growth_percentage } = results[0];

    //     // Ép kiểu growth_percentage sang số và kiểm tra giá trị
    //     const growth = growth_percentage != null && !isNaN(growth_percentage)
    //         ? Number(growth_percentage).toFixed(2)
    //         : "0.00";

    //     res.json({
    //         profit: latest_profit,
    //         growth: growth
    //     });
    // });
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
    OverduePenaltyChart,
    quantityBooksChart,
    genderRatio,
    borrowedBooksByCategory,
    registrationTrends,
    revenueGrowth,
    memberRegistrationGrowth,
    bookCountByMonth,
    memberBorrowGrowth,
    profitGrowth 
};
