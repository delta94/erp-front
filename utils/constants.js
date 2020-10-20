import moment from 'moment';
import { UserOutlined, ContactsOutlined, DeploymentUnitOutlined } from '@ant-design/icons';

export const RESPONSE_OBJECT_STANDARD = {
  forbidden: false,
  found: false,
  serverError: false,
};

export const SINGLE_ENTITY_STATE_STANDARD = {
  data: {},
  loading: true,
  response: { ...RESPONSE_OBJECT_STANDARD },
};

export const ENTITY_STATE_STANDARD = {
  total: 0,
  data: [],
  filters: {},
  loading: false,
  response: { ...RESPONSE_OBJECT_STANDARD },
};

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const KEY = process.env.NEXT_PUBLIC_KEY || 'key';

export const SALT = process.env.NEXT_PUBLIC_SALT || 'salt';

export const COUNTRIES = [
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Åland Islands', code: 'AX' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'American Samoa', code: 'AS' },
  { name: 'AndorrA', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Anguilla', code: 'AI' },
  { name: 'Antarctica', code: 'AQ' },
  { name: 'Antigua and Barbuda', code: 'AG' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Aruba', code: 'AW' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbados', code: 'BB' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' },
  { name: 'Bermuda', code: 'BM' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Bouvet Island', code: 'BV' },
  { name: 'Brazil', code: 'BR' },
  { name: 'British Indian Ocean Territory', code: 'IO' },
  { name: 'Brunei Darussalam', code: 'BN' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Cameroon', code: 'CM' },
  { name: 'Canada', code: 'CA' },
  { name: 'Cape Verde', code: 'CV' },
  { name: 'Cayman Islands', code: 'KY' },
  { name: 'Central African Republic', code: 'CF' },
  { name: 'Chad', code: 'TD' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Christmas Island', code: 'CX' },
  { name: 'Cocos (Keeling) Islands', code: 'CC' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Comoros', code: 'KM' },
  { name: 'Congo', code: 'CG' },
  { name: 'Congo, The Democratic Republic of the', code: 'CD' },
  { name: 'Cook Islands', code: 'CK' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Cote D\'Ivoire', code: 'CI' },
  { name: 'Croatia', code: 'HR' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'Czech Republic', code: 'CZ' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Dominica', code: 'DM' },
  { name: 'Dominican Republic', code: 'DO' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Egypt', code: 'EG' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Equatorial Guinea', code: 'GQ' },
  { name: 'Eritrea', code: 'ER' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Falkland Islands (Malvinas)', code: 'FK' },
  { name: 'Faroe Islands', code: 'FO' },
  { name: 'Fiji', code: 'FJ' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'French Guiana', code: 'GF' },
  { name: 'French Polynesia', code: 'PF' },
  { name: 'French Southern Territories', code: 'TF' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambia', code: 'GM' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Gibraltar', code: 'GI' },
  { name: 'Greece', code: 'GR' },
  { name: 'Greenland', code: 'GL' },
  { name: 'Grenada', code: 'GD' },
  { name: 'Guadeloupe', code: 'GP' },
  { name: 'Guam', code: 'GU' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Guernsey', code: 'GG' },
  { name: 'Guinea', code: 'GN' },
  { name: 'Guinea-Bissau', code: 'GW' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Haiti', code: 'HT' },
  { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
  { name: 'Holy See (Vatican City State)', code: 'VA' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran, Islamic Republic Of', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Isle of Man', code: 'IM' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jersey', code: 'JE' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kiribati', code: 'KI' },
  { name: 'Korea, Democratic People\'S Republic of', code: 'KP' },
  { name: 'Korea, Republic of', code: 'KR' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Kyrgyzstan', code: 'KG' },
  { name: 'Lao People\'S Democratic Republic', code: 'LA' },
  { name: 'Latvia', code: 'LV' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' },
  { name: 'Libyan Arab Jamahiriya', code: 'LY' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Lithuania', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Macao', code: 'MO' },
  { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Mali', code: 'ML' },
  { name: 'Malta', code: 'MT' },
  { name: 'Marshall Islands', code: 'MH' },
  { name: 'Martinique', code: 'MQ' },
  { name: 'Mauritania', code: 'MR' },
  { name: 'Mauritius', code: 'MU' },
  { name: 'Mayotte', code: 'YT' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Micronesia, Federated States of', code: 'FM' },
  { name: 'Moldova, Republic of', code: 'MD' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Mongolia', code: 'MN' },
  { name: 'Montserrat', code: 'MS' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Netherlands Antilles', code: 'AN' },
  { name: 'New Caledonia', code: 'NC' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Niue', code: 'NU' },
  { name: 'Norfolk Island', code: 'NF' },
  { name: 'Northern Mariana Islands', code: 'MP' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palau', code: 'PW' },
  { name: 'Palestinian Territory, Occupied', code: 'PS' },
  { name: 'Panama', code: 'PA' },
  { name: 'Papua New Guinea', code: 'PG' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Pitcairn', code: 'PN' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Puerto Rico', code: 'PR' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Reunion', code: 'RE' },
  { name: 'Romania', code: 'RO' },
  { name: 'Russian Federation', code: 'RU' },
  { name: 'RWANDA', code: 'RW' },
  { name: 'Saint Helena', code: 'SH' },
  { name: 'Saint Kitts and Nevis', code: 'KN' },
  { name: 'Saint Lucia', code: 'LC' },
  { name: 'Saint Pierre and Miquelon', code: 'PM' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'San Marino', code: 'SM' },
  { name: 'Sao Tome and Principe', code: 'ST' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Senegal', code: 'SN' },
  { name: 'Serbia and Montenegro', code: 'CS' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' },
  { name: 'Solomon Islands', code: 'SB' },
  { name: 'Somalia', code: 'SO' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' },
  { name: 'Suriname', code: 'SR' },
  { name: 'Svalbard and Jan Mayen', code: 'SJ' },
  { name: 'Swaziland', code: 'SZ' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Syrian Arab Republic', code: 'SY' },
  { name: 'Taiwan, Province of China', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Tanzania, United Republic of', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Timor-Leste', code: 'TL' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tokelau', code: 'TK' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Trinidad and Tobago', code: 'TT' },
  { name: 'Tunisia', code: 'TN' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Turks and Caicos Islands', code: 'TC' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'United States Minor Outlying Islands', code: 'UM' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Viet Nam', code: 'VN' },
  { name: 'Virgin Islands, British', code: 'VG' },
  { name: 'Virgin Islands, U.S.', code: 'VI' },
  { name: 'Wallis and Futuna', code: 'WF' },
  { name: 'Western Sahara', code: 'EH' },
  { name: 'Yemen', code: 'YE' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' },
];

export const CLIENT_FIELD_TYPE = {
  WEBSITE: 'website',
  LINK: 'link',
  OTHER: 'other',
  REDDIT: 'reddit',
  LINKEDIN: 'linkedin',
};

export const EXTENSIONS = {
  'text/html': 'html',
  'text/css': 'css',
  'text/xml': 'xml',
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'application/x-javascript': 'js',
  'application/atom+xml': 'atom',
  'application/rss+xml': 'rss',
  'text/mathml': 'mml',
  'text/plain': 'txt',
  'text/vnd.sun.j2me.app-descriptor': 'jad',
  'text/vnd.wap.wml': 'wml',
  'text/x-component': 'htc',
  'image/png': 'png',
  'image/tiff': ['tif', 'tiff'],
  'image/vnd.wap.wbmp': 'wbmp',
  'image/x-icon': 'ico',
  'image/x-jng': 'jng',
  'image/x-ms-bmp': 'bmp',
  'image/svg+xml': 'svg',
  'image/webp': 'webp',
  'application/java-archive': ['jar', 'war', 'ear'],
  'application/mac-binhex40': ['hqx'],
  'application/msword': ['doc'],
  'application/pdf': ['pdf'],
  'application/postscript': ['ps', 'eps', 'ai'],
  'application/rtf': 'rtf',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.wap.wmlc': 'wmlc',
  'application/vnd.google-earth.kml+xml': 'kml',
  'application/vnd.google-earth.kmz': 'kmz',
  'application/x-7z-compressed': '7z',
  'application/x-cocoa': 'cco',
  'application/x-java-archive-diff': 'jardiff',
  'application/x-java-jnlp-file': 'jnlp',
  'application/x-makeself': 'run',
  'application/x-perl': ['pl', 'pm'],
  'application/x-pilot': ['prc', 'pdb'],
  'application/x-rar-compressed': 'rar',
  'application/x-redhat-package-manager': 'rpm',
  'application/x-sea': 'sea',
  'application/x-shockwave-flash': 'swf',
  'application/x-stuffit': 'sit',
  'application/x-tcl': ['tcl', 'tk'],
  'application/x-x509-ca-cert': ['der', 'pem', 'crt'],
  'application/x-xpinstall': 'xpi',
  'application/xhtml+xml': 'xhtml',
  'application/zip': 'zip',
  'application/octet-stream': ['bin', 'exe', 'dll', 'deb', 'dmg', 'eot', 'iso', 'img', 'msi', 'msp', 'msm'],
  'audio/midi': ['mid', 'midi', 'kar'],
  'audio/mpeg': 'mp3',
  'audio/ogg': 'ogg',
  'audio/x-realaudio': 'ra',
  'video/3gpp': ['3gpp', '3gp'],
  'video/mpeg': ['mpeg', 'mpg'],
  'video/quicktime': 'mov',
  'video/x-flv': 'flv',
  'video/x-mng': 'mng',
  'video/x-ms-asf': ['asx', 'asf'],
  'video/x-ms-wmv': 'wmv',
  'video/x-msvideo': 'avi',
  'video/mp4': ['mp4', 'mv4'],
};

export const URLS = {
  PHOTOS: '/photos',
};

export const ORIGIN_COLORS = {
  upwork: 'green',
  freelancer: 'geekblue',
  linkedin: 'blue',
  reddit: 'red',
  payoneer: 'orange',
};

export const STATUS_COLORS = {
  ongoing: 'processing',
  completed: 'success',
  failed: 'error',
  pending: 'warning',
};

export const PAYMENT_STATUS_COLORS = {
  upcoming: 'warning',
  'on the way': 'processing',
  deposited: 'success',
  withdrawn: 'default',
  failed: 'error',
  paid: 'success',
};

export const RESPONSE_MODE = {
  SIMPLIFIED: 'simplified',
  FULL: 'full',
  MINIMAL: 'minimal',
  ORIGINAL: 'original',
};

export const ACCOUNT_TYPE = {
  UPWORK: 'upwork',
  PAYONEER: 'payoneer',
};

export const CURRENCY_SYMBOLS = {
  usd: '$', // US Dollar
  uah: '₴', // Ukrainian Hryvnia
  eur: '€', // Euro
  crc: '₡', // Costa Rican Colón
  gbp: '£', // British Pound Sterling
  ils: '₪', // Israeli New Sheqel
  inr: '₹', // Indian Rupee
  jpy: '¥', // Japanese Yen
  krw: '₩', // South Korean Won
  ngn: '₦', // Nigerian Naira
  php: '₱', // Philippine Peso
  pln: 'zł', // Polish Zloty
  pyg: '₲', // Paraguayan Guarani
  thb: '฿', // Thai Baht
  vnd: '₫', // Vietnamese Dong
};

export const INVITATION_STATUS_COLORS = {
  pending: 'processing',
  accepted: 'success',
  expired: 'error',
};

export const USER_ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  DEVELOPER: 'developer',
};

export const USER_ROLE_COLORS = {
  [USER_ROLE.ADMIN]: 'cyan',
  [USER_ROLE.MANAGER]: 'magenta',
  [USER_ROLE.DEVELOPER]: 'geekblue',
};

export const USER_STATUS_COLORS = {
  'day off': 'cyan',
  active: 'green',
  vacation: 'geekblue',
  'on sick leave': 'red',
  suspended: 'orange',
  fired: 'volcano',
};

export const ACCOUNT_CATEGORY = {
  AVATAR: 'avatar',
  GENERAL: 'general',
  PROJECT: 'project',
};

export const ACCOUNT_CATEGORY_ICON = {
  [ACCOUNT_CATEGORY.AVATAR]: UserOutlined,
  [ACCOUNT_CATEGORY.GENERAL]: ContactsOutlined,
  [ACCOUNT_CATEGORY.PROJECT]: DeploymentUnitOutlined,
};

export const ACCOUNT_CATEGORY_COLOR = {
  [ACCOUNT_CATEGORY.AVATAR]: 'green',
  [ACCOUNT_CATEGORY.GENERAL]: 'magenta',
  [ACCOUNT_CATEGORY.PROJECT]: 'cyan',
};

export const WORKDAYS = (() => {
  const workingWeekdays = [1, 2, 3, 4, 5];
  let currentDay = moment().startOf('month');
  const monthEnd = moment().endOf('month');
  const businessDays = [];
  let monthComplete = false;

  while (!monthComplete) {
    if (workingWeekdays.includes(currentDay.day())) businessDays.push(currentDay.clone());

    currentDay = currentDay.add(1, 'day');

    if (currentDay.isAfter(monthEnd)) monthComplete = true;
  }

  return businessDays;
})();

export const HOURS_CAP = WORKDAYS.length * 8;

export const PERMISSION = {
  ALL: '*',
  VIEW_USERS: 'users.view',
  VIEW_DEVELOPERS: 'users[role:developer].view',
  VIEW_MANAGERS: 'users[role:manager].view',
  VIEW_ADMINS: 'users[role:admin].view',

  VIEW_PROJECTS: 'projects.view',
  VIEW_CLIENTS: 'clients.view',
  VIEW_RAISES: 'raises.view',
  VIEW_WORKTIME: 'worktime.view',
  VIEW_ACCOUNTS: 'accounts.view',

  VIEW_USER_PROFITS: 'users[info:profits].view',
  VIEW_USER_PROJECTS: 'users[info:projects].view',
  VIEW_USER_WORKTIME: 'users[info:worktime].view',
  VIEW_USER_ACCOUNTS: 'users[info:accounts].view',
  VIEW_USER_RAISES_PROJECT: 'users[info:raises[type:project]].view',
  VIEW_USER_RAISES_PERSONAL: 'users[info:raises[type:personal]].view',
  VIEW_USER_RATE: 'users[info:rate].view',

  VIEW_PROJECT_PROFITS: 'projects[info:profits].view',
  VIEW_PROJECT_WORKTIME: 'projects[info:worktime].view',
  VIEW_PROJECT_RAISES_PROJECT: 'projects[info:raises[type:project]].view',
  VIEW_PROJECT_RAISES_WEEKLY_LIMIT: 'projects[info:raises[type:weekly_limit]].view',

  VIEW_CLIENT_PAYMENTS: 'clients[info:payments].view',
  VIEW_CLIENT_PROJECTS: 'clients[info:projects].view',
  VIEW_CLIENT_ABOUT: 'clients[info:about].view',
  VIEW_CLIENT_LINKS: 'clients[info:links].view',

  ADD_USER_WORKTIME: 'users[info:worktime].create',
  ADD_USER_RAISES_PERSONAL: 'users[info:raises[type:personal]].create',
  ADD_USER_RAISES_PROJECT: 'users[info:raises[type:project]].create',

  ADD_INVITATIONS: 'invitations.create',
  ADD_WORKTIME: 'worktime.create',
  ADD_RAISES: 'raises.create',
  ADD_USERS: 'users.create',
  ADD_CLIENTS: 'clients.create',
  ADD_ACCOUNTS: 'accounts.create',
  ADD_PROJECTS: 'projects.create',
  ADD_PAYMENTS: 'payments.create',
  ADD_EXPENSES: 'expenses.create',

  EDIT_USERS: 'users.update',
  EDIT_CLIENTS: 'clients.update',
  EDIT_ACCOUNTS: 'accounts.update',
  EDIT_PROJECTS: 'projects.update',
  EDIT_PAYMENTS: 'payments.update',
  EDIT_EXPENSES: 'expenses.update',

  DELETE_ACCOUNTS: 'accounts.delete',
  DELETE_PAYMENTS: 'payments.delete',
};

export const PROGRESS_CARD_STYLE = {
  headStyle: {
    borderBottom: 'none',
    padding: '0 12px',
  },
  bodyStyle: {
    padding: '0 12px 12px 12px',
    display: 'flex',
    flexDirection: 'column',
  },
};

export const CARD_STYLE = {
  headStyle: {
    borderBottom: 'none',
    padding: '0 12px',
  },
  bodyStyle: {
    padding: '0 12px 12px 12px',
    display: 'flex',
    flexDirection: 'column',
  },
};
