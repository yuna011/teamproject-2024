'use client'

import { useState } from 'react';
import UnderTab from './component/startPage/underTab';
import style from './styles/startPage/main.module.css';

export default function StartPage() {
  // const [state, setState] = useState(0);
  const [count, setCount] = useState(0);
  return (
    <div className={style.wrap}>
      <h1>Start Page</h1>
      <p>Welcome to the start page</p>
      <p>
        <button onClick={() => setCount(count + 1)}>Click me</button>
      </p>
      <p>
        <a href="/page-2">Go to page 2</a>
      </p>
      <UnderTab />
    </div>
  );
}

export function TitleText() {
  return (
    <div className={style.under}>
      <h2>Under Tab</h2>
      <p>Under tab content</p>
    </div>
  );
}