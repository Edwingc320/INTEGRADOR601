import server from "./server";

server.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
    console.log('http://localhost:3000');
});