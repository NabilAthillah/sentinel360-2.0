"use client"
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import attendanceSettingService from '../../../services/attendanceSettingService';
import siteEmployeeService from '../../../services/siteEmployeeService';
import { SiteEmployee } from '../../../types/siteEmployee';
import BottomNavBar from '../../../components/BottomBar';

type Settings = {
  label: string;
  placeholder: string;
  value: string;
}

const HomePage = () => {
  const [siteEmployee, setSiteEmployee] = useState<SiteEmployee>();
  const [attendance, setAttendance] = useState();
  const [formData, setFormData] = useState<Settings[]>([]);
  const [role, setRole] = useState<"Admin" | "User">("User");
  const fetchSites = async () => {
  }

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await attendanceSettingService.getAttendanceSetting(token);

      if (response.success) {
        const data = response.data;

        const mappedData = [
          { label: 'Grace period (in minutes)', placeholder: 'Grace period (in minutes)', value: data.grace_period.toString() },
          { label: 'Geo fencing (in minutes)', placeholder: 'Geo fencing (in minutes)', value: data.geo_fencing.toString() },
          { label: 'Day shift start time', placeholder: '00:00', value: data.day_shift_start_time.slice(0, 5) },
          { label: 'Day shift end time', placeholder: '00:00', value: data.day_shift_end_time.slice(0, 5) },
          { label: 'Night shift start time', placeholder: '00:00', value: data.night_shift_start_time.slice(0, 5) },
          { label: 'Night shift end time', placeholder: '00:00', value: data.night_shift_end_time.slice(0, 5) },
          { label: 'RELIEF Day shift start time', placeholder: '00:00', value: data.relief_day_shift_start_time.slice(0, 5) },
          { label: 'RELIEF Day shift end time', placeholder: '00:00', value: data.relief_day_shift_end_time.slice(0, 5) },
          { label: 'RELIEF night shift start time', placeholder: '00:00', value: data.relief_night_shift_start_time.slice(0, 5) },
          { label: 'RELIEF night shift end time', placeholder: '00:00', value: data.relief_night_shift_end_time.slice(0, 5) },
        ];

        console.log(mappedData)

        setFormData(mappedData);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getSettingTime = (label: string) => {
    const item = formData.find(d => d.label.trim().toLowerCase() === label.trim().toLowerCase());
    return item?.value ?? null;
  };

  const toTodayTime = (hhmm: string | null) => {
    if (!hhmm) return null;
    const [h, m] = hhmm.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  const fmtHM = (ms: number) => {
    const abs = Math.abs(ms);
    const minutes = Math.floor(abs / 60000);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const getShiftLabels = (shiftRaw?: string) => {
    const s = (shiftRaw || '').toLowerCase().trim();
    if (s === 'day') {
      return { start: 'Day shift start time', end: 'Day shift end time' };
    }
    if (s === 'night') {
      return { start: 'Night shift start time', end: 'Night shift end time' };
    }
    if (s === 'relief day' || s === 'relief-day' || s === 'relief_day') {
      return { start: 'RELIEF Day shift start time', end: 'RELIEF Day shift end time' };
    }
    if (s === 'relief night' || s === 'relief-night' || s === 'relief_night') {
      return { start: 'RELIEF night shift start time', end: 'RELIEF night shift end time' };
    }
    return null;
  };

  const [diffLabel, setDiffLabel] = useState<string>('');
  const [isLate, setIsLate] = useState<boolean>(false);

  useEffect(() => {
    if (!siteEmployee || formData.length === 0) return;

    const tick = () => {
      const labels = getShiftLabels(siteEmployee.shift);
      if (!labels) {
        setDiffLabel('');
        setIsLate(false);
        return;
      }

      const startStr = getSettingTime(labels.start);
      const endStr = getSettingTime(labels.end);

      const start = toTodayTime(startStr);
      let end = toTodayTime(endStr);
      const now = new Date();

      if (!start || !end) {
        setDiffLabel('');
        setIsLate(false);
        return;
      }

      if (end.getTime() <= start.getTime()) {
        const e = new Date(end);
        e.setDate(e.getDate() + 1);
        end = e;
      }

      const hasAttendance =
        (siteEmployee as any).attendance != null || (siteEmployee as any).attendancenya != null;

      const target = hasAttendance ? end : start;
      const ms = target.getTime() - now.getTime();

      setIsLate(ms < 0);
      setDiffLabel(fmtHM(ms));
    };

    tick();
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, [siteEmployee, formData]);


  useEffect(() => {
    fetchSites();
    fetchSettings();
  }, [])

  return (
    <div className="bg-[#0F101C] text-white min-h-screen px-4 pt-6 pb-20">
      <div className="mt-2 relative">
        <h1 className="text-xl font-bold">Michael</h1>
        <p className="text-sm text-gray-400">
          {role} | 12345567
        </p>
      </div>

      {role === "Admin" && siteEmployee && (
        <Link to="/user/attendance"
          className="bg-[#EFBF04] text-[#181D26] p-4 rounded-lg relative mt-4 flex justify-between items-center"
        >
          <div className='flex flex-col'>
            <p className="text-sm font-semibold capitalize">{siteEmployee.shift} Shift</p>
            {/* <p className="text-xs font-normal">{attendance?.value}</p> */}
            <p className={`text-xs font-normal ${isLate ? 'text-red-400' : 'text-[#181D26]'}`}>
              {siteEmployee?.date ? (() => {
                const dateObj = new Date(siteEmployee.date);
                const day = dateObj.toLocaleDateString("en-GB", { day: "2-digit" });
                const month = dateObj.toLocaleDateString("en-GB", { month: "long" });
                const year = dateObj.toLocaleDateString("en-GB", { year: "numeric" });
                const weekday = dateObj.toLocaleDateString("en-GB", { weekday: "long" });
                return `${day} ${month} ${year}, ${weekday}`;
              })() : "Invalid date"} {diffLabel ? ` | ${diffLabel}` : ''}
            </p>
          </div>

          <div className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-4 mt-6">
        {role === "Admin" && (
          <>
            <Link to="/user/e-occurence" className="bg-[#FFFFFF1A] p-4 rounded-xl flex flex-col justify-center items-center gap-2 w-full py-6 px-3 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                version="1.1" width="34" height="36" viewBox="0 0 34 36">
                <defs>
                  <clipPath id="master_svg0_133_01082">
                    <rect x="0" y="0" width="34" height="36" rx="0" />
                  </clipPath>
                </defs>
                <g clip-path="url(#master_svg0_133_01082)">
                  <g>
                    <path
                      d="M29,3.5L8,3.5C6.35,3.5,5,4.85,5,6.5L5,27.5C5,29.15,6.35,30.5,8,30.5L29,30.5C30.65,30.5,32,29.15,32,27.5L32,6.5C32,4.85,30.65,3.5,29,3.5ZM29,27.5L8,27.5L8,6.5L29,6.5L29,27.5Z"
                      fill="#D65B92" fill-opacity="1" />
                  </g>
                  <g>
                    <path
                      d="M9.875,10.58L17.375,10.58L17.375,12.83L9.875,12.83L9.875,10.58ZM20,22.625L27.5,22.625L27.5,24.875L20,24.875L20,22.625ZM20,18.875L27.5,18.875L27.5,21.125L20,21.125L20,18.875ZM12.5,26L14.75,26L14.75,23L17.75,23L17.75,20.75L14.75,20.75L14.75,17.75L12.5,17.75L12.5,20.75L9.5,20.75L9.5,23L12.5,23L12.5,26ZM21.634999999999998,15.425L23.75,13.309999999999999L25.865,15.425L27.455,13.835L25.34,11.705L27.455,9.59L25.865,8L23.75,10.115L21.634999999999998,8L20.045,9.59L22.16,11.705L20.045,13.835L21.634999999999998,15.425Z"
                      fill="#D65B92" fill-opacity="1" />
                  </g>
                </g>
              </svg>
              <span className="text-white text-sm">e-Occurrence</span>
            </Link>

            <Link to="/user/employee-document"
              className="bg-[#FFFFFF1A] p-4 rounded-xl flex flex-col items-center justify-center gap-2 w-full py-6 px-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="32" height="32" viewBox="0 0 32 32"><defs><clipPath id="master_svg0_133_00798"><rect x="0" y="0" width="32" height="32" rx="0" /></clipPath></defs><g clip-path="url(#master_svg0_133_00798)"><g><path d="M18.6667,11.999986494140625L18.6667,5.333326494140625L6.66667,5.333326494140625L6.66667,26.666656494140625L14.7413,26.666656494140625C15.1787,27.222656494140626,15.7067,27.713356494140626,16.314700000000002,28.113356494140625L18.168,29.333356494140624L5.324,29.333356494140624C4.593295,29.333356494140624,4.000735919,28.741356494140625,4,28.010656494140626L4,3.989326494140625C4,3.273323494140625,4.598666,2.666656494140625,5.336,2.666656494140625L19.996000000000002,2.666656494140625L28,10.666656494140625L28,11.999986494140625L18.6667,11.999986494140625ZM16,14.666656494140625L28,14.666656494140625L28,22.598656494140624C28,23.918656494140624,27.332,25.153356494140624,26.2187,25.885356494140623L22,28.663956494140624L17.7813,25.885356494140623C16.6726,25.159756494140623,16.0031,23.925056494140627,16,22.599956494140624L16,14.666656494140625ZM18.6667,22.598656494140624C18.6667,23.019956494140626,18.8827,23.417356494140623,19.247999999999998,23.658656494140626L22,25.471956494140624L24.752,23.658656494140626C25.112,23.425856494140625,25.3306,23.027356494140626,25.3333,22.598656494140624L25.3333,17.333356494140624L18.6667,17.333356494140624L18.6667,22.598656494140624Z" fill="#46EADF" fill-opacity="1" /></g></g></svg>
              <span className="text-white text-center flex flex-col ">Employe Document</span>
            </Link>
            <Link to="/user/sop-document" className="bg-[#FFFFFF1A] p-4 rounded-xl flex flex-col justify-center items-center gap-2 w-full py-6 px-3 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                version="1.1" width="32" height="32" viewBox="0 0 32 32">
                <defs>
                  <clipPath id="master_svg0_133_00984">
                    <rect x="0" y="0" width="32" height="32" rx="0" />
                  </clipPath>
                </defs>
                <g clip-path="url(#master_svg0_133_00984)">
                  <g>
                    <path
                      d="M16.551956494140626,6.66667L27.999956494140626,6.66667C28.736356494140626,6.66667,29.333356494140624,7.2636199999999995,29.333356494140624,8L29.333356494140624,26.6667C29.333356494140624,27.403,28.736356494140626,28,27.999956494140626,28L3.999986494140625,28C3.263610494140625,28,2.666656494140625,27.403,2.666656494140625,26.6667L2.666656494140625,5.33333C2.666656494140625,4.596954,3.263610494140625,4,3.999986494140625,4L13.885356494140625,4L16.551956494140626,6.66667ZM5.333326494140625,6.66667L5.333326494140625,25.3333L26.666656494140625,25.3333L26.666656494140625,9.33333L15.447956494140625,9.33333L12.781356494140624,6.66667L5.333326494140625,6.66667ZM14.666656494140625,12L17.333356494140624,12L17.333356494140624,22.6667L14.666656494140625,22.6667L14.666656494140625,12ZM19.999956494140626,16L22.666656494140625,16L22.666656494140625,22.6667L19.999956494140626,22.6667L19.999956494140626,16ZM9.333326494140625,18.6667L11.999986494140625,18.6667L11.999986494140625,22.6667L9.333326494140625,22.6667L9.333326494140625,18.6667Z"
                      fill="#E5D463" fill-opacity="1" />
                  </g>
                </g>
              </svg>
              <span className="text-white">SOP Documents</span>
            </Link>

            <Link to="/user/contact" className="bg-[#FFFFFF1A] p-4 rounded-xl flex flex-col justify-center items-center gap-2 w-full py-6 px-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="32" height="32" viewBox="0 0 32 32"><defs><clipPath id="master_svg0_133_01334"><rect x="0" y="0" width="32" height="32" rx="0" /></clipPath></defs><g clip-path="url(#master_svg0_133_01334)"><g><path d="M26.66656494140625,5.33333L5.33323494140625,5.33333C3.86656494140625,5.33333,2.66656494140625,6.53333,2.66656494140625,8L2.66656494140625,24C2.66656494140625,25.4667,3.86656494140625,26.6667,5.33323494140625,26.6667L26.66656494140625,26.6667C28.13326494140625,26.6667,29.33326494140625,25.4667,29.33326494140625,24L29.33326494140625,8C29.33326494140625,6.53333,28.13326494140625,5.33333,26.66656494140625,5.33333ZM26.66656494140625,24L5.33323494140625,24L5.33323494140625,8L26.66656494140625,8L26.66656494140625,24ZM5.33323494140625,0L26.66656494140625,0L26.66656494140625,2.66667L5.33323494140625,2.66667L5.33323494140625,0ZM5.33323494140625,29.3333L26.66656494140625,29.3333L26.66656494140625,32L5.33323494140625,32L5.33323494140625,29.3333ZM15.99986494140625,16C17.840864941406252,16,19.33326494140625,14.5076,19.33326494140625,12.6667C19.33326494140625,10.8257,17.840864941406252,9.33333,15.99986494140625,9.33333C14.15896494140625,9.33333,12.66656494140625,10.8257,12.66656494140625,12.6667C12.66656494140625,14.5076,14.15896494140625,16,15.99986494140625,16ZM15.99986494140625,11.3333C16.73326494140625,11.3333,17.33326494140625,11.9333,17.33326494140625,12.6667C17.33326494140625,13.4,16.73326494140625,14,15.99986494140625,14C15.26656494140625,14,14.66656494140625,13.4,14.66656494140625,12.6667C14.66656494140625,11.9333,15.26656494140625,11.3333,15.99986494140625,11.3333ZM22.66656494140625,21.32C22.66656494140625,18.5333,18.25326494140625,17.3333,15.99986494140625,17.3333C13.74656494140625,17.3333,9.33323494140625,18.5333,9.33323494140625,21.32L9.33323494140625,22.6667L22.66656494140625,22.6667L22.66656494140625,21.32ZM11.74656494140625,20.6667C12.55989494140625,19.9733,14.45326494140625,19.3333,15.99986494140625,19.3333C17.55986494140625,19.3333,19.45326494140625,19.9733,20.26656494140625,20.6667L11.74656494140625,20.6667Z" fill="#D4863F" fill-opacity="1" /></g></g></svg>
              <span className="text-white">Contacts</span>
            </Link>


            <Link to="/user/clocking"
              className="bg-[#FFFFFF1A] p-4 rounded-xl flex flex-col items-center justify-center gap-2 w-full py-6 px-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="32" height="32"
                viewBox="0 0 44 44">
                <defs>
                  <clipPath id="master_svg0_133_00783">
                    <rect x="0" y="0" width="44" height="44" rx="0" />
                  </clipPath>
                </defs>
                <g clip-path="url(#master_svg0_133_00783)">
                  <path
                    d="M21.99998701171875,3.6666641235351562C11.91668701171875,3.6666641235351562,3.66668701171875,11.916664123535156,3.66668701171875,21.999964123535158C3.66668701171875,32.083364123535155,11.91668701171875,40.333364123535155,21.99998701171875,40.333364123535155C32.08338701171875,40.333364123535155,40.33338701171875,32.083364123535155,40.33338701171875,21.999964123535158C40.33338701171875,11.916664123535156,32.08338701171875,3.6666641235351562,21.99998701171875,3.6666641235351562ZM21.99998701171875,36.666664123535156C13.91498701171875,36.666664123535156,7.33335701171875,30.084964123535155,7.33335701171875,21.999964123535158C7.33335701171875,13.914964123535157,13.91498701171875,7.333334123535156,21.99998701171875,7.333334123535156C30.08498701171875,7.333334123535156,36.66668701171875,13.914964123535157,36.66668701171875,21.999964123535158C36.66668701171875,30.084964123535155,30.08498701171875,36.666664123535156,21.99998701171875,36.666664123535156ZM22.91668701171875,12.833334123535156L20.16668701171875,12.833334123535156L20.16668701171875,23.833364123535155L29.69998701171875,29.699964123535157L31.16668701171875,27.316664123535155L22.91668701171875,22.366664123535156L22.91668701171875,12.833334123535156Z"
                    fill="#6091F4" fill-opacity="1" />
                </g>
              </svg>
              <span className="text-white">Clocking</span>
            </Link>

            <Link to="/user/incident" className="bg-[#FFFFFF1A] p-4 rounded-xl flex flex-col justify-center items-center gap-2 w-full py-6 px-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="34" height="34" viewBox="0 0 34 34"><defs><clipPath id="master_svg0_133_01341"><rect x="0" y="0" width="34" height="34" rx="0" /></clipPath></defs><g clip-path="url(#master_svg0_133_01341)"><g><path d="M17.000114453125,8.485832098999023L27.667614453125,26.916642098999024L6.332594453125,26.916642098999024L17.000114453125,8.485832098999023ZM3.881756453125,25.500042098999025C2.790923453125,27.384142098999025,4.150923453125,29.750042098999025,6.332594453125,29.750042098999025L27.667614453125,29.750042098999025C29.849214453125,29.750042098999025,31.209214453125,27.384142098999025,30.118414453125,25.500042098999025L19.450914453125,7.069162098999024C18.360114453125,5.185000098999024,15.640114453125,5.185000098999024,14.549214453125,7.069162098999024L3.881756453125,25.500042098999025ZM15.583414453125,15.583332098999023L15.583414453125,18.416642098999024C15.583414453125,19.195842098999023,16.220914453124998,19.833342098999026,17.000114453125,19.833342098999026C17.779214453125,19.833342098999026,18.416714453125,19.195842098999023,18.416714453125,18.416642098999024L18.416714453125,15.583332098999023C18.416714453125,14.804172098999024,17.779214453125,14.166672098999024,17.000114453125,14.166672098999024C16.220914453124998,14.166672098999024,15.583414453125,14.804172098999024,15.583414453125,15.583332098999023ZM15.583414453125,22.666642098999024L18.416714453125,22.666642098999024L18.416714453125,25.500042098999025L15.583414453125,25.500042098999025L15.583414453125,22.666642098999024Z" fill="#58E79F" fill-opacity="1" /></g></g></svg>
              <span className="text-white">Incidents</span>
            </Link>
          </>
        )}
      </div>

      {role !== "Admin" && (
        <div className='flex flex-col gap-10 items-center'>
          <Link to="/user/attendance" className="bg-[#FFFFFF1A] p-4 rounded-xl flex flex-col justify-center items-center gap-2 w-full py-6 px-3">
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 2.75C7.39137 2.75 3.25 6.89137 3.25 12C3.25 17.1086 7.39137 21.25 12.5 21.25C17.6086 21.25 21.75 17.1086 21.75 12C21.75 6.89137 17.6086 2.75 12.5 2.75ZM1.75 12C1.75 6.06294 6.56294 1.25 12.5 1.25C18.4371 1.25 23.25 6.06294 23.25 12C23.25 17.9371 18.4371 22.75 12.5 22.75C6.56294 22.75 1.75 17.9371 1.75 12ZM12.5 7.25C12.9142 7.25 13.25 7.58579 13.25 8V11.6893L15.5303 13.9697C15.8232 14.2626 15.8232 14.7374 15.5303 15.0303C15.2374 15.3232 14.7626 15.3232 14.4697 15.0303L11.9697 12.5303C11.829 12.3897 11.75 12.1989 11.75 12V8C11.75 7.58579 12.0858 7.25 12.5 7.25Z" fill="#6992ED" />
            </svg>
            <span className="text-white">Attendance</span>
          </Link>
          <Link to="/user/guard-tour" className="bg-[#FFFFFF1A] p-4 rounded-xl flex flex-col justify-center items-center gap-2 w-full py-6 px-3">
            <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24.4999 28.2537L23.8711 28.25C15.2374 28.1975 0.74985 27.6425 0.74985 24.5C0.74985 23.1375 2.94485 22.73 5.9836 22.1675C7.47485 21.8925 10.5799 21.315 10.7511 20.745C10.6061 20.285 8.10485 19.6337 5.09735 19.4987L4.49985 19.4738V18.25L5.74985 18.2825C8.32485 18.4425 11.9999 18.9825 11.9999 20.75C11.9999 22.3237 9.31735 22.82 6.20985 23.3963C4.73485 23.67 2.2686 24.1262 1.98235 24.5712C2.3686 25.7837 12.3874 26.93 23.8761 27H24.4999V28.2537ZM10.7499 5.91625C10.7499 8.765 8.01735 12.625 5.74985 17C3.48235 12.625 0.74985 8.76625 0.74985 5.915C0.73459 5.2464 0.852284 4.58142 1.0961 3.95868C1.33992 3.33593 1.705 2.76781 2.17016 2.2873C2.63532 1.80679 3.19129 1.42346 3.80579 1.15956C4.4203 0.895662 5.0811 0.756447 5.74985 0.75C6.4186 0.756447 7.0794 0.895662 7.69391 1.15956C8.30841 1.42346 8.86438 1.80679 9.32954 2.2873C9.7947 2.76781 10.1598 3.33593 10.4036 3.95868C10.6474 4.58142 10.7651 5.24765 10.7499 5.91625ZM6.4561 13.1063C8.0211 10.325 9.49985 7.7025 9.49985 5.915C9.51602 5.41035 9.43129 4.90755 9.25062 4.43607C9.06996 3.96459 8.797 3.53391 8.44774 3.16929C8.09848 2.80466 7.67996 2.51342 7.21669 2.31264C6.75342 2.11185 6.25473 2.00556 5.74985 2C5.24497 2.00556 4.74628 2.11185 4.28301 2.31264C3.81974 2.51342 3.40121 2.80466 3.05196 3.16929C2.7027 3.53391 2.42974 3.96459 2.24908 4.43607C2.06841 4.90755 1.98368 5.41035 1.99985 5.915C1.99985 7.7025 3.4786 10.3275 5.0436 13.1063C5.2761 13.5213 5.5136 13.9413 5.74985 14.3688C5.98735 13.9413 6.2236 13.5213 6.4561 13.1063ZM8.24985 5.75C8.24985 6.24445 8.10323 6.7278 7.82852 7.13893C7.55382 7.55005 7.16337 7.87048 6.70656 8.0597C6.24974 8.24892 5.74708 8.29843 5.26212 8.20196C4.77717 8.1055 4.33171 7.8674 3.98208 7.51777C3.63245 7.16814 3.39435 6.72268 3.29789 6.23773C3.20142 5.75277 3.25093 5.25011 3.44015 4.79329C3.62937 4.33648 3.9498 3.94603 4.36092 3.67133C4.77205 3.39662 5.2554 3.25 5.74985 3.25C6.41289 3.25 7.04878 3.51339 7.51762 3.98223C7.98646 4.45107 8.24985 5.08696 8.24985 5.75ZM6.99985 5.75C6.99985 5.50277 6.92654 5.2611 6.78919 5.05554C6.65183 4.84998 6.45661 4.68976 6.2282 4.59515C5.9998 4.50054 5.74846 4.47579 5.50599 4.52402C5.26351 4.57225 5.04078 4.6913 4.86597 4.86612C4.69115 5.04093 4.5721 5.26366 4.52387 5.50614C4.47564 5.74861 4.50039 5.99995 4.595 6.22835C4.68961 6.45676 4.84983 6.65199 5.05539 6.78934C5.26095 6.92669 5.50262 7 5.74985 7C6.08137 7 6.39931 6.8683 6.63373 6.63388C6.86815 6.39946 6.99985 6.08152 6.99985 5.75ZM28.2499 14.665C28.2499 17.5163 25.5174 21.375 23.2499 25.75C20.9824 21.375 18.2498 17.5163 18.2498 14.665C18.2287 13.9951 18.3423 13.3277 18.5841 12.7026C18.8258 12.0775 19.1907 11.5073 19.6571 11.0259C20.1235 10.5446 20.6818 10.1618 21.299 9.90043C21.9162 9.63906 22.5796 9.50437 23.2499 9.50437C23.9201 9.50437 24.5835 9.63906 25.2007 9.90043C25.8179 10.1618 26.3762 10.5446 26.8426 11.0259C27.309 11.5073 27.6739 12.0775 27.9156 12.7026C28.1574 13.3277 28.271 13.9951 28.2499 14.665ZM23.9561 21.8563C25.5211 19.075 26.9999 16.4525 26.9999 14.665C27.0225 14.1584 26.9423 13.6525 26.7641 13.1778C26.5858 12.7031 26.3133 12.2694 25.9628 11.9029C25.6124 11.5365 25.1913 11.2448 24.725 11.0455C24.2587 10.8462 23.7569 10.7435 23.2499 10.7435C22.7428 10.7435 22.241 10.8462 21.7747 11.0455C21.3084 11.2448 20.8873 11.5365 20.5369 11.9029C20.1864 12.2694 19.9139 12.7031 19.7356 13.1778C19.5574 13.6525 19.4772 14.1584 19.4998 14.665C19.4998 16.4525 20.9786 19.0775 22.5436 21.8563C22.7761 22.2712 23.0136 22.6912 23.2499 23.1188C23.4874 22.6912 23.7236 22.2712 23.9561 21.8563ZM25.7499 14.5C25.7499 14.9945 25.6032 15.4778 25.3285 15.8889C25.0538 16.3 24.6634 16.6205 24.2066 16.8097C23.7497 16.9989 23.2471 17.0484 22.7621 16.952C22.2772 16.8555 21.8317 16.6174 21.4821 16.2678C21.1325 15.9181 20.8944 15.4727 20.7979 14.9877C20.7014 14.5028 20.7509 14.0001 20.9402 13.5433C21.1294 13.0865 21.4498 12.696 21.8609 12.4213C22.272 12.1466 22.7554 12 23.2499 12C23.9129 12 24.5488 12.2634 25.0176 12.7322C25.4865 13.2011 25.7499 13.837 25.7499 14.5ZM24.4999 14.5C24.4999 14.2528 24.4265 14.0111 24.2892 13.8055C24.1518 13.6 23.9566 13.4398 23.7282 13.3451C23.4998 13.2505 23.2485 13.2258 23.006 13.274C22.7635 13.3222 22.5408 13.4413 22.366 13.6161C22.1912 13.7909 22.0721 14.0137 22.0239 14.2561C21.9756 14.4986 22.0004 14.7499 22.095 14.9784C22.1896 15.2068 22.3498 15.402 22.5554 15.5393C22.761 15.6767 23.0026 15.75 23.2499 15.75C23.5814 15.75 23.8993 15.6183 24.1337 15.3839C24.3682 15.1495 24.4999 14.8315 24.4999 14.5Z" fill="#F35A6C" />
            </svg>

            <span className="text-white">Guard Tour</span>
          </Link>
        </div>
      )}


      <BottomNavBar />
      <div className="mt-6 flex gap-2">
        <button
          className="bg-blue-500 px-3 py-1 rounded"
          onClick={() => setRole("Admin")}
        >
          Set Admin
        </button>
        <button
          className="bg-green-500 px-3 py-1 rounded"
          onClick={() => setRole("User")}
        >
          Set User
        </button>
      </div>
    </div>

  )
}

export default HomePage