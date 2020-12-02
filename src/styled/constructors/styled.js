
import constructWithOptions from './constructWithOptions';
import StyledComponent from '../models/StyledComponent';
import domElements from '../utils/domElements';

// constructWithOptions返回一个templateFunction，可以接受css样式
const styled = (tag) => constructWithOptions(StyledComponent, tag);

// Shorthands for all valid HTML Elements
// domElements是一个包含了所有原声html表签名和svg名的数组，此处对所有原声dom进行处理
domElements.forEach(domElement => {
  styled[domElement] = styled(domElement);
});

export default styled;
