import '../i8n/i18n';

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Bounce, toast, ToastContainer } from 'react-toastify';
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebar, setSidebar] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logout successful!");
        navigate("/auth/login");
    };

    const isToday = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        return (
            date.getUTCFullYear() === now.getUTCFullYear() &&
            date.getUTCMonth() === now.getUTCMonth() &&
            date.getUTCDate() === now.getUTCDate()
        );
    };

    const checkLastLogin = (lastLogin: string) => {
        if (lastLogin && isToday(lastLogin)) {
            const notifShown = localStorage.getItem('notif_last_login');
            if (!notifShown || notifShown === 'false') {
                toast.warning('You must change your password every 3 months!');
                localStorage.setItem('notif_last_login', 'true');
            }
        }
    };

    const checkTokenAndRole = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first!");
            navigate("/auth/login");
            return;
        }

        try {
            const response = await authService.checkToken(token);

            if (response.success && response.user) {
                setUser(response.user);

                // hanya admin yang boleh masuk layout
                if (response.user.role.name !== "Admin" && response.user.role.name !== "Administrator") {
                    toast.error("Forbidden area. You will be logged out.");
                    handleLogout();
                    return;
                }

                checkLastLogin(response.user.last_login);
            } else {
                toast.error("Session expired. Please login again.");
                handleLogout();
            }
        } catch (error) {
            console.error(error);
            toast.error("Session expired. Please login again.");
            handleLogout();
        }
    };

    useEffect(() => {
        checkTokenAndRole();
    }, []);

    return (
        <main className="max-w-screen w-full min-h-screen h-full bg-[#181D26]">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />

            <div className="flex flex-col max-w-screen w-full pl-0 min-h-screen h-full transition-all duration-200 md:pl-[265px] ">
                <Header openSidebar={setSidebar} handleLogout={handleLogout} />
                {children}
            </div>
        </main>
    );
};

export default MainLayout;
