


const signupService = async (data) => {
    try {
        const user = new User(data);
        await user.save();
        return user;
    } catch (e) {
        throw e;
    }
}

export default signupService;