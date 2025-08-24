import { Switch } from "@material-tailwind/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../../components/Loader";
import Navbar from "../../../../components/Navbar";
import MainLayout from "../../../../layouts/MainLayout";
import { useTranslation } from "react-i18next";
import Sidebar from "../../../../components/Sidebar";

type IncidentType = {
    id: string;
    name: string;
    status: "active" | "inactive";
};

const IncidentPageMaster = () => {
    const [addIncident, setAddIncident] = useState(false);
    const [editIncident, setEditIncident] = useState(false);
    const [editData, setEditData] = useState<IncidentType | null>(null);
    const [loading, setLoading] = useState(false);
    const [datas, setDatas] = useState<IncidentType[]>([
        { id: "1", name: "Fire Drill", status: "active" },
        { id: "2", name: "Workplace Injury", status: "inactive" },
        { id: "3", name: "Equipment Failure", status: "active" },
    ]);
    const [name, setName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const { t } = useTranslation();

    const filteredData = datas.filter((doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({
        "1": true,
        "2": false,
        "3": true,
    });

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleToggle = (id: string) => {
        setSwitchStates((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
        toast.success("Status toggled (dummy)");
    };

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const newIncident: IncidentType = {
                id: String(datas.length + 1),
                name,
                status: "active",
            };
            setDatas((prev) => [...prev, newIncident]);
            setName("");
            setAddIncident(false);
            setLoading(false);
            toast.success("Incident added (dummy)");
        }, 800);
    };

    const handleEdit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!editData) return;
        setLoading(true);
        setTimeout(() => {
            setDatas((prev) =>
                prev.map((doc) =>
                    doc.id === editData.id ? { ...doc, name } : doc
                )
            );
            setName("");
            setEditIncident(false);
            setEditData(null);
            setLoading(false);
            toast.success("Incident updated (dummy)");
        }, 800);
    };

    useEffect(() => {
        if (editData && editIncident) {
            setName(editData.name);
        }
    }, [editIncident]);

    return (
        <MainLayout>
            <Sidebar isOpen={true} closeSidebar={undefined} />
            <div className="flex flex-col gap-4 px-6 pb-20 w-full h-full flex-1">
                <h2 className="text-2xl leading-9 text-white font-noto">
                    {t("Settings")}
                </h2>
                <div className="flex flex-col gap-8 w-full h-full flex-1">
                    <Navbar />
                    <div className="flex flex-col gap-10 bg-[#252C38] p-6 rounded-lg w-full h-full flex-1">
                        {/* Top Bar */}
                        <div className="w-full flex justify-between items-center gap-4 flex-wrap lg:flex-nowrap">
                            <div className="flex items-end gap-4 w-full">
                                <div className="max-w-[400px] w-full flex items-center bg-[#222834] border-b border-[#98A1B3] rounded-t">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] focus:outline-none"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="32" height="32" viewBox="0 0 32 32"><defs><clipPath id="master_svg0_247_12873"><rect x="0" y="0" width="32" height="32" rx="0" /></clipPath></defs><g clip-path="url(#master_svg0_247_12873)"><g><path d="M20.666698807907103,18.666700953674315L19.613298807907107,18.666700953674315L19.239998807907106,18.306700953674316C20.591798807907104,16.738700953674318,21.334798807907106,14.736900953674317,21.333298807907106,12.666670953674316C21.333298807907106,7.880200953674317,17.453098807907104,4.000000953674316,12.666668807907104,4.000000953674316C7.880198807907105,4.000000953674316,4.000000715257104,7.880200953674317,4.000000715257104,12.666670953674316C4.000000715257104,17.453100953674316,7.880198807907105,21.333300953674318,12.666668807907104,21.333300953674318C14.813298807907104,21.333300953674318,16.786698807907104,20.546700953674318,18.306698807907104,19.24000095367432L18.666698807907103,19.61330095367432L18.666698807907103,20.666700953674315L25.333298807907106,27.320000953674317L27.319998807907105,25.333300953674318L20.666698807907103,18.666700953674315ZM12.666668807907104,18.666700953674315C9.346668807907104,18.666700953674315,6.666668807907104,15.986700953674317,6.666668807907104,12.666670953674316C6.666668807907104,9.346670953674316,9.346668807907104,6.666670953674316,12.666668807907104,6.666670953674316C15.986698807907105,6.666670953674316,18.666698807907103,9.346670953674316,18.666698807907103,12.666670953674316C18.666698807907103,15.986700953674317,15.986698807907105,18.666700953674315,12.666668807907104,18.666700953674315Z" fill="#98A1B3" fill-opacity="1" /></g></g></svg>

                                </div>

                            </div>
                            <button
                                onClick={() => setAddIncident(true)}
                                className="font-medium text-base min-w-[200px] text-[#181d26] px-[46.5px] py-3 border border-[#EFBF04] bg-[#EFBF04] rounded-full hover:bg-[#181d26] hover:text-[#EFBF04] transition-all"
                            >
                                {t("Add Incident")}
                            </button>
                        </div>

                        <div className="w-full h-full relative pb-10 flex flex-1">
                            <div className="w-full h-full overflow-auto pb-5 flex flex-1">
                                <table className="min-w-[700px] w-full">
                                    <thead>
                                        <tr>
                                            <th className="font-semibold text-[#98A1B3] text-start">
                                                {t("S/NO")}
                                            </th>
                                            <th className="font-semibold text-[#98A1B3] text-start">
                                                {t("Incident")}
                                            </th>
                                            <th className="font-semibold text-[#98A1B3] text-start">
                                                {t("Status")}
                                            </th>
                                            <th className="font-semibold text-[#98A1B3] text-center">
                                                {t("Action")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.length > 0 ? (
                                            paginatedData.map((incident, index) => (
                                                <tr key={incident.id}>
                                                    <td className="text-[#F4F7FF] pt-6 pb-3">
                                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                                    </td>
                                                    <td className="text-[#F4F7FF] pt-6 pb-3">
                                                        {incident.name}
                                                    </td>
                                                    <td className="text-[#F4F7FF] pt-6 pb-3">
                                                        <div className="flex items-center gap-4 w-40">

                                                            <p
                                                                className={`font-medium text-sm capitalize ${switchStates[incident.id]
                                                                    ? "text-[#19CE74]"
                                                                    : "text-[#FF7E6A]"
                                                                    }`}
                                                            >
                                                                {switchStates[incident.id]
                                                                    ? "active"
                                                                    : "inactive"}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="pt-6 pb-3">
                                                        <div className="flex gap-6 items-center justify-center">
                                                            <svg
                                                                onClick={() => {
                                                                    setEditIncident(true);
                                                                    setEditData(incident);
                                                                }}
                                                                className="cursor-pointer"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                version="1.1"
                                                                width="28"
                                                                height="28"
                                                                viewBox="0 0 28 28"
                                                            >
                                                                <path
                                                                    d="M3.5,20.1249V24.5H7.875L20.7783,11.5967L16.4033,7.2217L3.5,20.1249ZM24.1617,8.2133C24.6166,7.7593,24.6166,7.0223,24.1617,6.5683L21.4317,3.8383C20.9777,3.3834,20.2406,3.3834,19.7867,3.8383L17.6517,5.9733L22.0267,10.3483L24.1617,8.2133Z"
                                                                    fill="#F4F7FF"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="text-center text-white py-4"
                                                >
                                                    No incidents found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="absolute bottom-0 right-0 flex gap-2">
                                <button
                                    onClick={goToPrevPage}
                                    disabled={currentPage === 1}
                                    className="font-medium text-xs text-[#B3BACA] py-1 px-4 rounded-l bg-[#575F6F] disabled:opacity-50"
                                >
                                    {t("Prev")}
                                </button>
                                <button className="font-medium text-xs text-[#181D26] py-1 px-3 bg-[#D4AB0B]">
                                    {currentPage}
                                </button>
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="font-medium text-xs text-[#B3BACA] py-1 px-4 rounded-r bg-[#575F6F] disabled:opacity-50"
                                >
                                    {t("Next")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {editIncident && (
                    <motion.div
                        key="edit-overlay"
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { setEditIncident(false); setLoading(false); setEditData(null); }}
                    >
                        <motion.form
                            onSubmit={handleEdit}
                            className="flex flex-col gap-6 p-6 bg-[#252C38] rounded-2xl shadow-xl w-[min(92vw,520px)]"
                            initial={{ y: 20, scale: 0.98, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: 12, scale: 0.98, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 380, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className='text-2xl leading-[36px] text-white font-noto'>Edit Incident</h2>
                            <div className="flex flex-col w-full px-4 pt-2 py-2 rounded-[4px_4px_0px_0px] bg-[#222834] border-b-[1px] border-b-[#98A1B3]">
                                <label htmlFor="" className="text-xs leading-[21px] text-[#98A1B3]">Incident name</label>
                                <input
                                    type={"text"}
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] placeholder:text-base active:outline-none focus-visible:outline-none"
                                    placeholder='Incident name'
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />
                            </div>
                            <div className="flex gap-4 justify-end flex-wrap">
                                <button onClick={() => { setEditIncident(false); setLoading(false); setEditData(null) }} className="font-medium text-base leading-[21px] text-[#868686] bg-[#252C38] px-12 py-3 border-[1px] border-[#868686] rounded-full transition-all hover:bg-[#868686] hover:text-[#252C38]">Cancel</button>
                                <button type="submit" className="font-medium text-base leading-[21px] text-[#181D26] bg-[#EFBF04] px-12 py-3 border-[1px] border-[#EFBF04] rounded-full transition-all hover:bg-[#181D26] hover:text-[#EFBF04]">{loading ? <Loader primary={true} /> : 'Save'}</button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>

                     <AnimatePresence>
                {addIncident && (
                    <motion.div
                        key="edit-overlay"
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { setAddIncident(false); }}
                    >
                        <motion.form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-6 p-6 bg-[#252C38] rounded-2xl shadow-xl w-[min(92vw,520px)]"
                            initial={{ y: 20, scale: 0.98, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: 12, scale: 0.98, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 380, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className='text-2xl leading-[36px] text-white font-noto'>Add Incident</h2>
                            <div className="flex flex-col w-full px-4 pt-2 py-2 rounded-[4px_4px_0px_0px] bg-[#222834] border-b-[1px] border-b-[#98A1B3]">
                                <label htmlFor="" className="text-xs leading-[21px] text-[#98A1B3]">Incident name</label>
                                <input
                                    type={"text"}
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] placeholder:text-base active:outline-none focus-visible:outline-none"
                                    placeholder='Incident name'
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex gap-4 justify-end flex-wrap">
                                <button onClick={() => setAddIncident(false)} className="font-medium text-base leading-[21px] text-[#868686] bg-[#252C38] px-12 py-3 border-[1px] border-[#868686] rounded-full transition-all hover:bg-[#868686] hover:text-[#252C38]">Cancel</button>
                                <button type="submit" className="font-medium text-base leading-[21px] text-[#181D26] bg-[#EFBF04] px-12 py-3 border-[1px] border-[#EFBF04] rounded-full transition-all hover:bg-[#181D26] hover:text-[#EFBF04]">{loading ? <Loader primary={true} /> : 'Submit'}</button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </MainLayout>
    );
};

export default IncidentPageMaster;
