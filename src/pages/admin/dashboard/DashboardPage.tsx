import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MainLayout from '../../../layouts/MainLayout';
import { Site } from '../../../types/site';
import Map from '../../../components/Map';
import Sidebar from '../../../components/Sidebar';
import auditTrialsService from '../../../services/auditTrailsService';
import authService from '../../../services/authService';
import Loader from '../../../components/Loader';

type User = {
    id: number;
    name: string;
    email: string;
    role: { id: number; name: string };
    last_login: string;
    language?: string;
};

const DashboardPage = () => {
    const navigate = useNavigate();
    const [sites, setSites] = useState<Site[]>([]);
    const [sidebar, setSidebar] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation();

    // cek login tiap hari
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

    const audit = async (userId: number, email: string) => {
        try {
            const token = localStorage.getItem('token');
            const title = `Access dashboard page`;
            const description = `User ${email} accessed dashboard page`;
            const status = 'success';
            await auditTrialsService.storeAuditTrails(token, userId, title, description, status, 'access dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    const checkToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login first!');
            navigate('/auth/login');
            return;
        }

        try {
            const response = await authService.checkToken(token);

            if (response.success && response.user) {
                setUser(response.user);

                if (response.user.role.name !== 'Administrator') {
                    toast.error('Forbidden area. You will be logged out.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/auth/login');
                    return;
                }

                checkLastLogin(response.user.last_login);
                audit(response.user.id, response.user.email);
            } else {
                toast.error('Session expired. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/auth/login');
            }
        } catch (error) {
            console.error(error);
            toast.error('Session expired. Please login again.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/auth/login');
        }
    };

    useEffect(() => {
        checkToken();

        const data = localStorage.getItem('user');
        if (data) {
            const parsedUser: User = JSON.parse(data);
            setUser(parsedUser);
        }
    }, []);

    return (
        <MainLayout>
            {user ? (
            <div className='flex flex-col gap-10 px-6 pb-20 w-full h-[calc(100vh-91px)]'>
                <h2 className='text-2xl leading-9 text-white font-noto'>
                    Hello {user?.name}
                </h2>
                <div className="flex-1">
                    <Map key={location.key} sites={sites} />
                </div>
            </div>
            ) : (
                <Loader primary />
            )}
        </MainLayout>
    );
};

export default DashboardPage;
