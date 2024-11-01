-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS library_management;

-- Sử dụng cơ sở dữ liệu vừa tạo
USE library_management;

-- Tạo bảng users (tài khoản người dùng)
CREATE TABLE users (
    user_code VARCHAR(20) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,   
    full_name VARCHAR(100) NOT NULL,         
    password VARCHAR(255) NOT NULL,          
    email VARCHAR(100) NOT NULL UNIQUE,
    age INT,                                 
    phone_number VARCHAR(15),                
    country VARCHAR(50),                     
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar_user VARCHAR(255) NOT NULL
);

-- Tạo bảng books
CREATE TABLE books (
    book_code VARCHAR(50) PRIMARY KEY,
    book_name VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    language VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    received_date DATE NOT NULL,
    image_link VARCHAR(255)
);

-- Tạo bảng members
CREATE TABLE members (
    member_code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    registration_date DATE NOT NULL,
    age INT NOT NULL,
    avatar_link VARCHAR(255),
    country VARCHAR(50) NOT NULL
);

-- Thêm tài khoản người dùng (users)
INSERT INTO users (user_code, username, full_name, password, email, age, phone_number, country, avatar_user) VALUES 
('MEM001', 'admin1', 'Admin One', 'Tien%123', 'admin1@library.com', 30, '0123456789', 'Vietnam', '328bf51c-2ac5-492b-aaab-f826f700db33.avif');

