const bcryptjs = require("bcryptjs");

const hashPassword = async (password) => {
    const hashedPassword = await bcryptjs.hash(password, 10);
    return hashedPassword;
};

const comparePassword = async (password, userPassword) => {
    const hashedPassword = await bcryptjs.compare(password, userPassword);
    return hashedPassword;
};

module.exports = { hashPassword, comparePassword };
