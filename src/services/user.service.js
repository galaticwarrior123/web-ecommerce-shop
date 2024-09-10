import bcrypt from 'bcrypt';
import User from '../model/user.model.js';


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

export default { signupService };