const bcrypt = require("bcrypt");

const signupService = async (data) => {
    try {
        const { email, password } = data; s
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
}

export default {
    signupService,
};