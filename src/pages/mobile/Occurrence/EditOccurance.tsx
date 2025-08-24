import { ChevronLeft } from 'lucide-react';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const EditOccurance = () => {
  const navigate = useNavigate();
  const profileData = {
    name: "",
    dob: "98299213",
    Occurence: "Occurance",
  };
  const FormField = ({ label, type = "text", defaultValue }: { label: string; type?: string; defaultValue?: string }) => (
    <div className="flex flex-col gap-1 bg-[#222630]  w-full  p-4 border-b rounded-md outline-none">

      <input
        type={type}
        placeholder={label}
        defaultValue={defaultValue}
        className="bg-[#222630] text-[#F4F7FF] placeholder-[#98A1B3]"
      />
    </div>
  );
  return (
    <div className="min-h-screen bg-[#181D26] text-[#F4F7FF] p-4 flex flex-col gap-6 justify-between">
      <div className='flex flex-col gap-10'>
        <div className="flex items-center gap-3 pt-8">
          <ChevronLeft size={20} className="cursor-pointer" onClick={() => navigate(-1)} />
          <h1 className="text-xl font-normal text-[#F4F7FF]">Edit Report</h1>
        </div>

        <div className="flex flex-col gap-6">
          <FormField label="Category" defaultValue={profileData.name} />
          <FormField label="Date and TIme" defaultValue={profileData.dob} />
          <FormField label="Occourance" defaultValue={profileData.Occurence} />
        </div>
      </div>
      <div className='pb-9 flex flex-row justify-between gap-12'>
        <Link to="/user/e-occurence/history" className=' gap-3 w-full py-3 border border-[#EFBF04] text-[#EFBF04] rounded-full flex flex-row justify-center items-center py-3'>
        <p>Cancel</p>
        </Link>
        <Link to="/user/incident/report" className=' gap-3 w-full py-3  bg-[#EFBF04] text-[#181D26] rounded-full flex flex-row justify-center items-center py-3'>
          <p>Save </p>
        </Link>
      </div>
    </div>
  )
}

export default EditOccurance