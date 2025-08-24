import { useState, useRef } from "react";
import { toast } from "react-toastify";
import MainLayout from "../../../../layouts/MainLayout";
import Navbar from "../../../../components/Navbar";
import { useTranslation } from "react-i18next";
import Loader from "../../../../components/Loader";
import PhoneInput from "react-phone-input-2";
import Sidebar from "../../../../components/Sidebar";

const ClientInfoPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(false);
    const [client] = useState({
        id: "1",
        name: "Sentinel ",
        reg_no: "REG123456",
        address: "123 Street, Singapore 123456",
        contact: "+6512345678",
        website: "https://example.com",
        email: "info@example.com",
        logo: "",
        chart: "",
    });

    const [name, setName] = useState(client.name);
    const [reg, setReg] = useState(client.reg_no);
    const [address, setAddress] = useState(client.address);
    const [contact, setContact] = useState(client.contact);
    const [website, setWebsite] = useState(client.website);
    const [email, setEmail] = useState(client.email);

    const [imageName, setImageName] = useState<string | null>(null);
    const [chartName, setChartName] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const chartInputRef = useRef<HTMLInputElement | null>(null);

    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            toast.success("Client Info Updated (dummy)");
            setSaving(false);
        }, 1000);
    };

    return (
        <MainLayout>
            <Sidebar isOpen={true} closeSidebar={undefined} />
            <div className="flex flex-col gap-4 px-6 pb-20 w-full h-full">
                <h2 className="text-2xl leading-9 text-white font-noto">{t("Settings")}</h2>
                <div className="flex flex-col gap-8 w-full h-full">
                    <Navbar />
                    <div className="flex gap-6 flex-wrap xl:flex-nowrap">
                        <div className="flex flex-col w-full gap-6 xl:max-w-80">
                            <div className="flex flex-col gap-4 bg-[#252C38] xl:max-w-80 w-full h-fit p-4 rounded-lg">
                                <p className="font-semibold text-base leading-[20px] text-[#EFBF04]">{client.name}</p>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-[#98A1B3]">Reg. No</label>
                                    <p className="text-base text-[#F4F7FF]">{client.reg_no}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-[#98A1B3]">Address</label>
                                    <p className="text-base text-[#F4F7FF]">{client.address}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-[#98A1B3]">Contact</label>
                                    <p className="text-base text-[#F4F7FF]">{client.contact}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-[#98A1B3]">Website</label>
                                    <p className="text-base text-[#F4F7FF]">{client.website}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-[#98A1B3]">Email</label>
                                    <p className="text-base text-[#F4F7FF]">{client.email}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs leading-[21px] text-[#98A1B3]">
                                        Management chart
                                    </label>
                                </div>
                            </div>


                            <div className="grid grid-cols-1 justify-between gap-x-2 gap-y-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-3">
                                {["Sites", "Employees", "Asigned", "Unasigned", "On leave"].map(
                                    (label, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col gap-2 px-4 py-[14px] w-full bg-[#252C38] shadow-[2px_2px_12px_rgba(24,29,38,0.14)] rounded-xl"
                                        >
                                            <p className="font-open font-semibold text-sm leading-[20px] text-[#98A1B3]">
                                                {label}
                                            </p>
                                            <p className="font-open font-semibold text-2xl leading-[20px] text-[#F4F7FF]">
                                                {loading ? (
                                                    <span className="inline-block h-6 w-10 bg-white/10 rounded animate-pulse" />
                                                ) : (
                                                    ["4", "12", "10", "1", "1"][i]
                                                )}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="w-full p-6 h-full rounded-lg bg-[#252C38] flex flex-col gap-8"
                        >
                            <fieldset>
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col max-w-[520px] w-full px-4 pt-2 py-2 rounded bg-[#222834] border-b border-b-[#98A1B3]">
                                        <label className="text-xs text-[#98A1B3]">Company name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#222834] text-[#F4F7FF]"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col max-w-[520px] w-full px-4 pt-2 py-2 rounded bg-[#222834] border-b border-b-[#98A1B3]">
                                        <label className="text-xs text-[#98A1B3]">Reg No.</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#222834] text-[#F4F7FF]"
                                            value={reg}
                                            onChange={(e) => setReg(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col max-w-[520px] w-full px-4 pt-2 py-2 rounded bg-[#222834] border-b border-b-[#98A1B3]">
                                        <label className="text-xs text-[#98A1B3]">Address</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#222834] text-[#F4F7FF]"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col max-w-[520px] w-full px-4 pt-2 py-2 rounded bg-[#222834] border-b border-b-[#98A1B3]">
                                        <label className="text-xs text-[#98A1B3]">Contact</label>
                                        <PhoneInput
                                            country={"sg"}
                                            value={contact}
                                            onChange={(phone) => setContact("+" + phone.replace(/\s/g, ""))}
                                            inputStyle={{
                                                backgroundColor: "#222834",
                                                color: "#F4F7FF",
                                                border: "none",
                                                width: "100%",
                                            }}
                                            buttonStyle={{ backgroundColor: "#222834", border: "none" }}
                                            containerStyle={{ backgroundColor: "#222834" }}
                                        />
                                    </div>

                                    <div className="flex flex-col max-w-[520px] w-full px-4 pt-2 py-2 rounded bg-[#222834] border-b border-b-[#98A1B3]">
                                        <label className="text-xs text-[#98A1B3]">Website</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#222834] text-[#F4F7FF]"
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col max-w-[520px] w-full px-4 pt-2 py-2 rounded bg-[#222834] border-b border-b-[#98A1B3]">
                                        <label className="text-xs text-[#98A1B3]">Email</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#222834] text-[#F4F7FF]"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="text-xs leading-[21px] text-[#98A1B3]">
                                            Site image <span className="text-xs">(Maximum image size is 5MB!)</span>{" "}
                                            <span className="text-red-500 text-[10px]">
                                                * Do not upload if you don't want to make changes
                                            </span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => imageInputRef.current?.click()}
                                            className="font-medium text-sm leading-[21px] text-[#EFBF04] px-5 py-2 border-[1px] border-[#EFBF04] rounded-full cursor-pointer w-fit transition-all hover:bg-[#EFBF04] hover:text-[#252C38]"
                                        >
                                            Upload file
                                        </button>
                                        {imageName && <span className="text-sm text-[#98A1B3]">{imageName}</span>}
                                        <input
                                            type="file"
                                            ref={imageInputRef}
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setImageName(file.name);
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="text-xs leading-[21px] text-[#98A1B3]">
                                            Organisation chart{" "}
                                            <span className="text-xs">(Maximum image size is 5MB!)</span>{" "}
                                            <span className="text-red-500 text-[10px]">
                                                * Do not upload if you don't want to make changes
                                            </span>
                                        </label><button
                                            type="button"
                                            onClick={() => chartInputRef.current?.click()}
                                            className="font-medium text-sm leading-[21px] text-[#EFBF04] px-5 py-2 border-[1px] border-[#EFBF04] rounded-full cursor-pointer w-fit transition-all hover:bg-[#EFBF04] hover:text-[#252C38]"
                                        >
                                            Upload file
                                        </button>
                                        {chartName && <span className="text-sm text-[#98A1B3]">{chartName}</span>}
                                        <input
                                            type="file"
                                            ref={chartInputRef}
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setChartName(file.name);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </fieldset>

                            <div className="flex gap-4 flex-wrap">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="font-medium text-base px-12 py-3 rounded-full flex items-center gap-2 bg-[#EFBF04] text-[#181D26] border border-[#EFBF04] hover:bg-[#181D26] hover:text-[#EFBF04]"
                                >
                                    {saving ? <Loader primary={true} /> : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ClientInfoPage;
