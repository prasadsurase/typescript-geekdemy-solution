import CommonUtils from './utils/common_utils';

let lines: string[] = CommonUtils.readFile('./input/input1.txt');

lines.forEach(line => {
  if(line.trim() !== '') {
    let data: string[] = line.split(' ');
    
    switch(data[0]) { 
      case 'ADD_PROGRAMME': { 
        break; 
      } 
      case 'APPLY_COUPON': {
        break; 
      } 
      case 'ADD_PRO_MEMBERSHIP': { 
        break;
      } 
      case 'PRINT_BILL': { 
        break;
      } 
      default: { 
        break; 
      } 
    } 
  }
});
