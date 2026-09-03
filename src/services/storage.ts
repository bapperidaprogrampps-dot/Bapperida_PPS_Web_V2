import { 
  NewsArticle, 
  PlanningDocument, 
  Complaint, 
  AgendaEvent, 
  GalleryItem,
  InformationRequest 
} from '../types';
import { 
  initialArticles, 
  initialDocuments, 
  initialComplaints, 
  initialAgendas, 
  initialGallery 
} from '../data/mockData';

const KEYS = {
  ARTICLES: 'bapperida_pps_articles_v1',
  DOCUMENTS: 'bapperida_pps_documents_v1',
  COMPLAINTS: 'bapperida_pps_complaints_v1',
  AGENDAS: 'bapperida_pps_agendas_v1',
  GALLERY: 'bapperida_pps_gallery_v1',
  INFO_REQUESTS: 'bapperida_pps_info_requests_v1',
  ADMIN_AUTH: 'bapperida_pps_admin_auth_v1',
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

  deleteAgenda(id: string): void {
    const agendas = this.getAgendas().filter(a => a.id !== id);
    this.saveAgendas(agendas);
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
    try {
      localStorage.setItem(KEYS.INFO_REQUESTS, JSON.stringify(list));
    } catch {
      // ignore
    }
    return newReq;
  },

  // Admin Auth Status
  isAdminLoggedIn(): boolean {
    try {
      return localStorage.getItem(KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  },

  setAdminLoggedIn(val: boolean): void {
    try {
      if (val) {
        localStorage.setItem(KEYS.ADMIN_AUTH, 'true');
      } else {
        localStorage.removeItem(KEYS.ADMIN_AUTH);
      }
    } catch {
      // ignore
    }
  }
};
