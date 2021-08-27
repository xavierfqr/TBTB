import './App.css';
import { RouterConfig } from './navigation/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './lib/firebase';
import { UserContext } from './lib/context';
import NavBar from './components/Navbar';
import { BrowserRouter as Router} from "react-router-dom";



function App() {
  const [user] = useAuthState(auth);

  return (
    <UserContext.Provider value={{user, username: user ? user.displayName : null}}>
      <Router>
        <NavBar/>
        <div className="App">
          <RouterConfig/>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
