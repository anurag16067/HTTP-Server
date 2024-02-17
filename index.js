const express = require("express");
const fs = require('fs');
const users = require("./MOCK_DATA.json");
const app = express();
const cookie = require("cookie-parser");
const cookieParser = require("cookie-parser");
const PORT = 8000;
// Middleware -> assume plugin
// when a data come it send to in body
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());

//Routes
app.get('/users', (req, res) => {
    const html = `
    <ul>
        ${users.map((users) => `<li>${users.first_name}</li>`).join("")}
    </ul>
    `;
    res.status(200).send(html);
});

//REST API
app.get("/api/users", (req, res) => {
    res.cookie("Name", "Anurag");
    return res.status(200).json(users);
}).head((res) => {
    return res.status(200).json(users);
})

// Gropping /api/users/:id 
app.route("/api/users/:id").get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.status(200).json(user);
}).delete((req, res) => {
    //TOOD: Delete the user with id
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        users.splice(index, 1); // Remove the user at the found index
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
            if (err) {
                return res.status(500).json({ status: "Error", message: "Failed to delete user" });
            }
            return res.status(202).json({ status: "Success", message: "User deleted successfully" });
        });
    } else {
        return res.status(404).json({ status: "Error", message: "User not found" });
    }
    // users.pop()
    // return res.json({ status: "Pending"});
}).put((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        const updatedUser = { ...users[index], ...req.body }; // Merge existing user data with new data from request body
        users[index] = updatedUser; // Update the user in the array
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
            if (err) {
                return res.status(500).json({ status: "Error", message: "Failed to update user" });
            }
            return res.status(202).json({ status: "Success", message: "User updated successfully" });
        });
    } else {
        return res.status(404).json({ status: "Error", message: "User not found" });
    }
});

// app.get("/api/users/:id", (req, res) => {
//     const id = Number(req.params.id);
//     const user = users.find((user) => user.id === id);
//     return res.json(user);
// });

app.post('/api/users', (req, res) => {
    const body = req.body; //data send from froentend
    // console.log("Body", body);
    users.push({ ...body, id: users.length + 1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.status(201).json({ status: "Success", id: users.length});
    });
    
});

// app.patch('/api/users/:id', (req, res) => {
//     //TOOD: Edit the user with id
//     return res.json({ status: "Pending"});
// });

// app.delete('/api/users/:id', (req, res) => {
//     //TOOD: Delete the user with id
//     return res.json({ status: "Pending"});
// });


app.listen(PORT, () => console.log(`Server Started at port ${PORT}`));
