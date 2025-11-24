'use client';
import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Share2, TrendingUp, Zap, Clock, Heart, MessageCircle, Bookmark, Home, Settings, FileText, BarChart3, Plus, Edit2, Trash2, Eye, Lock, LogOut, Search } from 'lucide-react';

// --- TYPE DEFINITIONS ---

interface AdConfig {
    key: string;
    width: number;
    height: number;
}

interface PageScriptConfig {
    src: string;
    enabled: boolean;
}

interface AdConfigState {
    slots: { [key: string]: AdConfig };
    pageScripts: { [key: string]: PageScriptConfig };
}

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
  adConfig?: {
    articleRectangle?: AdConfig;
    articleSidebar?: AdConfig;
  }
}

interface FormData {
  title: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  readTime: string;
  articleRectangleKey?: string;
  articleSidebarKey?: string;
}

interface AdSlotProps {
  format: string;
  width?: string;
  height?: string;
  className?: string;
}

// --- RE-USABLE COMPONENTS ---

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

const AdsterraBanner = ({ adKey, width, height }: { adKey: string, width: number, height: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !adKey) return;

    if (container.children.length > 0) {
        container.innerHTML = '';
    }

    const scriptContainer = document.createElement('div');
    scriptContainer.setAttribute('data-ad-key', adKey);

    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.innerHTML = `
        atOptions = {
            'key' : '${adKey}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
        };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
    invokeScript.async = true;

    scriptContainer.appendChild(configScript);
    scriptContainer.appendChild(invokeScript);
    
    container.appendChild(scriptContainer);

  }, [adKey, width, height]);

  return <div key={adKey} ref={containerRef} style={{ width: `${width}px`, height: `${height}px`, display: 'inline-block' }} />;
};


// --- FRONTEND COMPONENTS ---

const HomePage = (props: { 
    articles: Article[], 
    setSelectedArticle: (article: Article | null) => void, 
    incrementViews: (id: number) => void, 
    selectedCategory: string | null, 
    setSelectedCategory: (category: string | null) => void, 
    searchQuery: string,
    adConfig: { [key: string]: AdConfig }
}) => {
  const { articles, setSelectedArticle, incrementViews, selectedCategory, setSelectedCategory, searchQuery, adConfig } = props;

  const articlesByCategory = selectedCategory 
    ? articles.filter(a => a.category === selectedCategory) 
    : articles;

  const articlesToDisplay = searchQuery
    ? articlesByCategory.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articlesByCategory;

  const leaderboardAd = adConfig.leaderboard;
  const footerBannerAd = adConfig.footerBanner;

  return (
    <div className="space-y-8">
      {!selectedCategory && !searchQuery && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Portal Informasi & Tips Terkini</h1>
            <p className="text-xl text-blue-100">Dapatkan informasi terbaru tentang bisnis, teknologi, dan lifestyle</p>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        {leaderboardAd && leaderboardAd.key ? (
          <AdsterraBanner adKey={leaderboardAd.key} width={leaderboardAd.width} height={leaderboardAd.height} />
        ) : (
          <AdSlot format="Leaderboard Banner (728x90)" width="728px" height="90px" />
        )}
      </div>

      {selectedCategory && (
        <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
                Showing articles in: <span className="text-blue-600">{selectedCategory}</span>
            </h2>
            <button onClick={() => setSelectedCategory(null)} className="text-sm font-semibold text-gray-600 hover:text-gray-800">
                Show All Articles
            </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articlesToDisplay.map((article) => (
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
              <div 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setSelectedCategory(article.category); 
                  setSelectedArticle(null); 
                }}
                className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-700 cursor-pointer transition-colors"
              >
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

      {articlesToDisplay.length === 0 && (
        <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
        </div>
      )}

      <div className="flex justify-center mt-8">
        {footerBannerAd && footerBannerAd.key ? (
          <AdsterraBanner adKey={footerBannerAd.key} width={footerBannerAd.width} height={footerBannerAd.height} />
        ) : (
          <AdSlot format="Banner Ad (728x90)" width="728px" height="90px" />
        )}
      </div>
    </div>
  );
};

const ArticleDetail = (props: { 
  article: Article, 
  setSelectedArticle: (article: Article | null) => void, 
  articles: Article[], 
  incrementViews: (id: number) => void, 
  setSelectedCategory: (category: string | null) => void,
  adConfig: { [key: string]: AdConfig }
}) => {
  const { article, setSelectedArticle, articles, incrementViews, setSelectedCategory, adConfig } = props;
  
  const articleRectangleAd = article.adConfig?.articleRectangle?.key 
    ? article.adConfig.articleRectangle 
    : adConfig.articleRectangle;

  const articleSidebarAd = article.adConfig?.articleSidebar?.key
    ? article.adConfig.articleSidebar
    : adConfig.articleSidebar;

  return (
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
            <span 
              onClick={() => { setSelectedCategory(article.category); setSelectedArticle(null); }}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-700 cursor-pointer transition-colors"
            >
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
            {articleRectangleAd && articleRectangleAd.key ? (
              <AdsterraBanner adKey={articleRectangleAd.key} width={articleRectangleAd.width} height={articleRectangleAd.height} />
            ) : (
              <AdSlot format="Large Rectangle (336x280)" width="336px" height="280px" />
            )}
          </div>
        </div>

        <div className="space-y-6">
          {articleSidebarAd && articleSidebarAd.key ? (
            <AdsterraBanner adKey={articleSidebarAd.key} width={articleSidebarAd.width} height={articleSidebarAd.height} />
          ) : (
            <AdSlot format="Half Page (300x600)" width="300px" height="600px" />
          )}
          
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
};

const FrontendView = (props: {
  loading: boolean;
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;
  setIsAdmin: (val: boolean | null) => void;
  articles: Article[];
  incrementViews: (id: number) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  adConfig: AdConfigState;
}) => {
  const { loading, selectedArticle, setSelectedArticle, setIsAdmin, articles, incrementViews, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, adConfig } = props;

  return (
    <div className="min-h-screen bg-gray-50">
      {adConfig.pageScripts && Object.values(adConfig.pageScripts).map(script => (
          script.enabled && script.src && (
              <Script 
                  key={script.src}
                  id={`page-script-${script.src}`}
                  strategy="afterInteractive"
                  src={script.src}
              />
          )
      ))}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <AdSlot format="Social Bar (Sticky)" width="100%" height="60px" />
        </div>
      </div>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-8">
            <div 
              onClick={() => { setSelectedArticle(null); setSelectedCategory(null); }}
              className="cursor-pointer"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InfoPortal
              </h1>
              <p className="text-sm text-gray-500 mt-1">Your Daily Source of Information</p>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-lg">
                <input 
                  type="text" 
                  placeholder="Search articles by title or content..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-2 border-gray-200 rounded-full px-5 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={20}/>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAdmin(null)}
              className="text-sm text-gray-500 hover:text-gray-700 flex-shrink-0"
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
          <ArticleDetail article={selectedArticle} setSelectedArticle={setSelectedArticle} articles={articles} incrementViews={incrementViews} setSelectedCategory={setSelectedCategory} adConfig={adConfig.slots} />
        ) : (
          <HomePage articles={articles} setSelectedArticle={setSelectedArticle} incrementViews={incrementViews} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} searchQuery={searchQuery} adConfig={adConfig.slots} />
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


// --- ADMIN COMPONENTS ---

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
  handleSubmitArticle: () => void,
  adConfig: AdConfigState,
  saveAdConfig: (config: AdConfigState) => void
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
    handleSubmitArticle,
    adConfig,
    saveAdConfig
  } = props;

  const [localAdConfig, setLocalAdConfig] = useState(adConfig);

  useEffect(() => {
    setLocalAdConfig(adConfig);
  }, [adConfig]);

  const handleSlotConfigChange = (slot: string, field: keyof AdConfig, value: string | number) => {
    const isNumeric = field === 'width' || field === 'height';
    setLocalAdConfig(prev => ({
        ...prev,
        slots: {
            ...prev.slots,
            [slot]: {
                ...prev.slots[slot],
                [field]: isNumeric ? Number(value) : value
            }
        }
    }));
  };

  const handlePageScriptChange = (slot: string, field: keyof PageScriptConfig, value: string | boolean) => {
     setLocalAdConfig(prev => ({
        ...prev,
        pageScripts: {
            ...prev.pageScripts,
            [slot]: {
                ...prev.pageScripts[slot],
                [field]: value
            }
        }
    }));
  }

  const handleSaveAdConfig = () => {
    saveAdConfig(localAdConfig);
    alert('Pengaturan iklan telah disimpan!');
  };


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

                  <div className="pt-4 mt-4 border-t">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Iklan Khusus Artikel (Opsional)</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Article Rectangle Ad Key</label>
                        <input
                            type="text"
                            value={formData.articleRectangleKey || ''}
                            onChange={(e) => setFormData({...formData, articleRectangleKey: e.target.value})}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Gunakan key global jika kosong"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Article Sidebar Ad Key</label>
                        <input
                            type="text"
                            value={formData.articleSidebarKey || ''}
                            onChange={(e) => setFormData({...formData, articleSidebarKey: e.target.value})}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Gunakan key global jika kosong"
                        />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
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
                        setFormData({
                          title: '',
                          category: '',
                          image: '',
                          excerpt: '',
                          content: '',
                          readTime: '5 min'
                        });
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
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Informasi Sistem</h3>
                <p className="text-sm text-gray-600">Penyimpanan: Cloudflare KV</p>
                <p className="text-sm text-gray-600">Data tersimpan secara otomatis di cloud.</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Password Admin</h3>
                <p className="text-sm text-gray-600">Password default: admin123</p>
                <p className="text-sm text-gray-600">Untuk keamanan, ubah password di production</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Pengaturan Slot Iklan</h3>
                <div className="space-y-4">
                    {Object.keys(localAdConfig.slots).map(slotName => (
                        <div key={slotName} className="p-3 bg-white rounded-md shadow-sm">
                            <label className="block text-sm font-medium text-gray-700 capitalize">
                                {slotName.replace(/([A-Z])/g, ' $1')}
                            </label>
                            <div className="mt-1 space-y-2">
                                <div>
                                    <label className="text-xs text-gray-600">Ad Key</label>
                                    <input
                                        type="text"
                                        value={localAdConfig.slots[slotName]?.key || ''}
                                        onChange={(e) => handleSlotConfigChange(slotName, 'key', e.target.value)}
                                        className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-600">Width (px)</label>
                                        <input
                                            type="number"
                                            value={localAdConfig.slots[slotName]?.width || 0}
                                            onChange={(e) => handleSlotConfigChange(slotName, 'width', e.target.value)}
                                            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-600">Height (px)</label>
                                        <input
                                            type="number"
                                            value={localAdConfig.slots[slotName]?.height || 0}
                                            onChange={(e) => handleSlotConfigChange(slotName, 'height', e.target.value)}
                                            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </div>

               <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Pengaturan Skrip Halaman</h3>
                 <div className="space-y-4">
                    {Object.keys(localAdConfig.pageScripts).map(scriptName => (
                        <div key={scriptName} className="p-3 bg-white rounded-md shadow-sm">
                             <label className="block text-sm font-medium text-gray-700 capitalize">
                                {scriptName.replace(/([A-Z])/g, ' $1')}
                            </label>
                            <div className="mt-2 space-y-2">
                                <div>
                                    <label className="text-xs text-gray-600">Script Source URL</label>
                                    <input
                                        type="text"
                                        value={localAdConfig.pageScripts[scriptName]?.src || ''}
                                        onChange={(e) => handlePageScriptChange(scriptName, 'src', e.target.value)}
                                        className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id={`enabled-${scriptName}`}
                                        type="checkbox"
                                        checked={localAdConfig.pageScripts[scriptName]?.enabled || false}
                                        onChange={(e) => handlePageScriptChange(scriptName, 'enabled', e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={`enabled-${scriptName}`} className="ml-2 block text-sm text-gray-900">
                                        Enabled
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
              
              <button
                onClick={handleSaveAdConfig}
                className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Simpan Semua Pengaturan Iklan
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


// --- MAIN APP COMPONENT ---

const AdsterraApp = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(false);
  const [password, setPassword] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('articles');
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [stats, setStats] = useState({ views: 0, clicks: 0, earnings: 0 });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const defaultAdConfig: AdConfigState = {
    slots: {
      leaderboard: { key: 'b097cb03c5e6bba0398e0613f4306f55', width: 728, height: 90 },
      footerBanner: { key: '', width: 728, height: 90 },
      articleRectangle: { key: '', width: 336, height: 280 },
      articleSidebar: { key: '', width: 300, height: 600 },
    },
    pageScripts: {
      popUnder: { src: '//pl28124730.effectivegatecpm.com/12/78/0f/12780f97b1caf3c203b75c7452ef61ab.js', enabled: true },
      directLink: { src: '//pl28124934.effectivegatecpm.com/c9/94/f4/c994f4c1a15a972811b49384fa273240.js', enabled: true },
    }
  };

  const [adConfig, setAdConfig] = useState<AdConfigState>(defaultAdConfig);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    image: '',
    excerpt: '',
    content: '',
    readTime: '5 min',
    articleRectangleKey: '',
    articleSidebarKey: '',
  });

  useEffect(() => {
    loadArticles();
    loadAdConfig();
  }, []);

  const loadAdConfig = async () => {
    try {
        const response = await fetch('/api/config');
        if (!response.ok) throw new Error('Failed to fetch ad config');
        const storedConfig = await response.json();
        
        if (storedConfig && Object.keys(storedConfig).length > 0) {
            const mergedConfig = {
                ...defaultAdConfig,
                slots: {
                    ...defaultAdConfig.slots,
                    ...storedConfig.slots,
                },
                pageScripts: {
                    ...defaultAdConfig.pageScripts,
                    ...storedConfig.pageScripts,
                }
            };
            setAdConfig(mergedConfig);
        }
    } catch (error) {
        console.error('Error loading ad config:', error);
    }
  };

  const saveAdConfig = async (newConfig: AdConfigState) => {
    try {
        setAdConfig(newConfig);
        await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newConfig),
        });
    } catch (error) {
        console.error('Error saving ad config:', error);
        alert('Gagal menyimpan pengaturan iklan');
    }
  };

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/articles');
      if (!response.ok) throw new Error('Failed to fetch articles');
      let articlesData = await response.json();

      if (!articlesData || articlesData.length === 0) {
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
        await saveArticles(defaultArticles);
      } else {
        setArticles(articlesData);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // The loadStats function still uses localStorage. This is fine for non-critical, client-specific stats.
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

  const saveArticles = async (newArticles: Article[]) => {
    try {
        setArticles(newArticles); // Optimistic update
        await fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newArticles),
        });
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

  const handleSubmitArticle = async () => {
    const articleData: Article = {
      title: formData.title,
      category: formData.category,
      image: formData.image,
      excerpt: formData.excerpt,
      content: formData.content,
      readTime: formData.readTime,
      id: editingArticle ? editingArticle.id : Date.now(),
      views: editingArticle ? editingArticle.views : 0,
      createdAt: editingArticle ? editingArticle.createdAt : Date.now(),
      adConfig: {
        articleRectangle: {
          key: formData.articleRectangleKey || '',
          width: 336,
          height: 280,
        },
        articleSidebar: {
          key: formData.articleSidebarKey || '',
          width: 300,
          height: 600,
        }
      }
    };

    let newArticles: Article[];
    if (editingArticle) {
      newArticles = articles.map(a => a.id === editingArticle.id ? articleData : a);
    } else {
      newArticles = [articleData, ...articles];
    }

    await saveArticles(newArticles);
    
    setShowArticleForm(false);
    setEditingArticle(null);
    setFormData({
      title: '',
      category: '',
      image: '',
      excerpt: '',
      content: '',
      readTime: '5 min',
      articleRectangleKey: '',
      articleSidebarKey: '',
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
      readTime: article.readTime,
      articleRectangleKey: article.adConfig?.articleRectangle?.key || '',
      articleSidebarKey: article.adConfig?.articleSidebar?.key || '',
    });
    setShowArticleForm(true);
  };

  const handleDeleteArticle = async (id: number) => {
    if (window.confirm('Yakin ingin menghapus artikel ini?')) {
      const newArticles = articles.filter(a => a.id !== id);
      await saveArticles(newArticles);
    }
  };

  const incrementViews = async (articleId: number) => {
    const newArticles = articles.map(a => 
      a.id === articleId ? { ...a, views: (a.views || 0) + 1 } : a
    );
    await saveArticles(newArticles);
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
      adConfig={adConfig}
      saveAdConfig={saveAdConfig}
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
    selectedCategory={selectedCategory}
    setSelectedCategory={setSelectedCategory}
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    adConfig={adConfig}
  />;
};

export default AdsterraApp;
