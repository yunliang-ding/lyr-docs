import { MarkdownViewer } from 'lyr-extra';
import uiStore from './store/ui';

export default (props: any) => {
  const { dark } = uiStore.useSnapshot();
  return <MarkdownViewer {...props} codeTheme={dark ? 'dark' : 'light'} />;
};
