import './App.css';
import { RouterConfig } from './navigation/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './lib/firebase';
import { UserContext } from './lib/context';


function App() {
  const [user] = useAuthState(auth);

  return (
    <UserContext.Provider value={{user, username: user ? user.displayName : null}}>
      <div className="App">
        <RouterConfig/>
      </div>
    </UserContext.Provider>  
  );
}

export default App;
