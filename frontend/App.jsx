// frontend/src/App.jsx
import AccessGate from "./components/AccessGate.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";

function App() {
    return (
        <AccessGate>
            <MessagesPage />
        </AccessGate>
    );
}

export default App;