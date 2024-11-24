module.exports = io => {
    io.on('connection', socket => {
        console.log('User connected');

        client.on('disconnect', () => {
            console.log('User disconnected');
        });

        client.on('chat message', msg => {
            io.emit('chat message', msg);
        });
    });
}