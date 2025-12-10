// frontend/src/App.jsx
import AccessGate from "./components/AccessGate.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";

function App() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <AccessGate>
                <MessagesPage />
            </AccessGate>
        </div>
    );
}

export default App;