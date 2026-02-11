import { BrowserRouter, Routes, Route } from "react-router";


function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                        <Route path="/" index element={<HomePage />} />
                </Routes>
            </BrowserRouter>,
        </>
    );
}

export default App
