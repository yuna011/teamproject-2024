"use client";
import Image from "next/image";
import Button from "@/app/component/common/Button";
import Nav from "@/app/component/common/Nav";
import { FaBell } from "react-icons/fa";
import { useState } from "react";
import TinderCard from "react-tinder-card";

export default function Home() {
    const [active, setActive] = useState<"home" | "list" | "memory" | "account">("home");

    const renderContent = () => {
        switch (active) {
            case "home":
                return <HomePage />;
            case "list":
                return <ListPage />;
            case "memory":
                return <MemoryPage />;
            case "account":
                return <AccountPage />;
            default:
                return null;
        }
    };

    const items = [
        {
            id: 1,
            username: "ryota11_07",
            location: "阪急梅田",
            product: "ストレッチショートブーツ",
            price: "￥3,220",
            image: "/images/shoes.svg",
        },
        {
            id: 2,
            username: "hana_kim",
            location: "渋谷駅",
            product: "スニーカー",
            price: "￥6,800",
            image: "/images/sneaker.svg",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

    const swiped = (direction: "left" | "right", index: number) => {
        console.log(`You swiped ${direction} on item ${index}`);
        setSwipeDirection(direction);
        setTimeout(() => {
            setSwipeDirection(null);
            setCurrentIndex(index + 1); // 次のアイテムに移動
        }, 500); // アニメーション後にリセット
    };

    const currentItem = items[currentIndex];

    return (
        <div>
            <div>{renderContent()}</div>
            <Nav active={active} onChange={(newActive) => setActive(newActive)} />
        </div>
    );
}

export function LastPage() {
    return (
        <div className="text-center mt-48">
            <h2 className="text-xl font-bold">まだまだ歩き足りないようです…</h2>
            <Button
                disabled={false}
                text="リストを確認する"
                onClick={() => { }}
                className="mt-24 w-fit px-2 py-2 rounded-xl"
            />
            <p className="mt-6 underline font-bold">イマイチを表示</p>
        </div>
    );
}

function HomePage() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const swiped = (direction: string, index: number) => {
        console.log(`You swiped ${direction} on item ${index}`);
        if (direction === "left" || direction === "right") {
            setCurrentIndex(index + 1);
        }
    };

    const items = [
        {
            id: 1,
            username: "ryota11_07",
            location: "阪急梅田",
            product: "ストレッチショートブーツ",
            price: "￥3,220",
            image: "/images/shoes.svg",
        },
        {
            id: 2,
            username: "hana_kim",
            location: "渋谷駅",
            product: "スニーカー",
            price: "￥6,800",
            image: "/images/sneaker.svg",
        },
    ];

    const currentItem = items[currentIndex];

    return (
        <div>
            <div className="mt-8 h-screen flex flex-col gap-4 items-center px-6">
                <div className="w-full flex justify-between">
                    <div className="relative">
                        <div>
                            <Image src="/images/icon.svg" alt="" width={60} height={60} />
                            <p className="pt-2 text-center text-[10px]">ryota11_07</p>
                        </div>
                        <Image
                            src="/images/icon2.svg"
                            alt=""
                            width={60}
                            height={60}
                            className="absolute top-0 left-6 opacity-70"
                        />
                        <Image
                            src="/images/icon3.svg"
                            alt=""
                            width={60}
                            height={60}
                            className="absolute top-0 left-14 opacity-45"
                        />
                    </div>
                    <FaBell className="text-lg" />
                </div>

                {items.map((item, index) => (
                    <TinderCard
                        onSwipe={(dir) => swiped(dir, currentIndex)}
                        preventSwipe={["up", "down"]}
                        key={index}
                    >
                        <div className="w-full mt-6 rounded-2xl text-xs" style={{ boxShadow: "1px -1px 12px 0px rgba(255, 255, 255, 0.6)" }}>
                            <div className="flex items-center gap-2 p-4 text-[10px]">
                                <Image src="/images/icon.svg" alt="" width={40} height={40} />
                                <div>
                                    <p>{currentItem.username}</p>
                                    <p>{currentItem.location}</p>
                                </div>
                                <p className="ml-auto">たった今</p>
                            </div>
                            <Image src="/images/shoes.svg" alt="" width={380} height={350} />
                            <div className="p-4">
                                <p>UNIQLO</p>
                                <p className="font-bold text-base mt-2">
                                    {currentItem.product}
                                    <span className="float-end text-xs font-normal leading-8">{currentItem.price}</span>
                                </p>
                            </div>
                        </div>
                    </TinderCard>
                ))}

                <div className="w-full flex justify-between items-center">
                    <p className="underline text-xs">一つ前に戻る</p>
                    <Image src="/images/Spotify.svg" alt="" width={150} height={150} />
                </div>
            </div>;
        </div>
    )
}

function ListPage() {
    return <div>リストページのコンテンツ</div>;
}

function MemoryPage() {
    return <div>メモリーページのコンテンツ</div>;
}

function AccountPage() {
    return <div>アカウントページのコンテンツ</div>;
}