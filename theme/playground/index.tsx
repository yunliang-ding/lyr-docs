import React, { useEffect, useMemo, useState } from 'react';
import { ResizeBox } from '@arco-design/web-react';
import MonacoEditor from './monaco-editor';
import { decode, babelParse, getUrlSearchParams } from 'lyr-extra';
import { mdRequire } from '../../.lyr/router';
import './index.less';

export default () => {
  const { params }: any = getUrlSearchParams(location.hash);
  const { tabs, code, source } = JSON.parse(decode(params));
  const [spin, setSpin] = useState(true);
  const [reload, setReload] = useState(Math.random());
  const [updateRequire] = useState({});
  const [innerCode] = useState({ value: code });
  const [innerSourceCode] = useState({ value: source });
  const [reset, setReset] = useState(Math.random());
  const Comp = useMemo(() => {
    return babelParse({
      code: innerCode.value,
      require: {
        ...mdRequire,
        ...updateRequire,
      },
      onRequire: (requireName: string) => {
        if (requireName.endsWith('.ts') || requireName.endsWith('.tsx')) {
          if (!tabs.includes(requireName)) {
            tabs.push(requireName);
          }
        }
      },
    });
  }, [reload]);
  useEffect(() => {
    innerCode.value = code;
    innerSourceCode.value = source;
    tabs.forEach((tab) => {
      delete updateRequire[tab];
    });
    setReload(Math.random());
  }, [reset]);
  useEffect(() => {
    setTimeout(() => {
      setSpin(false);
    });
  }, []);
  let VNode: any = null;
  try {
    VNode = Comp();
  } catch (error) {
    VNode = <pre style={{ color: 'red', margin: 0 }}>{String(error)}</pre>;
  }
  return (
    <div className="demos-playground">
      <ResizeBox.Split
        direction={'horizontal'}
        style={{
          width: '100vw',
          height: '100vh',
          border: '1px solid var(--color-border)',
        }}
        max={0.7}
        min={0.3}
        panes={[
          !spin && (
            <MonacoEditor
              tabs={tabs}
              code={innerCode}
              sourceCode={innerSourceCode}
              updateRequire={updateRequire}
              require={mdRequire}
              setReload={setReload}
              setReset={setReset}
            />
          ),
          <div key={reload}>{VNode}</div>,
        ]}
      />
    </div>
  );
};
