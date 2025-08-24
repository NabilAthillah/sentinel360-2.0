import { Switch } from "@material-tailwind/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../../../../components/Navbar";
import MainLayout from "../../../../layouts/MainLayout";
import Loader from "../../../../components/Loader";
import { useTranslation } from "react-i18next";
import Sidebar from "../../../../components/Sidebar";

type EmployeeDocument = {
    id: string;
    name: string;
    status: "active" | "inactive";
};

const EmployeeDocumentPage = () => {
    const { t } = useTranslation();
    const [addEmploy, setAddEmploy] = useState(false);
    const [editEmploy, setEditEmploy] = useState(false);
    const [editData, setEditData] = useState<EmployeeDocument | null>(null);
    const [loading, setLoading] = useState(false);

    // Dummy data
    const [datas, setDatas] = useState<EmployeeDocument[]>([
        { id: "1", name: "Passport", status: "active" },
        { id: "2", name: "Work Permit", status: "inactive" },
        { id: "3", name: "Employment Contract", status: "active" },
    ]);

    const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({
        "1": true,
        "2": false,
        "3": true,
    });

    const [name, setName] = useState("");

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
            setDatas((prev) => [
                ...prev,
                { id: String(prev.length + 1), name, status: "active" },
            ]);
            setName("");
            setAddEmploy(false);
            setLoading(false);
            toast.success("Document added (dummy)");
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
            setEditEmploy(false);
            setEditData(null);
            setLoading(false);
            toast.success("Document updated (dummy)");
        }, 800);
    };

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
                        <div className="w-full flex justify-between items-center gap-4 flex-wrap lg:flex-nowrap">
                            <div className="flex items-end gap-4 w-full">
                                <div className="max-w-[400px] w-full flex items-center bg-[#222834] border-b-[1px] border-b-[#98A1B3] rounded-[4px_4px_0px_0px]">
                                    <input
                                        type={"text"}
                                        className="w-full px-4 pt-[17.5px] pb-[10.5px] bg-[#222834] rounded-[4px_4px_0px_0px] text-[#F4F7FF] text-base placeholder:text-[#98A1B3]  placeholder:text-base active:outline-none focus-visible:outline-none"
                                        placeholder="Search"
                                    />
                                    <button
                                        type="button"
                                        className="p-2 rounded-[4px_4px_0px_0px]"
                                        tabIndex={-1}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="32" height="32" viewBox="0 0 32 32"><defs><clipPath id="master_svg0_247_12873"><rect x="0" y="0" width="32" height="32" rx="0" /></clipPath></defs><g clip-path="url(#master_svg0_247_12873)"><g><path d="M20.666698807907103,18.666700953674315L19.613298807907107,18.666700953674315L19.239998807907106,18.306700953674316C20.591798807907104,16.738700953674318,21.334798807907106,14.736900953674317,21.333298807907106,12.666670953674316C21.333298807907106,7.880200953674317,17.453098807907104,4.000000953674316,12.666668807907104,4.000000953674316C7.880198807907105,4.000000953674316,4.000000715257104,7.880200953674317,4.000000715257104,12.666670953674316C4.000000715257104,17.453100953674316,7.880198807907105,21.333300953674318,12.666668807907104,21.333300953674318C14.813298807907104,21.333300953674318,16.786698807907104,20.546700953674318,18.306698807907104,19.24000095367432L18.666698807907103,19.61330095367432L18.666698807907103,20.666700953674315L25.333298807907106,27.320000953674317L27.319998807907105,25.333300953674318L20.666698807907103,18.666700953674315ZM12.666668807907104,18.666700953674315C9.346668807907104,18.666700953674315,6.666668807907104,15.986700953674317,6.666668807907104,12.666670953674316C6.666668807907104,9.346670953674316,9.346668807907104,6.666670953674316,12.666668807907104,6.666670953674316C15.986698807907105,6.666670953674316,18.666698807907103,9.346670953674316,18.666698807907103,12.666670953674316C18.666698807907103,15.986700953674317,15.986698807907105,18.666700953674315,12.666668807907104,18.666700953674315Z" fill="#98A1B3" fill-opacity="1" /></g></g></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="w-[200px]">
                                <button onClick={() => setAddEmploy(true)} className="font-medium text-base min-w-[200px] text-[#181d26] px-[46.5px] py-3 border-[1px] border-[#EFBF04] bg-[#EFBF04] rounded-full hover:bg-[#181d26] hover:text-[#EFBF04] transition-all">{t('Add document')}</button>
                            </div>
                        </div>
                        <table className="min-w-[600px] w-full">
                            <thead>
                                <tr>
                                    <th className="text-[#98A1B3] text-left">S/No</th>
                                    <th className="text-[#98A1B3] text-left">Document</th>
                                    <th className="text-[#98A1B3] text-left">Status</th>
                                    <th className="text-[#98A1B3] text-center">Action</th>
                                </tr>
                            </thead>
                            {loading ? (
                                <tbody>
                                    <tr>
                                        <td colSpan={4} className="py-10">
                                            <div className="w-full flex justify-center">
                                                <Loader primary />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {datas.map((doc, index) => (
                                        <tr key={doc.id}>
                                            <td className="text-[#F4F7FF] pt-6 pb-3">{index + 1}</td>
                                            <td className="text-[#F4F7FF] pt-6 pb-3">{doc.name}</td>
                                            <td className="text-white py-3">
                                                <div className="flex items-center gap-4 w-40">

                                                    <p
                                                        className={`font-medium text-sm capitalize ${switchStates[doc.id]
                                                            ? "text-[#19CE74]"
                                                            : "text-[#FF7E6A]"
                                                            }`}
                                                    >
                                                        {switchStates[doc.id] ? "active" : "inactive"}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="pt-6 pb-3">
                                                <div className="flex gap-6 items-center justify-center">
                                                    <svg
                                                        onClick={() => {
                                                            setEditEmploy(true);
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
                                    ))}
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {editEmploy && (
                    <motion.div
                        key="edit-overlay"
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { setEditEmploy(false); setLoading(false); setEditData(null); }}
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
                            <h2 className='text-2xl leading-[36px] text-white font-noto'>Edit Employee Document</h2>

                            <div className="flex flex-col w-full px-4 pt-2 py-2 rounded-[4px_4px_0px_0px] bg-[#222834] border-b-[1px] border-b-[#98A1B3]">
                                <label className="text-xs leading-[21px] text-[#98A1B3]">Employee Document name</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] placeholder:text-base focus-visible:outline-none"
                                    placeholder='Employee Document name'
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />
                            </div>

                            <div className="flex gap-4 justify-end flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => { setEditEmploy(false); setLoading(false); setEditData(null); }}
                                    className="font-medium text-base leading-[21px] text-[#868686] bg-[#252C38] px-12 py-3 border border-[#868686] rounded-full hover:bg-[#868686] hover:text-[#252C38] transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="font-medium text-base leading-[21px] text-[#181D26] bg-[#EFBF04] px-12 py-3 border border-[#EFBF04] rounded-full hover:bg-[#181D26] hover:text-[#EFBF04] transition"
                                >
                                    {loading ? <Loader primary /> : 'Save'}
                                </button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {addEmploy && (
                    <motion.div
                        key="add-overlay"
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setAddEmploy(false)}
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
                            <h2 className='text-2xl leading-[36px] text-white font-noto'>Add Employee Document</h2>

                            <div className="flex flex-col w-full px-4 pt-2 py-2 rounded-[4px_4px_0px_0px] bg-[#222834] border-b-[1px] border-b-[#98A1B3]">
                                <label className="text-xs leading-[21px] text-[#98A1B3]">Employee Document name</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] placeholder:text-base focus-visible:outline-none"
                                    placeholder='Employee Document name'
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex gap-4 justify-end flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => setAddEmploy(false)}
                                    className="font-medium text-base leading-[21px] text-[#868686] bg-[#252C38] px-12 py-3 border border-[#868686] rounded-full hover:bg-[#868686] hover:text-[#252C38] transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="font-medium text-base leading-[21px] text-[#181D26] bg-[#EFBF04] px-12 py-3 border border-[#EFBF04] rounded-full hover:bg-[#181D26] hover:text-[#EFBF04] transition"
                                >
                                    {loading ? <Loader primary /> : 'Submit'}
                                </button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </MainLayout>
    );
};

export default EmployeeDocumentPage;
