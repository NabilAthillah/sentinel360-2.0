import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../../components/Loader";
import Navbar from "../../../../components/Navbar";
import MainLayout from "../../../../layouts/MainLayout";
import { useTranslation } from 'react-i18next';
import Sidebar from "../../../../components/Sidebar";

const SettingsAttendancePage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState([
        { label: 'Grace period (in minutes)', placeholder: 'Grace period (in minutes)', value: '15' },
        { label: 'Geo fencing (in meters)', placeholder: 'Geo fencing (in meters)', value: '200' },
        { label: 'Day shift start time', placeholder: '00:00', value: '08:00' },
        { label: 'Day shift end time', placeholder: '00:00', value: '20:00' },
        { label: 'Night shift start time', placeholder: '00:00', value: '20:00' },
        { label: 'Night shift end time', placeholder: '00:00', value: '08:00' },
        { label: 'RELIEF Day shift start time', placeholder: '00:00', value: '08:00' },
        { label: 'RELIEF Day shift end time', placeholder: '00:00', value: '20:00' },
        { label: 'RELIEF night shift start time', placeholder: '00:00', value: '20:00' },
        { label: 'RELIEF night shift end time', placeholder: '00:00', value: '08:00' },
    ]);

    const handleInputChange = (index: number, newValue: string) => {
        setFormData(prev => {
            const updated = [...prev];
            updated[index].value = newValue;
            return updated;
        });
    };

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            toast.success("Settings updated (dummy)");
            setLoading(false);
        }, 1000);
    };

    return (
        <MainLayout>
            <Sidebar isOpen={true} closeSidebar={undefined}/>
            <div className='flex flex-col gap-4 px-6 pb-20 w-full h-full'>
                <h2 className='text-2xl leading-9 text-white font-noto'>{t('Settings')}</h2>
                <div className="flex flex-col gap-8 w-full h-full">
                    <Navbar />
                    <div className="bg-[#252C38] p-6 rounded-lg w-full h-full">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2">
                            {formData.map((item, index) => (
                                <div key={index} className="flex flex-col w-full px-4 pt-2 py-2 rounded bg-[#222834] border-b border-b-[#98A1B3]">
                                    <label className="text-xs leading-[21px] text-[#98A1B3]">{item.label}</label>
                                    <input
                                        type={index <= 1 ? 'number' : 'time'}
                                        className="w-full bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3]"
                                        placeholder={item.placeholder}
                                        value={item.value}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                    />
                                </div>
                            ))}

                            <div className="flex gap-4 flex-wrap">
                                <button
                                    type="submit"
                                    className="font-medium text-base leading-[21px] text-[#181D26] bg-[#EFBF04] px-12 py-3 border-[1px] border-[#EFBF04] rounded-full transition-all hover:bg-[#181D26] hover:text-[#EFBF04]"
                                >
                                    {loading ? <Loader primary={true} /> : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default SettingsAttendancePage;
