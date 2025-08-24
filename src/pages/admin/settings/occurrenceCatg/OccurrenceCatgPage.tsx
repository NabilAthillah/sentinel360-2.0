import { Switch } from "@material-tailwind/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../../components/Loader";
import Navbar from "../../../../components/Navbar";
import MainLayout from "../../../../layouts/MainLayout";
import { useTranslation } from "react-i18next";
import Sidebar from "../../../../components/Sidebar";

type Category = {
    id: string;
    name: string;
    status: "active" | "inactive";
};

const OccurrenceCatgPage = () => {
    const [addCatg, setAddCatg] = useState(false);
    const [editCatg, setEditCatg] = useState(false);
    const [editData, setEditData] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([
        { id: "1", name: "Fire", status: "active" },
        { id: "2", name: "Accident", status: "inactive" },
        { id: "3", name: "Security Breach", status: "active" },
    ]);
    const [name, setName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const { t } = useTranslation();

    const filteredData = categories.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({
        "1": true,
        "2": false,
        "3": true,
    });

    const handleToggle = (id: string) => {
        setSwitchStates((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
        toast.success("Status updated (dummy)");
    };

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const newCatg: Category = {
                id: String(categories.length + 1),
                name,
                status: "active",
            };
            setCategories((prev) => [...prev, newCatg]);
            setName("");
            setAddCatg(false);
            setLoading(false);
            toast.success("Category added (dummy)");
        }, 800);
    };

    const handleEdit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!editData) return;
        setLoading(true);
        setTimeout(() => {
            setCategories((prev) =>
                prev.map((catg) =>
                    catg.id === editData.id ? { ...catg, name } : catg
                )
            );
            setName("");
            setEditData(null);
            setEditCatg(false);
            setLoading(false);
            toast.success("Category updated (dummy)");
        }, 800);
    };

    useEffect(() => {
        if (editData && editCatg) {
            setName(editData.name);
        }
    }, [editCatg, editData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const goPrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);
    const goNext = () =>
        currentPage < totalPages && setCurrentPage((p) => p + 1);

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
                                <div className="max-w-[400px] w-full flex items-center bg-[#222834] border-b border-[#98A1B3] rounded-t">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] focus:outline-none"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setAddCatg(true)}
                                className="font-medium text-base min-w-[200px] text-[#181d26] px-[46.5px] py-3 border border-[#EFBF04] bg-[#EFBF04] rounded-full hover:bg-[#181d26] hover:text-[#EFBF04] transition-all"
                            >
                                {t("Add Category")}
                            </button>
                        </div>

                        <div className="w-full h-full relative flex flex-1 pb-10">
                            <div className="w-full h-fit overflow-auto pb-5 flex-1">
                                <table className="w-full min-w-[500px]">
                                    <thead>
                                        <tr>
                                            <th className="font-semibold text-[#98A1B3] text-start">
                                                {t("S/NO")}
                                            </th>
                                            <th className="font-semibold text-[#98A1B3] text-start">
                                                {t("Category")}
                                            </th>
                                            <th className="font-semibold text-[#98A1B3] text-start">
                                                {t("Status")}
                                            </th>
                                            <th className="font-semibold text-[#98A1B3] text-center">
                                                {t("Action")}
                                            </th>
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
                                            {paginatedData.length > 0 ? (
                                                paginatedData.map((category, index) => (
                                                    <tr key={category.id}>
                                                        <td className="text-[#F4F7FF] pt-6 pb-3">
                                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                                        </td>
                                                        <td className="text-[#F4F7FF] pt-6 pb-3">
                                                            {category.name}
                                                        </td>
                                                        <td className="text-[#F4F7FF] pt-6 pb-3">
                                                            <div className="flex items-center gap-4 w-40">

                                                                <p
                                                                    className={`font-medium text-sm capitalize ${switchStates[category.id]
                                                                        ? "text-[#19CE74]"
                                                                        : "text-[#FF7E6A]"
                                                                        }`}
                                                                >
                                                                    {switchStates[category.id]
                                                                        ? "active"
                                                                        : "inactive"}
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="pt-6 pb-3">
                                                            <div className="flex gap-6 items-center justify-center">
                                                                <svg
                                                                    onClick={() => {
                                                                        setEditCatg(true);
                                                                        setEditData(category);
                                                                    }}
                                                                    className={`cursor-pointer ${loading ? "opacity-60 pointer-events-none" : ""
                                                                        }`}
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
                                                        No categories found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    )}
                                </table>
                            </div>

                            <div className="grid grid-cols-3 w-fit absolute bottom-0 right-0">
                                <button
                                    className="font-medium text-xs text-[#B3BACA] py-1 px-4 rounded-l bg-[#575F6F] disabled:opacity-50"
                                    onClick={goPrev}
                                    disabled={currentPage === 1 || loading}
                                >
                                    Prev
                                </button>
                                <button className="font-medium text-xs text-[#181D26] py-1 px-3 bg-[#D4AB0B]">
                                    {currentPage}
                                </button>
                                <button
                                    className="font-medium text-xs text-[#B3BACA] py-1 px-4 rounded-r bg-[#575F6F] disabled:opacity-50"
                                    onClick={goNext}
                                    disabled={currentPage === totalPages || loading}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <AnimatePresence>
                {editCatg && (
                    <motion.div
                        key="add-overlay"
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditCatg(false)}
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
                            <h2 className="text-2xl leading-[36px] text-white font-noto">Edit Category</h2>
                            <div className="flex flex-col w-full px-4 pt-2 py-2 rounded-[4px_4px_0px_0px] bg-[#222834] border-b-[1px] border-b-[#98A1B3]">
                                <label className="text-xs leading-[21px] text-[#98A1B3]">Category name</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] placeholder:text-base active:outline-none focus-visible:outline-none"
                                    placeholder="Category name"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex gap-4 justify-end flex-wrap">
                                <button
                                    onClick={() => {
                                        setEditCatg(false);
                                        setEditData(null);
                                    }}
                                    type="button"
                                    className="font-medium text-base leading-[21px] text-[#868686] bg-[#252C38] px-12 py-3 border-[1px] border-[#868686] rounded-full transition-all hover:bg-[#868686] hover:text-[#252C38]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="font-medium text-base leading-[21px] text-[#181D26] bg-[#EFBF04] px-12 py-3 border-[1px] border-[#EFBF04] rounded-full transition-all hover:bg-[#181D26] hover:text-[#EFBF04] disabled:opacity-60"
                                >
                                    {loading ? <Loader primary /> : "Save"}
                                </button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>


            <AnimatePresence>
                {addCatg && (
                    <motion.div
                        key="add-overlay"
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setAddCatg(false)}
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
                            <h2 className="text-2xl leading-[36px] text-white font-noto">Add Category</h2>
                            <div className="flex flex-col w-full px-4 pt-2 py-2 rounded-[4px_4px_0px_0px] bg-[#222834] border-b-[1px] border-b-[#98A1B3]">
                                <label className="text-xs leading-[21px] text-[#98A1B3]">Category name</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] placeholder:text-base active:outline-none focus-visible:outline-none"
                                    placeholder="Category name"
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex gap-4 justify-end flex-wrap">
                                <button
                                    onClick={() => setAddCatg(false)}
                                    type="button"
                                    className="font-medium text-base leading-[21px] text-[#868686] bg-[#252C38] px-12 py-3 border-[1px] border-[#868686] rounded-full transition-all hover:bg-[#868686] hover:text-[#252C38]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="font-medium text-base leading-[21px] text-[#181D26] bg-[#EFBF04] px-12 py-3 border-[1px] border-[#EFBF04] rounded-full transition-all hover:bg-[#181D26] hover:text-[#EFBF04] disabled:opacity-60"
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

export default OccurrenceCatgPage;
