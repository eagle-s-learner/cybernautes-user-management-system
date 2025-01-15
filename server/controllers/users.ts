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

// update user handler
async function updateUser(req: Request, res: Response) {
    try {
        const id: number = parseInt(req.params.id);
        const result = await client.query(
            `SELECT * FROM USERS WHERE id = ($1)`,
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not exist" });
            return;
        }

        const user: Users = req.body;

        if (user.name.length === 0 || user.age <= 0) {
            res.status(400).json({ message: "Required valid Name or Age" });
            return;
        }

        // updating name and age
        if (
            user.name != result.rows[0].name &&
            user.age != result.rows[0].age
        ) {
            await client.query(
                `UPDATE users SET name = ($1), age = ($2) WHERE id = ($3)`,
                [user.name, user.age, id]
            );
        } else if (user.name != result.rows[0].name) {
            await client.query(`UPDATE users SET name = ($1) WHERE id = ($2)`, [
                user.name,
                id,
            ]);
        } else if (user.age != result.rows[0].age) {
            await client.query(`UPDATE users SET age = ($1) WHERE id = ($2)`, [
                user.age,
                id,
            ]);
        }

        // deleting all the hobbies related to that user
        await client.query(`DELETE FROM hobbies WHERE id = ($1)`, [id]);

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

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// delete user handler
async function deleteUser(req: Request, res: Response) {
    try {
        const id: number = parseInt(req.params.id);
        const result = await client.query(
            `SELECT * FROM USERS WHERE id = ($1)`,
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not exist" });
            return;
        }

        await client.query(`DELETE FROM users WHERE id = ($1)`, [id]);

        res.status(204).json({ message: "User Deleted Successfully" });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export { getUsers, createUser, updateUser, deleteUser };
