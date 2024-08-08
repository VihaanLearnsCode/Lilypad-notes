import express from "express";
import cors from "cors";

const app = express();

app.use(express.json())
app.use(cors())

app.get("/api/notes", async (req, res)=> {
    res.json({message: "Success!"});
});
app.listen(4000, () => {
    console.log("server running localhost:4000")
});

