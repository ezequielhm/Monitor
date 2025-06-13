import Link from 'next/link';

interface MenuLinkProps {
  href: string;
  text: string;
  icon: string;
  colorClass: string;
  enabled: boolean;
}

const MenuLink: React.FC<MenuLinkProps> = ({ href, text, icon, colorClass, enabled }) => {
  return enabled ? (
    <Link href={href} className={`flex items-center px-6 py-4 space-x-6 text-lg font-semibold ${colorClass} border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out`}>
      <span className="text-3xl">{icon}</span>
      <span>{text}</span>
    </Link>
  ) : (
    <div className="flex items-center px-6 py-4 space-x-6 text-lg font-semibold bg-gray-300 text-gray-500 border border-gray-300 rounded-lg shadow-md cursor-not-allowed">
      <span className="text-3xl">{icon}</span>
      <span>{text}</span>
    </div>
  );
};

export default MenuLink;
