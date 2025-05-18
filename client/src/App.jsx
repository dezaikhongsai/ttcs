import './styles/global.css';
import AppRoutes from './common/routes/AppRoutes';
import setupAxiosInterceptors from './utils/axiosInterceptor';

// Thiết lập interceptor
setupAxiosInterceptors();

function App() {
  return (
    <div className="app">
      <AppRoutes />
    </div>
  );
}

export default App;
