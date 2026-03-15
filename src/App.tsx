/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { BookOpen, Search, CheckCircle, AlertCircle, Loader2, Copy, AlertTriangle, Scale, Book, Users, GitMerge, SearchCode, Lightbulb, List, AlignLeft, GraduationCap, GitCommitVertical, MessageSquare, Bookmark, Mail, X, Menu } from 'lucide-react';
import { analyzeHadith, HadithResult } from './services/geminiService';
import AiHadisChat from './components/AiHadisChat';

export default function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<HadithResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'contact'>('home');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showFahamiModal, setShowFahamiModal] = useState(false);
  const [showAiHadisModal, setShowAiHadisModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await analyzeHadith(query);
      if (response) {
        setResult(response);
      } else {
        setError('Tiada respons diterima. Sila cuba lagi.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ralat berlaku semasa membuat carian.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'text-slate-600 bg-slate-50 border-slate-200';
    const s = status.toUpperCase();
    if (s.includes('SAHIH')) return 'text-green-600 bg-green-50 border-green-200';
    if (s.includes('HASAN')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (s.includes('DAIF') || s.includes('DHAIF')) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (s.includes('MAUDHU') || s.includes('PALSU')) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const getStatusIconColor = (status?: string) => {
    if (!status) return 'text-slate-500';
    const s = status.toUpperCase();
    if (s.includes('SAHIH')) return 'text-green-500';
    if (s.includes('HASAN')) return 'text-blue-500';
    if (s.includes('DAIF') || s.includes('DHAIF')) return 'text-orange-500';
    if (s.includes('MAUDHU') || s.includes('PALSU')) return 'text-red-500';
    return 'text-slate-500';
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `${result.matanArab || ''}\n\n${result.terjemahanMelayu || ''}\n\nStatus: ${result.status || 'Tidak Diketahui'}`;
    navigator.clipboard.writeText(text);
    alert('Teks telah disalin!');
  };

  return (
    <div className="font-sans text-slate-800 antialiased min-h-screen flex flex-col">
      <nav className="bg-darkblue text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div 
              className="flex items-center cursor-pointer transition transform hover:scale-105" 
              onClick={() => { setCurrentView('home'); setQuery(''); setResult(null); setError(''); setIsMobileMenuOpen(false); }}
            >
              <div className="bg-turquoise text-white p-2 rounded-lg mr-3">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="font-bold text-xl md:text-2xl tracking-wide">Takhrij Hadis.my</h1>
                <p className="text-[10px] md:text-xs text-turquoise tracking-widest uppercase">Semak Sebelum Sebar</p>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 font-semibold">
              <button onClick={() => setCurrentView('home')} className={`${currentView === 'home' ? 'text-turquoise' : 'hover:text-white'} transition`}>Utama</button>
              <button onClick={() => setShowAiHadisModal(true)} className={`hover:text-white transition`}>Ai Hadis</button>
              <button onClick={() => setCurrentView('about')} className={`${currentView === 'about' ? 'text-turquoise' : 'hover:text-white'} transition`}>Tentang Kami</button>
              <button onClick={() => setCurrentView('contact')} className={`${currentView === 'contact' ? 'text-turquoise' : 'hover:text-white'} transition`}>Hubungi</button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-turquoise transition focus:outline-none p-2"
              >
                {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 pt-2 pb-4 space-y-1 shadow-lg flex flex-col">
              <button 
                onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }} 
                className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium ${currentView === 'home' ? 'bg-slate-700 text-turquoise' : 'text-white hover:bg-slate-700 hover:text-white'} transition`}
              >
                Utama
              </button>
              <button 
                onClick={() => { setShowAiHadisModal(true); setIsMobileMenuOpen(false); }} 
                className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium text-white hover:bg-slate-700 hover:text-white transition`}
              >
                Ai Hadis
              </button>
              <button 
                onClick={() => { setCurrentView('about'); setIsMobileMenuOpen(false); }} 
                className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium ${currentView === 'about' ? 'bg-slate-700 text-turquoise' : 'text-white hover:bg-slate-700 hover:text-white'} transition`}
              >
                Tentang Kami
              </button>
              <button 
                onClick={() => { setCurrentView('contact'); setIsMobileMenuOpen(false); }} 
                className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium ${currentView === 'contact' ? 'bg-slate-700 text-turquoise' : 'text-white hover:bg-slate-700 hover:text-white'} transition`}
              >
                Hubungi
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow flex flex-col items-center px-4 mt-12 text-center max-w-7xl mx-auto w-full">
        
        {currentView === 'home' && (
          <>
            {!result && !isLoading && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
            <h2 className="text-5xl md:text-7xl font-extrabold text-darkblue mb-4 leading-tight">
              BIAR YAKIN <br />
              <span className="text-turquoise">BARU SHARE</span>
            </h2>
            
            <p className="text-slate-500 max-w-2xl text-lg mb-10">
              Semak dulu status hadis, matan, dan terjemahan. Elakkan penyebaran hadis palsu menggunakan teknologi AI yang dilatih dengan metodologi ilmu hadis muktabar.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm font-semibold text-slate-700">
              <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center">
                Nak tahu status hadis dengan cepat? Jom guna <button onClick={() => setShowAiHadisModal(true)} className="text-turquoise hover:text-emerald-500 transition ml-1 font-bold">Ai Hadis</button>
              </div>
            </div>
          </div>
        )}

        <div className={`w-full max-w-3xl transition-all duration-500 ${result || isLoading ? 'mb-8' : 'mb-16'}`}>
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-14 pr-16 py-5 bg-darkblue border border-transparent rounded-full text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent text-lg shadow-lg transition" 
              placeholder="Taip matan hadis atau kata kunci..."
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute inset-y-2 right-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800 text-turquoise rounded-full p-3 transition focus:outline-none flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Search className="h-6 w-6" />}
            </button>
          </form>

          {!result && !isLoading && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button 
                onClick={() => setShowFahamiModal(true)}
                className="bg-turquoise text-darkblue font-bold py-3 px-8 rounded-full shadow hover:bg-emerald-400 transition"
              >
                Jom Fahami hadis
              </button>
              <button 
                onClick={() => setShowSupportModal(true)}
                className="bg-white text-darkblue border-2 border-darkblue font-bold py-3 px-8 rounded-full shadow hover:bg-slate-50 transition"
              >
                Jom Support Kami
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="w-full max-w-3xl bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 flex items-start text-left">
            <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Ralat</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200 mb-20 text-left animate-in fade-in slide-in-from-bottom-8 duration-700 overflow-hidden">
            
            {/* Header Section */}
            <div className="p-8 border-b border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div className={`px-4 py-1.5 rounded-full border font-bold text-sm flex items-center gap-2 ${getStatusColor(result.status)}`}>
                  <AlertCircle className="w-4 h-4" />
                  {(result.status || 'TIDAK DIKETAHUI').toUpperCase()}
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition text-sm font-medium"
                >
                  <Copy className="w-4 h-4" />
                  Copy Text
                </button>
              </div>
              <p className="text-xs text-slate-400 font-semibold tracking-widest uppercase mb-6">ANALISIS TAKHRIJ</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.pandanganJumhur && (
                  <div className="bg-slate-50 rounded-xl p-5 border-l-4 border-yellow-500 flex justify-between items-start">
                    <div>
                      <p className="text-yellow-600 text-xs font-bold tracking-wider uppercase mb-1">PANDANGAN JUMHUR</p>
                      <h3 className="text-2xl font-extrabold text-slate-800 mb-2">{result.pandanganJumhur.label}</h3>
                      <p className="text-slate-500 text-sm">{result.pandanganJumhur.description}</p>
                    </div>
                    <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  </div>
                )}
                {result.statusTertinggi && (
                  <div className="bg-slate-50 rounded-xl p-5 border-l-4 border-blue-500 flex justify-between items-start">
                    <div>
                      <p className="text-blue-600 text-xs font-bold tracking-wider uppercase mb-1">STATUS TERTINGGI</p>
                      <h3 className="text-2xl font-extrabold text-slate-800 mb-2">{result.statusTertinggi.label}</h3>
                      <p className="text-slate-500 text-sm">{result.statusTertinggi.description}</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  </div>
                )}
              </div>
            </div>

            {/* Matan & Terjemahan */}
            <div className="p-8 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 font-semibold tracking-widest uppercase text-xs mb-6">
                <Book className="w-4 h-4" />
                MATAN HADIS (ARAB)
              </div>
              <div className="bg-slate-50 rounded-2xl p-8 mb-8">
                <p className="text-3xl md:text-4xl leading-loose text-right font-arabic text-slate-800" dir="rtl">
                  {result.matanArab}
                </p>

                {/* Visualisasi Jalur Sanad */}
                {result.jalurSanad && result.jalurSanad.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-lg mb-6">
                      <GitCommitVertical className="w-5 h-5 text-blue-500" />
                      JALUR SANAD PERAWI
                    </div>
                    
                    <div className="max-w-2xl mx-auto flex flex-col items-center">
                      {result.jalurSanad.map((perawi, idx) => (
                        <React.Fragment key={idx}>
                          <div className="w-full bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex justify-between items-center">
                            <span className={`font-bold ${
                              perawi.statusPerawi === 'DITOLAK' ? 'text-red-600' :
                              perawi.statusPerawi === 'DITERIMA' ? 'text-orange-500' :
                              'text-slate-800'
                            }`}>
                              {perawi.nama}
                            </span>
                            {perawi.penerangan && (
                              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider
                                ${perawi.statusPerawi === 'DITOLAK' ? 'bg-red-100 text-red-800' :
                                  perawi.statusPerawi === 'DITERIMA' ? 'bg-orange-100 text-orange-800' :
                                  perawi.penerangan.includes('SAHABAT') ? 'bg-emerald-100 text-emerald-800' : 
                                  perawi.penerangan.includes('MUKHARRIJ') ? 'bg-slate-200 text-slate-700' : 
                                  'bg-blue-100 text-blue-800'}`}>
                                {perawi.penerangan}
                              </span>
                            )}
                          </div>
                          {idx < result.jalurSanad!.length - 1 && (
                            <div className="h-8 w-px bg-slate-300 my-1 relative">
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                                <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-400 font-semibold tracking-widest uppercase text-xs mb-6">
                <Scale className="w-4 h-4" />
                TERJEMAHAN MELAYU
              </div>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                {result.terjemahanMelayu}
              </p>
            </div>

            {/* Sumber & Perawi */}
            {(result.sumberKitab?.length || result.perawiUtama?.length) && (
              <div className="p-8 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                {result.sumberKitab && result.sumberKitab.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg mb-4">
                      <BookOpen className="w-5 h-5" />
                      Sumber Kitab (Takhrij)
                    </div>
                    <div className="space-y-2">
                      {result.sumberKitab.map((kitab, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-slate-600 text-sm">
                          • {kitab}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {result.perawiUtama && result.perawiUtama.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-blue-700 font-bold text-lg mb-4">
                      <Users className="w-5 h-5" />
                      Perawi Utama
                    </div>
                    <div className="space-y-2">
                      {result.perawiUtama.map((perawi, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-slate-600 text-sm">
                          {perawi}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Analisis Muqaranah */}
            {result.analisisMuqaranah && result.analisisMuqaranah.length > 0 && (
              <div className="p-8 border-b border-slate-100">
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-2 text-blue-800 font-bold text-xl mb-6">
                    <GitMerge className="w-6 h-6" />
                    Analisis Muqaranah (Perbandingan Lafaz)
                  </div>
                  <div className="space-y-6">
                    {result.analisisMuqaranah.map((muqaranah, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`inline-block text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider ${
                            muqaranah.status?.toUpperCase().includes('SAHIH') ? 'bg-green-100 text-green-800' :
                            muqaranah.status?.toUpperCase().includes('HASAN') ? 'bg-blue-100 text-blue-800' :
                            muqaranah.status?.toUpperCase().includes('DAIF') || muqaranah.status?.toUpperCase().includes('DHAIF') ? 'bg-orange-100 text-orange-800' :
                            muqaranah.status?.toUpperCase().includes('MAUDHU') || muqaranah.status?.toUpperCase().includes('PALSU') ? 'bg-red-100 text-red-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {muqaranah.status || 'TIADA STATUS'}
                          </div>
                          <div className="text-sm font-bold text-slate-600">
                            {muqaranah.riwayat}
                          </div>
                        </div>
                        <p className="text-2xl leading-loose text-right font-arabic text-slate-800 mb-4" dir="rtl">
                          {muqaranah.matan}
                        </p>
                        <p className="text-slate-600 italic border-l-4 border-slate-200 pl-4 mb-4">
                          "{muqaranah.terjemahan}"
                        </p>
                        <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700">
                          <strong>Nota Perbandingan:</strong> {muqaranah.nota}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analisis Sanad & Hukum */}
            {result.ulasanTeknikalSanad && (
              <div className="p-8 border-b border-slate-100">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xl mb-6">
                    <SearchCode className="w-6 h-6" />
                    Analisis Sanad & Hukum
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">ULASAN TEKNIKAL SANAD</p>
                    <p className="text-slate-700 leading-relaxed">
                      {result.ulasanTeknikalSanad}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pandangan Ulama */}
            {result.pandanganUlama && result.pandanganUlama.length > 0 && (
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 text-slate-400 font-semibold tracking-widest uppercase text-xs mb-6">
                  <Users className="w-4 h-4" />
                  PANDANGAN ULAMA
                </div>
                <div className="space-y-6">
                  {result.pandanganUlama.map((ulama, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-slate-800">{ulama.nama}</h3>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium">
                          <Bookmark className="w-4 h-4 text-slate-400" />
                          {ulama.kitab}
                        </div>
                      </div>
                      
                      <div className="pl-4 border-l-4 border-slate-200">
                        <p className="text-slate-700 leading-relaxed">
                          {ulama.pandangan}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Maksud Di Sebalik Hadis */}
            {result.maksudDiSebalikHadis && (
              <div className="p-8 border-b border-slate-100">
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-2 text-blue-800 font-bold text-xl mb-6">
                    <Lightbulb className="w-6 h-6 text-blue-600" />
                    Maksud Di Sebalik Hadis
                  </div>
                  <div className="text-slate-700 leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-2 [&>h3]:font-bold [&>h3]:text-lg [&>h3]:mb-3 [&_strong]:text-blue-900">
                    <Markdown>{result.maksudDiSebalikHadis}</Markdown>
                  </div>
                </div>
              </div>
            )}

            {/* Syarah & Pengajaran */}
            {result.syarahDanPengajaran && (
              <div className="p-8 border-b border-slate-100">
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-2 text-indigo-800 font-bold text-xl mb-6">
                    <Lightbulb className="w-6 h-6" />
                    Syarah & Pengajaran
                  </div>
                  
                  <div className="space-y-4">
                    {result.syarahDanPengajaran.intipati && result.syarahDanPengajaran.intipati.length > 0 && (
                      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-4">
                          <List className="w-4 h-4" />
                          INTIPATI HADIS
                        </div>
                        <ul className="space-y-3">
                          {result.syarahDanPengajaran.intipati.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-700">
                              <span className="text-indigo-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.syarahDanPengajaran.huraian && result.syarahDanPengajaran.huraian.length > 0 && (
                      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-4">
                          <AlignLeft className="w-4 h-4" />
                          HURAIAN MAKNA TERPERINCI
                        </div>
                        <ul className="space-y-3">
                          {result.syarahDanPengajaran.huraian.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-700">
                              <span className="text-indigo-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.syarahDanPengajaran.pengajaran && result.syarahDanPengajaran.pengajaran.length > 0 && (
                      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-4">
                          <GraduationCap className="w-4 h-4" />
                          PENGAJARAN
                        </div>
                        <ul className="space-y-3">
                          {result.syarahDanPengajaran.pengajaran.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-700">
                              <span className="text-indigo-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {currentView === 'home' && !result && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-6 mx-auto">
                <Search className="w-8 h-8 text-turquoise" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-darkblue">1. Cari Topik</h3>
              <p className="text-slate-500 text-sm">Masukkan kata kunci, hadis dalam Bahasa Arab, maksud hadis, atau kalimah yang dirumikan.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="w-8 h-8 text-turquoise" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-darkblue">2. Analisis AI</h3>
              <p className="text-slate-500 text-sm">Sistem AI akan mengimbas ribuan data daripada kitab-kitab hadis muktabar dalam saat untuk mencari padanan yang tepat.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-6 mx-auto">
                <CheckCircle className="w-8 h-8 text-turquoise" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-darkblue">3. Keputusan Tepat</h3>
              <p className="text-slate-500 text-sm">Dapatkan status hadis berserta rujukan nombor hadis, kitab, analisis sanad dan fiqh hadis.</p>
            </div>
          </div>
        )}
          </>
        )}

        {currentView === 'about' && (
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 my-12">
            {/* Left Sidebar */}
            <div className="bg-darkblue text-white p-10 flex flex-col items-center justify-center md:w-1/3 text-center">
              <div className="w-40 h-40 rounded-full border-4 border-turquoise p-1 mb-6">
                <img 
                  src="https://i.postimg.cc/HTJ4PKf0/unnamed-042057.jpg" 
                  alt="Muhammad Syahmi" 
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">Muhammad Syahmi<br/>Aminuddin bin Suhaimi</h2>
              <p className="text-turquoise text-xs font-bold tracking-widest uppercase mt-2">PENYELIDIK & PENGASAS</p>
            </div>
            
            {/* Right Content */}
            <div className="p-10 md:p-14 md:w-2/3 text-left">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-turquoise rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-800">Latar Belakang Penyelidikan</h2>
              </div>
              
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  Merupakan graduan daripada Universiti Islam Pahang Sultan Ahmad Shah (UniPSAS) dengan pengkhususan dalam bidang Al-Quran dan As-Sunnah. Inisiatif Takhrij Hadis.my ini adalah sebahagian daripada kajian lanjutan di peringkat Ijazah Sarjana (Master) yang memfokuskan kepada metodologi Takhrij Hadis kontemporari.
                </p>
                <p>
                  Projek ini merupakan kesinambungan daripada penyelidikan intensif yang telah dimulakan sejak peringkat Ijazah Sarjana Muda, didorong oleh tekad untuk mengisi jurang kelompongan kritikal dalam aksesibiliti semakan status hadis di alam maya.
                </p>
                <p>
                  Bergiat aktif dalam penerokaan teknologi Kecerdasan Buatan (AI), saya berhasrat untuk mengadaptasi disiplin ilmu hadis agar lebih mesra teknologi. Visi utamanya adalah untuk mendemokrasikan akses kepada semakan hadis, memastikan setiap lapisan masyarakat di Malaysia mampu memverifikasi kesahihan sumber agama dengan pantas dan tepat.
                </p>
                <div className="mt-4">
                  <p className="mb-2">Saya juga menerima pendidikan hadis secara turath, antara guru saya ialah:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Syeikh Dr Mustafa Al-Nadawi</li>
                    <li>Mualana Hussein Abdul Khadir Al-Yusufi</li>
                    <li>Syeikh Muhammad Nuruddin Marbu Abdullah Al-Banjari</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'contact' && (
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 my-12">
            <div className="bg-darkblue text-white p-10 text-center">
              <div className="w-20 h-20 bg-turquoise rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-darkblue" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Hubungi Kami</h2>
              <p className="text-turquoise text-sm font-bold tracking-widest uppercase mt-2">MAKLUM BALAS & ADUAN</p>
            </div>
            
            <div className="p-10 md:p-14 text-center">
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Untuk melaporkan sebarang permasalahan AI atau kesalahan hadis, sila hubungi kami melalui e-mel di bawah:
              </p>
              
              <a 
                href="mailto:syahdinsuhaimi@gmail.com" 
                className="inline-flex items-center gap-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-8 py-4 rounded-full font-semibold text-lg transition-colors border border-emerald-200"
              >
                <Mail className="w-6 h-6" />
                syahdinsuhaimi@gmail.com
              </a>
            </div>
          </div>
        )}
      </main>

      {showAiHadisModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-4xl h-[85vh] md:h-[80vh] animate-in zoom-in-95 duration-300">
            <AiHadisChat onClose={() => setShowAiHadisModal(false)} />
          </div>
        </div>
      )}

      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-darkblue p-6 text-center relative">
              <button 
                onClick={() => setShowSupportModal(false)}
                className="absolute top-4 right-4 text-slate-300 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-bold text-white mb-1">Sokong Kami</h3>
              <p className="text-turquoise text-sm">Sumbangan anda amat dihargai</p>
            </div>
            <div className="p-8 flex flex-col items-center text-center">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 w-full flex justify-center">
                <img 
                  src="https://i.postimg.cc/L2fNhb3c/qr-maybank.png" 
                  alt="QR Code Maybank" 
                  className="w-48 h-48 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex justify-center mb-2">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Maybank_Logo.svg/2560px-Maybank_Logo.svg.png" 
                    alt="Maybank Logo" 
                    className="h-6 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-2xl font-bold text-slate-800 tracking-wider mb-1">0130 2366 6336</p>
                <p className="text-sm font-medium text-slate-600 uppercase">Muhammad Syahmi Aminuddin</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFahamiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Panduan Asas Ulum al-Hadith</h3>
                  <p className="text-slate-500 text-xs font-semibold tracking-widest uppercase mt-1">ISTILAH & KLASIFIKASI</p>
                </div>
              </div>
              <button 
                onClick={() => setShowFahamiModal(false)}
                className="text-slate-400 hover:text-slate-600 transition p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto flex-grow custom-scrollbar">
              
              {/* Section 1 */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <h4 className="text-xl font-bold text-slate-800">Istilah Asas Sanad dan Matan</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-800 mb-2">Sanad (Isnad)</h5>
                    <p className="text-slate-600 text-sm leading-relaxed">Rantaian perawi yang menyampaikan matan hadis dari sumbernya (kitab) hingga kepada Rasulullah SAW. Ia adalah "jalan" yang menghubungkan kita kepada teks.</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-800 mb-2">Rawi</h5>
                    <p className="text-slate-600 text-sm leading-relaxed">Individu yang memindahkan atau meriwayatkan hadis dalam rantaian sanad. Setiap rawi mesti dinilai status kebolehpercayaannya.</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-800 mb-2">Matan</h5>
                    <p className="text-slate-600 text-sm leading-relaxed">Teks atau isi kandungan hadis yang terletak di hujung sanad. Ia adalah sabdaan, perbuatan, atau pengakuan Nabi SAW.</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-800 mb-2">Thiqah</h5>
                    <p className="text-slate-600 text-sm leading-relaxed">Sifat rawi yang menggabungkan dua elemen: <span className="italic">'Adalah</span> (Integriti agama/moral) dan <span className="italic">Dhabti</span> (Ketajaman hafalan/tulisan). Syarat utama hadis sahih.</p>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <h4 className="text-xl font-bold text-slate-800">Klasifikasi Hadis (Maqbul & Mardud)</h4>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="p-4 border-b border-slate-200">Istilah</th>
                        <th className="p-4 border-b border-slate-200">Kategori</th>
                        <th className="p-4 border-b border-slate-200">Huraian Ringkas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-4 font-bold text-green-700">Hadis Sahih</td>
                        <td className="p-4 text-green-600">Diterima<br/>(Maqbul)</td>
                        <td className="p-4 text-slate-600">Sanad bersambung, perawi thiqah (adil & dhabti), tiada syadz, tiada 'illah.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-blue-700">Hadis Hasan</td>
                        <td className="p-4 text-blue-600">Diterima<br/>(Maqbul)</td>
                        <td className="p-4 text-slate-600"><span className="font-bold">Li Zatihi:</span> Syarat sahih tetapi hafalan rawi sedikit kurang.<br/><span className="font-bold">Li Ghairihi:</span> Hadis daif yang ringan, dikuatkan oleh jalur lain.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-orange-700">Hadis Daif</td>
                        <td className="p-4 text-orange-600">Boleh<br/>Diamalkan</td>
                        <td className="p-4 text-slate-600">Boleh diamalkan untuk diri sendiri. Hadis dhaif tidak mencukupi syarat hadis hasan dan sahih, maka ia hanya boleh beramal bukan untuk sebaran dan tidak boleh digunakan sebagai hujah.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-red-700">Hadis Daif Jiddan</td>
                        <td className="p-4 text-red-600">Ditolak</td>
                        <td className="p-4 text-slate-600">Hadis Palsu yang direka cipta dan disandarkan kepada Nabi SAW secara dusta. Haram disebarkan kecuali untuk menjelaskan kepalsuannya.</td>
                      </tr>
                      <tr className="bg-red-50">
                        <td className="p-4 font-bold text-red-800">Hadis Maudhu'</td>
                        <td className="p-4 text-red-700 font-semibold">Ditolak Keras</td>
                        <td className="p-4 text-slate-700">Hadis rekaan semata-mata. Dusta yang disengajakan ke atas nama Nabi SAW.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <h4 className="text-xl font-bold text-slate-800">Istilah Kecacatan Sanad & Matan</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-800 mb-1">Syadz (الشاذ)</h5>
                    <p className="text-slate-600 text-sm">Hadis yang diriwayatkan oleh perawi Thiqah (dipercayai), tetapi bertentangan dengan riwayat yang lebih kuat daripadanya. Ini menyebabkan hadis itu ditolak.</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-800 mb-1">Munkar (المنكر)</h5>
                    <p className="text-slate-600 text-sm">Hadis yang diriwayatkan oleh perawi Dhaif Jiddan (sangat lemah) dan bertentangan dengan riwayat perawi yang Thiqah. Kedudukannya lebih teruk dari Syadz.</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-800 mb-1">Matruk (المتروك)</h5>
                    <p className="text-slate-600 text-sm">Hadis yang diriwayatkan oleh perawi yang dituduh berdusta (walaupun belum terbukti), atau sering melakukan kesalahan yang banyak, sehingga hadisnya ditinggalkan (Matruk).</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-800 mb-1">Mudraj (المدرج)</h5>
                    <p className="text-slate-600 text-sm">Hadis yang terdapat sisipan tambahan (kata-kata) dari rawi, sama ada pada sanad atau matan, dan sisipan ini disangka sebagai sebahagian daripada hadis Nabi S.A.W.</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-800 mb-1">Munqati' (المنقطع)</h5>
                    <p className="text-slate-600 text-sm">Hadis yang sanadnya terputus di mana-mana sahaja (di tengah-tengah), dan bukan putus selepas Sahabat.</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-800 mb-1">Mursal (المرسل)</h5>
                    <p className="text-slate-600 text-sm">Hadis yang diriwayatkan oleh Tabi'in (generasi selepas Sahabat) terus dari Nabi S.A.W. tanpa menyebut nama Sahabat di antaranya. Kebanyakan ulama menganggap ia Dhaif.</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-800 mb-1">Mu'allaq (المعلق)</h5>
                    <p className="text-slate-600 text-sm">Hadis yang sanadnya terputus dari awal (pada rawi-rawi yang terdekat dengan pengumpul hadis, seperti Imam Bukhari) atau gugur keseluruhannya.</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-800 mb-1">Mu'dal (المعضل)</h5>
                    <p className="text-slate-600 text-sm">Hadis yang sanadnya gugur dua rawi berturut-turut atau lebih.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <footer className="text-center py-8 text-slate-400 text-sm mt-auto bg-darkblue text-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2">
          <p className="font-semibold text-white">Takhrij Hadis.my © 2026</p>
          <p>Dibina oleh: <span className="text-turquoise font-medium">Muhammad Syahmi Aminuddin</span></p>
        </div>
      </footer>
    </div>
  );
}

