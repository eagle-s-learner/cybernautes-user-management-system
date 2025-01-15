import { Router } from "express";
import { createUser, getUsers, updateUser } from "../controllers/users";

const routes = Router();

routes.get('/users/', getUsers);

routes.post('/users', createUser);

routes.put('/users/:id', updateUser);

export default routes;