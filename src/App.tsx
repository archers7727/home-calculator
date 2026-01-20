import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { HomePage } from './pages/Home';
import { FirstBuyPage } from './pages/FirstBuy';
import { TradeUpPage } from './pages/TradeUp';
import { CalculatorsPage } from './pages/calculators';
import { HistoryPage } from './pages/History';
import { GlossaryPage } from './pages/Glossary';
import { FAQPage } from './pages/FAQ';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/first-buy" element={<FirstBuyPage />} />
          <Route path="/trade-up" element={<TradeUpPage />} />
          <Route path="/calculators/*" element={<CalculatorsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
