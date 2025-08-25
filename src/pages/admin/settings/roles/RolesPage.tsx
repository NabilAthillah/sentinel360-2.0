import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Loader from "../../../../components/Loader";
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import MainLayout from "../../../../layouts/MainLayout";
import permissionService from "../../../../services/permissionService";
import roleService from "../../../../services/roleService";

type Role = {
    id: string;
    name: string;
    permissions: Permission[];
};

type Permission = {
    id: string;
    name: string;
    category: string;
};

type PermissionGroup = {
    [category: string]: Permission[];
};

const RolesPage = () => {
    const [addRole, setAddRole] = useState(false);
    const [editRole, setEditRole] = useState(false);
    const [permissions, setPermissions] = useState<PermissionGroup>({});
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [editedRole, setEditedRole] = useState<Role | null>(null);

    const permissionsFlat = Object.values(permissions).flat();

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const { t } = useTranslation();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = (searchTerm ? filteredRoles : roles).slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const totalItems = searchTerm ? filteredRoles.length : roles.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const token = localStorage.getItem("token");

    // Load roles from API
    const loadRoles = async () => {
        try {
            setLoading(true);
            const res = await roleService.getAllRoles(token);
            setRoles(res.data || []);
        } catch (err: any) {
            toast.error(err.message || "Failed to fetch roles");
        } finally {
            setLoading(false);
        }
    };

    const loadPermissions = async () => {
        try {
            const response = await permissionService.getAllPermissions();

            if (response.success) {
                setPermissions(response.data);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        loadRoles();
        loadPermissions();
    }, []);

    const togglePermission = (id: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const toggleEditPermission = (id: string) => {
        if (!editedRole) return;
        const perm = permissionsFlat.find((p) => p.id === id);
        if (!perm) return;

        const updatedPermissions = editedRole.permissions.some((p) => p.id === id)
            ? editedRole.permissions.filter((p) => p.id !== id)
            : [...editedRole.permissions, perm];

        setEditedRole({ ...editedRole, permissions: updatedPermissions });
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!name) return;

        try {
            setLoading(true);
            const payload = {
                name,
                permission_ids: selectedPermissions,
            };
            await roleService.addRole(payload);
            toast.success("Role added successfully");
            loadRoles();
            setAddRole(false);
            setName("");
            setSelectedPermissions([]);
        } catch (err: any) {
            toast.error(err.message || "Failed to add role");
        } finally {
            setLoading(false);
        }
    };

    const handleEditRole = async () => {
        if (!editedRole) return;
        try {
            setLoading(true);
            const payload = {
                name: editedRole.name,
                permission_ids: editedRole.permissions.map((p) => p.id),
            };
            await roleService.updateRole(editedRole.id, payload);
            toast.success("Role updated successfully");
            loadRoles();
            setEditRole(false);
            setEditedRole(null);
        } catch (err: any) {
            toast.error(err.message || "Failed to update role");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const filtered = roles.filter((role) =>
            role.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRoles(filtered);
    };

    const formatPermissionName = (name: string) =>
        name
            .replace(/_/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase()
            .replace(/(^|\s)\S/g, (m) => m.toUpperCase());

    return (
        <MainLayout>
            <Sidebar isOpen={true} closeSidebar={undefined} />
            <div className="flex flex-col gap-4 px-4 pb-20 w-full h-full flex-1">
                <h2 className="text-2xl leading-9 text-white font-noto">Roles</h2>
                <div className="flex flex-col gap-8 w-full h-full flex-1">
                    <Navbar />
                    <div className="flex flex-col gap-10 bg-[#252C38] p-6 rounded-lg w-full h-full flex-1">
                        <div className="w-full flex justify-between items-center gap-4 flex-wrap lg:flex-nowrap">
                            <div className="max-w-[400px] w-full flex items-center bg-[#222834] border-b-[1px] border-b-[#98A1B3] rounded-[4px_4px_0px_0px]">
                                <input
                                    type={"text"}
                                    className="w-full px-4 pt-[17.5px] pb-[10.5px] bg-[#222834] rounded-[4px_4px_0px_0px] text-[#F4F7FF] text-base placeholder:text-[#98A1B3]  placeholder:text-base active:outline-none focus-visible:outline-none"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSearch();
                                    }}
                                />
                                <button
                                    type="button"
                                    className="p-2 rounded-[4px_4px_0px_0px]"
                                    tabIndex={-1}
                                    onClick={handleSearch}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="32" height="32" viewBox="0 0 32 32"><defs><clipPath id="master_svg0_247_12873"><rect x="0" y="0" width="32" height="32" rx="0" /></clipPath></defs><g clip-path="url(#master_svg0_247_12873)"><g><path d="M20.666698807907103,18.666700953674315L19.613298807907107,18.666700953674315L19.239998807907106,18.306700953674316C20.591798807907104,16.738700953674318,21.334798807907106,14.736900953674317,21.333298807907106,12.666670953674316C21.333298807907106,7.880200953674317,17.453098807907104,4.000000953674316,12.666668807907104,4.000000953674316C7.880198807907105,4.000000953674316,4.000000715257104,7.880200953674317,4.000000715257104,12.666670953674316C4.000000715257104,17.453100953674316,7.880198807907105,21.333300953674318,12.666668807907104,21.333300953674318C14.813298807907104,21.333300953674318,16.786698807907104,20.546700953674318,18.306698807907104,19.24000095367432L18.666698807907103,19.61330095367432L18.666698807907103,20.666700953674315L25.333298807907106,27.320000953674317L27.319998807907105,25.333300953674318L20.666698807907103,18.666700953674315ZM12.666668807907104,18.666700953674315C9.346668807907104,18.666700953674315,6.666668807907104,15.986700953674317,6.666668807907104,12.666670953674316C6.666668807907104,9.346670953674316,9.346668807907104,6.666670953674316,12.666668807907104,6.666670953674316C15.986698807907105,6.666670953674316,18.666698807907103,9.346670953674316,18.666698807907103,12.666670953674316C18.666698807907103,15.986700953674317,15.986698807907105,18.666700953674315,12.666668807907104,18.666700953674315Z" fill="#98A1B3" fill-opacity="1" /></g></g></svg>
                                </button>
                            </div>
                            <div className="w-[200px]">
                                <button
                                    onClick={() => setAddRole(true)}
                                    className="font-medium text-base min-w-[200px] text-[#181d26] px-[46.5px] py-3 border-[1px] border-[#EFBF04] bg-[#EFBF04] rounded-full hover:bg-[#181d26] hover:text-[#EFBF04] transition-all"
                                >
                                    {t("Add role")}
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="w-full h-full relative pb-10 flex flex-1">
                            <div className="w-full h-full overflow-auto pb-5 flex flex-1">
                                <table className="min-w-[700px] w-full">
                                    <thead>
                                        <tr>
                                            <th className="font-semibold text-[#98A1B3] text-start">{t("S/NO")}</th>
                                            <th className="font-semibold text-[#98A1B3] text-start">{t("Role")}</th>
                                            <th className="font-semibold text-[#98A1B3] text-center">{t("Actions")}</th>
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
                                            {currentItems.length > 0 ? (
                                                currentItems.map((data, index) => (
                                                    <tr key={data.id}>
                                                        <td className="text-[#F4F7FF] pt-6 pb-3">{indexOfFirstItem + index + 1}</td>
                                                        <td className="text-[#F4F7FF] pt-6 pb-3">{data.name}</td>
                                                        <td className="pt-6 pb-3">
                                                            <div className="flex gap-6 items-center justify-center">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditedRole(data);
                                                                        setEditRole(true);
                                                                    }}
                                                                    className="text-white hover:text-blue-500"
                                                                >
                                                                    <svg onClick={() => { setEditedRole(data); setEditRole(true) }} className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="28" height="28" viewBox="0 0 28 28"><defs><clipPath id="master_svg0_247_14308"><rect x="0" y="0" width="28" height="28" rx="0" /></clipPath></defs><g><g clip-path="url(#master_svg0_247_14308)"><g><path d="M3.5,20.124948752212525L3.5,24.499948752212525L7.875,24.499948752212525L20.7783,11.596668752212524L16.4033,7.2216687522125245L3.5,20.124948752212525ZM24.1617,8.213328752212524C24.6166,7.759348752212524,24.6166,7.0223187522125246,24.1617,6.568328752212524L21.4317,3.8383337522125243C20.9777,3.3834207522125244,20.2406,3.3834207522125244,19.7867,3.8383337522125243L17.651699999999998,5.973328752212524L22.0267,10.348338752212523L24.1617,8.213328752212524Z" fill="#F4F7FF" fill-opacity="1" /></g></g></g></svg>
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

                            <div className="absolute bottom-0 right-0 flex gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                    className="flex items-center gap-1 font-medium text-xs leading-[21px] text-[#B3BACA] disabled:opacity-50"
                                >
                                    <ArrowLeft size={14} />
                                    {t("Previous")}
                                </button>
                                <button className="font-medium text-xs text-[#181D26] py-1 px-3 bg-[#D4AB0B]">{currentPage}</button>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    className="flex items-center gap-1 font-medium text-xs leading-[21px] text-[#B3BACA] disabled:opacity-50"
                                >
                                    {t("Next")}
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Role Modal */}
            <AnimatePresence>
                {addRole && (
                    <motion.div
                        key="add-overlay"
                        className="fixed inset-0 z-50 bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setAddRole(false)}
                    >
                        <motion.aside
                            role="dialog"
                            aria-modal="true"
                            className="absolute right-0 top-0 h-full w-full max-w-[568px] bg-[#252C38] shadow-xl overflow-auto"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 320, damping: 32 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl leading-[36px] text-white font-noto">Add Role</h2>
                                    <button type="button" onClick={() => setAddRole(false)} className="text-[#98A1B3] hover:text-white">
                                        ✕
                                    </button>
                                </div>

                                <div className="flex flex-col w-full px-4 pt-2 py-2 rounded-[4px_4px_0px_0px] bg-[#222834] border-b border-b-[#98A1B3]">
                                    <label className="text-xs leading-[21px] text-[#98A1B3]">Role name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] focus-visible:outline-none"
                                        placeholder="Role name"
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                {Object.entries(permissions).map(([category, permissionList]) => (
                                    <div key={category} className="flex flex-col gap-2 mb-4">
                                        <label className="text-xs leading-[21px] text-[#98A1B3]">{category}</label>
                                        <div className="flex flex-wrap gap-x-3 gap-y-[14px]">
                                            {permissionList.map((permission) => {
                                                const isSelected = selectedPermissions.includes(permission.id);
                                                return (
                                                    <button
                                                        key={permission.id}
                                                        type="button"
                                                        onClick={() => togglePermission(permission.id)}
                                                        className={`font-medium text-sm leading-[20px] w-fit px-4 py-2 rounded-full transition-all ${isSelected ? 'bg-[#446FC7] text-white' : 'bg-[#303847] text-[#F4F7FF] hover:bg-[#446FC7] hover:text-white'
                                                            }`}
                                                    >
                                                        {formatPermissionName(permission.name)}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-auto flex gap-4 justify-end flex-wrap">
                                    <button
                                        type="button"
                                        onClick={() => setAddRole(false)}
                                        className="font-medium text-base text-[#868686] bg-[#252C38] px-12 py-3 border border-[#868686] rounded-full hover:bg-[#868686] hover:text-[#252C38] transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex justify-center items-center font-medium text-base text-[#181D26] bg-[#EFBF04] px-12 py-3 border border-[#EFBF04] rounded-full hover:bg-[#181D26] hover:text-[#EFBF04] transition"
                                    >
                                        {loading ? <Loader primary /> : "Save"}
                                    </button>
                                </div>
                            </form>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Role Modal */}
            <AnimatePresence>
                {editRole && editedRole && (
                    <motion.div
                        key="edit-overlay"
                        className="fixed inset-0 z-50 bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditRole(false)}
                    >
                        <motion.aside
                            role="dialog"
                            aria-modal="true"
                            className="absolute right-0 top-0 h-full w-full max-w-[568px] bg-[#252C38] shadow-xl overflow-auto"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col gap-6 p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl leading-[36px] text-white font-noto">Edit Role</h2>
                                    <button type="button" onClick={() => setEditRole(false)} className="text-[#98A1B3] hover:text-white">
                                        ✕
                                    </button>
                                </div>

                                <div className="flex flex-col w-full px-4 pt-2 py-2 rounded-[4px_4px_0px_0px] bg-[#222834] border-b border-b-[#98A1B3]">
                                    <label className="text-xs leading-[21px] text-[#98A1B3]">Role name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[#222834] text-[#F4F7FF] text-base placeholder:text-[#98A1B3] focus-visible:outline-none"
                                        placeholder="Role name"
                                        value={editedRole.name}
                                        onChange={(e) => setEditedRole({ ...editedRole, name: e.target.value })}
                                        required
                                    />
                                </div>

                                {Object.entries(permissions).map(([category, permissionList]) => (
                                    <div key={category} className="flex flex-col gap-2">
                                        <label className="text-xs leading-[21px] text-[#98A1B3]">{category}</label>
                                        <div className="flex flex-wrap gap-x-3 gap-y-[14px]">
                                            {permissionList.map((permission) => {
                                                const isSelected = editedRole.permissions.some((p) => p.id === permission.id);
                                                return (
                                                    <button
                                                        key={permission.id}
                                                        onClick={() => toggleEditPermission(permission.id)}
                                                        className={`px-4 py-2 rounded-full text-sm transition ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-blue-600'
                                                            }`}
                                                    >
                                                        {formatPermissionName(permission.name)}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-auto flex gap-4 justify-end flex-wrap">
                                    <button
                                        type="button"
                                        onClick={() => setEditRole(false)}
                                        className="font-medium text-base text-[#868686] bg-[#252C38] px-12 py-3 border border-[#868686] rounded-full hover:bg-[#868686] hover:text-[#252C38] transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEditRole}
                                        className="flex items-center justify-center font-medium text-base text-[#181D26] bg-[#EFBF04] px-12 py-3 border border-[#EFBF04] rounded-full hover:bg-[#181D26] hover:text-[#EFBF04] transition"
                                    >
                                        {loading ? <Loader primary /> : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </MainLayout>
    );
};

export default RolesPage;
