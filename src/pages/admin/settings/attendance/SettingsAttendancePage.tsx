import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../../../components/Loader";
import Navbar from "../../../../components/Navbar";
import MainLayout from "../../../../layouts/MainLayout";
import { useTranslation } from 'react-i18next';
import Sidebar from "../../../../components/Sidebar";
import attendanceSettingService from "../../../../services/attendanceSettingService";
import { data } from "react-router-dom";

const SettingsAttendancePage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState([
        { key: "grace_period", label: 'Grace period (in minutes)', type: 'number', value: '' },
        { key: "geo_fencing", label: 'Geo fencing (in meters)', type: 'number', value: '' },
        { key: "day_shift_start_time", label: 'Day shift start time', type: 'time', value: '' },
        { key: "day_shift_end_time", label: 'Day shift end time', type: 'time', value: '' },
        { key: "night_shift_start_time", label: 'Night shift start time', type: 'time', value: '' },
        { key: "night_shift_end_time", label: 'Night shift end time', type: 'time', value: '' },
        { key: "relief_day_shift_start_time", label: 'RELIEF Day shift start time', type: 'time', value: '' },
        { key: "relief_day_shift_end_time", label: 'RELIEF Day shift end time', type: 'time', value: '' },
        { key: "relief_night_shift_start_time", label: 'RELIEF night shift start time', type: 'time', value: '' },
        { key: "relief_night_shift_end_time", label: 'RELIEF night shift end time', type: 'time', value: '' },
    ]);
    const [fetching, setFetching] = useState(true);
    const [id, setId] = useState<string | null>(null);

    const loadAttendanceSettings = async () => {
        try {
            const res = await attendanceSettingService.getAttendanceSetting();
            if (res.success && res.data) {
                // console.log(res.data);
                setId(res.data.id);
                setFormData(prev =>
                    prev.map(item => ({
                        ...item,
                        value: res.data[item.key] ?? ''
                    }))
                );
            } else {
                toast.error(res.message || "Failed to load attendance settings");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load attendance settings");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        loadAttendanceSettings();
    }, []);

    const handleInputChange = (index: number, newValue: string) => {
        setFormData(prev => {
            const updated = [...prev];
            updated[index].value = newValue;
            return updated;
        });
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = formData.reduce((acc, item) => {
                acc[item.key] = item.value;
                return acc;
            }, {} as Record<string, string>);
            const res = await attendanceSettingService.updateAttendanceSetting(payload, id);
            if (res.success) {
                toast.success("Settings updated successfully");
            } else {
                toast.error(res.message || "Failed to update settings");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to update settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <Sidebar isOpen={true} closeSidebar={undefined} />
            <div className='flex flex-col gap-4 pr-[156px] pl-4 pb-20 w-full h-full'>
                <h2 className='text-2xl leading-9 text-white font-noto'>{t('Settings')}</h2>
                <div className="flex flex-col gap-8 w-full h-full">
                    <Navbar />
                    <div className="bg-[#252C38] p-6 rounded-lg w-full h-full">
                        {loading || fetching ? (
                            <Loader primary={true} />
                        ) : (
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2">
                                {formData.map((item, index) => (
                                    <div key={item.key} className="flex flex-col w-full px-4 pt-2 py-2 rounded bg-[#222834] border-b border-b-[#98A1B3]">
                                        <label className="text-xs leading-[21px] text-[#98A1B3]">{item.label}</label>
                                        <input
                                            type={item.type}
                                            className="w-full bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] border-none outline-none"
                                            placeholder={item.label}
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
                        )}
                    </div>
                </div>
                
            </div>
        </MainLayout>
    )
}

export default SettingsAttendancePage;
