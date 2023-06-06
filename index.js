const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./database/dbConnection')
const jwt = require('jsonwebtoken')
const verifyToken = require('./middleware/auth')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express()
const port = 3000

app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
//signup
app.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
        console.log(username, password,"=======");
      // Check if the username is already taken
      const existingUser = await connection.query(`select username from signup where username = '${username}' limit 1`)
     console.log("===>",existingUser.rows[0]);
      if (existingUser.length) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      // Hash the password
      const hashedPassword =  await bcrypt.hash(password, saltRounds);
  
      // Create a new user object
    //   const newUser = {
    //     username,
    //     password: hashedPassword
    //   };
  
      // Add the user to the data store
   const saveUser=  await connection.query(`INSERT INTO public.signup(
	 username, password)
	VALUES ('${username}','${hashedPassword}');`)
  
      res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ error: 'Error during signup' });
    }
  });
  // Login API
app.post('/login',async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user =await connection.query(`select * from signup where username = '${username}' limit 1`)
    console.log(user.rows[0]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const decrypted = await bcrypt.compare(password, user.rows[0].password);
    if(!decrypted){
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log(password, user.rows[0].password,"=======");
    // Compare the password
    // const passwordMatch =  jwt.verify(password, user.rows[0].password);
    // if (!passwordMatch) {
    //   return res.status(401).json({ error: 'Invalid credentials' });
    // }

    // Generate a JWT token with a payload (e.g., user ID)
    const token = jwt.sign({ userId: user.rows[0].id }, 'secretKey');

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error during login' });
  }
});

// app.get('/', (request, response) => {
//   response.json({ info: 'Node.js, Express, and Postgres API' })
// })
app.put('/upload', async (req, res) => {
    try {
      const {usertoken} = req.query;
      const file = req.file;
      const data =  jwt.decode(usertoken);
      console.log("=====",data,usertoken,file);
      // Retrieve the file from the database
    //   const query = `SELECT id FROM signup WHERE id = ${data.userId}`;
      const updateData = await connection.query(`UPDATE public.signup
      SET file='${file}'
      WHERE id='${data.userId}';`)
        res.status(201).json({ message: 'upload successful' });
    //   const values = [fileId];
  
    //   const result = await pool.query(query, values);
    //   if (result.rows.length === 0) {
    //     res.status(404).json({ error: 'File not found' });
    //   } else {
    //     const fileContent = result.rows[0].file_content;
    //   }
    }
    catch(error){
        console.log(error);
    }
});

app.get('/file', async (req, res) => {
    try {
      const {usertoken} = req.query;
    //   const file = req.file;
      const data =  jwt.decode(usertoken);
    //   console.log("=====",data,usertoken,file);
      // Retrieve the file from the database
      const query =await connection.query( `SELECT * FROM signup WHERE id = '${data.userId}'`)
    //   const updateData = await connection.query(`UPDATE public.signup
    //   SET file='${file}'
    //   WHERE id='${data.userId}';`)
        res.status(201).json({ data: query });
    //   const values = [fileId];
  
    //   const result = await pool.query(query, values);
    //   if (result.rows.length === 0) {
    //     res.status(404).json({ error: 'File not found' });
    //   } else {
    //     const fileContent = result.rows[0].file_content;
    //   }
    }
    catch(error){
        console.log(error);
    }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
// connection.query()
