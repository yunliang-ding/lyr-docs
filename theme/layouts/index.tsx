/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useEffect } from 'react';
import Layout from './layout';
import uiStore from '../store/ui';
import { generate, getRgbStr } from '@arco-design/color';

export default () => {
  const { dark } = uiStore.useSnapshot();
  useEffect(() => {
    if (dark) {
      // 设置为暗黑主题
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      // 恢复亮色主题
      document.body.removeAttribute('arco-theme');
    }
  }, [dark]);
  // 更新主题
  const setTheme = (newColor: string | undefined) => {
    const newList = generate(newColor, {
      list: true,
      dark,
    });
    newList.forEach((l, index) => {
      const rgbStr = getRgbStr(l);
      document.body.style.setProperty(`--arcoblue-${index + 1}`, rgbStr);
    });
    uiStore.primaryColor = newColor || '';
  };
  useEffect(() => {
    setTheme(uiStore.primaryColor);
  }, [uiStore.primaryColor]);
  return (
    <>
      <div style={{ display: 'none' }}>
        {/* @ts-ignore */}
        <window.lyrCodeEditor.CodeEditor />
      </div>
      <Layout />
    </>
  );
};
