import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { ArticleDetailModal } from './components/ArticleDetailModal';

// Views
import { HomeView } from './views/HomeView';
import { ProfileView } from './views/ProfileView';
import { DocumentsView } from './views/DocumentsView';
import { NewsView } from './views/NewsView';
import { PublicServicesView } from './views/PublicServicesView';
import { ComplaintsView } from './views/ComplaintsView';
import { AgendaView } from './views/AgendaView';
import { StatisticsView } from './views/StatisticsView';
import { GalleryView } from './views/GalleryView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';
import { AdminLoginView } from './views/AdminLoginView';

// Services & Types
import { StorageService } from './services/storage';
import { CentralSyncService } from './services/centralSyncService';
import { ScrollProgressBar, ScrollToTopButton } from './components/ScrollAnimations';
import { 
  ActivePage, 
  PlanningDocument, 
  NewsArticle, 
  Complaint, 
  AgendaEvent, 
  GalleryItem 
} from './types';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('beranda');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    // Selalu keluar dari mode admin saat pertama kali masuk web
    StorageService.logout();
    return false;
  });

  // Data state
  const [documents, setDocuments] = useState<PlanningDocument[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [agendas, setAgendas] = useState<AgendaEvent[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<PlanningDocument | null>(null);
  const [readingArticle, setReadingArticle] = useState<NewsArticle | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load and sync data
  const loadData = useCallback(() => {
    setDocuments(StorageService.getDocuments());
    setNews(StorageService.getNews());
    setComplaints(StorageService.getComplaints());
    setAgendas(StorageService.getAgendas());
    setGallery(StorageService.getGallery());
  }, []);

  useEffect(() => {
    loadData();
    CentralSyncService.init();

    const handleSyncUpdate = () => {
      loadData();
    };

    window.addEventListener('bapperida:data-synced', handleSyncUpdate);
    return () => {
      window.removeEventListener('bapperida:data-synced', handleSyncUpdate);
    };
  }, [loadData]);

  // Scroll to top on page switch
  const handlePageChange = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Administrator logout handler
  const handleAdminLogout = () => {
    StorageService.logout();
    setIsAdminLoggedIn(false);
    handlePageChange('beranda');
    setToastMessage('Anda telah berhasil keluar dari sesi administrator.');
  };

  // Document download handler
  const handleDownloadDocument = (doc: PlanningDocument) => {
    StorageService.incrementDownload(doc.id);
    setDocuments(StorageService.getDocuments());

    // Jika berkas asli telah diunggah ke server Hostinger
    if (doc.fileUrl) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.target = '_blank';
      link.download = doc.fileUrl.split('/').pop() || `${doc.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMessage(`Mengunduh berkas "${doc.title}" dari server Hostinger.`);
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    // Generate real readable text-based document summary download
    const content = `PEMERINTAH PROVINSI PAPUA SELATAN
BADAN PERENCANAAN PEMBANGUNAN DAERAH, RISET DAN INOVASI DAERAH (BAPPERIDA)
Komp. Pusat Pemerintahan Terpadu, Salor, Merauke - Papua Selatan
Email: bapperidaprogram.pps@gmail.com
================================================================================
DOKUMEN PERENCANAAN PEMBANGUNAN DAERAH RESMI
Kategori     : ${doc.category}
Judul        : ${doc.title}
Tahun Rencana: ${doc.year}
Dasar Hukum  : ${doc.legalBasis}
Format File  : ${doc.fileFormat} (${doc.fileSize})
Tanggal Rilis: ${doc.uploadDate}
================================================================================

RINGKASAN EKSEKUTIF / LATAR BELAKANG:
${doc.description}

LINGKUP PRIORITAS PEMBANGUNAN DAERAH PAPUA SELATAN:
1. Peningkatan Aksesibilitas Transportasi Antar-Kabupaten (Merauke - Boven Digoel - Mappi - Asmat).
2. Swasembada Pangan Sentra Pertanian Terpadu Padi Merauke dan Hilirisasi Sagu Mappi.
3. Peningkatan Kualitas Layanan Dasar Pendidikan & Kesehatan Orang Asli Papua (OAP).
4. Penurunan Angka Kemiskinan dan Stunting di Wilayah Pesisir dan Pedalaman.
5. Pemanfaatan Riset BRIDA dalam Tata Kelola Ekosistem Gambut dan Hutan Adat Anim Ha.

Dokumen ini sah dan dipublikasikan secara terbuka untuk kepentingan publik 
berdasarkan Undang-Undang Republik Indonesia Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik.

Salor, Merauke
Bapperida Provinsi Papua Selatan
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/[/\\?%*:|"<>]/g, '_')}_BAPPERIDA_PPS.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage(`Dokumen "${doc.title}" berhasil diunduh.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Article selection handler (increments views)
  const handleSelectArticle = (art: NewsArticle) => {
    StorageService.incrementArticleViews(art.id);
    setNews(StorageService.getNews());
    setReadingArticle(art);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-300 selection:text-slate-900">
      {/* Scroll Progress Bar at very top */}
      <ScrollProgressBar />

      {/* Floating Scroll to Top button */}
      <ScrollToTopButton />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        activePage={activePage}
        setActivePage={handlePageChange}
        onOpenSearch={() => setIsSearchOpen(true)}
        isAdmin={isAdminLoggedIn}
        onLogout={handleAdminLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activePage === 'beranda' && (
          <HomeView
            setActivePage={handlePageChange}
            articles={news}
            documents={documents}
            agendas={agendas}
            onSelectDocument={setPreviewDoc}
            onSelectArticle={handleSelectArticle}
          />
        )}

        {activePage === 'profil' && <ProfileView />}

        {activePage === 'dokumen' && (
          <DocumentsView
            documents={documents}
            onSelectDocument={setPreviewDoc}
            onDownloadDocument={handleDownloadDocument}
          />
        )}

        {activePage === 'berita' && (
          <NewsView
            articles={news}
            onSelectArticle={handleSelectArticle}
          />
        )}

        {activePage === 'layanan' && <PublicServicesView />}

        {activePage === 'pengaduan' && (
          <ComplaintsView
            complaints={complaints}
            onComplaintCreated={() => loadData()}
          />
        )}

        {activePage === 'agenda' && <AgendaView agendas={agendas} />}

        {activePage === 'data-statistik' && <StatisticsView />}

        {activePage === 'galeri' && <GalleryView gallery={gallery} />}

        {activePage === 'kontak' && <ContactView />}

        {activePage === 'admin' && (
          isAdminLoggedIn ? (
            <AdminView
              documents={documents}
              news={news}
              complaints={complaints}
              agendas={agendas}
              gallery={gallery}
              onDataChanged={loadData}
              onLogout={handleAdminLogout}
            />
          ) : (
            <AdminLoginView
              onLoginSuccess={() => {
                setIsAdminLoggedIn(true);
                setToastMessage('Autentikasi berhasil! Selamat datang di Panel Administrator BAPPERIDA.');
              }}
              setActivePage={handlePageChange}
            />
          )
        )}
      </main>

      {/* Footer */}
      <Footer 
        setActivePage={handlePageChange} 
        isAdmin={isAdminLoggedIn}
        onLogout={handleAdminLogout}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        documents={documents}
        articles={news}
        agendas={agendas}
        onSelectDocument={setPreviewDoc}
        onSelectArticle={handleSelectArticle}
        setActivePage={handlePageChange}
      />

      {/* Document Detail / Preview Modal */}
      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onDownload={handleDownloadDocument}
      />

      {/* News Article Reader Modal */}
      <ArticleDetailModal
        article={readingArticle}
        onClose={() => setReadingArticle(null)}
      />
    </div>
  );
}
