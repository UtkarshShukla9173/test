const jwt =require('jsonwebtoken');
const dotenv =require('dotenv');
dotenv.config();
// const secretKey = process.env.SECRET_KEY || 'your_default_secret_key'; // Use the secret key from the environment variable or a default value
 function generateToken(payload) {
  return jwt.sign(payload, secretKey);
}
 function verifyToken(token)  {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.error('Invalid token:', error);
    return undefined;
  }
} 
module.exports ={generateToken,verifyToken}