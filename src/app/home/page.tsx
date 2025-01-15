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


    return (
        <div>
            <div>{renderContent()}</div>
            <Nav active={active} onChange={(newActive) => setActive(newActive)} />
        </div>
    );
}

function HomePage() {
    const [items, setItems] = useState([
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
        {
            id: 3,
            username: "hana_kim",
            location: "阪急梅田",
            product: "スニーカー",
            price: "￥14,300",
            image: "/images/one.svg",
        },
        {
            id: 4,
            username: "hana_kim",
            location: "阪急梅田",
            product: "スニーカー",
            price: "￥12,100",
            image: "/images/two.svg",
        },
        {
            id: 5,
            username: "hana_kim",
            location: "阪急梅田",
            product: "スニーカー",
            price: "￥8,600",
            image: "/images/three.svg",
        },
        {
            id: 6,
            username: "hana_kim",
            location: "阪急梅田",
            product: "スニーカー",
            price: "￥6,600",
            image: "/images/four.svg",
        },
    ]);

    const swiped = (direction: string, index: number) => {
        console.log(`You swiped ${direction} on item ${index}`);
        // カードを削除
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };


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
                        key={item.id}
                        onSwipe={(dir) => swiped(dir, index)}
                        preventSwipe={["up", "down"]}
                        className="absolute w-full h-full bg-[#000] mt-24"
                        style={{
                            zIndex: items.length - index, // カードの順序をz-indexでコントロール
                        }}
                    >
                        {/* カードコンテンツ */}
                        <div
                            className="relative w-full mt-6 rounded-2xl text-xs shadow-lg"
                            style={{
                                boxShadow: "1px -1px 12px 0px rgba(255, 255, 255, 0.6)",
                            }}
                        >
                            {/* ユーザー情報 */}
                            <div className="flex items-center gap-2 p-4 text-[10px]">
                                <Image src="/images/icon.svg" alt="User Icon" width={40} height={40} />
                                <div>
                                    <p>{item.username}</p>
                                    <p>{item.location}</p>
                                </div>
                                <p className="ml-auto">たった今</p>
                            </div>

                            {/* 商品画像 */}
                            <Image
                                src={item.image}
                                alt={item.product}
                                width={380}
                                height={350}
                                className="object-contain mx-auto"
                            />

                            {/* 商品情報 */}
                            <div className="p-4">
                                <p className="font-semibold">{item.product}</p>
                                <p className="font-bold text-base mt-2">
                                    <span>{item.price}</span>
                                </p>
                            </div>
                        </div>

                        {/* 下部のナビゲーション */}
                        <div className="w-full px-2 mt-2 flex justify-between items-center">
                            <p className="underline text-xs">一つ前に戻る</p>
                            <Image src="/images/Spotify.svg" alt="Spotify Logo" width={150} height={150} />
                        </div>
                    </TinderCard>
                ))}

                {items.length === 0 && (
                    <div className="text-center mt-48">
                        <h2 className="text-xl font-bold">まだまだ歩き足りないようです…</h2>
                        <Button
                            disabled={false}
                            text="リストを確認する"
                            onClick={() => { }}
                            className="mt-24 w-fit px-8 py-4 rounded-xl"
                        />
                        <p className="mt-6 underline font-bold">イマイチを表示</p>
                    </div>
                )}
            </div>;
        </div>
    )
}

function ListPage() {
    const images = [
        "/images/shoes.svg",
        "/images/sneaker.svg",
        "/images/one.svg",
        "/images/two.svg",
        "/images/three.svg",
        "/images/four.svg",
        "/images/five.svg",
        "/images/seven.svg",
        "/images/eight.svg",
    ];


    return (<div>

        <div className="mx-auto w-fit mt-8"><Image src="/images/Me..svg" alt="Spotify Logo" width={30} height={30} /></div>
        <div className="flex space-between bg-[#2c2c2e] mx-4 rounded-lg py-1 pl-2 mt-4"><span><Image src="/images/find.svg" alt="Spotify Logo" width={25} height={25} /></span><input type="text" className="bg-inherit pl-1 text-sm" placeholder="商品やリストを検索" /></div>
        <div className="flex space-between bg-[#2c2c2e] mx-4 rounded-xl py-1 pl-2 mt-4 py-2">
            <span><Image src="/images/icon.svg" className="pt-1" alt="" width={45} height={45} /></span>
            <p className="pl-4 pr-16 pt-1"><span className="font-bold">友達をMe.に招待しましょう！</span> <br />
                <span className="text-sm">me.with.shopping/ryota11_07</span>
            </p>
            <Image className="" src="/images/share.svg" alt="" width={30} height={30} />
        </div>
        <div className="grid grid-cols-3 gap-1 p-4">
            {images.map((image, index) => (
                <div key={index} className="relative w-full h-40">
                    <img
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg"
                    />
                </div>
            ))}
        </div>
    </div>)
}

function MemoryPage() {
    return <div>メモリーページのコンテンツ</div>;
}

function AccountPage() {
    return <div>
        <Image src="/images/display.png" className="mt-12" alt="" width={420} height={820} />

    </div>;
}