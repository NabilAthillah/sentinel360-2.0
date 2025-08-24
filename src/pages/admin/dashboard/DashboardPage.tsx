import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MainLayout from '../../../layouts/MainLayout';
import { Site } from '../../../types/site';
import Map from '../../../components/Map';
import Sidebar from '../../../components/Sidebar';

type User = {
    id: number;
    name: string;
    email: string;
    last_login: string;
    language?: string;
};

const DashboardPage = () => {
    const navigate = useNavigate();
    const [sites, setSites] = useState<Site[]>([]);
    const [sidebar, setSidebar] = useState(true);
    // Dummy user
    const user: User = {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        last_login: new Date().toISOString(), // login hari ini
        language: "en",
    };

    function isToday(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();

        return (
            date.getUTCFullYear() === now.getUTCFullYear() &&
            date.getUTCMonth() === now.getUTCMonth() &&
            date.getUTCDate() === now.getUTCDate()
        );
    }

    function checkLastLogin() {
        const lastLogin = user?.last_login;
        if (lastLogin && isToday(lastLogin)) {
            const notifShown = localStorage.getItem('notif_last_login');

            if (notifShown === 'false' || !notifShown) {
                toast.warning('You must change your password every 3 months!');
                localStorage.setItem('notif_last_login', 'true');
            }
        }
    }

    const audit = async () => {
        try {
            const token = localStorage.getItem('token');
            const title = `Access dashboard page`;
            const description = `User ${user?.email} access dashboard page`;
            const status = 'success';

            console.log({ token, title, description, status });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        audit();
        checkLastLogin();
    }, []);

    return (
        <MainLayout>
            <Sidebar isOpen={sidebar} closeSidebar={setSidebar}  />
            <div className='flex flex-col gap-10 px-6 pb-20 w-full h-[calc(100vh-91px)]'>
                <h2 className='text-2xl leading-9 text-white font-noto'>
                    Hello {user?.name}
                </h2>
                <div className="flex-1">
                    <Map sites={sites} />
                </div>
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
