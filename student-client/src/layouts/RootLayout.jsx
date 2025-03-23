import React from 'react'
import { Outlet,useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';

function RootLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };



  return (
    <div>
        <div className="bg-dark d-flex align-items-center justify-content-end px-5" style={{minHeight:"10vh",minWidth:"100vw", position:"fixed"}}>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
        <div className="bg-dark" style={{minHeight:"10vh",minWidth:"100vw"}}></div>
        <div className="d-flex" >
            <div className="bg-warning" style={{height:"90vh", width:"15vw", position:"fixed"}}>
                <Navbar />
            </div>
            <div className="bg-danger" style={{height:"90vh", minWidth:"15vw",}} ></div>
            <div className="" style={{minHeight:"90vh", minWidth:"85vw"}}>
                <Outlet />
            </div>
        </div>
        {/* <div className="bg-dark text-white" style={{minHeight:"30vh"}}>Footer</div> */}
    </div>
  )
}

export default RootLayout