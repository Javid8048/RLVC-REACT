export const config = {
    logoCount: 5,
    firebaseConfig: {
        apiKey: "AIzaSyD3GChDwzmoOXuEhytA1slQm-12ZGarsGM",
        authDomain: "fir-rlvc.firebaseapp.com",
        databaseURL: "https://fir-rlvc-default-rtdb.firebaseio.com",
        projectId: "fir-rlvc",
        storageBucket: "fir-rlvc.appspot.com",
        messagingSenderId: "1061693431183",
        appId: "1:1061693431183:web:21dd3323eb7530e406bffa",
        measurementId: "G-XFCP0V38D8"
    },
    servers: {
        iceServers: [
            {
            urls: ['stun:stun1.l.google.com:19302',
                   'stun:stun2.l.google.com:19302'],
            },
        ],
        iceCandidatePoolSize: 10,
    },
    DEV: "development" === 'development',
}

