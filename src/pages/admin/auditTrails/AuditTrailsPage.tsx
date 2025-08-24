import React, { useState, useEffect, useRef } from "react";
import SecondLayout from "../../../layouts/SecondLayout";
import Loader from "../../../components/Loader";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import SidebarLayout from "../../../components/SidebarLayout";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Dummy data
const categories = ["login", "update", "delete", "create"];
const statuses = ["success", "failed", "info"];

const dummyLogs = [
    {
        id: 1,
        user: { name: "John Doe", email: "john@example.com" },
        title: "User logged in",
        status: "success",
        created_at: new Date().toISOString(),
        description: "User John Doe successfully logged in from IP 192.168.0.1",
    },
    {
        id: 2,
        user: { name: "Jane Smith", email: "jane@example.com" },
        title: "Password updated",
        status: "info",
        created_at: new Date().toISOString(),
        description: "User Jane Smith updated her password",
    },
];

const AuditTrailsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [sidebar, setSidebar] = useState(true);
    const itemsPerPage = 10;
    const { t } = useTranslation();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLogs(dummyLogs);
            setLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const totalPages = Math.ceil(logs.length / itemsPerPage);
    const paginatedLogs = logs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openModal = (log: any) => {
        setSelectedLog(log);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedLog(null);
        setShowModal(false);
    };

    const formatDateTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleString();
    };

    const getStatusClasses = (status: string) => {
        switch (status) {
            case "success":
                return "bg-green-600 text-white";
            case "failed":
                return "bg-red-600 text-white";
            default:
                return "bg-gray-600 text-white";
        }
    };

    return (
        <SecondLayout>
            <SidebarLayout isOpen={sidebar} closeSidebar={setSidebar} />
            <div className="flex flex-col gap-6 pl-4 pr-[156px] pb-20 w-full min-h-[calc(100vh-91px)] h-full">
                <h2 className="text-2xl leading-9 text-white font-noto">
                    {t("Audit Trails")}
                </h2>

                <div className="flex flex-col gap-10 bg-[#252C38] p-6 rounded-lg w-full h-full flex-1 relative">

                    <div className="flex flex-wrap gap-4">
                        <select
                            className="max-w-[250px] w-full h-[44px] px-4 bg-[#222834] text-[#F4F7FF] border-b border-[#98A1B3] rounded-t-md"
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">{t("All Categories")}</option>
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat} className="capitalize">
                                    {cat}
                                </option>
                            ))}
                        </select>

                        <select
                            className="max-w-[180px] w-full h-[44px] px-4 bg-[#222834] text-[#F4F7FF] border-b border-[#98A1B3] rounded-t-md"
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">{t("All Statuses")}</option>
                            {statuses.map((s) => (
                                <option key={s} value={s} className="capitalize">
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full h-full relative pb-10 flex flex-1">
                        <div className="w-full h-full overflow-auto">
                            <table className="min-w-[700px] w-full">
                                <thead>
                                    <tr>
                                        <th className="text-[#98A1B3] text-start">{t("S/NO")}</th>
                                        <th className="text-[#98A1B3] text-start">{t("Name")}</th>
                                        <th className="text-[#98A1B3] text-start">{t("Email")}</th>
                                        <th className="text-[#98A1B3] text-start">{t("Activity")}</th>
                                        <th className="text-[#98A1B3] text-center">{t("Status")}</th>
                                        <th className="text-[#98A1B3] text-start">{t("Timestamp")}</th>
                                        <th className="text-[#98A1B3] text-start">{t("Action")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="py-10">
                                                <div className="w-full flex justify-center">
                                                    <Loader primary />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : paginatedLogs.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-white text-center py-6"
                                            >
                                                No audit logs found
                                            </td>
                                        </tr>
                                    ) : (
                                        <AnimatePresence>
                                            {paginatedLogs.map((log, index) => (
                                                <motion.tr
                                                    key={log.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                    className=""
                                                >
                                                    <td className="text-[#F4F7FF] py-3">
                                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                                    </td>
                                                    <td className="text-[#F4F7FF] py-3">
                                                        {log.user?.name || "-"}
                                                    </td>
                                                    <td className="text-[#F4F7FF] py-3">
                                                        {log.user?.email || "-"}
                                                    </td>
                                                    <td className="text-[#F4F7FF] py-3">{log.title}</td>
                                                    <td className="text-[#F4F7FF] py-3 text-center">
                                                        <span
                                                            className={`text-xs px-2 py-1 rounded-full ${getStatusClasses(
                                                                log.status
                                                            )}`}
                                                        >
                                                            {log.status.toLowerCase()}
                                                        </span>
                                                    </td>
                                                    <td className="text-[#F4F7FF] py-3">
                                                        {formatDateTime(log.created_at)}
                                                    </td>
                                                    <td>
                                                        <svg
                                                            onClick={() => openModal(log)}
                                                            className="w-6 h-6 text-white ml-3 cursor-pointer hover:text-blue-400 transition"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                                                            />
                                                            <path
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                            />
                                                        </svg>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-center gap-3 absolute bottom-0 right-0">
                            <button
                                className="flex items-center gap-1 font-medium text-xs leading-[21px] text-[#B3BACA] disabled:opacity-50"
                            >
                                <ArrowLeft size={14} />
                                {t('Previous')}
                            </button>

                            <button
                                disabled
                                className="font-medium text-xs leading-[21px] text-[#181D26] py-1 px-3 bg-[#D4AB0B] rounded-md"
                            >
                                1
                            </button>

                            <button
                                className="flex items-center gap-1 font-medium text-xs leading-[21px] text-[#B3BACA] disabled:opacity-50"
                            >
                                {t('Next')}
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showModal && selectedLog && (
                            <motion.div
                                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="bg-[#1A1D23] text-white p-6 rounded-lg w-[90%] md:w-[600px] max-h-[80vh] overflow-y-auto"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold">
                                            {t("Audit Log Description")}
                                        </h2>
                                        <button
                                            onClick={closeModal}
                                            className="text-gray-400 hover:text-white text-2xl"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                    <pre className="whitespace-pre-wrap text-sm text-[#F4F7FF]">
                                        {selectedLog.description}
                                    </pre>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </SecondLayout>
    );
};

export default AuditTrailsPage;
