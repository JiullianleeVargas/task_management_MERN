import './App.css';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import Sidebar_ from "./components/Sidebar";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Switch, Redirect } from "react-router-dom";
import  Admins  from "./components/admins/admins";
import  Employees  from "./components/employees/employees";
import  Tasks  from "./components/tasks/tasks";
import  Reports  from "./components/reports/reports";
import  Login  from "./components/login/login";
import  EditAdmin  from "./components/admins/editAdmin";
import { RequireAuth } from "react-auth-kit";



function App({ Component, pageProps }) {
    return (
        <PrimeReactProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />}/>
              <Route path="/main" element={<Sidebar_ />}>
                <Route index element={<Tasks />} />
                <Route path="admins" element={<Admins />}/>
                  <Route path="editAdmin/:id" element={<EditAdmin />} />
                
                <Route path="employees" element={<Employees />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="reports" element={<Reports />} />
                {/* <Route path="*" element={<NoPage />} /> */}
              </Route>
            </Routes>
          </BrowserRouter>
        </PrimeReactProvider>
    );
}
        
export default App;
