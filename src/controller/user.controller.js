import userService from "../services/user.service.js";



const postSignupUser = async (req, res) => {
    try {
        await userService.signupService(req.body);
        return res.status(200).send("Create user successfully");
    } catch (error) {
        return res.status(400).send(error.message);
    }
};


const postSigninUser = async (req, res) => {
    try {
        const user = await userService.signinService(req.body);
        return res.status(200).send(user);
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

export default { postSignupUser, postSigninUser };