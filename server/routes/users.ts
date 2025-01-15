import { Router } from "express";
import { createUser, deleteUser, getUsers, updateUser } from "../controllers/users";

const routes = Router();

routes.get('/users/', getUsers);

routes.post('/users', createUser);

routes.put('/users/:id', updateUser);

routes.delete('/users/:id', deleteUser);

export default routes;