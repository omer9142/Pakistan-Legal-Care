import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connection from "./db.js";
import multer from "multer";
import path from "path";
import nodemailer from 'nodemailer';

dotenv.config();

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));


const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Function to add user to database
const addUser = async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        connection.query(query, [name, email, hashedPassword], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

// Signup Route
app.post("/signup", async (req, res) => {
    try {
        console.log("Received signup request:", req.body);
        const { username, email, password, confirmPassword } = req.body;

        // ✅ Fix: Ensure confirmPassword is received and checked
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        await addUser(username, email, password);
        res.json({ message: "Signup successful" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
});

// Signin Route
app.post("/signin", (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";
    connection.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(401).json({ error: "User not found" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    });
});

//Get data for lawyer form
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
app.get("/user", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });

        const query = "SELECT id, username, email FROM users WHERE id = ?";
        connection.query(query, [decoded.id], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (results.length === 0) return res.status(404).json({ error: "User not found" });

            res.json(results[0]); // Send username and email
        });
    });
});

const upload = multer({ storage });

// Lawyer Registration Route
app.post("/register-lawyer", upload.fields([{ name: "license_card" }, { name: "profile_picture" }]), async (req, res) => {
    try {
        const { username, email, phone, city, experience, about, license_no, specialization } = req.body;
        const license_card = req.files["license_card"] ? req.files["license_card"][0].filename : null;
        const profile_picture = req.files["profile_picture"] ? req.files["profile_picture"][0].filename : null;

        if (!username || !email || !phone || !city || !experience || !about || !license_no || !license_card || !profile_picture) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const query = `
            INSERT INTO lawyers (username, email, phone, city, experience, about, license_no, specialization, license_card, profile_picture) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        connection.query(query, [username, email, phone, city, experience, about, license_no, specialization, license_card, profile_picture], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error", error: err.message });
            }
            res.json({ message: "Lawyer registered successfully!" });
        });
    } catch (error) {
        console.error("Error registering lawyer:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
//Attorney page for
app.get("/attorneys", (req, res) => {
    const query = "SELECT * FROM lawyers";
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});
//For ROle Check
app.get("/user/role", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });

        const email = decoded.email;

        // Check if user exists in the lawyers table
        const lawyerQuery = "SELECT * FROM lawyers WHERE email = ?";
        connection.query(lawyerQuery, [email], (err, lawyerResults) => {
            if (err) return res.status(500).json({ error: "Database error" });

            if (lawyerResults.length > 0) {
                return res.json({ role: "Lawyer" });
            } else {
                return res.json({ role: "User" });
            }
        });
    });
});

//Edit profile 
app.get("/profile", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });

        const email = decoded.email;
        const lawyerQuery = `
            SELECT username, email, phone, city, experience, about, license_no, 
                   license_card, specialization, profile_picture 
            FROM lawyers WHERE email = ?`;

        connection.query(lawyerQuery, [email], (err, lawyerResults) => {
            if (err) return res.status(500).json({ error: "Database error" });

            if (lawyerResults.length > 0) {
                console.log("Lawyer Data:", lawyerResults[0]); // Debugging
                return res.json(lawyerResults[0]); // Return lawyer details if found
            } else {
                const userQuery = "SELECT username, email, password FROM users WHERE email = ?";

                connection.query(userQuery, [email], (err, userResults) => {
                    if (err) return res.status(500).json({ error: "Database error" });

                    if (userResults.length > 0) {
                        console.log("User Data:", userResults[0]); // Debugging
                        return res.json(userResults[0]); // Return basic user details
                    } else {
                        return res.status(404).json({ error: "User not found" });
                    }
                });
            }
        });
    });
});
app.post("/verify-password", (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT password FROM users WHERE email = ?";
    connection.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ error: "User not found" });

        const storedPassword = results[0].password;

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, storedPassword);
        if (isMatch) {
            return res.json({ success: true });
        } else {
            return res.status(401).json({ error: "Incorrect password" });
        }
    });
});
app.put("/update-profile", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Updating profile with token:", token);
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error("Invalid token:", err);
            return res.status(401).json({ error: "Invalid token" });
        }

        const { username, email, phone, city, experience, about, license_no, license_card } = req.body;
        console.log(`Updating user with email: ${email}`);

        const query1 = "UPDATE users SET username = ? WHERE email = ?";
        connection.query(query1, [username, email], (err) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            const query2 = `
                UPDATE lawyers 
                SET username = ?, phone = ?, city = ?, experience = ?, about = ?, license_no = ?, license_card = ? 
                WHERE email = ?`;

            connection.query(query2, [username, phone, city, experience, about, license_no, license_card, email], (err) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: "Database error" });
                }

                console.log("Profile updated successfully in both tables");
                res.json({ message: "Profile updated successfully in both tables" });
            });
        });
    });
});

//Attorney dashboard request 
let lastRequestTime = 0;

app.post("/attorney-email", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    console.log(`Fetching cases for lawyer email: ${email}`);

    const query = "SELECT * FROM cases_submitted WHERE lawyerEmail = ?";

    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        console.log("Cases found:", results);
        res.json({ cases: results });
    });
});
//Fetching single attorney for detail
app.get("/attorneys/:email", (req, res) => {
    const email = decodeURIComponent(req.params.email);
    console.log("Received email in backend:", email); // Debugging log

    if (!email) {
        return res.status(400).json({ error: "Invalid email parameter" });
    }

    const query = "SELECT * FROM lawyers WHERE email = ?";
    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
            console.log("Attorney not found for email:", email);
            return res.status(404).json({ error: "Attorney not found" });
        }

        console.log("Attorney details sent:", results[0]);
        res.json(results[0]);
    });
});

// case accept or reject and send emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'doe09565@gmail.com',
        pass: 'uhzn wafc hzio jiaq',
    }
});

function sendEmail(to, subject, htmlContent) {
    const mailOptions = {
        from: 'doe09565@gmail.com',
        to,
        subject,
        html: htmlContent,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

app.post("/submit-case/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const { clientName, caseType, description, city, shortSummary } = req.body;

        if (!clientName || !caseType || !description || !city || !shortSummary) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Correcting table name & ensuring 6 values match 6 columns
        const query = `INSERT INTO cases_submitted (lawyerEmail, clientName, caseCategory, detailSummary, city, shortSummary) VALUES (?, ?, ?, ?, ?, ?)`;

        connection.query(query, [email, clientName, caseType, description, city, shortSummary], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error", error: err.message });
            }

            // Send email to lawyer
            sendEmail(
                email,
                'New Case Submission - Action Required',
                `
            <p>Dear Lawyer,</p>
            <p>A new case has been submitted to your profile on Pakistan Legal Care.</p>
            <p>Please log in to your account to review and respond to this case request.</p>
            <p>Best regards,<br>The Pakistan Legal Care Team</p>
            `
            );

            res.json({ message: "Case submitted successfully!" });
        });
    } catch (error) {
        console.error("Error submitting case:", error);
        res.status(500).json({ message: "Failed to submit case", error: error.message });
    }
});

app.put('/update-request-status/:id', (req, res) => {
    const requestId = parseInt(req.params.id);
    const newStatus = req.body.status;

    if (!newStatus) {
        return res.status(400).json({ error: 'Status is required' });
    }

    const getCaseSql = 'SELECT lawyerEmail, clientName FROM cases_submitted WHERE id = ?';

    connection.query(getCaseSql, [requestId], (err, caseResult) => {
        if (err || caseResult.length === 0) {
            console.error('Error fetching case info:', err);
            return res.status(500).json({ error: 'Failed to fetch case details' });
        }

        const { lawyerEmail, clientName } = caseResult[0];

        const getUserSql = 'SELECT email FROM users WHERE username = ?';

        connection.query(getUserSql, [clientName], (err, userResult) => {
            if (err || userResult.length === 0) {
                console.error('Error fetching user info:', err);
                return res.status(500).json({ error: 'Failed to fetch user details' });
            }

            const userEmail = userResult[0].email;

            const updateSql = 'UPDATE cases_submitted SET status = ? WHERE id = ?';

            connection.query(updateSql, [newStatus, requestId], (err, result) => {
                if (err) {
                    console.error('DB Error:', err);
                    return res.status(500).json({ error: 'Database update failed' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Request not found' });
                }

                if (newStatus === 'Accepted') {
                    sendEmail(
                        lawyerEmail,
                        'Case Request Accepted - Client Information',
                        `
              <p>Dear Lawyer,</p>
              <p>You have successfully accepted a new case request.</p>
              <p><strong>Client Name:</strong> ${clientName}<br>
              <strong>Client Email:</strong> ${userEmail}</p>
              <p>Please get in touch with your client to proceed further.</p>
              <p>Best regards,<br>The Pakistan Legal Care Team</p>
              `
                    );

                    sendEmail(
                        userEmail,
                        'Your Case Request Has Been Accepted',
                        `
              <p>Dear ${clientName},</p>
              <p>Great news! Your case request has been <strong>accepted</strong> by the lawyer.</p>
              <p><strong>Lawyer Email:</strong> ${lawyerEmail}</p>
              <p>You can now reach out to your lawyer to discuss your case details.</p>
              <p>Wishing you the best,<br>The Pakistan Legal Care Team</p>
              `
                    );
                } else if (newStatus === 'Rejected') {
                    sendEmail(
                        userEmail,
                        'Update on Your Case Request',
                        `
                      <p>Dear ${clientName},</p>
                      <p>We regret to inform you that your case request has been <strong>rejected</strong>.</p>
                      <p>Feel free to explore other lawyers on our platform who may be able to assist you.</p>
                      <p>Thank you for using Pakistan Legal Care.<br>Warm regards,<br>The Pakistan Legal Care Team</p>
                      `
                    );
                } else if (newStatus === 'Completed') {
                    sendEmail(
                        lawyerEmail,
                        'Case Completed and Closed',
                        `
                      <p>Dear Lawyer,</p>
                      <p>We acknowledge the successful completion and closure of the case with the following details:</p>
                      <p><strong>Client Name:</strong> ${clientName}<br>
                      <strong>Client Email:</strong> ${userEmail}</p>
                      <p>Thank you for your professional service and contribution to the Pakistan Legal Care platform.</p>
                      <p>Best regards,<br>The Pakistan Legal Care Team</p>
                      `
                    );

                    sendEmail(
                        userEmail,
                        'Case Completed and Closed',
                        `
                      <p>Dear ${clientName},</p>
                      <p>We’re pleased to inform you that your case has been successfully <strong>completed and closed</strong>.</p>
                      <p><strong>Lawyer Email:</strong> ${lawyerEmail}</p>
                      <p>We appreciate your trust in Pakistan Legal Care. If you require further legal assistance in the future, we are here to help.</p>
                      <p>Warm regards,<br>The Pakistan Legal Care Team</p>
                      `
                    );
                }

                res.status(200).json({ message: 'Request status updated and email(s) sent' });
            });
        });
    });
});

// Search lawyers by specialization (area of law)
app.get("/search-lawyers", (req, res) => {
    const { area } = req.query;

    if (!area) {
        return res.status(400).json({ error: "Area/specialization parameter is required" });
    }

    console.log(`Searching lawyers for area: ${area}`);

    // Using LIKE for partial matches (case-insensitive)
    const query = "SELECT * FROM lawyers WHERE specialization LIKE ?";
    const searchTerm = `%${area}%`;

    connection.query(query, [searchTerm], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        console.log(`Found ${results.length} lawyers for area: ${area}`);
        res.json(results);
    });
});
