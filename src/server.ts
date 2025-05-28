import dotenv from 'dotenv';
import app from './app';

console.log('Starting server...');
dotenv.config();

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});
