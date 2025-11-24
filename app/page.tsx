'use client';
import React, { useState, useEffect } from 'react';
import { Share2, TrendingUp, Zap, Clock, Heart, MessageCircle, Bookmark, Home, Settings, FileText, BarChart3, Plus, Edit2, Trash2, Eye, Lock, LogOut } from 'lucide-react';

// Type definitions
interface Article {
  id: number;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  readTime: string;
  views: number;
  createdAt: number;
}

interface FormData {
  title: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  readTime: string;
}

interface AdSlotProps {
  format: string;
  width?: string;
  height?: string;
  className?: string;
}

// --- Re-usable Components ---

const AdSlot = ({ format, width, height, className = "" }: AdSlotProps) => (
  <div 
    className={`border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}
    style={{ width: width || '100%', height: height || '250px', minHeight: height }}
  >
    <div className="text-center p-4">
      <div className="text-gray-300 mb-2">
        <Zap size={28} className="mx-auto" />
      </div>
      <p className="text-xs text-gray-400 font-medium">{format}</p>
      <p className="text-xs text-gray-300">Advertisement</p>
    </div>
  </div>
);


// --- Frontend Components ---

const HomePage = ({ articles, setSelectedArticle, incrementViews }: { articles: Article[], setSelectedArticle: (article: Article) => void, incrementViews: (id: number) => void }) => (
  <div className="space-y-8">
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">Portal Informasi & Tips Terkini</h1>
        <p className="text-xl text-blue-100">Dapatkan informasi terbaru tentang bisnis, teknologi, dan lifestyle</p>
      </div>
    </div>

    <div className="flex justify-center">
      <AdSlot format="Leaderboard Banner (728x90)" width="728px" height="90px" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map((article) => (
        <div 
          key={article.id}
          onClick={() => {
            setSelectedArticle(article);
            incrementViews(article.id);
          }}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
        >
          <div className="relative h-48 overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {article.category}
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              {article.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  {article.readTime}
                </span>
                <span className="flex items-center">
                  <Eye size={14} className="mr-1" />
                  {article.views || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="flex justify-center mt-8">
      <AdSlot format="Banner Ad (728x90)" width="728px" height="90px" />
    </div>
  </div>
);

const ArticleDetail = ({ article, setSelectedArticle, articles, incrementViews }: { article: Article, setSelectedArticle: (article: Article | null) => void, articles: Article[], incrementViews: (id: number) => void }) => (
  <div className="space-y-6">
    <button 
      onClick={() => setSelectedArticle(null)}
      className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
    >
      ← Kembali ke Beranda
    </button>

    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <img 
        src={article.image} 
        alt={article.title}
        className="w-full h-96 object-cover"
      />
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {article.category}
          </span>
          <span className="text-gray-500 text-sm flex items-center">
            <Clock size={14} className="mr-1" />
            {article.readTime}
          </span>
          <span className="text-gray-500 text-sm flex items-center">
            <Eye size={14} className="mr-1" />
            {article.views || 0} views
          </span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-6">{article.title}</h1>
        
        <div className="flex items-center space-x-6 pb-6 border-b">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Heart size={20} />
            <span>Like</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Share2 size={20} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>

    <div className="flex justify-center">
      <AdSlot format="Banner Ad (728x90)" width="728px" height="90px" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-8">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {article.content}
          </div>
        </div>

        <div className="my-8 flex justify-center">
          <AdSlot format="Large Rectangle (336x280)" width="336px" height="280px" />
        </div>
      </div>

      <div className="space-y-6">
        <AdSlot format="Half Page (300x600)" width="300px" height="600px" />
        
        {articles.filter(a => a.id !== article.id).length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Artikel Terkait</h3>
            <div className="space-y-4">
              {articles.filter(a => a.id !== article.id).slice(0, 2).map(related => (
                <div 
                  key={related.id}
                  onClick={() => {
                    setSelectedArticle(related);
                    incrementViews(related.id);
                  }}
                  className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                >
                  <h4 className="font-semibold text-gray-800 mb-1 text-sm">{related.title}</h4>
                  <p className="text-xs text-gray-500">{related.readTime} • {related.views || 0} views</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const FrontendView = ({ loading, selectedArticle, setSelectedArticle, setIsAdmin, articles, incrementViews }: { loading: boolean, selectedArticle: Article | null, setSelectedArticle: (article: Article | null) => void, setIsAdmin: (val: boolean | null) => void, articles: Article[], incrementViews: (id: number) => void }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <AdSlot format="Social Bar (Sticky)" width="100%" height="60px" />
        </div>
      </div>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => setSelectedArticle(null)}
              className="cursor-pointer"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InfoPortal
              </h1>
              <p className="text-sm text-gray-500 mt-1">Your Daily Source of Information</p>
            </div>
            <button
              onClick={() => setIsAdmin(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Admin →
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : selectedArticle ? (
          <ArticleDetail article={selectedArticle} setSelectedArticle={setSelectedArticle} articles={articles} incrementViews={incrementViews} />
        ) : (
          <HomePage articles={articles} setSelectedArticle={setSelectedArticle} incrementViews={incrementViews} />
        )}
      </main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-gray-400">© 2024 InfoPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};


// --- Admin Components ---

const AdminLogin = ({ password, setPassword, handleLogin, setIsAdmin }: { password: string, setPassword: (val: string) => void, handleLogin: () => void, setIsAdmin: (val: boolean | null) => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Lock size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
        <p className="text-gray-500 mt-2">Masukkan password untuk akses dashboard</p>
      </div>
      <div className="space-y-4">
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan password admin"
          />
          <p className="text-xs text-black mt-2">Default: admin123</p>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Login
        </button>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={() => setIsAdmin(false)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          ← Kembali ke Frontend
        </button>
      </div>
    </div>
  </div>
);

const AdminDashboard = (props: {
  handleLogout: () => void,
  activeTab: string,
  setActiveTab: (tab: string) => void,
  showArticleForm: boolean,
  setShowArticleForm: (show: boolean) => void,
  articles: Article[],
  editingArticle: Article | null,
  setEditingArticle: (article: Article | null) => void,
  formData: FormData,
  setFormData: (data: FormData) => void,
  handleEditArticle: (article: Article) => void,
  handleDeleteArticle: (id: number) => void,
  handleSubmitArticle: () => void
}) => {
  const {
    handleLogout,
    activeTab,
    setActiveTab,
    showArticleForm,
    setShowArticleForm,
    articles,
    editingArticle,
    setEditingArticle,
    formData,
    setFormData,
    handleEditArticle,
    handleDeleteArticle,
    handleSubmitArticle
  } = props;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <BarChart3 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Kelola konten & monitor performa</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {[ 
              { id: 'articles', label: 'Artikel', icon: FileText },
              { id: 'stats', label: 'Statistik', icon: BarChart3 },
              { id: 'settings', label: 'Pengaturan', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${ 
                  activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'articles' && (
          <div>
            {!showArticleForm ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Kelola Artikel</h2>
                  <button
                    onClick={() => setShowArticleForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Tambah Artikel</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {articles.map(article => (
                    <div key={article.id} className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6">
                      <img src={article.image} alt={article.title} className="w-32 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{article.category} • {article.readTime} • {article.views || 0} views</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditArticle(article)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-black mb-6">
                  {editingArticle ? 'Edit Artikel' : 'Tambah Artikel Baru'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-black font-medium mb-2">Judul</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-2">Kategori</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-2">URL Gambar</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-2">Excerpt (Ringkasan)</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-2">Konten Artikel</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      rows={10}
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-2">Waktu Baca</label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="5 min"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSubmitArticle}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {editingArticle ? 'Update Artikel' : 'Simpan Artikel'}
                    </button>
                    <button
                      onClick={() => {
                        setShowArticleForm(false);
                        setEditingArticle(null);
                        setFormData({ title: '', category: '', image: '', excerpt: '', content: '', readTime: '5 min' });
                      }}
                      className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Statistik</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Total Views</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {articles.reduce((sum, a) => sum + (a.views || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <Eye size={32} className="text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Total Artikel</p>
                    <p className="text-3xl font-bold text-gray-800">{articles.length}</p>
                  </div>
                  <FileText size={32} className="text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Avg Views/Artikel</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {articles.length > 0 ? Math.round(articles.reduce((sum, a) => sum + (a.views || 0), 0) / articles.length) : 0}
                    </p>
                  </div>
                  <TrendingUp size={32} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Informasi Sistem</h3>
                <p className="text-sm text-gray-600">Storage: Menggunakan persistent storage (localStorage)</p>
                <p className="text-sm text-gray-600">Data tersimpan otomatis</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Password Admin</h3>
                <p className="text-sm text-gray-600">Password default: admin123</p>
                <p className="text-sm text-gray-600">Untuk keamanan, ubah password di production</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


// --- Main App Component ---

const AdsterraApp = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(false);
  const [password, setPassword] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('articles');
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  // This state is not used in the refactored components, but keeping it to not break things if it was used somewhere else.
  const [stats, setStats] = useState({ views: 0, clicks: 0, earnings: 0 });

  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    image: '',
    excerpt: '',
    content: '',
    readTime: '5 min'
  });

  useEffect(() => {
    loadArticles();
    loadStats();
  }, []);

  const loadArticles = () => {
    try {
      const result = localStorage.getItem('articles');
      if (result) {
        setArticles(JSON.parse(result));
      } else {
        const defaultArticles: Article[] = [
          {
            id: Date.now(),
            title: "10 Tips Menghasilkan Uang dari Internet untuk Pemula",
            category: "Bisnis Online",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
            excerpt: "Panduan lengkap untuk memulai bisnis online dan mendapatkan penghasilan dari rumah...",
            content: "Di era digital seperti sekarang, peluang untuk menghasilkan uang secara online semakin terbuka lebar. Banyak orang yang telah meraih kesuksesan finansial melalui internet.\n\nBeberapa cara yang bisa Anda coba:\n1. Affiliate Marketing\n2. Dropshipping\n3. Content Creation\n4. Freelancing\n5. Online Course\n\nKunci kesuksesan adalah konsistensi dan terus belajar. Jangan menyerah jika hasil belum terlihat dalam waktu singkat.",
            readTime: "5 min",
            views: 1250,
            createdAt: Date.now()
          }
        ];
        setArticles(defaultArticles);
        localStorage.setItem('articles', JSON.stringify(defaultArticles));
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    try {
      const result = localStorage.getItem('stats');
      if (result) {
        setStats(JSON.parse(result));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const saveArticles = (newArticles: Article[]) => {
    try {
      localStorage.setItem('articles', JSON.stringify(newArticles));
      setArticles(newArticles);
    } catch (error) {
      console.error('Error saving articles:', error);
      alert('Gagal menyimpan artikel');
    }
  };

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAdmin(true);
      setPassword('');
    } else {
      alert('Password salah!');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActiveTab('articles');
  };

  const handleSubmitArticle = () => {
    const articleData: Article = {
      ...formData,
      id: editingArticle ? editingArticle.id : Date.now(),
      views: editingArticle ? editingArticle.views : 0,
      createdAt: editingArticle ? editingArticle.createdAt : Date.now()
    };

    let newArticles: Article[];
    if (editingArticle) {
      newArticles = articles.map(a => a.id === editingArticle.id ? articleData : a);
    } else {
      newArticles = [articleData, ...articles];
    }

    saveArticles(newArticles);
    
    setShowArticleForm(false);
    setEditingArticle(null);
    setFormData({
      title: '',
      category: '',
      image: '',
      excerpt: '',
      content: '',
      readTime: '5 min'
    });
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      category: article.category,
      image: article.image,
      excerpt: article.excerpt,
      content: article.content,
      readTime: article.readTime
    });
    setShowArticleForm(true);
  };

  const handleDeleteArticle = (id: number) => {
    if (window.confirm('Yakin ingin menghapus artikel ini?')) {
      const newArticles = articles.filter(a => a.id !== id);
      saveArticles(newArticles);
    }
  };

  const incrementViews = (articleId: number) => {
    const newArticles = articles.map(a => 
      a.id === articleId ? { ...a, views: (a.views || 0) + 1 } : a
    );
    saveArticles(newArticles);
  };

  if (isAdmin === true) {
    return <AdminDashboard 
      handleLogout={handleLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      showArticleForm={showArticleForm}
      setShowArticleForm={setShowArticleForm}
      articles={articles}
      editingArticle={editingArticle}
      setEditingArticle={setEditingArticle}
      formData={formData}
      setFormData={setFormData}
      handleEditArticle={handleEditArticle}
      handleDeleteArticle={handleDeleteArticle}
      handleSubmitArticle={handleSubmitArticle}
    />; 
  }
  
  if (isAdmin === null) {
    return <AdminLogin 
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
      setIsAdmin={setIsAdmin}
    />;
  }

  return <FrontendView 
    loading={loading}
    selectedArticle={selectedArticle}
    setSelectedArticle={setSelectedArticle}
    setIsAdmin={setIsAdmin}
    articles={articles}
    incrementViews={incrementViews}
  />;
};

export default AdsterraApp;