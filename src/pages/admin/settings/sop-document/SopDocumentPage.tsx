import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteModal from "../../../../components/DeleteModal";
import Loader from "../../../../components/Loader";
import Navbar from "../../../../components/Navbar";
import MainLayout from "../../../../layouts/MainLayout";
import { useTranslation } from 'react-i18next';
import Sidebar from "../../../../components/Sidebar";
import { ArrowLeft, ArrowRight } from "lucide-react";
interface SopDocument {
    id: string;
    name: string;
    document: string;
}
const SopDocumentPage = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [viewDoc, setViewDoc] = useState(false);
    const [editDoc, setEditDoc] = useState(false);
    const [addDoc, setAddDoc] = useState(false);
    const [sop, setSop] = useState(false)
    const [editData, setEditData] = useState(false);
    const [sidebar, setSidebar] = useState(false);
    const [addSop, setAddSop] = useState(false);
    const [editSop, setEditSop] = useState(false);
    const [loading, setLoading] = useState(false);
    const [document, setDocument] = useState('');
    const [selected, setSelected] = useState<SopDocument | null>(null);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const baseURL = new URL(process.env.REACT_APP_API_URL || '');
    baseURL.pathname = baseURL.pathname.replace(/\/api$/, '');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { t, i18n } = useTranslation();
    const [datas, setDatas] = useState<SopDocument[]>([
        { id: "1", name: "SOP Keamanan", document: "https://via.placeholder.com/300" },
        { id: "2", name: "SOP Produksi", document: "https://via.placeholder.com/300" },
    ]);
    const itemsPerPage = 5;
    const filteredData = datas.filter((doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const goToNextPage = () =>
        currentPage < totalPages && setCurrentPage(currentPage + 1);
    const goToPrevPage = () =>
        currentPage > 1 && setCurrentPage(currentPage - 1);

    const handleAdd = () => {
        setDatas([
            ...datas,
            {
                id: Date.now().toString(),
                name,
                document: "https://via.placeholder.com/300",
            },
        ]);
        setAddDoc(false);
        setName("");
        setImageFile(null);
        setImageName(null);
    };

    const handleEdit = () => {
        if (!selected) return;
        setDatas(
            datas.map((d) =>
                d.id === selected.id ? { ...d, name, document: d.document } : d
            )
        );
        setEditDoc(false);
        setSelected(null);
        setName("");
        setImageFile(null);
        setImageName(null);
    };

    const handleDelete = () => {
        if (!selected) return;
        setDatas(datas.filter((d) => d.id !== selected.id));
        setDeleteModal(false);
        setSelected(null);
    };
    const handleSubmit = async (e: React.SyntheticEvent) => {
        if (!selected) return;
        setDatas(
            datas.map((d) =>
                d.id === selected.id ? { ...d, name, document: d.document } : d
            )
        );
        setEditDoc(false);
        setSelected(null);
        setName("");
        setImageFile(null);
        setImageName(null);
    }


    return (
        <MainLayout>
            <Sidebar isOpen={true} closeSidebar={undefined} />
            <div className='flex flex-col gap-4 pr-[156px] pl-4 pb-20 w-full h-full flex-1'>
                <h2 className='text-2xl leading-9 text-white font-noto'>{t('Settings')}</h2>
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
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
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
                            <div className="w-[250px]">
                                <button onClick={() => setAddDoc(true)} className="font-medium text-base min-w-[250px] text-[#181d26] px-[46.5px] py-3 border-[1px] border-[#EFBF04] bg-[#EFBF04] rounded-full hover:bg-[#181d26] hover:text-[#EFBF04] transition-all">{t('Add Document')}</button>
                            </div>
                        </div>
                        <div className="w-full h-full relative pb-10 flex flex-1">
                            <div className="w-full h-full overflow-auto pb-5 flex flex-1">
                                <table className="min-w-[700px] w-full">
                                    <thead>
                                        <tr>
                                            <th className="font-semibold text-[#98A1B3] text-start">{t('S/No')}</th>
                                            <th className="font-semibold text-[#98A1B3] text-start">{t('Name')}</th>
                                            <th className="font-semibold text-[#98A1B3] text-center">{t('Action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.length > 0 ? (
                                            paginatedData.map((Sop, index) => (
                                                <tr>
                                                    <td className="text-[#F4F7FF] pt-6 pb-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td className="text-[#F4F7FF] pt-6 pb-3">{Sop.name}</td>
                                                    <td className="pt-6 pb-3">
                                                        <div className="flex gap-6 items-center justify-center">
                                                            <svg onClick={() => { setViewDoc(true); }} className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="28" height="28" viewBox="0 0 28 28"><defs><clipPath id="master_svg0_247_10443"><rect x="0" y="0" width="28" height="28" rx="0" /></clipPath></defs><g><g clip-path="url(#master_svg0_247_10443)"><g>
                                                                <path d="M14.0002921875,5.25C8.1669921875,5.25,3.1853221875,8.87833,1.1669921875,14C3.1853221875,19.1217,8.1669921875,22.75,14.0002921875,22.75C19.8336921875,22.75,24.8152921875,19.1217,26.8336921875,14C24.8152921875,8.87833,19.8336921875,5.25,14.0002921875,5.25ZM14.0002921875,19.8333C10.7803221875,19.8333,8.1669921875,17.22,8.1669921875,14C8.1669921875,10.780000000000001,10.7803221875,8.16667,14.0002921875,8.16667C17.2202921875,8.16667,19.8336921875,10.780000000000001,19.8336921875,14C19.8336921875,17.22,17.2202921875,19.8333,14.0002921875,19.8333ZM14.0002921875,10.5C12.0636921875,10.5,10.5003221875,12.06333,10.5003221875,14C10.5003221875,15.9367,12.0636921875,17.5,14.0002921875,17.5C15.9369921875,17.5,17.5002921875,15.9367,17.5002921875,14C17.5002921875,12.06333,15.9369921875,10.5,14.0002921875,10.5Z" fill="#F4F7FF" fill-opacity="1" /></g></g></g>
                                                            </svg>
                                                            <svg onClick={() => {
                                                                setEditDoc(true);
                                                                setName(Sop.name);
                                                                setDocument(Sop.document);
                                                            }} className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="28" height="28" viewBox="0 0 28 28"><defs><clipPath id="master_svg0_247_14308"><rect x="0" y="0" width="28" height="28" rx="0" /></clipPath></defs><g><g clip-path="url(#master_svg0_247_14308)"><g><path d="M3.5,20.124948752212525L3.5,24.499948752212525L7.875,24.499948752212525L20.7783,11.596668752212524L16.4033,7.2216687522125245L3.5,20.124948752212525ZM24.1617,8.213328752212524C24.6166,7.759348752212524,24.6166,7.0223187522125246,24.1617,6.568328752212524L21.4317,3.8383337522125243C20.9777,3.3834207522125244,20.2406,3.3834207522125244,19.7867,3.8383337522125243L17.651699999999998,5.973328752212524L22.0267,10.348338752212523L24.1617,8.213328752212524Z" fill="#F4F7FF" fill-opacity="1" /></g></g></g></svg>

                                                            <svg
                                                                onClick={() => {
                                                                    console.log('Selected sop.id:', Sop.id);
                                                                    setSelectedId(Sop.id);
                                                                    setDeleteModal(true);
                                                                }}
                                                                className="cursor-pointer"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                version="1.1"
                                                                width="28"
                                                                height="28"
                                                                viewBox="0 0 28 28"
                                                            >
                                                                <defs>
                                                                    <clipPath id="delete_icon_clip">
                                                                        <rect x="0" y="0" width="28" height="28" rx="0" />
                                                                    </clipPath>
                                                                </defs>
                                                                <g clipPath="url(#delete_icon_clip)">
                                                                    <path
                                                                        d="M6.9997,24.5H21V8.16667H6.9997V24.5ZM22.1663,4.66667H18.083L16.9163,3.5H11.083L9.9163,4.66667H5.833V7H22.1663V4.66667Z"
                                                                        fill="#F4F7FF"
                                                                        fillOpacity="1"
                                                                    />
                                                                </g>
                                                            </svg>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (<tr>
                                            <td colSpan={4} className="text-center text-white py-4">
                                                {t('No document found')}.
                                            </td>
                                        </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="absolute bottom-0 right-0 flex gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 font-medium text-xs leading-[21px] text-[#B3BACA] disabled:opacity-50"
                                >
                                    <ArrowLeft size={14} />
                                    {t('Previous')}
                                </button>
                                <button className="font-medium text-xs text-[#181D26] py-1 px-3 bg-[#D4AB0B]">
                                    {currentPage}
                                </button>
                                <button
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1 font-medium text-xs leading-[21px] text-[#B3BACA] disabled:opacity-50"
                                >
                                    {t('Next')}
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {deleteModal && (
                    <motion.div
                        className="fixed w-screen h-screen flex justify-center items-center top-0 left-0 z-50 bg-[rgba(0,0,0,0.5)]"
                        key="add-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setDeleteModal(false)}>
                        <DeleteModal loading={loading} setModal={setDeleteModal} handleDelete={handleDelete} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {viewDoc && (
                    <motion.div className="fixed w-screen h-screen flex justify-center items-center top-0 left-0 z-50 bg-[rgba(0,0,0,0.5)]"
                        key="add-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setViewDoc(false)}>
                        <div className="flex flex-col gap-6 pr-[150px] pl-6 py-6 bg-[#252C38]">
                            <h2 className="text-2xl leading-[36px] text-white font-noto">View SOP document</h2>

                            <div className="w-[394px] h-[289px] rounded-lg">
                                <img
                                    src=""
                                />
                            </div>

                            <button
                                className="w-fit font-medium text-base leading-[21px] text-[#868686] bg-[#252C38] px-12 py-3 border-[1px] border-[#868686] rounded-full transition-all hover:bg-[#868686] hover:text-[#252C38]"
                                onClick={() => setViewDoc(false)}
                            >
                                {t('Close')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editDoc && (
                    <motion.div className="fixed w-screen h-screen flex justify-center items-center top-0 left-0 z-50 bg-[rgba(0,0,0,0.5)]"
                        key="add-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditDoc(false)}>
                        <motion.form onSubmit={handleEdit} className="flex flex-col gap-6 p-6 bg-[#252C38]"
                            initial={{ y: 20, scale: 0.98, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: 12, scale: 0.98, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 380, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}>
                            <h2 className='text-2xl leading-[36px] text-white font-noto'>{t('Edit SOP Document')}</h2>
                            <div className="flex flex-col w-full px-4 pt-2 py-2 rounded-[4px_4px_0px_0px] bg-[#222834] border-b-[1px] border-b-[#98A1B3]">
                                <label htmlFor="" className="text-xs leading-[21px] text-[#98A1B3]">{t('SOP Document Name')}</label>
                                <input
                                    type={"text"}
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] placeholder:text-base active:outline-none focus-visible:outline-none"
                                    placeholder='SOP Document name'
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-full py-2 rounded-[4px_4px_0px_0px] gap-2">
                                <label className="text-xs leading-[21px] text-[#98A1B3]">SOP Document image <span className='text-xs'>(Maximum image size is 5MB!)</span></label>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => imageInputRef.current?.click()}
                                        className="font-medium text-sm leading-[21px] text-[#EFBF04] px-5 py-2 border-[1px] border-[#EFBF04] rounded-full cursor-pointer w-fit transition-all hover:bg-[#EFBF04] hover:text-[#252C38]"
                                    >
                                        {t('Upload File')}
                                    </button>
                                    {imageName && (
                                        <span className="text-sm text-[#98A1B3]">{imageName}</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={imageInputRef}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const maxSizeInBytes = 5 * 1024 * 1024;

                                            if (file.size > maxSizeInBytes) {
                                                toast.warning('Maximum file size is 5MB!');
                                                e.target.value = "";
                                                return;
                                            }

                                            setImageName(file.name);
                                            setImageFile(file);
                                        }
                                    }}
                                    className="hidden"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setEditDoc(false)} className="font-medium text-base leading-[21px] text-[#868686] bg-[#252C38] px-12 py-3 border-[1px] border-[#868686] rounded-full transition-all hover:bg-[#868686] hover:text-[#252C38]">{t('Cancel')}</button>
                                <button type="submit" className="font-medium text-base leading-[21px] text-[#181D26] bg-[#EFBF04] px-12 py-3 border-[1px] border-[#EFBF04] rounded-full transition-all hover:bg-[#181D26] hover:text-[#EFBF04]">{loading ? <Loader primary={true} /> : 'Submit'}</button>
                            </div>
                        </motion.form>


                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {addDoc && (
                    <motion.div className="fixed w-screen h-screen flex justify-center items-center top-0 left-0 z-50 bg-[rgba(0,0,0,0.5)]"
                        key="add-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setAddDoc(false)}>
                        <motion.form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 bg-[#252C38]"
                            initial={{ y: 20, scale: 0.98, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: 12, scale: 0.98, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 380, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}>
                            <h2 className='text-2xl leading-[36px] text-white font-noto'>{t('Add SOP Document')}</h2>
                            <div className="flex flex-col w-full px-4 pt-2 py-2 rounded-[4px_4px_0px_0px] bg-[#222834] border-b-[1px] border-b-[#98A1B3]">
                                <label htmlFor="" className="text-xs leading-[21px] text-[#98A1B3]">{t('SOP Document Name')}</label>
                                <input
                                    type={"text"}
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] placeholder:text-base active:outline-none focus-visible:outline-none"
                                    placeholder='SOP Document name'
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-full py-2 rounded-[4px_4px_0px_0px] gap-2">
                                <label className="text-xs leading-[21px] text-[#98A1B3]">{t('Site Image')} <span className='text-xs'>({t('Maximum Size is 5MB')}!)</span></label>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => imageInputRef.current?.click()}
                                        className="font-medium text-sm leading-[21px] text-[#EFBF04] px-5 py-2 border-[1px] border-[#EFBF04] rounded-full cursor-pointer w-fit transition-all hover:bg-[#EFBF04] hover:text-[#252C38]"
                                    >
                                        {t('Uplaod File')}
                                    </button>
                                    {imageName && (
                                        <span className="text-sm text-[#98A1B3]">{imageName}</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={imageInputRef}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const maxSizeInBytes = 5 * 1024 * 1024;

                                            if (file.size > maxSizeInBytes) {
                                                toast.warning('Maximum file size is 5MB!');
                                                e.target.value = "";
                                                return;
                                            }

                                            setImageName(file.name);
                                            setImageFile(file);
                                        }
                                    }}
                                    className="hidden"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setAddDoc(false)} className="font-medium text-base leading-[21px] text-[#868686] bg-[#252C38] px-12 py-3 border-[1px] border-[#868686] rounded-full transition-all hover:bg-[#868686] hover:text-[#252C38]">{t('Cancel   ')}</button>
                                <button type="submit" className="font-medium text-base leading-[21px] text-[#181D26] bg-[#EFBF04] px-12 py-3 border-[1px] border-[#EFBF04] rounded-full transition-all hover:bg-[#181D26] hover:text-[#EFBF04]">{loading ? <Loader primary={true} /> : 'Submit'}</button>
                            </div>
                        </motion.form>


                    </motion.div>
                )}
            </AnimatePresence>
        </MainLayout>
    )
}

export default SopDocumentPage;