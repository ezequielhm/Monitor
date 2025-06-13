import Link from 'next/link';

const BackMenuButton: React.FC = () => {
  return (
    <div className="fixed top-4 left-4">
      <Link href="/" className="rounded-lg bg-red-500 px-2 py-1 text-sm font-bold text-white transition duration-300 ease-in-out hover:bg-red-700">
        {`<`}
      </Link>
    </div>
  );
};

export default BackMenuButton;
