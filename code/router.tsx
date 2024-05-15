import { MarkdownViewer } from 'lyr-extra';
import R from '../../docs/index.md';
import Componentsuser from '../../docs/components/user.md';
import Componentsgoodbod from '../../docs/components/good-bod.md';

export default [
  {
    "path": "/",
    "component": <MarkdownViewer content={R} />
  },
  {
    "path": "/components/user",
    "component": <MarkdownViewer content={Componentsuser} />
  },
  {
    "path": "/components/good-bod",
    "component": <MarkdownViewer content={Componentsgoodbod} />
  }
]