import './App.css';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import Sidebar_ from "./components/Sidebar";

        


function App({ Component, pageProps }) {
    return (
        <PrimeReactProvider>
          <Sidebar_/>
        </PrimeReactProvider>
    );
}
        
export default App;
