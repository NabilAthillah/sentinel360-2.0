import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import attendanceService from '../../../services/attendanceService';
import attendanceSettingService from '../../../services/attendanceSettingService';
import siteEmployeeService from '../../../services/siteEmployeeService';
import { SiteEmployee } from '../../../types/siteEmployee';
import BottomNavBar from '../../../components/BottomBar';

type Settings = {
    label: string;
    placeholder: string;
    value: string;
};

const Attendance = () => {
    const [siteEmployees, setSiteEmployees] = useState<SiteEmployee[]>([]);
    const [siteEmployee, setSiteEmployee] = useState<SiteEmployee | null>();
    const [formData, setFormData] = useState<Settings[]>([]);
    const [nowStr, setNowStr] = useState('');
    const navigate = useNavigate();

    const getSettingTime = (label: string) => {
        const item = formData.find(
            (d) => d.label.trim().toLowerCase() === label.trim().toLowerCase()
        );
        return item?.value ?? null;
    };

    const formatTime12h = (hhmm: string | null) => {
        if (!hhmm) return '';
        const [h, m] = hhmm.split(':').map(Number);
        const d = new Date();
        d.setHours(h ?? 0, m ?? 0, 0, 0);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const to12h = (timeStr?: string | null) => {
        if (!timeStr) return '--:--';
        const [h, m] = timeStr.split(':').map(Number);
        const d = new Date();
        d.setHours(h ?? 0, m ?? 0, 0, 0);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const formatHumanDate = (isoDate?: string) => {
        if (!isoDate) return '-';
        const d = new Date(isoDate);
        const day = d.toLocaleDateString('en-GB', { day: '2-digit' });
        const month = d.toLocaleDateString('en-GB', { month: 'long' });
        const year = d.toLocaleDateString('en-GB', { year: 'numeric' });
        const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' });
        return `${day} ${month} ${year}, ${weekday}`;
    };

    const getShiftMeta = (shiftRaw?: string) => {
        const s = (shiftRaw || '').toLowerCase().trim();
        if (s === 'day')
            return {
                start: 'Day shift start time',
                end: 'Day shift end time',
                title: 'Day shift',
                isDay: true,
            };
        if (s === 'night')
            return {
                start: 'Night shift start time',
                end: 'Night shift end time',
                title: 'Night shift',
                isDay: false,
            };
        if (s === 'relief day')
            return {
                start: 'RELIEF Day shift start time',
                end: 'RELIEF Day shift end time',
                title: 'Relief day shift',
                isDay: true,
            };
        if (s === 'relief night')
            return {
                start: 'RELIEF night shift start time',
                end: 'RELIEF night shift end time',
                title: 'Relief night shift',
                isDay: false,
            };
        return {
            start: 'Day shift start time',
            end: 'Day shift end time',
            title: 'Day shift',
            isDay: true,
        };
    };

    const startEndOf = (shiftRaw?: string) => {
        const meta = getShiftMeta(shiftRaw);
        const start = formatTime12h(getSettingTime(meta.start));
        const end = formatTime12h(getSettingTime(meta.end));
        return { start, end, meta };
    };

    const dateFromYMD = (ymd: string) => {
        const [y, m, d] = ymd.split('-').map(Number);
        return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
    };

    const hhmmOn = (baseDate: Date, hhmm: string) => {
        const [h, m] = hhmm.split(':').map(Number);
        const d = new Date(baseDate);
        d.setHours(h ?? 0, m ?? 0, 0, 0);
        return d;
    };

    const getShiftRange = (shiftRaw?: string, baseDateStr?: string) => {
        const meta = getShiftMeta(shiftRaw);
        const startStr = getSettingTime(meta.start);
        const endStr = getSettingTime(meta.end);
        if (!startStr || !endStr || !baseDateStr) return null;

        const base = dateFromYMD(baseDateStr);
        const start = hhmmOn(base, startStr);
        let end = hhmmOn(base, endStr);
        if (start.getTime() > end.getTime()) {
            end.setDate(end.getDate() + 1);
        }
        return { start, end };
    };

    const getGraceMinutes = () => {
        const gp = getSettingTime('Grace period (in minutes)');
        const n = parseInt(gp ?? '0', 10);
        return Number.isFinite(n) ? Math.max(0, n) : 0;
    };

    const isBeforeCheckin = () => {
        if (!siteEmployee) return false;
        const range = getShiftRange(siteEmployee.shift, siteEmployee.date);
        if (!range) return false;
        const { start } = range;
        const graceMin = getGraceMinutes();
        const now = new Date();
        const startMinusGrace = new Date(start.getTime() - graceMin * 60_000);
        return now < startMinusGrace;
    };

    const isBeforeCheckout = () => {
        if (!siteEmployee) return false;
        const range = getShiftRange(siteEmployee.shift, siteEmployee.date);
        if (!range) return false;
        const { end } = range;
        const graceMin = getGraceMinutes();
        const now = new Date();
        const endMinusGrace = new Date(end.getTime() - graceMin * 60_000);
        return now < endMinusGrace;
    };

    const isLateForCheckin = () => {
        if (!siteEmployee) return false;
        const range = getShiftRange(siteEmployee.shift, siteEmployee.date);
        if (!range) return false;
        const { start, end } = range;
        const graceMin = getGraceMinutes();
        const now = new Date();
        const startPlusGrace = new Date(start.getTime() + graceMin * 60_000);
        return now > startPlusGrace && now < end;
    };

    const getEffectiveTime = (timeIn?: string | null, timeOut?: string | null) => {
        if (!timeIn || !timeOut) return '0h 0m';
        const [inH, inM, inS] = timeIn.split(':').map(Number);
        const [outH, outM, outS] = timeOut.split(':').map(Number);
        const inDate = new Date(); inDate.setHours(inH ?? 0, inM ?? 0, inS ?? 0, 0);
        const outDate = new Date(); outDate.setHours(outH ?? 0, outM ?? 0, outS ?? 0, 0);
        let diffMs = outDate.getTime() - inDate.getTime();
        if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
        const totalMinutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    const fetchSites = async () => {
      
    };

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await attendanceSettingService.getAttendanceSetting(token);
            if (response.success) {
                const d = response.data;
                const mapped: Settings[] = [
                    { label: 'Grace period (in minutes)', placeholder: 'Grace period (in minutes)', value: String(d.grace_period) },
                    { label: 'Geo fencing (in meters)', placeholder: 'Geo fencing (in meters)', value: String(d.geo_fencing) },
                    { label: 'Day shift start time', placeholder: '00:00', value: d.day_shift_start_time.slice(0, 5) },
                    { label: 'Day shift end time', placeholder: '00:00', value: d.day_shift_end_time.slice(0, 5) },
                    { label: 'Night shift start time', placeholder: '00:00', value: d.night_shift_start_time.slice(0, 5) },
                    { label: 'Night shift end time', placeholder: '00:00', value: d.night_shift_end_time.slice(0, 5) },
                    { label: 'RELIEF Day shift start time', placeholder: '00:00', value: d.relief_day_shift_start_time.slice(0, 5) },
                    { label: 'RELIEF Day shift end time', placeholder: '00:00', value: d.relief_day_shift_end_time.slice(0, 5) },
                    { label: 'RELIEF night shift start time', placeholder: '00:00', value: d.relief_night_shift_start_time.slice(0, 5) },
                    { label: 'RELIEF night shift end time', placeholder: '00:00', value: d.relief_night_shift_end_time.slice(0, 5) },
                ];
                setFormData(mapped);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    type Coords = { lat: number; lng: number };

    const [checkingFence, setCheckingFence] = useState(false);

    const haversineMeters = (a: Coords, b: Coords) => {
        const R = 6371000;
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const dLat = toRad(b.lat - a.lat);
        const dLng = toRad(b.lng - a.lng);
        const lat1 = toRad(a.lat);
        const lat2 = toRad(b.lat);
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(h));
    };

    const getGeoRadius = () => {
        const s = getSettingTime('Geo fencing (in meters)');
        const n = Number(s ?? 0);
        return Number.isFinite(n) ? Math.max(0, n) : 0;
    };

    const fetchSitePos = async (): Promise<Coords | null> => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !siteEmployee?.id) return null;
            const res = await siteEmployeeService.getById(token, siteEmployee.id);
            const lat = Number(res?.data?.site?.lat ?? res?.data?.lat);
            const lng = Number(res?.data?.site?.lng ?? res?.data?.lng);
            if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
        } catch (e) { }
        return null;
    };

    const getCurrentCoords = (): Promise<Coords> =>
        new Promise((resolve, reject) => {
            if (!('geolocation' in navigator)) return reject(new Error('Geolocation unsupported'));
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => reject(err),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
        });

    const ensureWithinGeofence = async () => {
        try {
            setCheckingFence(true);

            const radius = getGeoRadius();
            if (!radius || radius <= 0) {
                await Swal.fire({
                    title: 'Geofence not configured',
                    text: 'Site radius is missing. Please contact admin.',
                    icon: 'error',
                    background: '#1e1e1e',
                    confirmButtonColor: '#EFBF04',
                    color: '#f4f4f4',
                    customClass: { popup: 'swal2-dark-popup' },
                });
                return { ok: false, user: null as Coords | null, site: null as Coords | null, dist: null as number | null, radius };
            }

            const [site, user] = await Promise.all([fetchSitePos(), getCurrentCoords()]);
            if (!site || !user) {
                await Swal.fire({
                    title: 'Location unavailable',
                    text: 'Unable to get site or your location.',
                    icon: 'error',
                    background: '#1e1e1e',
                    confirmButtonColor: '#EFBF04',
                    color: '#f4f4f4',
                    customClass: { popup: 'swal2-dark-popup' },
                });
                return { ok: false, user, site, dist: null, radius };
            }

            const dist = haversineMeters(user, site);
            if (dist > radius) {
                await Swal.fire({
                    title: 'Outside geofence',
                    text: `You are ~${Math.round(dist)} m away. Please be within ${Math.round(radius)} m of the site to check out.`,
                    icon: 'warning',
                    background: '#1e1e1e',
                    confirmButtonColor: '#EFBF04',
                    color: '#f4f4f4',
                    customClass: { popup: 'swal2-dark-popup' },
                });
                return { ok: false, user, site, dist, radius };
            }

            return { ok: true, user, site, dist, radius };
        } finally {
            setCheckingFence(false);
        }
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (isBeforeCheckin()) {
            toast.error('It is not yet check-in time');
            return;
        }

        if (!siteEmployee?.attendance) {
            if (isLateForCheckin()) {
                const confirmLate = await Swal.fire({
                    title: 'Late check-in',
                    text: 'You are late.',
                    icon: 'error',
                    confirmButtonText: 'Okay',
                    background: '#1e1e1e',
                    confirmButtonColor: '#EFBF04',
                    color: '#f4f4f4',
                    customClass: { popup: 'swal2-dark-popup' },
                });
                return;
            }
            navigate(`/user/attendance/checkin/${siteEmployee?.id}`);
            return;
        }

        if (siteEmployee?.attendance?.time_out) {
            return;
        }

        const fence = await ensureWithinGeofence();
        if (!fence.ok) return;

        const confirm = await Swal.fire({
            title: 'Confirm checkout?',
            text: 'Do you want to check out now?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, check out',
            cancelButtonText: 'Cancel',
            background: '#1e1e1e',
            confirmButtonColor: '#EFBF04',
            color: '#f4f4f4',
            customClass: { popup: 'swal2-dark-popup' },
        });

        if (!confirm.isConfirmed) return;

        if (isBeforeCheckout()) {
            const { isConfirmed, value: reason } = await Swal.fire({
                title: 'Checkout before end time',
                text: 'Please provide a reason for early checkout.',
                input: 'text',
                inputLabel: 'Reason',
                inputPlaceholder: 'e.g., Family emergency',
                inputAttributes: { maxlength: '200' },
                showCancelButton: true,
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel',
                background: '#1e1e1e',
                confirmButtonColor: '#EFBF04',
                color: '#f4f4f4',
                customClass: { popup: 'swal2-dark-popup' },
                inputValidator: (val) => {
                    if (!val || val.trim().length < 3) return 'Please enter at least 3 characters.';
                    return undefined;
                },
            });
            if (!isConfirmed) return;
            await handleCheckout(reason.trim(), fence);
            return;
        }

        handleCheckout('', fence);
    };

    type FenceInfo = {
        ok: boolean;
        user: Coords | null;
        site: Coords | null;
        dist: number | null;
        radius: number;
    };

    const handleCheckout = async (reason: string, fence?: FenceInfo) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                localStorage.clear();
                navigate('/auth/login');
                return;
            }

            const id_site_employee = siteEmployee?.id;
            if (!id_site_employee) {
                Swal.fire({
                    title: "Error!",
                    text: 'Oops! Something went wrong',
                    icon: "error",
                    background: "#1e1e1e",
                    confirmButtonColor: "#EFBF04",
                    color: "#f4f4f4",
                    customClass: { popup: "swal2-dark-popup" },
                });
            }

            const time_out = new Intl.DateTimeFormat('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'Asia/Singapore',
            }).format(new Date());

            if (!fence?.ok) {
                const recheck = await ensureWithinGeofence();
                if (!recheck.ok) return;
                fence = recheck;
            }

            const payload = {
                id_site_employee,
                time_out,
                is_early: isBeforeCheckout(),
                reason: reason
            };

            const response = await attendanceService.updateAttendance(token, payload, siteEmployee?.attendance?.id);

            if (response?.success) {
                Swal.fire({
                    title: "Checked out!",
                    text: "Successfully checked out.",
                    icon: "success",
                    background: "#1e1e1e",
                    confirmButtonColor: "#EFBF04",
                    color: "#f4f4f4",
                    customClass: { popup: "swal2-dark-popup" },
                });
                fetchSites();
                navigate('/user/attendance');
            } else {
                Swal.fire({
                    title: "Error!",
                    text: 'Oops! Something went wrong',
                    icon: "error",
                    background: "#1e1e1e",
                    confirmButtonColor: "#EFBF04",
                    color: "#f4f4f4",
                    customClass: { popup: "swal2-dark-popup" },
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: 'Oops! Something went wrong',
                icon: "error",
                background: "#1e1e1e",
                confirmButtonColor: "#EFBF04",
                color: "#f4f4f4",
                customClass: { popup: "swal2-dark-popup" },
            });
        } finally {
            return;
        }
    }

    useEffect(() => {
        fetchSites();
        fetchSettings();
    }, []);

    useEffect(() => {
        const tick = () => {
            setNowStr(
                new Intl.DateTimeFormat('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Singapore',
                }).format(new Date())
            );
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const { start: headerStartTime, end: headerEndTime } = useMemo(() => {
        const meta = getShiftMeta(siteEmployee?.shift);
        return {
            start: formatTime12h(getSettingTime(meta.start)),
            end: formatTime12h(getSettingTime(meta.end)),
        };
    }, [siteEmployee?.shift, formData]);

    return (
        <div className="bg-[#181D26] min-h-screen text-white flex flex-col gap-12">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <div className="rounded-lg flex flex-col gap-6 justify-between px-6">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-medium text-base">
                                {siteEmployee ? (
                                    siteEmployee?.date ? (
                                        formatHumanDate(siteEmployee.date)
                                    ) : (
                                        'Invalid date'
                                    )
                                ) : (
                                    '-'
                                )}
                            </h2>

                            <p className="text-sm text-[#98A1B3]">
                                {siteEmployee ? (
                                    headerStartTime + ' – ' + headerEndTime
                                ) : (
                                    '-'
                                )}
                            </p>
                        </div>

                        {siteEmployee?.shift ? (
                            <div className="flex items-center gap-1 text-sm text-[#F4F7FF] h-full">
                                {['day', 'relief day'].includes(
                                    (siteEmployee.shift || '').toLowerCase()
                                ) ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 16 16">
                                        <path
                                            d="M4.51 3.23L3.31 2.03l-.94.94 1.19 1.19 1.94-1.93zM2.67 7H.67v1.33h2V7zM8.67.37H7.33v2h1.33v-2zM13.63 2.97l-.94-.94-1.19 1.19 1.19 1.19 1.94-1.93zM11.49 12.11l1.19 1.2.94-.94-1.2-1.19-.93.93zM13.33 7v1.33h2V7h-2zM8 3.67A4 4 0 1 0 12 7.67 4 4 0 0 0 8 3.67zM7.33 14.97h1.33v-1.97H7.33v1.97zM2.37 12.36l.94.94 1.19-1.2-.94-.94-1.19 1.2z"
                                            fill="#F3C511"
                                        />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 16 16">
                                        <path
                                            d="M9.796 3.018c.157-.414-.21-.846-.653-.781-3.22.467-5.525 3.541-4.865 6.93.455 2.345 2.385 4.206 4.748 4.59 2.181.356 4.176-.507 5.436-2.006.28-.333.111-.864-.321-.945-3.512-.671-5.647-4.399-4.345-7.788z"
                                            fill="#33569F"
                                        />
                                    </svg>
                                )}
                                <span className="text-[#F4F7FF] capitalize">
                                    {siteEmployee.shift} shift
                                </span>
                            </div>
                        ) : (
                            '-'
                        )}
                    </div>

                    <div className="flex justify-between text-sm">
                        <div className="flex gap-6">
                            <div className="flex flex-col gap-1">
                                <p className="text-[#98A1B3] text-xs font-normal">Check in</p>
                                <p className="text-[#19CE74] font-normal text-xs">
                                    {siteEmployee?.attendance?.time_in ?? '--:--'}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[#98A1B3] text-xs font-normal">Check out</p>
                                <p className="text-[#FF7E6A] font-normal text-xs">
                                    {siteEmployee?.attendance?.time_out ?? '--:--'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#98A1B3] text-xs font-normal">Effective hours</p>
                            <p className="text-[#F4F7FF] text-xs font-normal">
                                {getEffectiveTime(
                                    siteEmployee?.attendance?.time_in,
                                    siteEmployee?.attendance?.time_out
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {!siteEmployee?.attendance?.time_out && (
                    <button
                        disabled={!siteEmployee || isBeforeCheckin()}
                        onClick={handleSubmit}
                        className={`rounded-full flex flex-wrap justify-center gap-3 items-center w-full py-[13.5px] ${siteEmployee ? 'bg-[#EFBF04]' : 'bg-[#a38304]'}`}
                    >
                        {siteEmployee && (
                            <span className="flex text-[#181D26] text-base font-bold gap-2 text-center w-fit font-inter">
                                {isBeforeCheckin()
                                    ? 'It is not yet check-in time'
                                    : siteEmployee?.attendance?.time_in && !siteEmployee?.attendance?.time_out
                                        ? "Let's checkout"
                                        : siteEmployee?.attendance?.time_out
                                            ? 'You have already checked out'
                                            : isLateForCheckin()
                                                ? 'Late'
                                                : "Let's check in"}
                            </span>
                        )}
                        {siteEmployee && (
                            <span className="flex text-[#181D26] text-base font-bold gap-2 text-center w-fit font-inter">
                                |
                            </span>
                        )}
                        <span className="flex text-[#181D26] text-base font-bold gap-2 text-center w-fit font-inter">
                            {nowStr || '00:00:00'}
                        </span>
                    </button>
                )}
            </div>

            <div className="h-full w-full flex flex-col flex-1 gap-4 pb-16">
                <h3 className="text-[#98A1B3] text-base font-normal px-6">History</h3>

                <div className="bg-white rounded-t-3xl px-6 py-[26px] text-[#0F1116] flex flex-col gap-6 flex-1">
                    {siteEmployees.length === 0 ? (
                        <div className='flex flex-col flex-1 gap-[35px] items-center justify-start h-full py-[30px]'>
                            <div className='w-[185px] h-[169px] bg-[#D8D8D8]/40 '></div>
                            <div className='flex flex-col gap-2'>
                                <h3 className='font-noto text-xl text-[#181D26]'>No data available</h3>
                                <p className='font-inter text-sm text-[#181D26]'>No attendance completed yet</p>
                            </div>
                        </div>
                    ) : (
                        siteEmployees.map((item, idx) => {
                            const { start, end, meta } = startEndOf(item.shift);
                            const timeIn = to12h(item?.attendance?.time_in);
                            const timeOut = to12h(item?.attendance?.time_out);
                            const eff = getEffectiveTime(item?.attendance?.time_in, item?.attendance?.time_out);
                            const completed = !!(item?.attendance?.time_in && item?.attendance?.time_out);

                            return (
                                <div className="flex flex-col gap-4" key={item.id ?? idx}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-1">
                                            <h4 className="text-sm font-medium text-[#181D26]">
                                                {formatHumanDate(item.date)}
                                            </h4>
                                            <p className="text-xs text-[#98A1B3]">
                                                {start} – {end}
                                            </p>
                                        </div>

                                        <div
                                            className={`flex items-center gap-1 text-xs ${meta.isDay ? 'text-[#F3C511]' : 'text-[#33569F]'
                                                }`}
                                        >
                                            {meta.isDay ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 16 16">
                                                    <path
                                                        d="M4.51 3.23L3.31 2.03l-.94.94 1.19 1.19 1.94-1.93zM2.67 7H.67v1.33h2V7zM8.67.37H7.33v2h1.33v-2zM13.63 2.97l-.94-.94-1.19 1.19 1.19 1.19 1.94-1.93zM11.49 12.11l1.19 1.2.94-.94-1.2-1.19-.93.93zM13.33 7v1.33h2V7h-2zM8 3.67A4 4 0 1 0 12 7.67 4 4 0 0 0 8 3.67zM7.33 14.97h1.33v-1.97H7.33v1.97zM2.37 12.36l.94.94 1.19-1.2-.94-.94-1.19 1.2z"
                                                        fill="#F3C511"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 16 16">
                                                    <path
                                                        d="M9.796 3.018c.157-.414-.21-.846-.653-.781-3.22.467-5.525 3.541-4.865 6.93.455 2.345 2.385 4.206 4.748 4.59 2.181.356 4.176-.507 5.436-2.006.28-.333.111-.864-.321-.945-3.512-.671-5.647-4.399-4.345-7.788z"
                                                        fill="#33569F"
                                                    />
                                                </svg>
                                            )}
                                            <span className="text-[#181D26] text-xs font-normal">{meta.title}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-xs">
                                        <div className="flex gap-6">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[#98A1B3] text-xs font-normal">Check in</p>
                                                <p className="text-[#181D26]">{timeIn}</p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[#98A1B3] text-xs font-normal">Check out</p>
                                                <p className="text-[#181D26]">{timeOut}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[#98A1B3] text-xs font-normal">Effective hours</p>
                                            <p className="text-[#181D26]">{eff}</p>
                                        </div>
                                    </div>

                                    <div
                                        className={`w-fit px-4 py-1.5 ${completed ? 'bg-[rgba(59,182,120,0.16)]' : 'bg-[rgba(255,126,106,0.16)]'
                                            }`}
                                    >
                                        <p
                                            className={`text-xs font-medium ${completed ? 'text-[#3BB678]' : 'text-[#FF7E6A]'
                                                }`}
                                        >
                                            {completed ? 'Completed' : 'Missing'}
                                        </p>
                                    </div>

                                    {idx !== siteEmployees.length - 1 && (
                                        <div className="w-full h-[1px] bg-[#98A1B3]/50" />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <BottomNavBar />
        </div>
    );
};

export default Attendance;
