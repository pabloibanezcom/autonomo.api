import connect from './connect';
import app from './server';
const port = process.env.PORT || 8080;

connect({ db: process.env.MONGODB_URI || '' });

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
