import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Ralli">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-[#FFAB91] to-[#00CED1] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">R</span>
        </div>
        <span className="text-xl font-bold text-gray-800">Ralli</span>
      </div>
    </Link>
  );
}
