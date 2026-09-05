import { 
  NewsArticle, 
  PlanningDocument, 
  Complaint, 
  AgendaEvent, 
  GalleryItem,
  InformationRequest,
  AgencySettings,
  IndicatorStat,
  AdminCredentials
} from '../types';
import { 
  initialArticles, 
  initialDocuments, 
  initialComplaints, 
  initialAgendas, 
  initialGallery,
  defaultAgencySettings,
  regionalIndicatorStats
} from '../data/mockData';

const KEYS = {
  ARTICLES: 'bapperida_pps_articles_v1',
  DOCUMENTS: 'bapperida_pps_documents_v1',
  COMPLAINTS: 'bapperida_pps_complaints_v1',
  AGENDAS: 'bapperida_pps_agendas_v1',
  GALLERY: 'bapperida_pps_gallery_v1',
  INFO_REQUESTS: 'bapperida_pps_info_requests_v1',
  ADMIN_AUTH: 'bapperida_pps_admin_auth_v1',
  ADMIN_CREDENTIALS: 'bapperida_pps_admin_credentials_v1',
  ADMIN_SESSION_USER: 'bapperida_pps_admin_session_user_v1',
  SETTINGS: 'bapperida_pps_settings_v1',
  INDICATORS: 'bapperida_pps_indicators_v1',
};

