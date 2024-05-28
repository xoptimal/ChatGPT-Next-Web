
import dayjs from 'dayjs';
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime); // 相对时间



export default dayjs;
