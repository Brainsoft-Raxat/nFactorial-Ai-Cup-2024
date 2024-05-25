// components/icons/UserIcon.tsx
const UserIcon = ({ photoURL, onClick }: { photoURL: string | null, onClick?: () => void }) => {
  return (
    <div onClick={onClick} className={`cursor-pointer ${onClick ? '' : ''}`}>
      {photoURL ? (
        <img src={photoURL} alt="User Avatar" className="w-8 h-8 rounded-full" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200" />
      )}
    </div>
  );
};

export default UserIcon;
