import http from 'http';
import { addOne } from './add';

console.log(addOne(1));

const server = http.createServer((request, response) => {
  response.end('Hello world!');
});

server.listen(3000);
