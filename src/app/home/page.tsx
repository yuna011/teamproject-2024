"use client";
import Image from "next/image";
import Button from "@/app/component/common/Button";
import Nav from "@/app/component/common/Nav";
import { FaBell } from "react-icons/fa";
import { useState } from "react";

type HomePageProps = {
    onHomePage: () => void;
};
type LastPageProps = {
    onLastPage: () => void;
};

export default function Home() {
    const [index, setIndex] = useState<number>(0);

    function nextPage(nextIndex?: number) {
        setIndex((prevIndex) => {
        const newIndex = nextIndex !== undefined ? nextIndex : prevIndex + 1;
        return Math.max(0, Math.min(newIndex, 1)); 
        });
    }

    function handleIndexChange(newIndex: number) {
        setIndex(newIndex);
    }

return (
    <div>
        <div className="absolute bg-white top-0 opacity-50 z-10">
            <h2 className="text-center font-bold text-lg text-black">
                現在のインデックス: {index}
            </h2>
            <div className="flex justify-center gap-2 my-4">
                {[...Array(2)].map((_, i) => (
                    <button
                    key={i}
                    onClick={() => handleIndexChange(i)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                    {i}
                    </button>
                ))}
            </div>
        </div>
        {index === 0 && <HomePage onHomePage={nextPage} />}
        {index === 1 && <LastPage onLastPage={nextPage} />}
    </div>
);
}

export function HomePage(props: HomePageProps) {
return (
    <div className="mt-24 h-screen flex flex-col gap-4 items-center">
        <div className="w-full flex justify-between px-12">
            <div className="relative">
            <div>
                <Image src="/images/icon.svg" alt="" width={50} height={50} />
                <p className="pt-2 text-center text-[6px]">ryota11_07</p>
            </div>
            <Image
                src="/images/icon2.svg"
                alt=""
                width={50}
                height={50}
                className="absolute top-0 left-6 opacity-70"
            />
            <Image
                src="/images/icon3.svg"
                alt=""
                width={50}
                height={50}
                className="absolute top-0 left-14 opacity-45"
            />
        </div>
        <FaBell className="text-lg" />
    </div>

    <div className="w-fit rounded-2xl text-xs" style={{ boxShadow: "1px -1px 12px 0px rgba(255, 255, 255, 0.6)" }}>
        <div className="flex items-center gap-2 p-4 text-[10px]">
            <Image src="/images/icon.svg" alt="" width={40} height={40} />
            <div>
                <p>ryota11_07</p>
                <p>阪急梅田</p>
            </div>
            <p className="ml-auto">たった今</p>
        </div>
        <Image src="/images/shoes.svg" alt="" width={350} height={350} />
        <div className="p-4">
            <p>UNIQLO</p>
            <p className="font-bold text-base mt-2">
                ストレッチショートブーツ
                <span className="float-end text-xs font-normal leading-8">￥3,220 </span>
            </p>
        </div>
    </div>

    <div className="w-full flex justify-around items-center">
        <p className="underline text-xs">一つ前に戻る</p>
        <Image src="/images/Spotify.svg" alt="" width={150} height={150} />
    </div>
    <Nav />
    </div>
);
}

export function LastPage(props: LastPageProps) {
return (
    <div className="text-center mt-48">
        <h2 className="text-xl font-bold">まだまだ歩き足りないようです…</h2>
        <Button
            disabled={false}
            text="リストを確認する"
            onClick={() => {}}
            className="mt-24 w-fit px-2 py-2 rounded-xl"
        />
        <p className="mt-6 underline font-bold">イマイチを表示</p>
    </div>
);
}