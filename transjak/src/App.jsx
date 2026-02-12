import { BrowserRouter, Routes, Route } from 'react-router';
import Homepage from './pages/Homepage';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" index element={<Homepage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
