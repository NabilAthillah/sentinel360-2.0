import "flag-icons/css/flag-icons.min.css";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { AlignLeft } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Header = ({ openSidebar, user, handleLogout, }: { openSidebar: any; user: any | null; handleLogout: any; }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [language, setLanguage] = useState<"en" | "ms">("en");
    const { t, i18n } = useTranslation();
    const rootRef = useRef<HTMLDivElement>(null);
    const firstItemRef = useRef<HTMLAnchorElement>(null);



    const handleLanguageChange = (lang: "en" | "ms") => {
        setLanguage(lang);
        setLangDropdownOpen(false);
    };

    const menuVariants: Variants = {
        hidden: { opacity: 0, y: -6, scale: 0.98 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.16, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            y: -6,
            scale: 0.98,
            transition: { duration: 0.12, ease: "easeIn" },
        },
    };

    const listVariants: Variants = {
        hidden: { opacity: 0, y: -6 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.14, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            y: -6,
            transition: { duration: 0.1, ease: "easeIn" },
        },
    };

    const langToFlag = (lng: "en" | "ms") => (lng === "ms" ? "my" : "sg");

    return (
        <nav className="w-full bg-transparent p-6 flex items-center justify-between z-40 md:justify-end relative sm:gap-4">
            <AlignLeft
                onClick={() => alert("Open sidebar")}
                color="#ffffff"
                className="cursor-pointer md:hidden"
            />

            <div
                ref={rootRef}
                className="flex items-center justify-end gap-2 relative sm:gap-4"
            >
                {/* Language switcher */}
                <div className="relative flex flex-col ">
                    <button
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={langDropdownOpen}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            setLangDropdownOpen((v) => !v);
                            setDropdownOpen(false);
                        }}
                        className="h-8 w-8 rounded-full flex items-center justify-center ring-1 ring-white/10 hover:ring-white/20 bg-[#252C38]/80 backdrop-blur-sm"
                        title="Change language"
                    >
                        <span
                            className={`fi fis fi-${langToFlag(language)}`}
                            aria-hidden="true"
                        />
                        <span className="sr-only">Change language</span>
                    </button>

                    <AnimatePresence>
                        {langDropdownOpen && (
                            <motion.ul
                                role="listbox"
                                aria-label="Select language"
                                variants={listVariants}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                className="absolute left-0 mt-2 min-w-[44px] bg-[#252C38]/95 rounded-md shadow-lg overflow-hidden z-50 p-1 ring-1 ring-white/10"
                                onClick={(e: React.MouseEvent<HTMLUListElement>) =>
                                    e.stopPropagation()
                                }
                            >
                                <li
                                    role="option"
                                    aria-selected={language === "en"}
                                    className="p-1 rounded hover:bg-white/10 cursor-pointer flex items-center justify-center"
                                    onClick={() => handleLanguageChange("en")}
                                    title="English"
                                >
                                    <span className="fi fis fi-sg" />
                                </li>
                                <li
                                    role="option"
                                    aria-selected={language === "ms"}
                                    className="p-1 rounded hover:bg-white/10 cursor-pointer flex items-center justify-center"
                                    onClick={() => handleLanguageChange("ms")}
                                    title="Malay"
                                >
                                    <span className="fi fis fi-my" />
                                </li>
                            </motion.ul>
                        )}
                    </AnimatePresence>


                </div>
                <div className="">
                    <svg className="border-r border-[#374957] " width="32" height="32" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.56836 19.75C5.8591 20.4185 6.33878 20.9876 6.94847 21.3873C7.55817 21.787 8.27133 22 9.00036 22C9.72939 22 10.4426 21.787 11.0522 21.3873C11.6619 20.9876 12.1416 20.4185 12.4324 19.75H5.56836Z" fill="#374957" />
                        <path d="M16.7939 13.4113L15.4919 9.11902C15.0749 7.61778 14.1684 6.29885 12.9163 5.37165C11.6641 4.44444 10.1381 3.96211 8.58054 4.00123C7.02297 4.04035 5.5231 4.59868 4.31908 5.58757C3.11507 6.57647 2.27591 7.93924 1.93486 9.45952L0.923856 13.6123C0.789481 14.1641 0.782201 14.7392 0.902564 15.2943C1.02293 15.8493 1.26779 16.3697 1.61867 16.8163C1.96956 17.2629 2.41729 17.624 2.92809 17.8722C3.43889 18.1205 3.99942 18.2495 4.56736 18.2495H13.2051C13.7907 18.2495 14.3681 18.1124 14.8911 17.8492C15.4142 17.5859 15.8683 17.2039 16.2171 16.7336C16.566 16.2633 16.7998 15.7178 16.9 15.1409C17.0001 14.564 16.9638 13.9716 16.7939 13.4113Z" fill="#374957" />
                        <rect x="10" width="10" height="10" rx="5" fill="#19CE74" />
                        <path d="M13.4078 8V7.55256L15.0882 5.71307C15.2855 5.49763 15.4479 5.31037 15.5755 5.15128C15.7031 4.99053 15.7975 4.83973 15.8588 4.69886C15.9218 4.55634 15.9533 4.4072 15.9533 4.25142C15.9533 4.07244 15.9102 3.9175 15.824 3.78658C15.7395 3.65566 15.6235 3.55457 15.476 3.48331C15.3285 3.41205 15.1628 3.37642 14.9789 3.37642C14.7833 3.37642 14.6126 3.41702 14.4668 3.49822C14.3226 3.57777 14.2108 3.68963 14.1312 3.83381C14.0533 3.97798 14.0144 4.14702 14.0144 4.34091H13.4277C13.4277 4.04261 13.4965 3.78078 13.6341 3.5554C13.7716 3.33002 13.9589 3.15436 14.1958 3.02841C14.4345 2.90246 14.7021 2.83949 14.9988 2.83949C15.2971 2.83949 15.5614 2.90246 15.7917 3.02841C16.0221 3.15436 16.2027 3.32422 16.3336 3.538C16.4645 3.75178 16.53 3.98958 16.53 4.25142C16.53 4.43868 16.496 4.6218 16.4281 4.80078C16.3618 4.9781 16.2458 5.17614 16.0801 5.39489C15.916 5.61198 15.6882 5.87713 15.3965 6.19034L14.253 7.41335V7.45312H16.6195V8H13.4078Z" fill="#181D26" />
                    </svg>
                </div>
                <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                    onClick={() => {
                        setDropdownOpen((v) => !v);
                        setLangDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 cursor-pointer outline-none rounded-md px-1"
                >
                    <div className="relative flex w-fit">
                        <span className="w-[14px] h-[14px] bg-[#22CAAD] border-2 border-[#07080B] rounded-full absolute bottom-[-2px] right-[-2px]" />
                        {user?.profile_image ? (
                            <img
                                src={user.profile_image}
                                alt="profile"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        ) : (
                            <img
                                src="/images/profile.png"
                                alt="default profile"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        )}
                    </div>
                    <div className="hidden sm:flex flex-col gap-[2px] text-left">
                        <p className="text-sm text-white">{user?.name}</p>
                        <p className="text-xs leading-[21px] text-[#A3A9B6]">
                            {user?.role.name}
                        </p>
                    </div>

                    <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        initial={false}
                        animate={{ rotate: dropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.18 }}
                    >
                        <path
                            d="M7.8 7.25h8.38a.75.75 0 0 1 .49 1.28l-4.19 4.19a.75.75 0 0 1-1.06 0L7.28 8.53A.75.75 0 0 1 7.8 7.25Z"
                            fill="#A3A9B6"
                        />
                    </motion.svg>
                </button>

                <AnimatePresence>
                    {dropdownOpen && (
                        <motion.div
                            role="menu"
                            aria-label="User Menu"
                            variants={menuVariants}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="min-w-[240px] px-4 py-3 bg-[#252C38]/95 backdrop-blur-sm rounded-xl flex flex-col gap-3 absolute right-0 top-[calc(100%+10px)] z-50 shadow-xl ring-1 ring-white/10"
                        >
                            <Link
                                ref={firstItemRef}
                                to="/profile"
                                role="menuitem"
                                className="text-[#F4F7FF] rounded-md px-2 py-2 hover:bg-white/5 transition-colors"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Profile
                            </Link>
                            <Link
                                to="/dashboard/settings/attendance"
                                role="menuitem"
                                className="text-[#F4F7FF] rounded-md px-2 py-2 hover:bg-white/5 transition-colors"
                                onClick={() => setDropdownOpen(false)}
                            >
                                {t("Master Settings")}
                            </Link>
                            <button
                                role="menuitem"
                                onClick={() => alert("Logout clicked")}
                                className="text-[#F4F7FF] rounded-md px-2 py-2 hover:bg-white/5 transition-colors text-left"
                            >
                                Logout
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Header;
