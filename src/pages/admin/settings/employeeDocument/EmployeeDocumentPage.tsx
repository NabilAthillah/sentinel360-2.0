import { Switch } from "@material-tailwind/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Loader from "../../../../components/Loader";
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import MainLayout from "../../../../layouts/MainLayout";
import employeeDocumentService from "../../../../services/employeeDocumentService";

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

    const [datas, setDatas] = useState<EmployeeDocument[]>([]);
    const [name, setName] = useState("");

    const token = localStorage.getItem("token");

    // Load data from API
    const loadDocuments = async () => {
        setLoading(true);
        try {
            const res = await employeeDocumentService.getEmployeeDocuments(token);
            setDatas(res?.data || []);
        } catch (err: any) {
            toast.error(err.message || "Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, []);

    // Add document
    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await employeeDocumentService.addEmployeeDocument(token, name);
            toast.success("Document added");
            setName("");
            setAddEmploy(false);
            loadDocuments();
        } catch (err: any) {
            toast.error(err.message || "Failed to add document");
        } finally {
            setLoading(false);
        }
    };

    // Edit document name
    const handleEdit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!editData) return;
        setLoading(true);
        try {
            await employeeDocumentService.editEmployeeDocument(
                token,
                editData.id,
                name
            );
            toast.success("Document updated");
            setName("");
            setEditEmploy(false);
            setEditData(null);
            loadDocuments();
        } catch (err: any) {
            toast.error(err.message || "Failed to update document");
        } finally {
            setLoading(false);
        }
    };

    // Toggle status pakai Switch
    const handleToggle = async (id: string, newStatus: "active" | "inactive") => {
        try {
            await employeeDocumentService.editEmployeeDocumentStatus(
                token,
                id,
                newStatus
            );
            toast.success("Status updated");
            loadDocuments();
        } catch (err: any) {
            toast.error(err.message || "Failed to update status");
        }
    };

    return (
        <MainLayout>
            <Sidebar isOpen={true} closeSidebar={undefined} />
            <div className="flex flex-col gap-4 pl-4 pr-[156px] pb-20 w-full h-full flex-1">
                <h2 className="text-2xl leading-9 text-white font-noto">
                    {t("Settings")}
                </h2>
                <div className="flex flex-col gap-8 w-full h-full flex-1">
                    <Navbar />
                    <div className="flex flex-col gap-10 bg-[#252C38] p-6 rounded-lg w-full h-full flex-1 relative">
                        <div className="w-full flex justify-between items-center gap-4 flex-wrap lg:flex-nowrap">
                            <div className="flex items-end gap-4 w-full">
                                <div className="max-w-[400px] w-full flex items-center bg-[#222834] border-b-[1px] border-b-[#98A1B3] rounded-[4px_4px_0px_0px]">
                                    <input
                                        type={"text"}
                                        className="w-full px-4 pt-[17.5px] pb-[10.5px] bg-[#222834] rounded-[4px_4px_0px_0px] text-[#F4F7FF] text-base placeholder:text-[#98A1B3]  placeholder:text-base active:outline-none focus-visible:outline-none"
                                        placeholder="Search"
                                    />
                                </div>
                            </div>
                            <div className="w-[200px]">
                                <button
                                    onClick={() => setAddEmploy(true)}
                                    className="font-medium text-base min-w-[200px] text-[#181d26] px-[46.5px] py-3 border-[1px] border-[#EFBF04] bg-[#EFBF04] rounded-full hover:bg-[#181d26] hover:text-[#EFBF04] transition-all"
                                >
                                    {t("Add document")}
                                </button>
                            </div>
                        </div>

                        {/* Table */}
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
                                    {datas.length > 0 ? (
                                        datas.map((doc, index) => (
                                            <tr key={doc.id}>
                                                <td className="text-[#F4F7FF] pt-6 pb-3">
                                                    {index + 1}
                                                </td>
                                                <td className="text-[#F4F7FF] pt-6 pb-3">{doc.name}</td>
                                                <td className="text-white py-3">
                                                    <div className="flex items-center gap-4 w-40">
                                                        <Switch
                                                            checked={doc.status === "active"}
                                                            onChange={(e) =>
                                                                handleToggle(doc.id, e.target.checked ? "active" : "inactive")
                                                            }
                                                            color="blue" onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                                                        <span
                                                            className={`font-medium text-sm capitalize ${doc.status === "active"
                                                                ? "text-[#19CE74]"
                                                                : "text-[#FF7E6A]"
                                                                }`}
                                                        >
                                                            {doc.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="text-center py-3">
                                                    <div className="flex justify-center gap-3">
                                                        <button
                                                            onClick={() => {
                                                                setEditEmploy(true);
                                                                setEditData(doc);
                                                                setName(doc.name);
                                                            }}
                                                            className="p-2 rounded-full bg-white hover:bg-gray-200 transition duration-200 group shadow"
                                                            title="Edit Document"
                                                        >
                                                            <svg
                                                                className="w-6 h-6 text-gray-800 group-hover:text-gray-900 group-hover:scale-110 transition-transform"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="currentColor"
                                                                viewBox="0 0 28 28"
                                                            >
                                                                <path d="M3.5,20.1249V24.5H7.875L20.7783,11.5967L16.4033,7.2217L3.5,20.1249ZM24.1617,8.2133C24.6166,7.7593,24.6166,7.0223,24.1617,6.5683L21.4317,3.8383C20.9777,3.3834,20.2406,3.3834,19.7867,3.8383L17.6517,5.9733L22.0267,10.3483L24.1617,8.2133Z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="text-center text-gray-400 py-6 italic"
                                            >
                                                No data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
            </div>

            {/* === Modal Edit === */}
            <AnimatePresence>
                {editEmploy && (
                    <motion.div
                        key="edit-overlay"
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            setEditEmploy(false);
                            setLoading(false);
                            setEditData(null);
                        }}
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
                            <h2 className="text-2xl leading-[36px] text-white font-noto">
                                Edit Employee Document
                            </h2>

                            <div className="flex flex-col w-full px-4 pt-2 py-2 rounded bg-[#222834] border-b-[1px] border-b-[#98A1B3]">
                                <label className="text-xs leading-[21px] text-[#98A1B3]">
                                    Employee Document name
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] focus-visible:outline-none"
                                    placeholder="Employee Document name"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />
                            </div>

                            <div className="flex gap-4 justify-end flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditEmploy(false);
                                        setLoading(false);
                                        setEditData(null);
                                    }}
                                    className="font-medium text-base text-[#868686] bg-[#252C38] px-12 py-3 border border-[#868686] rounded-full hover:bg-[#868686] hover:text-[#252C38] transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="font-medium text-base text-[#181D26] bg-[#EFBF04] px-12 py-3 border border-[#EFBF04] rounded-full hover:bg-[#181D26] hover:text-[#EFBF04] transition"
                                >
                                    {loading ? <Loader primary /> : "Save"}
                                </button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* === Modal Add === */}
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
                            <h2 className="text-2xl leading-[36px] text-white font-noto">
                                Add Employee Document
                            </h2>

                            <div className="flex flex-col w-full px-4 pt-2 py-2 rounded bg-[#222834] border-b-[1px] border-b-[#98A1B3]">
                                <label className="text-xs leading-[21px] text-[#98A1B3]">
                                    Employee Document name
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] focus-visible:outline-none"
                                    placeholder="Employee Document name"
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex gap-4 justify-end flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => setAddEmploy(false)}
                                    className="font-medium text-base text-[#868686] bg-[#252C38] px-12 py-3 border border-[#868686] rounded-full hover:bg-[#868686] hover:text-[#252C38] transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="font-medium text-base text-[#181D26] bg-[#EFBF04] px-12 py-3 border border-[#EFBF04] rounded-full hover:bg-[#181D26] hover:text-[#EFBF04] transition"
                                >
                                    {loading ? <Loader primary /> : "Submit"}
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
