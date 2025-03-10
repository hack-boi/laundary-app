import { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../App";
import UserNavigationPanel from "./UserNavigationPanel";

const Navbar = () => {

    const [userNavPanel, setUserNavPanel] = useState(false);

    const { userAuth, userAuth: { access_token, profile_img, role } } = useContext(UserContext);

    const handleUserNavPanel = () => {
        setUserNavPanel(currentVal => !currentVal);
    }

    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);
        }, 200);
    }

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <i className={"fi fi-rr-" + (role ? 'admin' : 'user') + " text-3xl text-black"}></i>
                </Link>

                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    {
                        !role && (
                            <Link to="/new-order" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-black hover:bg-gray-200 p-3 px-4 rounded-lg transition">
                                <i className="fi fi-rr-edit"></i>
                                <p>New Order</p>
                            </Link>
                        )
                    }

                    {
                        access_token ?
                            <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
                                <button className="w-12 h-12 mt-1">
                                    <img src={profile_img} alt="" className="w-full h-full object-cover rounded-full" />
                                </button>

                                {
                                    userNavPanel ?
                                        <UserNavigationPanel />
                                        : null
                                }
                            </div>
                            :
                            <>
                                <Link className="bg-black text-white py-2 px-5 rounded-full hover:bg-gray-800 transition" to="/login">
                                    Login
                                </Link>
                                <Link className="bg-gray-200 text-gray-800 py-2 px-5 rounded-full hidden md:block hover:bg-gray-300 transition" to="/register">
                                    Register
                                </Link>
                            </>
                    }
                </div>
            </nav>

            <Outlet />
        </>
    )
}

export default Navbar;
