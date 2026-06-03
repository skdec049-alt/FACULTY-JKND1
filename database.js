const { Sequelize, DataTypes } = require('sequelize');

let sequelize;

// ==========================================================
// --- 1. DYNAMIC DATABASE CONNECTION INITIALIZATION ---
// ==========================================================
if (process.env.DATABASE_URL) {
    // If running on Render, connect securely to Supabase (PostgreSQL)
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Required for hosted services like Render
            }
        },
        // UPDATED: Added connection pooling options to resolve network timeouts and ENETUNREACH drops
        pool: {
            max: 5,                  // Maximum number of connection instances in pool
            min: 0,                  // Minimum number of connection instances in pool
            acquire: 30000,          // The maximum time, in milliseconds, that pool will try to get connection before throwing error
            idle: 10000              // The time, in milliseconds, that a connection can be idle before being released
        }
    });
} else {
    // If running locally, fall back to your offline SQLite file
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './faculty.db', 
        logging: false
    });
}

// ==========================================================
// --- 2. DEFINE THE FACULTY TABLE ---
// ==========================================================
const Faculty = sequelize.define('Faculty', {
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    college: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Techno India Group Jharkhand"
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Faculty"
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    score: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    }
});

// ==========================================================
// --- 3. DEFINE THE COURSE TABLE ---
// ==========================================================
const Course = sequelize.define('Course', {
    courseName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    courseCode: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    credits: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    }
});

// ==========================================================
// --- 4. DEFINE THE SUBMISSION TABLE ---
// ==========================================================
const Submission = sequelize.define('Submission', {
    title: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    category: { 
        type: DataTypes.STRING 
    },
    points: { 
        type: DataTypes.INTEGER 
    },
    details: { 
        type: DataTypes.TEXT 
    }, 
    date: { 
        type: DataTypes.DATE, 
        defaultValue: Sequelize.NOW 
    }
});

// ==========================================================
// --- 5. SET UP RELATIONSHIPS ---
// ==========================================================
// Relationship: One Faculty has many Courses
Faculty.hasMany(Course);
Course.belongsTo(Faculty);

// Relationship: One Faculty can have Many Submissions
Faculty.hasMany(Submission);
Submission.belongsTo(Faculty);

// ==========================================================
// --- 6. CONSOLIDATED EXPORT ---
// ==========================================================
module.exports = { 
    sequelize, 
    Faculty, 
    Course, 
    Submission 
};