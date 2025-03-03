CREATE DATABASE IF NOT EXISTS leones_calistenia;
USE leones_calistenia;

-- Users Table
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
role ENUM('manager', 'coach', 'member') NOT NULL,
first_name VARCHAR(50) NOT NULL,
last_name VARCHAR(50) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
phone VARCHAR(20),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Members Table
CREATE TABLE members (
id INT PRIMARY KEY,
membership_paid BOOLEAN DEFAULT FALSE,
membership_expiration DATE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Coaches Table
CREATE TABLE coaches (
id INT PRIMARY KEY,
specialization VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Branches Table
CREATE TABLE branches (
id INT AUTO_INCREMENT PRIMARY KEY,
branch_name VARCHAR(100) NOT NULL,
location VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Class Packages Table
CREATE TABLE class_packages (
id INT AUTO_INCREMENT PRIMARY KEY,
member_id INT NOT NULL,
package_type ENUM('2', '7', '30', '60') NOT NULL,
remaining_classes INT NOT NULL,
purchase_date DATE NOT NULL,
expiration_date DATE NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Classes Table
CREATE TABLE classes (
id INT AUTO_INCREMENT PRIMARY KEY,
coach_id INT,
branch_id INT NOT NULL,
class_type VARCHAR(100) NOT NULL,
class_date DATETIME NOT NULL,
max_capacity INT NOT NULL CHECK (max_capacity > 0),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE SET NULL,
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- Class Enrollments Table
CREATE TABLE class_enrollments (
id INT AUTO_INCREMENT PRIMARY KEY,
member_id INT NOT NULL,
class_id INT NOT NULL,
enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- Transactions Table (For Memberships & Package Purchases)
CREATE TABLE transactions (
id INT AUTO_INCREMENT PRIMARY KEY,
member_id INT NOT NULL,
amount DECIMAL(10,2) NOT NULL,
transaction_type ENUM('membership', 'package') NOT NULL,
package_id INT NULL,
payment_method ENUM('cash', 'card', 'online') NOT NULL,
transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
FOREIGN KEY (package_id) REFERENCES class_packages(id) ON DELETE SET NULL
);

-- Trigger to enforce class capacity limit
DELIMITER // --Remove for GCloud--
CREATE TRIGGER check_class_capacity_before_insert
BEFORE INSERT ON class_enrollments
FOR EACH ROW
BEGIN
DECLARE current_count INT;
DECLARE max_capacity INT;

SELECT COUNT(*) INTO current_count FROM class_enrollments WHERE class_id = NEW.class_id;
SELECT classes.max_capacity INTO max_capacity FROM classes WHERE id = NEW.class_id;

IF current_count >= max_capacity THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Class is at full capacity';
END IF;

END;
//
DELIMITER ; --Remove for GCloud--

-- Indexes for performance optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_class_packages_member_id ON class_packages(member_id);
CREATE INDEX idx_classes_coach_id ON classes(coach_id);
CREATE INDEX idx_classes_branch_id ON classes(branch_id);
CREATE INDEX idx_enrollments_member_id ON class_enrollments(member_id);
CREATE INDEX idx_transactions_member_id ON transactions(member_id);

