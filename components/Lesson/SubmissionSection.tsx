import React from 'react';

interface SubmissionSectionProps {
  studentName: string;
  setStudentName: (name: string) => void;
  studentId: string;
  setStudentId: (id: string) => void;
  homeroom: string;
  setHomeroom: (homeroom: string) => void;
  isNameLocked: boolean;
  onFinish: () => void;
  variant?: 'green' | 'white';
}

export const SubmissionSection: React.FC<SubmissionSectionProps> = ({
  studentName,
  setStudentName,
  studentId,
  setStudentId,
  homeroom,
  setHomeroom,
  isNameLocked,
  onFinish,
  variant = 'green'
}) => {
  const isGreen = variant === 'green';
  const containerClasses = isGreen 
    ? "bg-green-700 p-8 rounded-xl shadow-lg text-white text-center mb-8"
    : "bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center mb-8";
    
  const inputBg = isGreen ? "bg-white" : "bg-gray-50";
  const inputBorder = isGreen ? "border-transparent" : "border-gray-200";
  const labelClasses = isGreen ? "text-white" : "text-gray-500";
  const buttonClasses = isGreen
    ? "bg-white text-green-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    : "bg-green-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl hover:bg-green-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl";

  return (
    <section className={containerClasses}>
      <h2 className={`text-2xl font-bold mb-4 ${!isGreen ? 'text-green-900' : ''}`}>
        {isNameLocked ? 'Update Score' : 'Finished?'}
      </h2>
      <div className="max-w-xl mx-auto mb-6">
        {isNameLocked ? (
          <div className={`w-full p-3 rounded-lg font-bold text-xl shadow-sm mb-4 ${isGreen ? 'bg-white text-green-900' : 'bg-green-50 text-green-800 border border-green-100'}`}>
            {studentName} • {studentId} • {homeroom}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block mb-2 text-xs font-semibold uppercase tracking-wider text-left ${labelClasses}`}>Nickname</label>
              <input
                type="text"
                className={`w-full p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-400 text-lg font-semibold ${inputBg} ${inputBorder}`}
                placeholder="Jake"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div>
              <label className={`block mb-2 text-xs font-semibold uppercase tracking-wider text-left ${labelClasses}`}>Student ID</label>
              <input
                type="text"
                className={`w-full p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-400 text-lg font-semibold ${inputBg} ${inputBorder}`}
                placeholder="01"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
            <div>
              <label className={`block mb-2 text-xs font-semibold uppercase tracking-wider text-left ${labelClasses}`}>Homeroom</label>
              <input
                type="text"
                className={`w-full p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-400 text-lg font-semibold ${inputBg} ${inputBorder}`}
                placeholder="M1/1"
                value={homeroom}
                onChange={(e) => setHomeroom(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
      <button
        onClick={onFinish}
        disabled={!studentName.trim() || !studentId.trim() || !homeroom.trim()}
        className={buttonClasses}
      >
        {isNameLocked ? 'See Updated Report Card' : 'See My Score'}
      </button>
    </section>
  );
};
