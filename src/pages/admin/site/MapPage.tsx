import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Map from '../../../components/Map';
import MainLayout from '../../../layouts/MainLayout';
import { Site } from '../../../types/site';
import { useTranslation } from 'react-i18next';
import SidebarLayout from '../../../components/SidebarLayout';

const MapPage = () => {
    const location = useLocation();
    const { pathname } = location;
    const [sites, setSites] = useState<Site[]>([]);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [sidebar, setSidebar] = useState(true);


    return (
        <MainLayout>

            <SidebarLayout isOpen={sidebar} closeSidebar={setSidebar} />
            <div className='flex flex-col gap-6 px-6 pb-20 w-full h-full flex-1'>
                <h2 className='text-2xl leading-9 text-white font-noto'>{t('Site Map')}</h2>
                <nav className='flex flex-wrap'>
                    <Link to="/dashboard/sites" className={`font-medium text-sm text-[#F4F7FF] px-6 ${pathname === '/dashboard/sites' ? 'pt-[14px] pb-3 border-b-2 border-b-[#F3C511]' : 'py-[14px] border-b-0'}`}>
                        {t('Site')}
                    </Link>
                    <Link to="/dashboard/sites/map" className={`font-medium text-sm text-[#F4F7FF] px-6 ${pathname === '/dashboard/sites/map' ? 'pt-[14px] pb-3 border-b-2 border-b-[#F3C511]' : 'py-[14px] border-b-0'}`}>
                        {t('Map')}
                    </Link>
                    <Link to="/dashboard/sites/allocation" className={`font-medium text-sm text-[#F4F7FF] px-6 ${pathname === '/dashboard/sites/allocation' ? 'pt-[14px] pb-3 border-b-2 border-b-[#F3C511]' : 'py-[14px] border-b-0'}`}>
                        {t('Allocation List')}
                    </Link>
                </nav>
                <div className="flex flex-col bg-[#252C38] p-4 rounded-lg w-full h-full flex-1">
                    <Map sites={sites} />
                </div>
            </div>
        </MainLayout>
    )
}

export default MapPage;
