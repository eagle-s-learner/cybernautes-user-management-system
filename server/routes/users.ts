import { Router } from "express";
import { getUsers } from "../controllers/users";

const routes = Router();

routes.get('/users/', getUsers);

export default routes;