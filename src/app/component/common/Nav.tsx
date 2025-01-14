import Image from "next/image";
import { MdHomeFilled } from "react-icons/md";
import { FaListUl, FaRegCalendarAlt } from "react-icons/fa";

type ActiveType = "home" | "list" | "memory" | "account";

type NavProps = {
    active: ActiveType;
    onChange: (newActive: ActiveType) => void; // 状態変更用のコールバック関数
};

export default function Nav({ active, onChange }: NavProps) {
    return (
        <div className="fixed bottom-0 w-full flex justify-around items-center py-4 border-t border-[#363636] rounded-xl bg-black">

            <MdHomeFilled
                onClick={() => onChange("home")}
                className={`size-8 ${active === "home" ? "text-white" : "text-gray-500"}`}
            />

            <FaListUl
                onClick={() => onChange("list")}
                className={`size-6 ${active === "list" ? "text-white" : "text-gray-500"}`}
            />

            <FaRegCalendarAlt
                onClick={() => onChange("memory")}
                className={`size-6 ${active === "memory" ? "text-white" : "text-gray-500"}`}
            />

            <Image
                src="../images/icon.svg"
                alt="Account Icon"
                width={30}
                height={30}
                onClick={() => onChange("account")}
                className={`${active === "account" ? "opacity-100" : "opacity-50"}`}
            />
        </div>
    );
}