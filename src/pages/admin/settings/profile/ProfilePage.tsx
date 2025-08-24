import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../../components/Loader";
import MainLayout from "../../../../layouts/MainLayout";
import { useTranslation } from "react-i18next";
import SidebarLayout from "../../../../components/SidebarLayout";

const ProfilePage = () => {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [sidebar, setSidebar] = useState(true);

    const user = {
        id: 1,
        name: "John Doe",
        address: "123 Main Street",
        mobile: "08123456789",
        email: "john@example.com",
        role: { name: "Admin" },
        employee: { nric_fin_no: "S1234567A" },
        profile_image: "default.png",
    };

    const baseURL = new URL(process.env.REACT_APP_API_URL || "http://localhost:8000/");
    baseURL.pathname = baseURL.pathname.replace(/\/api$/, "");
    const { t } = useTranslation();

    const [data, setData] = useState({
        name: user?.name,
        address: user?.address,
        mobile: user?.mobile,
        email: user?.email,
        old_password: "",
        new_password: "",
    });

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Submitted data:", data);
            toast.success("Profile updated successfully");
            setData({
                ...data,
                old_password: "",
                new_password: "",
            });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const audit = async () => {
        console.log(`User ${user?.email} accessed profile page`);
    };

    useEffect(() => {
        audit();
    }, []);

    return (
        <MainLayout>
            <SidebarLayout isOpen={sidebar} closeSidebar={setSidebar} />

            <div className="flex flex-col gap-4 px-6 pb-20 w-full h-full">
                <h2 className="text-2xl leading-9 text-white font-noto">
                    {t("Profile")}
                </h2>
                <div className="flex gap-6 flex-wrap lg:flex-nowrap">
                    <div className="flex flex-col w-full gap-6 lg:max-w-80">
                        <div className="flex flex-col gap-4 bg-[#252C38] lg:max-w-80 w-full h-fit p-4 rounded-lg">
                            <p className="font-semibold text-base leading-[20px] text-[#EFBF04]">
                                {user.role.name}
                            </p>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-[#98A1B3]">{t("NRIC")}</label>
                                <p className="text-base text-[#F4F7FF]">
                                    {user.employee.nric_fin_no}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-[#98A1B3]">{t("Company")}</label>
                                <p className="text-base text-[#F4F7FF]">Sentinel Group</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-[#98A1B3]">{t("Contact")}</label>
                                <p className="text-base text-[#F4F7FF]">{user.mobile}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-[#98A1B3]">{t("Email")}</label>
                                <p className="text-base text-[#F4F7FF]">{user.email}</p>
                            </div>
                        </div>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="w-full p-6 h-full rounded-lg bg-[#252C38] flex flex-col gap-8"
                    >
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col max-w-[520px] w-full px-4 pt-2 py-2 bg-[#222834] border-b border-b-[#98A1B3]">
                                <label className="text-xs text-[#98A1B3]">{t("Name")}</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="flex flex-col max-w-[520px] w-full px-4 pt-2 py-2 bg-[#222834] border-b border-b-[#98A1B3]">
                                <label className="text-xs text-[#98A1B3]">{t("Address")}</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData((prev) => ({ ...prev, address: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="flex flex-col max-w-[520px] w-full px-4 pt-2 py-2 bg-[#222834] border-b border-b-[#98A1B3]">
                                <label className="text-xs text-[#98A1B3]">{t("Mobile")}</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base"
                                    value={data.mobile}
                                    onChange={(e) =>
                                        setData((prev) => ({ ...prev, mobile: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="flex flex-col max-w-[520px] w-full px-4 pt-2 py-2 bg-[#222834] border-b border-b-[#98A1B3]">
                                <label className="text-xs text-[#98A1B3]">{t("Email")}</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData((prev) => ({ ...prev, email: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="flex flex-col max-w-[520px] w-full px-4 pt-2 py-2 bg-[#222834] border-b border-b-[#98A1B3]">
                                <label className="text-xs text-[#98A1B3]">{t("Old Password")}</label>
                                <input
                                    type="password"
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base"
                                    onChange={(e) =>
                                        setData((prev) => ({ ...prev, old_password: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="flex flex-col max-w-[520px] w-full px-4 pt-2 py-2 bg-[#222834] border-b border-b-[#98A1B3]">
                                <label className="text-xs text-[#98A1B3]">{t("New Password")}</label>
                                <input
                                    type="password"
                                    className="w-full bg-[#222834] text-[#F4F7FF] text-base"
                                    onChange={(e) =>
                                        setData((prev) => ({ ...prev, new_password: e.target.value }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-xs text-[#98A1B3]">
                                {t("Profile photo")} <span className="text-xs">({t("Maximum Size is 5MB")}!)</span>
                            </label>

                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => imageInputRef.current?.click()}
                                    className="font-medium text-sm text-[#EFBF04] px-5 py-2 border border-[#EFBF04] rounded-full"
                                >
                                    {t("Upload File")}
                                </button>

                                {imageName && (
                                    <span className="text-sm text-[#98A1B3]">{imageName}</span>
                                )}
                            </div>

                            {imageFile ? (
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Preview"
                                    className="h-20 w-fit rounded"
                                />
                            ) : (
                                <img
                                    src={`${baseURL.toString()}storage/${user.profile_image}`}
                                    alt="Profile"
                                    className="h-14 w-fit"
                                />
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                ref={imageInputRef}
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const maxSize = 5 * 1024 * 1024;
                                        if (file.size > maxSize) {
                                            toast.warning("Maximum file size is 5MB!");
                                            e.target.value = "";
                                            return;
                                        }
                                        setImageName(file.name);
                                        setImageFile(file);
                                    }
                                }}
                            />
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            <button
                                type="submit"
                                className="font-medium text-base text-[#181D26] bg-[#EFBF04] px-12 py-3 border border-[#EFBF04] rounded-full"
                            >
                                {loading ? <Loader primary={true} /> : "Save"}
                            </button>
                            <button
                                type="button"
                                className="font-medium text-base text-[#868686] bg-[#252C38] px-12 py-3 border border-[#868686] rounded-full"
                            >
                                {t("Cancel")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProfilePage;
