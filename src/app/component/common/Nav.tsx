import Image from "next/image"
import { MdHomeFilled } from "react-icons/md";
import { FaListUl,  FaRegCalendarAlt  } from "react-icons/fa";


export default function Nav(){
    return(
        <div className="fixed bottom-0 w-full flex justify-around items-center py-4 border-t border-[#363636] rounded-xl bg-black">
            <MdHomeFilled className="size-8"/>
            <FaListUl className="size-6"/>
            <FaRegCalendarAlt className="size-6"/>
            <Image src="../images/icon.svg" alt="" width={30} height={30} />
        </div>
    )
}