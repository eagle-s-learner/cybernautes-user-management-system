import { Router } from "express";
import { createUser, getUsers } from "../controllers/users";

const routes = Router();

routes.get('/users/', getUsers);

routes.post('/users', createUser);

export default routes;