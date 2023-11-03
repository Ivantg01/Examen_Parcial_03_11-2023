import { load } from "https://deno.land/std@0.202.0/dotenv/mod.ts";
const env = await load();
const DB_URI = env["DB_URI"] || Deno.env.get("DB_URI") || "mongodb://localhost:27017/disc"

//conexion con la base de datos
//import mongoose from "npm:mongoose@^6.7";
import mongoose from "npm:mongoose@7.6.3";
try {
    console.log("Database: connecting... ", DB_URI);
    const db = await mongoose.connect(DB_URI);
    console.log("Database: connected", db.connection.name);
} catch (error) {
    console.log("Database: error: ", error);
}


//inicialiamos aplicacion web
import express, { Request, Response } from "npm:express@4.18.2";
const app = express();
app.use(express.json());  //habilitamos el uso de json

//importamos las funciones llamadas por cada peticion get, post, put y delete
import {addContacto, deleteContacto, getAnyContacto, getTodosContactos, updateContacto} from "./resolvers.ts";
//registramos en express las llamadas web
app
    //Llamadas GET ->
    .get("/", (req: Request, res: Response) => {
        res.status(200).send("API REST Agenda!");
    })
    .get("/api/contactos",getTodosContactos)
    .get("/api/contactos/:DNI",getAnyContacto)
    .post("/api/contactos", addContacto)
    .put("/api/contactos/:DNI",updateContacto)
    .delete("/api/contactos/:DNI", deleteContacto)

app.listen(3000, () => {
    console.log("Server started on port 3000");
});