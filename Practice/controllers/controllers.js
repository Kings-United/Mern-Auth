export const userLogin = (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({
            success: false,
            message: "Please provide username and password"
        })
    }

    return res.json({
        success: true,
        message: `Username: ${username}, Password:${password}`
    })
}

export const updateUser = (req, res) => {
    const userId = req.params.id;
    const { username, password } = req.body;

    return res.json({
        success: true,
        message: `UserId : ${userId}, Username:${username}, Passsword:${password}`
    })
}

export const userSignUp = (req, res) => {
    console.log("Inside usersignup controller function");
    res.send("User signup Route");
}

export const formdata = (req, res) => {
    console.log(req.body);
    console.log(req.file)
    res.send("form received");
}