export const StorageService = {
  // Articles
  getArticles(): NewsArticle[] {
    try {
      const data = localStorage.getItem(KEYS.ARTICLES);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return initialArticles;
  },

  getNews(): NewsArticle[] {
    return this.getArticles();
  },

  saveArticles(articles: NewsArticle[]): void {
    try {
      localStorage.setItem(KEYS.ARTICLES, JSON.stringify(articles));
    } catch {
      // ignore
    }
  },

  addArticle(article: Omit<NewsArticle, 'id' | 'views'>): NewsArticle {
    const articles = this.getArticles();
    const newArticle: NewsArticle = {
      ...article,
      id: `art-${Date.now()}`,
      views: 1
    };
    articles.unshift(newArticle);
    this.saveArticles(articles);
    return newArticle;
  },

  updateArticle(updated: NewsArticle): void {
    const articles = this.getArticles().map(a => a.id === updated.id ? updated : a);
    this.saveArticles(articles);
  },

  deleteArticle(id: string): void {
    const articles = this.getArticles().filter(a => a.id !== id);
    this.saveArticles(articles);
  },

  incrementArticleViews(id: string): void {
    const articles = this.getArticles();
    const found = articles.find(a => a.id === id);
    if (found) {
      found.views = (found.views || 0) + 1;
      this.saveArticles(articles);
    }
  },

  // Documents
  getDocuments(): PlanningDocument[] {
    try {
      const data = localStorage.getItem(KEYS.DOCUMENTS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return initialDocuments;
  },

  saveDocuments(docs: PlanningDocument[]): void {
    try {
      localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
    } catch {
      // ignore
    }
  },

  addDocument(doc: Omit<PlanningDocument, 'id' | 'downloadCount' | 'uploadDate'>): PlanningDocument {
    const docs = this.getDocuments();
    const newDoc: PlanningDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      downloadCount: 0,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    docs.unshift(newDoc);
    this.saveDocuments(docs);
    return newDoc;
  },

  updateDocument(updated: PlanningDocument): void {
    const docs = this.getDocuments().map(d => d.id === updated.id ? updated : d);
    this.saveDocuments(docs);
  },

  deleteDocument(id: string): void {
    const docs = this.getDocuments().filter(d => d.id !== id);
    this.saveDocuments(docs);
  },

  incrementDocumentDownload(id: string): void {
    const docs = this.getDocuments();
    const found = docs.find(d => d.id === id);
    if (found) {
      found.downloadCount += 1;
      this.saveDocuments(docs);
    }
  },

  incrementDownload(id: string): void {
    this.incrementDocumentDownload(id);
  },

  // Complaints
  getComplaints(): Complaint[] {
    try {
      const data = localStorage.getItem(KEYS.COMPLAINTS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return initialComplaints;
  },

  saveComplaints(complaints: Complaint[]): void {
    try {
      localStorage.setItem(KEYS.COMPLAINTS, JSON.stringify(complaints));
    } catch {
      // ignore
    }
  },

  createComplaint(data: Omit<Complaint, 'id' | 'ticketNo' | 'status' | 'createdAt' | 'updatedAt'>): Complaint {
    const complaints = this.getComplaints();
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const ticketNo = `BAP-PPS-${yearMonth}-${randomSuffix}`;
    
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newComplaint: Complaint = {
      ...data,
      id: `comp-${Date.now()}`,
      ticketNo,
      status: 'Menunggu Verifikasi',
      createdAt: formattedDate,
      updatedAt: formattedDate
    };

    complaints.unshift(newComplaint);
    this.saveComplaints(complaints);
    return newComplaint;
  },

  findComplaintByTicket(ticketNo: string): Complaint | undefined {
    const complaints = this.getComplaints();
    return complaints.find(c => c.ticketNo.trim().toUpperCase() === ticketNo.trim().toUpperCase());
  },

  updateComplaintStatus(id: string, status: Complaint['status'], response?: string, responderName?: string): void {
    const complaints = this.getComplaints();
    const found = complaints.find(c => c.id === id);
    if (found) {
      found.status = status;
      if (response !== undefined) found.response = response;
      if (responderName !== undefined) found.responderName = responderName;
      const now = new Date();
      found.updatedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      this.saveComplaints(complaints);
    }
  },

  // Agendas
  getAgendas(): AgendaEvent[] {
    try {
      const data = localStorage.getItem(KEYS.AGENDAS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return initialAgendas;
  },

  saveAgendas(agendas: AgendaEvent[]): void {
    try {
      localStorage.setItem(KEYS.AGENDAS, JSON.stringify(agendas));
    } catch {
      // ignore
    }
  },

  addAgenda(agenda: Omit<AgendaEvent, 'id'>): AgendaEvent {
    const agendas = this.getAgendas();
    const newAgenda: AgendaEvent = {
      ...agenda,
      id: `ag-${Date.now()}`
    };
    agendas.unshift(newAgenda);
    this.saveAgendas(agendas);
    return newAgenda;
  },

  updateAgenda(updated: AgendaEvent): void {
    const agendas = this.getAgendas().map(a => a.id === updated.id ? updated : a);
    this.saveAgendas(agendas);
  },

  deleteAgenda(id: string): void {
    const agendas = this.getAgendas().filter(a => a.id !== id);
    this.saveAgendas(agendas);
  },

  deleteComplaint(id: string): void {
    const complaints = this.getComplaints().filter(c => c.id !== id);
    this.saveComplaints(complaints);
  },

  // Gallery
  getGallery(): GalleryItem[] {
    try {
      const data = localStorage.getItem(KEYS.GALLERY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return initialGallery;
  },

  saveGallery(items: GalleryItem[]): void {
    try {
      localStorage.setItem(KEYS.GALLERY, JSON.stringify(items));
    } catch {
      // ignore
    }
  },

  addGalleryItem(item: Omit<GalleryItem, 'id'>): GalleryItem {
    const gallery = this.getGallery();
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`
    };
    gallery.unshift(newItem);
    this.saveGallery(gallery);
    return newItem;
  },

  updateGalleryItem(updated: GalleryItem): void {
    const gallery = this.getGallery().map(g => g.id === updated.id ? updated : g);
    this.saveGallery(gallery);
  },

  deleteGalleryItem(id: string): void {
    const gallery = this.getGallery().filter(g => g.id !== id);
    this.saveGallery(gallery);
  },

  // Information Requests (PPID)
  getInfoRequests(): InformationRequest[] {
    try {
      const data = localStorage.getItem(KEYS.INFO_REQUESTS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [];
  },

  saveInfoRequests(reqs: InformationRequest[]): void {
    try {
      localStorage.setItem(KEYS.INFO_REQUESTS, JSON.stringify(reqs));
    } catch {
      // ignore
    }
  },

  addInfoRequest(req: Omit<InformationRequest, 'id' | 'requestNo' | 'status' | 'createdAt'>): InformationRequest {
    const list = this.getInfoRequests();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const reqNo = `PPID-PPS-${dateStr}-${Math.floor(100 + Math.random() * 900)}`;
    const newReq: InformationRequest = {
      ...req,
      id: `req-${Date.now()}`,
      requestNo: reqNo,
      status: 'Diterima',
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(newReq);
    this.saveInfoRequests(list);
    return newReq;
  },

  updateInfoRequestStatus(id: string, status: InformationRequest['status'], responseNote?: string): void {
    const list = this.getInfoRequests();
    const found = list.find(r => r.id === id);
    if (found) {
      found.status = status;
      if (responseNote !== undefined) found.responseNote = responseNote;
      this.saveInfoRequests(list);
    }
  },

  deleteInfoRequest(id: string): void {
    const list = this.getInfoRequests().filter(r => r.id !== id);
    this.saveInfoRequests(list);
  },

  // Agency Settings (Sambutan, Kontak, Link Eksternal)
  getAgencySettings(): AgencySettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (data) return { ...defaultAgencySettings, ...JSON.parse(data) };
    } catch {
      // ignore
    }
    return defaultAgencySettings;
  },

  saveAgencySettings(settings: AgencySettings): void {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  },

  // Regional Macro Indicators
  getIndicatorStats(): IndicatorStat[] {
    try {
      const data = localStorage.getItem(KEYS.INDICATORS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return regionalIndicatorStats;
  },

  saveIndicatorStats(stats: IndicatorStat[]): void {
    try {
      localStorage.setItem(KEYS.INDICATORS, JSON.stringify(stats));
    } catch {
      // ignore
    }
  },

  // Admin Auth & Credentials Management
  getDefaultAdminCredentials(): AdminCredentials {
    return {
      email: 'bapperidaprogram.pps@gmail.com',
      username: 'admin',
      passwordHash: 'BapperidaPPS#2025',
      name: 'Administrator BAPPERIDA PPS',
      role: 'Super Administrator',
      lastPasswordChangedAt: '2025-01-01T08:00:00.000Z'
    };
  },

  getAdminCredentials(): AdminCredentials {
    try {
      const data = localStorage.getItem(KEYS.ADMIN_CREDENTIALS);
      if (data) {
        return { ...this.getDefaultAdminCredentials(), ...JSON.parse(data) };
      }
    } catch {
      // ignore
    }
    return this.getDefaultAdminCredentials();
  },

  saveAdminCredentials(creds: AdminCredentials): void {
    try {
      localStorage.setItem(KEYS.ADMIN_CREDENTIALS, JSON.stringify(creds));
    } catch {
      // ignore
    }
  },

  isAdminLoggedIn(): boolean {
    try {
      return localStorage.getItem(KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  },

  getCurrentAdminUser(): AdminCredentials {
    try {
      const session = localStorage.getItem(KEYS.ADMIN_SESSION_USER);
      if (session) return JSON.parse(session);
    } catch {
      // ignore
    }
    return this.getAdminCredentials();
  },

  validateAdminLogin(identifier: string, passwordInput: string): { success: boolean; message: string; user?: AdminCredentials } {
    const creds = this.getAdminCredentials();
    const cleanId = identifier.trim().toLowerCase();
    const isEmailMatch = cleanId === creds.email.toLowerCase();
    const isUserMatch = cleanId === creds.username.toLowerCase() || cleanId === 'bapperida';

    if (!isEmailMatch && !isUserMatch) {
      return {
        success: false,
        message: 'Email atau username tidak terdaftar dalam sistem administrator.'
      };
    }

    if (passwordInput !== creds.passwordHash) {
      return {
        success: false,
        message: 'Kata sandi (password) yang Anda masukkan salah. Silakan coba lagi.'
      };
    }

    // Set logged in session
    this.setAdminLoggedIn(true, creds);

    return {
      success: true,
      message: 'Autentikasi berhasil! Mengalihkan ke Panel Administrator...',
      user: creds
    };
  },

  changeAdminPassword(oldPassword: string, newPassword: string): { success: boolean; message: string } {
    const creds = this.getAdminCredentials();

    if (oldPassword !== creds.passwordHash) {
      return {
        success: false,
        message: 'Kata sandi lama yang Anda masukkan tidak sesuai.'
      };
    }

    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        message: 'Kata sandi baru minimal harus terdiri dari 6 karakter.'
      };
    }

    if (newPassword === oldPassword) {
      return {
        success: false,
        message: 'Kata sandi baru tidak boleh sama persis dengan kata sandi lama.'
      };
    }

    const updatedCreds: AdminCredentials = {
      ...creds,
      passwordHash: newPassword,
      lastPasswordChangedAt: new Date().toISOString()
    };

    this.saveAdminCredentials(updatedCreds);
    localStorage.setItem(KEYS.ADMIN_SESSION_USER, JSON.stringify(updatedCreds));

    return {
      success: true,
      message: 'Kata sandi berhasil diperbarui. Harap simpan kata sandi baru Anda dengan aman.'
    };
  },

  resetAdminPasswordToDefault(): { success: boolean; message: string } {
    const defaults = this.getDefaultAdminCredentials();
    this.saveAdminCredentials(defaults);
    localStorage.setItem(KEYS.ADMIN_SESSION_USER, JSON.stringify(defaults));
    return {
      success: true,
      message: 'Kata sandi berhasil direset ke sandi bawaan (BapperidaPPS#2025).'
    };
  },

  setAdminLoggedIn(val: boolean, user?: AdminCredentials): void {
    try {
      if (val) {
        localStorage.setItem(KEYS.ADMIN_AUTH, 'true');
        if (user) {
          localStorage.setItem(KEYS.ADMIN_SESSION_USER, JSON.stringify(user));
        }
      } else {
        localStorage.removeItem(KEYS.ADMIN_AUTH);
        localStorage.removeItem(KEYS.ADMIN_SESSION_USER);
      }
    } catch {
      // ignore
    }
  },

  logout(): void {
    this.setAdminLoggedIn(false);
  },

  // Reset all local storage to default initial data
  resetAllToDefault(): void {
    try {
      Object.values(KEYS).forEach(k => {
        localStorage.removeItem(k);
      });
    } catch {
      // ignore
    }
  }
};
