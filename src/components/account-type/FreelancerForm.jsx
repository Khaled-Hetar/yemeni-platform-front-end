import React from 'react';
import { FaTimes } from 'react-icons/fa';

const FreelancerForm = ({
  specialty, onSpecialtyChange,
  jobTitle, onJobTitleChange,
  currentSkill, onCurrentSkillChange,
  skillsList, onSkillKeyDown, onRemoveSkill,
  aboutYou, onAboutYouChange,
  placeholders, errors, maxLength }) => (
  <div className="space-y-6 border-t pt-6 animate-fade-in">
    <div>
      <label htmlFor="specialty" className="block mb-2 font-medium text-neutral-700">مجال التخصص:</label>
      <select id="specialty" name="specialty" value={specialty} onChange={onSpecialtyChange} className="w-full bg-white font-bold px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-cyan-500">
        {Object.entries(placeholders).map(([key, { job }]) => (
          <option key={key} value={key}>{job.replace('مثل: ', '')}</option>
        ))}
      </select>
      {errors.specialty && <p className="text-red-600 text-sm mt-1">{errors.specialty}</p>}
    </div>

    <div>
      <label htmlFor="jobTitle" className="block mb-2 font-medium text-neutral-700">المسمى الوظيفي:</label>
      <input type="text" id="jobTitle" name="jobTitle" value={jobTitle} onChange={onJobTitleChange} className="w-full bg-gray-50 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-cyan-500" placeholder={placeholders[specialty]?.job} />
      {errors.jobTitle && <p className="text-red-600 text-sm mt-1">{errors.jobTitle}</p>}
    </div>

    <div>
      <label htmlFor="Skills" className="block mb-2 font-medium text-neutral-700">المهارات (اضغط Enter أو , لإضافة مهارة):</label>
      <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md bg-gray-50">
        {skillsList.map(skill => (
          <div key={skill} className="flex items-center gap-2 bg-cyan-100 text-cyan-800 text-sm font-semibold px-2 py-1 rounded-md">
            {skill}
            <button type="button" onClick={() => onRemoveSkill(skill)} className="text-cyan-600 hover:text-cyan-800"><FaTimes /></button>
          </div>
        ))}
        <input type="text" id="Skills" name="Skills" value={currentSkill} onChange={onCurrentSkillChange} onKeyDown={onSkillKeyDown} className="flex-grow bg-transparent outline-none p-1" placeholder={skillsList.length === 0 ? placeholders[specialty]?.skills : ''} />
      </div>
    </div>

    <div>
      <label htmlFor="aboutYou" className="block mb-2 font-medium text-neutral-700">نبذة عنك:</label>
      <textarea id="aboutYou" name="aboutYou" rows="5" value={aboutYou} onChange={onAboutYouChange} maxLength={maxLength} className="w-full resize-none bg-gray-50 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-cyan-500" placeholder="أكتب نبذة مختصرة عن خبراتك ومهاراتك لجذب العملاء..."></textarea>
      <div className="text-left text-xs text-gray-400 mt-1">{aboutYou.length} / {maxLength}</div>
      {errors.aboutYou && <p className="text-red-600 text-sm mt-1">{errors.aboutYou}</p>}
    </div>
  </div>
);

export default FreelancerForm;
