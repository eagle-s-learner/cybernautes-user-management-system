import { Request, Response } from "express";
import client from "../config";

interface Users {
    id?: number;
    name: string;
    age: number;
    hobbies?: string[];
}

// to handle get all the users and there hobbies
async function getUsers(req: Request, res: Response) {
    try {
        const query = `
            SELECT 
                u.id, 
                u.name, 
                u.age, 
                ARRAY_AGG(h.hobbies) AS hobbies
            FROM users u
            LEFT JOIN hobbies h ON u.id = h.id
            GROUP BY u.id, u.name, u.age
            ORDER BY u.id DESC;
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

// create new user
async function createUser(req: Request, res: Response) {
    try {
        const user: Users = req.body;

        if (user.name.length === 0 || user.age <= 0) {
            res.status(400).json({ message: "Required valid Name or Age" });
            return;
        }

        // this query will insert and return the inserted user at the same time
        const result = await client.query(
            `INSERT INTO users (name, age) VALUES ($1, $2) RETURNING *`,
            [user.name, user.age]
        );

        // now insert the hobbies in hobbies table
        if (user.hobbies && user.hobbies.length > 0) {
            const hobbyQueries = user.hobbies.map((hobby) =>
                client.query(
                    `INSERT INTO hobbies (id, hobbies) VALUES ($1, $2)`,
                    [result.rows[0].id, hobby]
                )
            );

            // this will insert all the hobbies concurrently
            await Promise.all(hobbyQueries);
        }
        
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export { getUsers, createUser };
