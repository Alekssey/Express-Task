const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const fs = require('fs');

app.listen(3001);
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Headers', ['content-type']);
    res.append('Access-Control-Allow-Methods', ['PUT', 'DELETE']);
    next();
});

app.get('/users', async (req, res) => {
    const usersData = await getUsers();
    res.append('Content-Type', 'application/json');
    res.json(usersData);
});

app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const userData = await getUserById(userId);
    res.append('Content-Type', 'application/json');
    res.json(userData);
});

app.post('/users/add', async (req, res) => {
    const newUser = req.body;
    const postResult = await postUser(newUser);
    res.send('User was added');
});

app.put('/users/:id', async (req, res) => {
    const newProperties = req.body;
    const userId = req.params.id;
    const putResult = await putUser(userId, newProperties);
    res.send('User was updated');
});

app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const deleteResult = await deleteUser(userId);
    res.send('User was deleted');
});

function getUsers(){
    return new Promise((resolve, reject) => {
        fs.readFile('./assets/users.json', 'utf8', (err, data) => {
            if(err){
                reject(err);
            }
            const usersArray = JSON.parse(data);
            resolve(usersArray);
        });
    })
}

function getUserById(id){
    return new Promise((resolve, reject) => {
        fs.readFile('./assets/users.json', 'utf8', (err, data) => {
            if(err){
                reject(err);
            }
            const usersArray = JSON.parse(data);
            for(let value of usersArray){
                (value.id === Number(id)) ? resolve(value) : null;
            }
        });
    })
}

async function postUser(newUser){
    const allUsers = await getUsers();

    allUsers.push(newUser);

    return new Promise((resolve, reject) => {fs.writeFile('./assets/users.json', JSON.stringify(allUsers), 'utf8', (err) => {
        if(err) reject(err) ;
        resolve(true);
    })})
}

async function putUser(id, newUserProperties){
    const allUsers = await getUsers();

    for(let i = 0; i < allUsers.length; i++){
        (allUsers[i].id === Number(id)) ? allUsers.splice(i, 1, newUserProperties) : null;
    }

    return new Promise((resolve, reject) => {fs.writeFile('./assets/users.json', JSON.stringify(allUsers), 'utf8', (err) => {
        if(err) reject(err) ;
        resolve(true);
    })})
}

async function deleteUser(id){
    const allUsers = await getUsers();

    for(let i = 0; i < allUsers.length; i++){
        (allUsers[i].id === Number(id)) ? allUsers.splice(i, 1) : null;
    }

    return new Promise((resolve, reject) => {fs.writeFile('./assets/users.json', JSON.stringify(allUsers), 'utf8', (err) => {
        if(err) reject(err) ;
        resolve(true);
    })})
}

// async function modifyUser(action){
//     const allUsers = await getUsers();
//
//     for(let value of allUsers){
//         (value.id === Number(id)) ? resolve(value) : null;
//     }
//
//
// }




