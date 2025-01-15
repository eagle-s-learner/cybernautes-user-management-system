import { Request, Response } from "express";
import client from "../config";

interface Users {
    id: number;
    name: string;
    age: number;
    hobbies?: string[];
}

// to handle get all the users and there hobbies
async function getUsers(req: Request, res: Response) {
    try {
        const { name } = req.body;
        console.log(name);
        const query = `
            SELECT 
                u.id, 
                u.name, 
                u.age, 
                ARRAY_AGG(h.hobbies) AS hobbies
            FROM users u
            LEFT JOIN hobbies h ON u.id = h.id
            GROUP BY u.id, u.name, u.age;
        `;

        const result = await client.query(query);

        const users: Users[] = result.rows.map((row) => ({
            id: row.id,
            name: row.name,
            age: row.age,
            hobbies: row.hobbies[0] === null ? [] : row.hobbies, // Handle users with no hobbies
        }));

        // res.status(200).json(result.rows);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export { getUsers };
