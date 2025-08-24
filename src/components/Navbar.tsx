import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const { pathname } = useLocation();
    const { t } = useTranslation();

    const menus = [
        { label: t("Attendance"), path: "/dashboard/settings/attendance" },
        { label: t("Client Info"), path: "/dashboard/settings/client-info" },
        { label: "Employee Document", path: "/dashboard/settings/employee-document" },
        { label: t("Incident"), path: "/dashboard/settings/incident" },
        { label: t("Occurrence Catg"), path: "/dashboard/settings/occurrence-catg" },
        { label: t("Roles"), path: "/dashboard/settings/roles" },
        { label: t("Sop Document"), path: "/dashboard/settings/sop-document" },
    ];

    return (
        <nav className="flex flex-wrap">
            {menus.map((menu, index) => (
                <Link
                    key={index}
                    to={menu.path}
                    className={`font-medium text-sm text-[#F4F7FF] px-6 ${pathname === menu.path
                            ? "pt-[14px] pb-3 border-b-2 border-b-[#F3C511]"
                            : "py-[14px] border-b-0"
                        }`}
                >
                    {menu.label}
                </Link>
            ))}
        </nav>
    );
};

export default Navbar;
