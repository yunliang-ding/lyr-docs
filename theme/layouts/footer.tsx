import { IconSoundFill } from '@arco-design/web-react/icon';
import Marquee from 'react-fast-marquee';

export default () => {
  return (
    <>
      <IconSoundFill style={{ color: 'rgb(var(--primary-6))' }} />
      <div style={{ width: 'calc(100%)', fontWeight: 'bold' }}>
        <Marquee pauseOnHover gradient={false} delay={2}>
          介绍：xxx消息通知
        </Marquee>
      </div>
    </>
  );
};
