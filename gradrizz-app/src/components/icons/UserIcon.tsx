// components/icons/UserIcon.tsx
import React from 'react';

interface UserIconProps {
  photoURL: string | null;
}

const UserIcon: React.FC<UserIconProps> = ({ photoURL }) => {
  return (
    <img
      src={photoURL || '/default-avatar.png'} // Default avatar if photoURL is null
      alt="User Avatar"
      className="w-8 h-8 rounded-full"
    />
  );
};

export default UserIcon;
