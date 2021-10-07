import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';

const app = express();
const port = 3000;
const dirname = path.dirname(fileURLToPath(import.meta.url));

app.use('/src', express.static('src'));
app.use('/public', express.static('public'));
app.use('/shaders', express.static('shaders'));
app.use('/textures', express.static('textures'));

app.get('/triangle', (req, res) =>{
  res.sendFile(`${dirname}/public/triangle.htm`);
});
app.get('/3dscene', (req, res) =>{
  res.sendFile(`${dirname}/public/3d-scene.htm`);
});

app.get('/', (req, res) =>{
  res.send('<h1>Hello node js</h1>');
});

app.listen(port, console.log(`listening at http://localhost:${port}`));