-- Thêm dữ liệu sách (books)
INSERT INTO books (book_code, book_name, image_link, quantity, category, author, location, language, received_date)
VALUES 
('BK001', 'NHÀ NÔNG CẦN BIẾT', '1558-nha-nong-can-biet-1.jpg', 10, 'Nông Lâm Ngư Nghiệp', 'Hoàng Bình', 'Khu C', 'Tiếng việt', '2024-08-10'),
('BK002', 'KỸ THUẬT CHĂN NUÔI VÀ PHÒNG BỆNH CHO LỢN', '2469-ky-thuat-chan-nuoi-va-phong-benh-cho-lon-1.jpg', 5, 'Nông Lâm Ngư Nghiệp', 'Hội Người Mù', 'Khu C', 'Tiếng việt', '2024-06-26'),
('BK003', 'KỸ THUẬT TRỒNG RAU ĂN TRÁI', '7533-ky-thuat-trong-rau-an-trai-1.jpg', 8, 'Nông Lâm Ngư Nghiệp', 'Trung Tâm Khuyến Nông Đồng Nai', 'Khu C', 'Tiếng việt', '2024-08-09'),
('BK004', 'KỸ THUẬT CHĂN NUÔI VÀ PHÒNG BỆNH CHO GIA CẦM', '2470-ky-thuat-chan-nuoi-va-phong-benh-cho-gia-cam-1.jpg', 8, 'Nông Lâm Ngư Nghiệp', 'Hội Người Mù Huế', 'Khu C', 'Tiếng việt', '2024-06-26'),
('BK005', 'CẨM NANG TRỒNG RAU GIA VỊ AN TOÀN', '13663-cam-nang-trong-rau-gia-vi-an-toan-1.jpg', 2, 'Nông Lâm Ngư Nghiệp', 'Trung Tâm Khuyến Nông', 'Khu C', 'Tiếng việt', '2023-03-21'),
('BK006', 'NGHỆ THUẬT TẠO ĐẤT MÙN', '489-nghe-thuat-tao-dat-mun-1.jpg', 4, 'Nông Lâm Ngư Nghiệp', 'Sưu Tầm', 'Khu C', 'Tiếng việt', '2023-06-15'),
('BK007', 'XÂY DỰNG LẠI TRÁI ĐẤT', '13469-xay-dung-lai-trai-dat-1.jpg', 3, 'Nông Lâm Ngư Nghiệp', 'Mark Everard', 'Khu C', 'Tiếng anh', '2022-11-14'),
('BK008', 'NHỮNG BÀI HỌC TỪ THIÊN NHIÊN', '13802-nhung-bai-hoc-tu-thien-nhien-1.jpg', 1, 'Nông Lâm Ngư Nghiệp', 'Shimpei Murakami', 'Khu C', 'Tiếng anh', '2023-04-18'),
('BK009', 'GIÁO TRÌNH ĐÁNH GIÁ TÁC ĐỘNG MÔI TRƯỜNG', '1564-giao-trinh-danh-gia-tac-dong-moi-truong-1.jpg', 10, 'Nông Lâm Ngư Nghiệp', 'Nguyễn Đình Mạnh', 'Khu C', 'Tiếng việt', '2022-10-08'),
('BK010', 'QUẢN LÝ SẢN XUẤT RAU AN TOÀN TRÁI VỤ', '1574-quan-ly-san-xuat-rau-an-toan-trai-vu-1.jpg', 9, 'Nông Lâm Ngư Nghiệp', 'Lê Thị Thủy', 'Khu C', 'Tiếng việt', '2022-10-08'),
('BK011', 'TỰ HỌC SỬ DỤNG LINUX', '14376-tu-hoc-su-dung-linux-1.jpg', 2, 'Công nghệ thông tin', 'Phan Vĩnh Thịnh', 'Khu D', 'Tiếng việt', '2023-07-14'),
('BK012', 'BỘ NHỚ ĐỘNG TRONG C++', '8399-bo-nho-dong-trong-c-1.jpg', 2, 'Công nghệ thông tin', 'Batanlp', 'Khu D', 'Tiếng việt', '2023-07-17'),
('BK013', 'GIÁO TRÌNH HỆ ĐIỀU HÀNH UNIX - LINUX', '14372-giao-trinh-he-dieu-hanh-unix-linux-1.jpg', 8, 'Công nghệ thông tin', 'Phan Vĩnh Thịnh', 'Khu D', 'Tiếng việt', '2023-07-14'),
('BK014', 'GIÁO TRÌNH C++', '9765-giao-trinh-c-1.jpg', 4, 'Công nghệ thông tin', 'Khuyết Danh', 'Khu D', 'Tiếng việt', '2023-07-14'),
('BK015', 'JAVA CORE', '14362-java-core-1.jpg', 3, 'Công nghệ thông tin', 'Sưu Tầm', 'Khu D', 'Tiếng việt', '2023-07-14'),
('BK016', 'LEARNING JAVASCRIPT', '14357-learning-javascript-1.jpg', 5, 'Công nghệ thông tin', 'Ethan Brown', 'Khu D', 'Tiếng anh', '2023-07-14'),
('BK017', 'THINK JAVA: CÁCH SUY NGHĨ NHƯ NHÀ KHOA HỌC MÁY TÍNH', '14356-think-java-cach-suy-nghi-nhu-nha-khoa-hoc-may-tinh-1.jpg', 5, 'Công nghệ thông tin', 'Allen B. Downey', 'Khu D', 'Tiếng anh', '2023-07-14'),
('BK018', 'DỮ LIỆU LỚN', '9548-du-lieu-lon-1.jpg', 3, 'Công nghệ thông tin', 'Viktor Mayer-Schonberger', 'Khu D', 'Tiếng việt', '2023-06-20'),
('BK019', 'HACKER LƯỢC SỬ', '4103-hacker-luoc-su-1.jpg', 3, 'Công nghệ thông tin', 'Steven Levy', 'Khu D', 'Tiếng việt', '2023-05-10'),
('BK020', 'CÔNG NGHỆ BLOCKCHAIN', '1213-cong-nghe-blockchain-1.jpg', 2, 'Công nghệ thông tin', 'Nhiều Tác Giả', 'Khu D', 'Tiếng việt', '2022-09-30'),
('BK021', 'KHI HƠI THỞ HÓA THINH KHÔNG', '372-khi-hoi-tho-hoa-thinh-khong-1.jpg', 2, 'Y Học - Sức Khỏe', 'Paul Kalanithi', 'Khu E', 'Tiếng việt', '2024-08-10'),
('BK022', 'BẤM HUYỆT THẬP CHỈ ĐẠO', '7499-bam-huyet-thap-chi-dao-1.jpg', 4, 'Y Học - Sức Khỏe', 'Hoàng Duy Tân', 'Khu D', 'Tiếng việt', '2024-08-13'),
('BK023', 'DINH DƯỠNG CHỮA BỆNH - GIA VỊ VÀ THẢO DƯỢC', '10685-dinh-duong-chua-benh-gia-vi-va-thao-duoc-1.jpg', 10, 'Y Học - Sức Khỏe', 'Susan Curtis', 'Khu E', 'Tiếng việt', '2024-05-12'),
('BK024', 'Atlas of Human Anatomy, International Edition, 7e', '61FBi4pL3JL._AC._SR360,460.jpg', 10, 'Y Học - Sức Khỏe', 'NETTER', 'Khu E', 'Tiếng anh', '2019-01-01'),
('BK025', 'Human Anatomy And Physiology For First Year Diploma In Pharmacy 3Ed (Pb 2019)', '71Ruvg1RtdL._AC._SR360,460.jpg', 5, 'Y Học - Sức Khỏe', 'RAJE V.N.', 'Khu E', 'Tiếng anh', '2020-01-01'),
('BK026', 'Selective Anatomy with Clinical Case Studies', '51OzN2vEWiL._AC._SR360,460.jpg', 8, 'Y Học - Sức Khỏe', 'Vishram Singh', 'Khu E', 'Tiếng anh', '2024-09-20'),
('BK027', 'GIÁO TRÌNH TRIẾT HỌC MÁC - LÊNIN', '13867-giao-trinh-triet-hoc-mac-lenin-1.jpg', 5, 'Triết Học - Lý Luận', 'Bộ Giáo Dục Và Đào Tạo', 'Khu F', 'Tiếng việt', '2024-06-25'),
('BK028', 'NHIỆT ĐỚI BUỒN', '11397-nhiet-doi-buon-1.jpg', 4, 'Triết Học - Lý Luận', 'Claude Lévi-Strauss', 'Khu F', 'Tiếng việt', '2024-10-6'),
('BK029', 'MINH ĐẠO NHÂN SINH', '15591-minh-dao-nhan-sinh-1.jpg', 7, 'Triết Học - Lý Luận', 'Michael Puett', 'Khu F', 'Tiếng việt', '2024-5-11'),
('BK030', 'Philosophy - Theories and Great Thinkers', 'A1KGcZ31MeL._SY466_.jpg', 7, 'Triết Học - Lý Luận', 'David Papineau', 'Khu F', 'Tiếng anh', '2019-01-01'),
('BK031', 'The Philosophy, Theory and Methods of J. L. Moreno The Man Who Tried to Become God', '9781138184817.webp', 3, 'Triết Học - Lý Luận', 'John Nolte', 'Khu F', 'Tiếng anh', '2024-01-01'),
('BK032', 'Humanly Possible: Seven Hundred Years of Humanist Freethinking, Inquiry, and Hope', '71pVrCd9wBL._SY466_.jpg', 1, 'Triết Học - Lý Luận', 'Sarah Bakewell', 'Khu F', 'Tiếng anh', '2023-03-28'),
('BK033', 'KỂ CHUYỆN LỊCH SỬ VIỆT NAM THỜI HÙNG VƯƠNG', '7195-ke-chuyen-lich-su-viet-nam-thoi-hung-vuong-1.jpg', 8, 'Lịch Sử - Quân Sự', 'Phạm Trường Khang', 'Khu A', 'Tiếng việt', '2024-10-15'),
('BK034', 'ĐÁNH THẮNG B52', '7201-danh-thang-b52-1.jpg', 4, 'Lịch Sử - Quân Sự', 'Dương Liễu', 'Khu A', 'Tiếng việt', '2024-10-24'),
('BK035', 'BÚT KÝ LÍNH TĂNG - HÀNH TRÌNH ĐẾN DINH ĐỘC LẬP', '7206-but-ky-linh-tang-hanh-trinh-den-dinh-doc-lap-1.jpg', 6, 'Lịch Sử - Quân Sự', 'Phạm Hùng', 'Khu A', 'Tiếng việt', '2024-10-14'),
('BK036', 'Prisoners of the Castle', '9780593136355.jpg', 9, 'Lịch Sử - Quân Sự', 'Ben Macintyre', 'Khu A', 'Tiếng anh', '2023-08-01'),
('BK037', 'Andrew Jackson and the Miracle of New Orleans', '9780735213241.jpg', 1, 'Lịch Sử - Quân Sự', ' Brian Kilmeade and Don Yaeger', 'Khu A', 'Tiếng anh', '2018-10-23'),
('BK038', 'The Vietnam War', '9781984897749.jpg', 2, 'Lịch Sử - Quân Sự', 'Sarah Bakewell', 'Khu A', 'Tiếng anh', '2024-03-24'),
('BK039', 'DẾ MÈN PHIÊU LƯU KÝ', '1095-de-men-phieu-luu-ky-1.jpg', 7, 'Phiêu Lưu - Mạo Hiểm', 'Tô Hoài', 'Khu B', 'Tiếng việt', '2024-09-16'),
('BK040', 'CÔ DÂU HẢI THẦN', '14634-co-dau-hai-than-1.jpg', 6, 'Phiêu Lưu - Mạo Hiểm', 'Tịch Hạ', 'Khu B', 'Tiếng việt', '2024-05-02'),
('BK041', 'BÍ MẬT CỦA NICHOLAS FLAMEL BẤT TỬ - TẬP 4: KẺ CHIÊU HỒN', '10183-ke-chieu-hon-1.jpg', 9, 'Phiêu Lưu - Mạo Hiểm', 'Sarah Bakewell', 'Khu B', 'Tiếng việt', '2024-04-14'),
('BK042', 'LỜI NGUYỀN LỖ BAN - TẬP 2', '10567-loi-nguyen-lo-ban-tap-2-1.jpg', 4, 'Phiêu Lưu - Mạo Hiểm', 'Viên Thái Cực', 'Khu B', 'Tiếng việt', '2023-09-18'),
('BK043', 'CHIẾC VƯƠNG MIỆN PTOLEMY', '8738-chiec-vuong-mien-ptolemy-1.jpg', 3, 'Phiêu Lưu - Mạo Hiểm', 'Rick Riordan', 'Khu B', 'Tiếng việt', '2023-09-14'),
('BK044', 'Tiger is Tale', '209528307.jpg', 2, 'Phiêu Lưu - Mạo Hiểm', 'Colleen Houck', 'Khu B', 'Tiếng anh', '2024-09-10'),
('BK045', 'Murder on Family Grounds', '205338104.jpg', 1, 'Phiêu Lưu - Mạo Hiểm', 'Susan Rowland', 'Khu B', 'Tiếng anh', '2024-03-01'),
('BK046', 'The Polymorph', '101265124.jpg', 8, 'Phiêu Lưu - Mạo Hiểm', 'Max Nowaz', 'Khu B', 'Tiếng anh', '2024-03-24'),
('BK047', 'Tress of the Emerald Sea', '60531406.jpg', 10, 'Phiêu Lưu - Mạo Hiểm', 'Brandon Sanderson', 'Khu B', 'Tiếng anh', '2023-01-10'),
('BK048', 'SPY×FAMILY 1', '52961491.jpg', 3, 'Phiêu Lưu - Mạo Hiểm', 'Tatsuya Endo', 'Khu B', 'Tiếng anh', '2019-07-14');

