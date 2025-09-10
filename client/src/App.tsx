import { useState } from 'react';
import Auth from './components/Auth';
import Chat from './components/Chat';

function App() {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const handleAuthSuccess = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <div className="flex flex-col min-h-screen">
            {!token ? (
                <Auth onAuthSuccess={handleAuthSuccess} />
            ) : (
                <Chat onLogout={handleLogout} />
            )}
        </div>
    );
}

export default App;