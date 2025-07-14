// Setup para tests unitarios
import '@testing-library/jest-dom';

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock de console para evitar logs en tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock de ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock de IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock de fetch
global.fetch = jest.fn();

// Mock de SweetAlert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
  close: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
}));

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/test' }),
  useParams: () => ({}),
}));

// Mock de react-icons
jest.mock('react-icons/fa', () => ({
  FaUser: () => 'FaUser',
  FaEnvelope: () => 'FaEnvelope',
  FaPhone: () => 'FaPhone',
  FaMapMarkerAlt: () => 'FaMapMarkerAlt',
  FaCalendarAlt: () => 'FaCalendarAlt',
  FaCheck: () => 'FaCheck',
  FaTimes: () => 'FaTimes',
  FaEdit: () => 'FaEdit',
  FaTrash: () => 'FaTrash',
  FaEye: () => 'FaEye',
  FaDownload: () => 'FaDownload',
  FaSearch: () => 'FaSearch',
  FaChevronLeft: () => 'FaChevronLeft',
  FaChevronRight: () => 'FaChevronRight',
}));

jest.mock('react-icons/tb', () => ({
  TbLayoutGrid: () => 'TbLayoutGrid',
  TbUser: () => 'TbUser',
  TbUsers: () => 'TbUsers',
  TbBriefcase: () => 'TbBriefcase',
  TbCalendar: () => 'TbCalendar',
  TbCreditCard: () => 'TbCreditCard',
  TbListDetails: () => 'TbListDetails',
  TbBox: () => 'TbBox',
  TbSettings: () => 'TbSettings',
  TbCircleCheck: () => 'TbCircleCheck',
  TbUserSquareRounded: () => 'TbUserSquareRounded',
}));

jest.mock('react-icons/fi', () => ({
  FiChevronRight: () => 'FiChevronRight',
  FiChevronLeft: () => 'FiChevronLeft',
}));

// Mock de file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

// Mock de xlsx
jest.mock('xlsx', () => ({
  utils: {
    book_new: jest.fn(),
    json_to_sheet: jest.fn(),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

// Mock de jszip
jest.mock('jszip', () => {
  return jest.fn().mockImplementation(() => ({
    file: jest.fn().mockReturnThis(),
    generateAsync: jest.fn().mockResolvedValue('mock-zip-content'),
  }));
});

// Mock de chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  ArcElement: jest.fn(),
  BarElement: jest.fn(),
}));

// Mock de react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Line: () => 'Line',
  Bar: () => 'Bar',
  Pie: () => 'Pie',
  Doughnut: () => 'Doughnut',
}));

// Mock de @fullcalendar/react
jest.mock('@fullcalendar/react', () => {
  return function MockFullCalendar() {
    return 'FullCalendar';
  };
});

// Mock de @fullcalendar/daygrid
jest.mock('@fullcalendar/daygrid', () => 'dayGridPlugin');

// Mock de @fullcalendar/timegrid
jest.mock('@fullcalendar/timegrid', () => 'timeGridPlugin');

// Mock de @fullcalendar/interaction
jest.mock('@fullcalendar/interaction', () => 'interactionPlugin');

// Mock de @headlessui/react
jest.mock('@headlessui/react', () => ({
  Dialog: ({ children, open }) => open ? children : null,
  Transition: ({ children, show }) => show ? children : null,
}));

// Configuración global para tests
beforeEach(() => {
  // Limpiar todos los mocks antes de cada test
  jest.clearAllMocks();
  
  // Resetear localStorage mock
  localStorageMock.getItem.mockReturnValue(null);
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});

afterEach(() => {
  // Limpiar después de cada test
  jest.clearAllMocks();
}); 