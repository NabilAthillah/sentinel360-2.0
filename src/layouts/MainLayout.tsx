import '../i8n/i18n';

import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Bounce, toast, ToastContainer } from 'react-toastify';
const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebar, setSidebar] = useState(false);

    const user = {
        id: 1,
        name: "John Doe",
        role: { name: "Admin" },
        profile_image: null,
        language: "en",
    };

    const handleLogout = () => {
        console.log("Logout clicked (dummy)");
    };

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
                <Header openSidebar={setSidebar} user={user} handleLogout={handleLogout} />
                {children}
            </div>
        </main>
    );
};

export default MainLayout;
