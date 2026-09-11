import { 
  NewsArticle, 
  PlanningDocument, 
  Complaint, 
  AgendaEvent, 
  GalleryItem,
  InformationRequest,
  AgencySettings,
  IndicatorStat,
  AdminCredentials,
  EmployeeProfile
} from '../types';
import { 
  initialArticles, 
  initialDocuments, 
  initialComplaints, 
  initialAgendas, 
  initialGallery,
  defaultAgencySettings,
  regionalIndicatorStats,
  initialEmployees
} from '../data/mockData';
import { CentralSyncService } from './centralSyncService';

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
  EMPLOYEES: 'bapperida_pps_employees_v1',
  ADMIN_DISABLE_DEFAULT_CREDS: 'bapperida_pps_admin_disable_default_creds_v1',
};

// 1. Selalu keluar dari mode admin saat pertama masuk / refresh web
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem(KEYS.ADMIN_AUTH);
    localStorage.removeItem(KEYS.ADMIN_SESSION_USER);
  } catch (e) {
    // ignore
  }

  // 2. Pembersihan & reset semua pengaturan database / penyimpanan Hostinger
  try {
    const DB_SETTINGS_RESET_FLAG = 'bapperida_pps_db_config_reset_v2';
    if (!localStorage.getItem(DB_SETTINGS_RESET_FLAG)) {
      localStorage.removeItem('bapperida_pps_server_storage_config_v1');
      localStorage.removeItem('bapperida_last_server_sync');
      localStorage.removeItem('bapperida_pps_db_custom_config');
      localStorage.setItem(DB_SETTINGS_RESET_FLAG, 'true');
    }
  } catch (e) {
    // ignore
  }

  // 3. Pembersihan otomatis dummy data lawas di browser pengunjung
  try {
    const DUMMY_CLEANED_FLAG = 'bapperida_pps_dummy_data_purged_v2';
    if (!localStorage.getItem(DUMMY_CLEANED_FLAG)) {
      localStorage.setItem(KEYS.ARTICLES, JSON.stringify([]));
      localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify([]));
      localStorage.setItem(KEYS.COMPLAINTS, JSON.stringify([]));
      localStorage.setItem(KEYS.AGENDAS, JSON.stringify([]));
      localStorage.setItem(KEYS.GALLERY, JSON.stringify([]));
      localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify([]));
      localStorage.setItem(KEYS.INFO_REQUESTS, JSON.stringify([]));
      localStorage.setItem(DUMMY_CLEANED_FLAG, 'true');
    }
  } catch (e) {
    console.warn('Gagal membersihkan cache dummy data lokal:', e);
  }
}

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
      CentralSyncService.syncKeyToServer('articles', articles).catch(() => {});
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
      CentralSyncService.syncKeyToServer('documents', docs).catch(() => {});
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
      CentralSyncService.syncKeyToServer('complaints', complaints).catch(() => {});
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
      CentralSyncService.syncKeyToServer('agendas', agendas).catch(() => {});
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
      CentralSyncService.syncKeyToServer('gallery', items).catch(() => {});
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
      CentralSyncService.syncKeyToServer('info_requests', reqs).catch(() => {});
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
      if (data) {
        const parsed = JSON.parse(data);
        // Sanitize: Jika heroVideoServerUrl adalah blob URL usang, jangan gunakan sebagai server URL
        if (parsed.heroVideoServerUrl && typeof parsed.heroVideoServerUrl === 'string' && parsed.heroVideoServerUrl.startsWith('blob:')) {
          delete parsed.heroVideoServerUrl;
        }
        return { ...defaultAgencySettings, ...parsed };
      }
    } catch {
      // ignore
    }
    return defaultAgencySettings;
  },

  saveAgencySettings(settings: AgencySettings): void {
    try {
      const clean = { ...settings };
      // Jangan pernah simpan blob: URL yang hanya hidup satu sesi ke penyimpanan permanen
      if (clean.heroVideoServerUrl && typeof clean.heroVideoServerUrl === 'string' && clean.heroVideoServerUrl.startsWith('blob:')) {
        delete clean.heroVideoServerUrl;
      }
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(clean));
      CentralSyncService.syncKeyToServer('settings', clean).catch(() => {});
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
      CentralSyncService.syncKeyToServer('indicators', stats).catch(() => {});
    } catch {
      // ignore
    }
  },

  // Admin Auth & Credentials Management
  getDefaultAdminCredentials(): AdminCredentials {
    return {
      email: 'bapperidaprogram.pps@gmail.com',
      username: 'admin',
      passwordHash: 'Tehkotak_213',
      name: 'Administrator Utama BAPPERIDA PPS',
      role: 'Super Administrator Tunggal',
      lastPasswordChangedAt: '2025-01-01T08:00:00.000Z',
      isPasswordChanged: false,
      singleAdminOnly: true
    };
  },

  getAdminCredentials(): AdminCredentials {
    try {
      const data = localStorage.getItem(KEYS.ADMIN_CREDENTIALS);
      if (data) {
        const parsed = JSON.parse(data);
        // Migrasi otomatis jika sebelumnya masih menggunakan default lama BapperidaPPS#2025
        if (parsed.passwordHash === 'BapperidaPPS#2025' || (!parsed.isPasswordChanged && parsed.passwordHash !== 'Tehkotak_213')) {
          parsed.passwordHash = 'Tehkotak_213';
          localStorage.setItem(KEYS.ADMIN_CREDENTIALS, JSON.stringify(parsed));
        }
        return { ...this.getDefaultAdminCredentials(), ...parsed };
      }
    } catch {
      // ignore
    }
    return this.getDefaultAdminCredentials();
  },

  isPasswordChanged(): boolean {
    const creds = this.getAdminCredentials();
    return Boolean(creds.isPasswordChanged && creds.passwordHash !== 'Tehkotak_213');
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
        message: 'Akses Ditolak: Sistem hanya mendukung 1 akun Administrator resmi (bapperidaprogram.pps@gmail.com). Email atau username yang Anda masukkan tidak terdaftar.'
      };
    }

    // Periksa jika password telah diubah dan pengguna mencoba menggunakan password default lama
    const isChanged = this.isPasswordChanged();
    if (passwordInput !== creds.passwordHash) {
      if (isChanged && (passwordInput === 'Tehkotak_213' || passwordInput === 'BapperidaPPS#2025' || passwordInput === 'admin')) {
        return {
          success: false,
          message: 'Akses Ditolak: Kata sandi bawaan (default) sudah tidak berlaku karena Administrator Utama telah memperbarui kata sandi. Pengguna lain tidak dapat masuk selain menggunakan kata sandi yang telah diubah.'
        };
      }

      return {
        success: false,
        message: 'Kata sandi salah. Portal Bapperida hanya memiliki 1 administrator dan akses terkunci pada kata sandi terbaru yang telah ditetapkan.'
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
      lastPasswordChangedAt: new Date().toISOString(),
      isPasswordChanged: true,
      singleAdminOnly: true
    };

    this.saveAdminCredentials(updatedCreds);
    localStorage.setItem(KEYS.ADMIN_SESSION_USER, JSON.stringify(updatedCreds));

    // Kunci bantuan kredensial default di layar login secara otomatis demi privasi admin
    this.setDefaultCredentialsDisabled(true);

    return {
      success: true,
      message: 'Kata sandi berhasil diperbarui! Sistem kini terkunci hanya untuk 1 admin dengan kata sandi baru Anda. Pengguna lain tidak akan dapat masuk menggunakan sandi lama.'
    };
  },

  resetAdminPasswordToDefault(): { success: boolean; message: string } {
    const defaults = this.getDefaultAdminCredentials();
    this.saveAdminCredentials(defaults);
    localStorage.setItem(KEYS.ADMIN_SESSION_USER, JSON.stringify(defaults));
    this.setDefaultCredentialsDisabled(true);
    return {
      success: true,
      message: 'Kata sandi berhasil direset ke sandi bawaan (Tehkotak_213).'
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

  resetDatabaseAndStorageSettings(): void {
    try {
      localStorage.removeItem('bapperida_pps_server_storage_config_v1');
      localStorage.removeItem('bapperida_last_server_sync');
      localStorage.removeItem('bapperida_pps_db_custom_config');
    } catch (e) {
      console.warn('Gagal mereset pengaturan database lokal:', e);
    }
  },

  // Toggle Default Credentials on Admin Login Screen
  isDefaultCredentialsDisabled(): boolean {
    try {
      return localStorage.getItem(KEYS.ADMIN_DISABLE_DEFAULT_CREDS) === 'true';
    } catch {
      return false;
    }
  },

  setDefaultCredentialsDisabled(disabled: boolean): void {
    try {
      if (disabled) {
        localStorage.setItem(KEYS.ADMIN_DISABLE_DEFAULT_CREDS, 'true');
      } else {
        localStorage.removeItem(KEYS.ADMIN_DISABLE_DEFAULT_CREDS);
      }
    } catch {
      // ignore
    }
  },

  // Employees (Profil Pegawai)
  getEmployees(): EmployeeProfile[] {
    try {
      const data = localStorage.getItem(KEYS.EMPLOYEES);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return initialEmployees;
  },

  saveEmployees(employees: EmployeeProfile[]): void {
    try {
      localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
      CentralSyncService.syncKeyToServer('employees', employees).catch(() => {});
    } catch {
      // ignore
    }
  },

  addEmployee(emp: Omit<EmployeeProfile, 'id'>): EmployeeProfile {
    const list = this.getEmployees();
    const newEmp: EmployeeProfile = {
      ...emp,
      id: `emp-${Date.now()}`
    };
    list.push(newEmp);
    this.saveEmployees(list);
    return newEmp;
  },

  updateEmployee(updated: EmployeeProfile): void {
    const list = this.getEmployees().map(e => e.id === updated.id ? updated : e);
    this.saveEmployees(list);
  },

  deleteEmployee(id: string): void {
    const list = this.getEmployees().filter(e => e.id !== id);
    this.saveEmployees(list);
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
