'use client'

import { useState } from 'react';
import UnderTab from './component/startPage/underTab';
import style from './styles/startPage/main.module.css';

export default function StartPage() {
  const text = [
    {
      mainTitle: 'すれちがいが、',
      subTitle: 'ショッピングを',
      secondTitle: 'もっと楽しくする。'
    },
    {
      mainTitle: '森尾ゆうな',
      subTitle: '森尾ゆうなです',
      secondTitle: 'こんにちは'
    },
    {
      mainTitle: '共産主義',
      subTitle: '共産主義です',
      secondTitle: 'こんにちは'
    },
  ];

  const [count, setCount] = useState(0);

  // countがtextの範囲を超えないようにする
  const currentText = text[count % text.length];

  return (
    <div className={`${style.wrap} px-12 pt-12 relative`}>
      <TitleText mainTitle={currentText.mainTitle} subTitle={currentText.subTitle} secondTitle={currentText.secondTitle} />
      <button onClick={() => setCount(count + 1)} className={style.nextButton}></button>

      <button onClick={() => setCount(count + 1)} className={style.nextButton}></button>
      {/* <UnderTab /> */}
    </div>
  );
}

export function TitleText({ mainTitle, subTitle, secondTitle }) {
  return (
    <div className={`${style.titleWrap} font-bold`}>
      <h1 className='text-2xl'>
        <span className='text-5xl whitespace-nowrap block pb-0'>{mainTitle}</span><br />
        <span className='block'>{subTitle}</span><br />
        <span className='block'>{secondTitle}</span>
      </h1>
    </div>
  );
}