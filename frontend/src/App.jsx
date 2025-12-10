// frontend/src/App.jsx
import AccessGate from "./components/AccessGate.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";

function App() {
    return (
        <div className="min-h-screen gold-animated-bg text-white p-6">
            <AccessGate>
                <MessagesPage />
            </AccessGate>
        </div>
    );
}

export default App;