import UsersDAO from "../dao/usersDAO.js";

export default class UsersController {
    static async apiGetUser(req, res, next) {
        try {
            const userId = req.query.id;
            const getResponse = await UsersDAO.getUser(userId);
            res.json(getResponse);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiPostUser(req, res, next) {
        try {
            const user = { email: req.body.email, userName: req.body.userName };
            const postResponse = await UsersDAO.addUser(user);
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateUser(req, res, next) {}

    static async apiDeleteUser(req, res, next) {
        try {
            const userId = req.query.id;
            const deleteResponse = UsersDAO.deleteUser(userId);
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}
