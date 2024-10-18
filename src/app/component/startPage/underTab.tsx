import { FaApple } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

export default function UnderTab() {
  return (
    <div className="bg-white bg-opacity-95 fixed bottom-0 h-[40vh] w-full rounded-t-2xl text-gray-800">
      <div className="absolute top-1 left-0 right-0 mx-auto w-9 h-1 bg-gray-400 rounded"></div>
      <div className="pt-14 flex flex-col gap-4">
        <div className="flex items-center justify-center gap-4 mx-8 py-3 px-4 text-xl rounded bg-black text-white">
          <FaApple />
          <p>Appleで続ける</p>
        </div>
        <div className="flex items-center justify-center gap-4 mx-8 py-3 px-4 text-xl rounded bg-white">
          <FaGoogle />
          <p>Googleで続行</p>
        </div>
        <div className="flex items-center justify-center gap-4 mx-8 py-3 px-4 text-xl rounded bg-[#AE4CEC] text-white">
          <FaInstagram />
          <p>Instagramで続行</p>
        </div>
      </div>
    </div>
  );
}
