

jest.mock('config', () => {
    return JSON.stringify({
        apiUrl: ''
    });
}, { virtual: true });

 