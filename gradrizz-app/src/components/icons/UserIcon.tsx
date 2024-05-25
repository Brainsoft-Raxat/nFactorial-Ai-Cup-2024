import React from 'react';

const UserIcon = ({ photoURL }: { photoURL: string | null }) => {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
      {photoURL ? (
        <img src={photoURL} alt="User" className="w-full h-full object-cover" />
      ) : (
        <svg
          className="w-6 h-6 text-gray-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M12 2a7 7 0 100 14 7 7 0 000-14zm0 12a5 5 0 100-10 5 5 0 000 10zm-8 8a8 8 0 0116 0H4z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
};

export default UserIcon;
