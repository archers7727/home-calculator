import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { HomePage } from './pages/Home';
import { FirstBuyPage } from './pages/FirstBuy';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/first-buy" element={<FirstBuyPage />} />
          <Route path="/trade-up" element={<ComingSoon title="집 갈아타기" />} />
          <Route path="/calculators/*" element={<ComingSoon title="개별 계산기" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">{title}</h1>
      <p className="text-slate-600">준비 중입니다</p>
    </div>
  );
}

export default App;
