import bcrypt from 'bcrypt';
import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 

const signupService = async (data) => {
    try {
        const { email, password } = data;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let res = await User.create({
            email,
            password: hashedPassword,
        });
        return res;
    } catch (e) {
        throw e;
    }
};

const signinService = async (data) => {
    try {
        const { email, password } = data;
        let user = await User.findOne({
            email,
        });
        if (!user) {
            throw new Error("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
        return { user, token };

    }
    catch (e) {
        throw e;
    }
}

export default { signupService, signinService };