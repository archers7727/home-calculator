import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { HomePage } from './pages/Home';
import { FirstBuyPage } from './pages/FirstBuy';
import { TradeUpPage } from './pages/TradeUp';
import { CalculatorsPage } from './pages/calculators';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/first-buy" element={<FirstBuyPage />} />
          <Route path="/trade-up" element={<TradeUpPage />} />
          <Route path="/calculators/*" element={<CalculatorsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
