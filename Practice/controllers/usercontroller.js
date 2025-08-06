import { user } from "../models/person.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export const createUser = async (req, res) => {
    console.log(req.body)
    try {
        const { name, email, age } = req.body

        const newUser = new user({
            name,
            email,
            age
        })

        await newUser.save()
        console.log(newUser)

        res.send("New User created");
    } catch (error) {
        res.send(error.message);
    }
}

export const updateUserData = async (req, res) => {
    console.log(req.body)
    const { email } = req.body;

    const personData = await user.findOne({ email })
    personData.name = "AAAAAAA";
    personData.age = 30;

    await personData.save();


    console.log(personData);
    res.send("User Data updated")
}

export const deleteUser = async (req, res) => {
    const { id } = req.params

    const deletedUser = await user.findByIdAndDelete(id);
    console.log(deletedUser);
    res.send("User deleted", deletedUser);
}

const users = [];

export const userRegister = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
        username,
        password: hashedPassword
    })
    console.log(users)
    return res.send('User registered');
}

export const userLog = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password);
        const user = users.find(u => u.username === username)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.send("Not Authorized");
        }
        const token = jwt.sign({ username }, 'secret#key');
        return res.json({ token });
    } catch (error) {
        res.send(error.message);
    }

}

export const userDashboard = async (req, res) => {
    const token = req.header('Authorization');
    const decodedToken = jwt.verify(token, 'secret#key');
    if (decodedToken.username) {
        return res.send(`Welcome ,${decodedToken.username}`);
    } else {
        return res.json('Access Denied');
    }


}