INSERT INTO members (member_code, name, email, phone, registration_date, age, avatar_link, country) VALUES
('MEM001', 'John Doe', 'john@example.com', '1234567890', '2024-01-15', 25, 'avatar.jpeg', 'United States'),
('MEM002', 'Jane Smith', 'jane@example.com', '0987654321', '2024-01-20', 30, 'user1.jpg', 'United Kingdom'),
('MEM003', 'Alice Johnson', 'alice@example.com', '1122334455', '2024-01-25', 28, 'user2.jpg', 'Canada'),
('MEM004', 'Bob Brown', 'bob@example.com', '2233445566', '2024-02-01', 35, 'user3.jpg', 'Australia'),
('MEM005', 'Charlie White', 'charlie@example.com', '3344556677', '2024-02-05', 22, 'user4.jpg', 'France'),
('MEM006', 'David Wilson', 'david@example.com', '4455667788', '2024-02-10', 29, 'user5.jpg', 'Germany'),
('MEM007', 'Eva Green', 'eva@example.com', '5566778899', '2024-02-15', 32, 'user6.jpg', 'Italy'),
('MEM008', 'Frank Harris', 'frank@example.com', '6677889900', '2024-02-20', 27, 'user7.jpg', 'Spain'),
('MEM009', 'Grace Lee', 'grace@example.com', '7788990011', '2024-02-25', 31, 'user8.jpg', 'Japan'),
('MEM010', 'Hank Miller', 'hank@example.com', '8899001122', '2024-03-01', 40, 'user9.jpg', 'South Korea');
