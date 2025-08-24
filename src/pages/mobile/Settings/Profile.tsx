import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import BottomNavBar from "../../../components/BottomBar";

type Props = {
    label: string;
    name: string;
    type?: React.HTMLInputTypeAttribute;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    readOnly?: boolean;
    disabled?: boolean;
    autoComplete?: string;
    required?: boolean;
    className?: string;
};

const Profile = () => {
    const navigate = useNavigate();

    // Dummy user statis
    const [form, setForm] = useState({
        name: "John Doe",
        mobile: "+65 8123 4567",
        email: "john.doe@mail.com",
        birth: "1995-01-01",
        nric_fin_no: "S1234567A",
        role_id: "1",
    });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const FormField: React.FC<Props> = ({
        label,
        name,
        type = "text",
        value,
        onChange,
        placeholder,
        error,
        readOnly,
        disabled,
        autoComplete,
        required,
        className,
    }) => (
        <div
            className={`flex flex-col gap-1 bg-[#222630] w-full p-3 border-b rounded-md ${className || ""
                }`}
        >
            <label htmlFor={name} className="text-xs text-[#98A1B3]">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                readOnly={readOnly}
                disabled={disabled}
                required={required}
                className="bg-[#222630] text-[#F4F7FF] placeholder-[#98A1B3] outline-none"
            />
            {error ? <span className="text-xs text-red-400">{error}</span> : null}
        </div>
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const onSubmit = async () => {
        setSaving(true);
        setErrors({});

        setTimeout(() => {
            // Simulasi validasi
            if (!form.name.trim() || !form.email.trim()) {
                toast.error("Please check your input");
                setErrors({
                    name: form.name ? "" : "Name is required",
                    email: form.email ? "" : "Email is required",
                });
            } else {
                Swal.fire({
                    title: "Success!",
                    text: "Profile updated successfully.",
                    icon: "success",
                    background: "#1e1e1e",
                    confirmButtonColor: "#EFBF04",
                    color: "#f4f4f4",
                });
                toast.success("Profile saved!");
            }
            setSaving(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#181D26] text-[#F4F7FF] p-4 flex flex-col gap-8 py-20">
            <div className="flex items-center gap-2 fixed px-6 py-6 top-0 left-0 w-full bg-[#181D26]">
                <ChevronLeft
                    size={20}
                    className="cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <h1 className="text-xl text-[#F4F7FF] font-normal font-noto">Profile</h1>
            </div>

            <div className="flex flex-col gap-6">
                <FormField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                />
                <FormField
                    label="Mobile number"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    error={errors.mobile}
                    placeholder="+65 8123 4567"
                    autoComplete="tel"
                />
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    autoComplete="email"
                    required
                />
                <FormField
                    label="NRIC/FIN"
                    name="nric_fin_no"
                    value={form.nric_fin_no}
                    onChange={handleChange}
                    error={errors.nric_fin_no}
                />
                <div className="flex flex-col gap-1 bg-[#222630] w-full p-3 border-b rounded-md">
                    <label htmlFor="role" className="text-xs text-[#98A1B3]">
                        Role
                    </label>
                    <select
                        id="role"
                        name="role_id"
                        value={form.role_id}
                        onChange={(e) =>
                            setForm((s) => ({ ...s, role_id: e.target.value }))
                        }
                        disabled
                        className="bg-[#222630] text-[#F4F7FF] outline-none"
                    >
                        <option value="">-- Select Role --</option>
                        <option value="1">Admin</option>
                        <option value="2">Staff</option>
                    </select>
                </div>
            </div>

            <button
                onClick={onSubmit}
                disabled={saving}
                className={`pt-4 bg-[#FFC107] text-[#181D26] font-medium text-base py-3 rounded-full disabled:opacity-60`}
            >
                {saving ? "Saving..." : "Save"}
            </button>

            <BottomNavBar />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Profile;
