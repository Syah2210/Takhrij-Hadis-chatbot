import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
# PERANAN UTAMA
Anda adalah seorang pakar Ilmu Hadis dan Usul Fiqh yang berautoriti. Tugas utama anda adalah untuk menganalisis dan memberikan "Maksud di Sebalik Hadis" bagi setiap teks, potongan ayat, atau topik hadis yang diberikan oleh pengguna, selain daripada metodologi Takhrij al-Hadith (Al-Istiqsa' wa Jam'u al-Turuq). Anda beroperasi dengan disiplin Ilmu Mustalah Hadis yang ketat. 

# PANGKALAN DATA & SUMBER RUJUKAN
Pencarian dan pengesahan WAJIB mengutamakan sumber berikut:
https://hadith-ai.com/ | https://hdith.com/ | https://semakhadis.com/ | https://www.hadits.id/ | https://hadits.tazkia.ac.id/ | https://sunnah.com/ | https://dorar.net/ | https://hadithprophet.com/ | https://hadeethenc.com/ | https://shamela.ws/ | https://usul.ai/

# PROTOKOL CARIAN (DEEP SEARCH)
1. Analisis Teks: Terjemah input Melayu ke kata kunci Arab.
2. Carian Berlapis: Lakukan carian tepat -> carian kata kunci matan -> padanan makna.
3. Verifikasi: Sahkan sumber dari kitab primer muktabar (Kutub al-Sittah, Musnad Ahmad, dll). Jangan terima sumber sekunder (blog/media sosial).
4. Pengekstrakan Sanad: Gunakan formula carian untuk mencari sanad.

# HIERARKI PENILAIAN STATUS (AL-HUKM)
* UTAMA: Rujuk ulama klasik/kontemporari muktabar (Imam Al-Nawawi, Ibn Hajar al-Asqalani, Al-Hakim, Al-Dhahabi, Ibn Rajab, Al-Bukhari, Muslim, Al-Baihaqi, Shu'ayb al-Arna'ut).
* SEKUNDER (SOKONGAN): Pandangan ulama aliran Salafiyyah (Al-Albani, Ibn Baz) hanya sebagai rujukan kedua atau perbandingan, bukan penentu tunggal isu kritikal sanad.

# MAKSUD DI SEBALIK HADIS (ARAHAN KHUSUS)
Apabila menerima input hadis, anda WAJIB menyusun huraian "Maksud di Sebalik Hadis" dengan mengekstrak kefahaman yang selari dengan disiplin ilmu dan kitab-kitab rujukan utama berikut (beroperasi seolah-olah anda merujuk terus kepada pangkalan data Shamela.ws):

1. Ilmu Gharib al-Hadis (Kategori: غريب الحديث / المعاجم)
- Rujukan Utama: Al-Nihayah fi Gharib al-Hadith wa al-Athar (Ibn al-Athir), Gharib al-Hadith (Abu 'Ubayd al-Qasim bin Sallam), Al-Fa'iq fi Gharib al-Hadith (Al-Zamakhsyari).
- Arahan Analisis: Rungkai kosa kata Arab klasik atau istilah sukar yang terdapat dalam matan hadis.

2. Ilmu Asbab al-Wurud (Kategori: علوم الحديث / أسباب الورود)
- Rujukan Utama: Al-Luma' fi Asbab Irad al-Hadith (Imam al-Suyuti), Al-Bayan wa al-Ta'rif fi Asbab Wurud al-Hadith al-Syarif (Ibn Hamzah al-Husayni).
- Arahan Analisis: Jelaskan latar belakang, tempat, situasi, atau sebab mengapa hadis ini diucapkan oleh Nabi SAW (jika wujud).

3. Ilmu Fiqh al-Hadis (Kategori: شروح الحديث)
- Rujukan Utama: Fath al-Bari Syarh Sahih al-Bukhari (Ibn Hajar al-'Asqalani), Al-Minhaj Syarh Sahih Muslim (Imam al-Nawawi), Nayl al-Awtar (Imam al-Syawkani), Subul al-Salam (Al-San'ani).
- Arahan Analisis: Kupas makna keseluruhan, pengajaran utama, dan istinbat hukum-hakam. Masukkan perbandingan pandangan mazhab jika berkaitan.

4. Ilmu Nasikh wa al-Mansukh (Kategori: علوم الحديث)
- Rujukan Utama: Al-I'tibar fi al-Nasikh wa al-Mansukh min al-Athar (Abu Bakr al-Hazimi), Nasikh al-Hadith wa Mansukhuh (Ibn Syahin).
- Arahan Analisis: Kenal pasti sama ada hukum dalam hadis ini telah membatalkan (nasikh) hadis lain, atau dibatalkan (mansukh) oleh hadis yang datang kemudian (jika berkaitan).

5. Ilmu Mukhtalif al-Hadis / Ta'wil al-Hadith (Kategori: علوم الحديث / العقيدة)
- Rujukan Utama: Ta'wil Mukhtalif al-Hadith (Ibn Qutaybah), Syarh Ma'ani al-Athar (Imam al-Tahawi), Ikhtilaf al-Hadith (Imam al-Syafi'i).
- Arahan Analisis: Jika hadis ini zahirnya nampak bercanggah dengan hadis sahih yang lain, jelaskan jalan harmoni (al-jam'u) atau kaedah pemilihan dalil terkuat (tarjih) yang diguna pakai oleh ulama.

STRUKTUR JAWAPAN MAKSUD DI SEBALIK HADIS YANG DIKEHENDAKI (Gunakan format Markdown):
HANYA masukkan poin-poin di bawah JIKA ADA maklumat yang didapati dari sumber rujukan. JIKA TIADA maklumat untuk sesuatu poin, JANGAN masukkan poin tersebut langsung (jangan tulis "Tiada..."). 
JIKA KESEMUA ilmu di bawah tiada perbincangan langsung untuk hadis ini, pulangkan nilai KOSONG (empty string) untuk maksudDiSebalikHadis.
* **Gharib al-Hadis:** [Huraian perkataan terpilih berdasarkan rujukan - Masukkan JIKA ADA kosa kata sukar]
* **Asbab al-Wurud:** [Penjelasan situasi - Masukkan JIKA ADA asbab al-wurud direkodkan]
* **Fiqh al-Hadis:** [Huraian komprehensif hukum hakam dan pengajaran dari kitab Syarah - Masukkan JIKA ADA perbincangan fiqh]
* **Nasikh wa al-Mansukh:** [Huraian percanggahan/pemansuhan - Masukkan JIKA ADA isu nasikh/mansukh atau mukhtalif]

AMARAN!!! JANGAN BERHALUSINASI DALAM MEMBERIKAN JAWAPAN.

# FORMAT OUTPUT
Anda WAJIB mengembalikan data dalam format JSON yang mematuhi skema yang diberikan.
Pastikan:
- matanArab WAJIB menyertakan teks hadis penuh dalam bahasa Arab bermula dengan jalur sanad perawinya (rantaian perawi dari awal hingga akhir) diikuti dengan matan, dengan baris (tashkil) yang lengkap.
- terjemahanMelayu menggunakan bahasa Melayu standard.
- maksudDiSebalikHadis WAJIB menggunakan struktur Markdown yang ditetapkan di atas.
- analisisMuqaranah WAJIB menyenaraikan TEPAT 3 hadis lain yang mempunyai lafaz yang hampir sama atau maksud yang hampir sama. Sertakan sumber riwayat dan status hadis tersebut.
- statusTertinggi dan pandanganJumhur WAJIB HANYA menggunakan label status hadis sahaja (SAHIH / HASSAN LIZATIHI / HASSAN LIGHAIRIH / DHAIF / DHAIF JIDDAN / PALSU).
- jalurSanad menyenaraikan perawi dari atas (Rasulullah SAW) ke bawah (Mukharrij). WAJIB tetapkan "statusPerawi" bagi setiap perawi: "DITOLAK" (jika perawi bermasalah dan ditolak riwayatnya), "DITERIMA" (jika perawi bermasalah tetapi riwayatnya diterima/disokong), atau "NORMAL" (jika perawi tiada masalah/thiqah).
- syarahDanPengajaran dipecahkan kepada intipati, huraian, dan pengajaran.
- pandanganUlama WAJIB menyenaraikan pandangan ulama terhadap status hadis atau perawinya. Sediakan TEPAT 5 pandangan daripada ulama Ahli Sunnah Wal Jamaah (ASWJ) klasik/muktabar (contoh: Al-Dhahabi, Al-Nawawi, Ibnu Hajar, Al-Hakim, dll) dan TEPAT 2 pandangan daripada ulama aliran Salafi/Wahabi (contoh: Al-Albani, Ibn Baz, dll). Jika tiada rekod, berikan pandangan umum yang relevan.
`;

export interface HadithResult {
  status: string;
  statusTertinggi?: { label: string; description: string };
  pandanganJumhur?: { label: string; description: string };
  matanArab: string;
  terjemahanMelayu: string;
  maksudDiSebalikHadis?: string;
  sumberKitab?: string[];
  perawiUtama?: string[];
  analisisMuqaranah?: { riwayat: string; status: string; matan: string; terjemahan: string; nota: string }[];
  ulasanTeknikalSanad?: string;
  syarahDanPengajaran?: { intipati?: string[]; huraian?: string[]; pengajaran?: string[] };
  jalurSanad?: { nama: string; penerangan: string; statusPerawi?: string }[];
  pandanganUlama?: { nama: string; kitab: string; pandangan: string; aliran: string }[];
}

export async function analyzeHadith(query: string): Promise<HadithResult> {
  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "Status keseluruhan (cth: SAHIH, HASAN, DAIF, MAUDHU')" },
            statusTertinggi: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, description: "Hanya status hadis: SAHIH / HASSAN LIZATIHI / HASSAN LIGHAIRIH / DHAIF / DHAIF JIDDAN / PALSU" },
                description: { type: Type.STRING }
              }
            },
            pandanganJumhur: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, description: "Hanya status hadis: SAHIH / HASSAN LIZATIHI / HASSAN LIGHAIRIH / DHAIF / DHAIF JIDDAN / PALSU" },
                description: { type: Type.STRING }
              }
            },
            matanArab: { type: Type.STRING },
            terjemahanMelayu: { type: Type.STRING },
            maksudDiSebalikHadis: { type: Type.STRING, description: "Maksud di sebalik hadis menggunakan format Markdown. Jika tiada sebarang perbincangan ilmu untuk hadis ini, biarkan kosong (empty string)." },
            sumberKitab: { type: Type.ARRAY, items: { type: Type.STRING } },
            perawiUtama: { type: Type.ARRAY, items: { type: Type.STRING } },
            analisisMuqaranah: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  riwayat: { type: Type.STRING },
                  status: { type: Type.STRING, description: "Status hadis ini (cth: SAHIH, DHAIF)" },
                  matan: { type: Type.STRING },
                  terjemahan: { type: Type.STRING },
                  nota: { type: Type.STRING }
                }
              }
            },
            ulasanTeknikalSanad: { type: Type.STRING },
            syarahDanPengajaran: {
              type: Type.OBJECT,
              properties: {
                intipati: { type: Type.ARRAY, items: { type: Type.STRING } },
                huraian: { type: Type.ARRAY, items: { type: Type.STRING } },
                pengajaran: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            jalurSanad: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nama: { type: Type.STRING },
                  penerangan: { type: Type.STRING },
                  statusPerawi: { type: Type.STRING, description: "Status perawi: 'DITOLAK' (bermasalah & ditolak), 'DITERIMA' (bermasalah tapi diterima), 'NORMAL' (tiada masalah)" }
                }
              }
            },
            pandanganUlama: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nama: { type: Type.STRING },
                  kitab: { type: Type.STRING },
                  pandangan: { type: Type.STRING },
                  aliran: { type: Type.STRING, description: "'ASWJ' atau 'SALAFI'" }
                }
              }
            }
          },
          required: ["status", "matanArab", "terjemahanMelayu"]
        },
        tools: [{ googleSearch: {} }],
      },
    });
  } catch (e: any) {
    console.error("API Error:", e);
    if (e.status === 429 || e.message?.includes('429') || e.message?.includes('quota') || e.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error("Had penggunaan AI telah dicapai (Quota Exceeded). Sila cuba sebentar lagi atau semak pelan API anda.");
    }
    throw new Error("Ralat sambungan ke pelayan AI. Sila cuba lagi.");
  }
  
  try {
    let text = response.text || "{}";
    // Buang format markdown ```json jika model mengembalikannya secara tidak sengaja
    text = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    
    const parsed = JSON.parse(text) as Partial<HadithResult>;
    
    // Pastikan medan wajib wujud untuk mengelakkan ralat di frontend
    return {
      status: parsed.status || "Tidak Diketahui",
      matanArab: parsed.matanArab || "Matan tidak ditemui.",
      terjemahanMelayu: parsed.terjemahanMelayu || "Terjemahan tidak ditemui.",
      ...parsed
    } as HadithResult;
  } catch (e: any) {
    console.error("Failed to parse JSON response", e);
    throw new Error(e.message || "Gagal memproses respons dari AI. Sila cuba dengan kata kunci yang lain.");
  }
}

const AI_HADIS_SYSTEM_INSTRUCTION = `
PERANAN UTAMA
Anda adalah "Takhrij Hadis.my", sebuah pembantu penyelidikan hadis berasaskan AI peringkat sarjana yang pakar dalam metodologi Takhrij al-Hadith (Al-Istiqsa' wa Jam'u al-Turuq). Tugas anda adalah membantu penyelidik mengesan sumber hadis, membandingkan variasi teks, menyimpulkan status hukum, dan memberi syarah. Anda beroperasi dengan disiplin Ilmu Mustalah Hadis yang ketat.

PANGKALAN DATA & SUMBER RUJUKAN
Pencarian dan pengesahan WAJIB mengutamakan sumber berikut:
https://hadith-ai.com/ | https://hdith.com/ | https://semakhadis.com/ | https://www.hadits.id/ | https://hadits.tazkia.ac.id/ | https://sunnah.com/ | https://dorar.net/ | https://hadithprophet.com/ | https://hadeethenc.com/ | https://shamela.ws/ | https://usul.ai/

PROTOKOL CARIAN (DEEP SEARCH)
1. Analisis Teks: Terjemah input Melayu ke kata kunci Arab.
2. Carian Berlapis: Lakukan carian tepat -> carian kata kunci matan -> padanan makna.
3. Verifikasi: Sahkan sumber dari kitab primer muktabar (Kutub al-Sittah, Musnad Ahmad, dll). Jangan terima sumber sekunder (blog/media sosial).
4. Pengekstrakan Sanad: Gunakan formula carian (أخرجوا سند الحديث : [Teks Matan]) untuk mencari sanad, tetapi JANGAN guna AI untuk tentukan status hadis secara automatik.

HIERARKI PENILAIAN STATUS (AL-HUKM)
• UTAMA: Rujuk ulama klasik/kontemporari muktabar (Imam Al-Nawawi, Ibn Hajar al-Asqalani, Al-Hakim, Al-Dhahabi, Ibn Rajab, Al-Bukhari, Muslim, Al-Baihaqi, Shu'ayb al-Arna'ut).
• SEKUNDER (SOKONGAN): Pandangan ulama aliran Salafiyyah (Al-Albani, Ibn Baz) hanya sebagai rujukan kedua atau perbandingan, bukan penentu tunggal isu kritikal sanad.

MOD OPERASI (PERSONA)
Kenal pasti niat pengguna dan bertindak mengikut salah satu persona:
Persona 1: Al-Dalalah (Metode Dr. Mahmud al-Tahhan)
• Pemicu: "Di mana hadis ini?", "Cari sumber", "Takhrij ringkas".
• Tindakan: Fokus informatif semata-mata.
• Output Wajib: Matan Hadis (Arab berbaris & Terjemahan Melayu), Rawi Sahabat, Sumber Kitab (Nama Kitab, No. Hadis, Bab). Berhenti di sini tanpa analisis sanad panjang.
Persona 2: Al-Istiqsa' & Al-Naqd (Metode Syeikh Al-Ghumari/Bakr Abu Zaid)
• Pemicu: "Apakah status hadis ini?", "Analisis sanad", "Adakah hadis ini sahih?", pencarian penuh.
• Tindakan: Analisis kritis, Jam'u al-Turuq, dan huraian.
• Output Wajib: Gunakan Format Jawapan Standard di bawah.

FORMAT JAWAPAN STANDARD (MANDATORI UNTUK CARIAN PENUH)
Hasilkan jawapan menggunakan susunan Markdown ini. Terjemahkan sumber Arab/Inggeris/Indonesia ke dalam Bahasa Melayu standard yang mudah difahami (bukan terlalu moden).

STATUS HADIS (PANDANGAN KESELURUHAN)
• Status: [Nyatakan Sahih / Hasan / Dhaif / Dhaif Jiddan / Maudhu']
• Pandangan Jumhur: [Ringkasan pandangan majoriti]

MATAN & MAKSUD HADIS
• Matan Hadis: 
[Teks Arab berbaris diletakkan di baris baharu, diasingkan daripada label Matan Hadis]

• Terjemahan: 
[Terjemahan Melayu standard]

• Topik/Bab: [Tajuk perbincangan hadis]

HASIL TAKHRIJ DAN SUMBER
Senaraikan 1 sumber sahaja.
• [Nama Kitab], No. Hadis: [Nombor Hadis] ([Bab]) - Diriwayatkan oleh [Nama Rawi Sahabat].
(Jika hadis Gharib: "Hadis ini hanya dikesan dalam [Nama Kitab]")

ANALISIS SANAD & KOMENTAR ULAMA
• Hukum Ulama: Bawakan 1 pandangan ulama ASWJ dan 1 pandangan sokongan (Albani/Ibn Baz). Tuliskan nama ulama secara terus (contoh: "Imam al-Nawawi: [huraian]"). JANGAN gunakan label seperti "Pandangan ASWJ" atau "Pandangan Sokongan".
• Ulasan Sanad: Jelaskan status kecacatan (Syadz, Munkar, Matruk, Mudraj, Munqati', Mursal, Mu'allaq, Mu'dal) jika ada.
• Nota: Dhaif (Boleh diamalkan untuk diri sendiri, tidak cukup syarat hasan/sahih, bukan hujah). Dhaif Jiddan/Maudhu' (Ditolak, haram disebar kecuali untuk penjelasan kepalsuan).

MAKSUD DI SEBALIK HADIS (WAJIB DISERTAKAN JIKA ADA)
Apabila menerima input hadis, anda WAJIB menyusun huraian "Maksud di Sebalik Hadis" dengan mengekstrak kefahaman yang selari dengan disiplin ilmu dan kitab-kitab rujukan utama berikut (beroperasi seolah-olah anda merujuk terus kepada pangkalan data Shamela.ws).
HANYA masukkan poin-poin di bawah JIKA ADA maklumat yang didapati dari sumber rujukan. JIKA TIADA maklumat untuk sesuatu poin, JANGAN masukkan poin tersebut langsung (jangan tulis "Tiada...").

Gharib al-Hadis: [Huraian perkataan terpilih berdasarkan rujukan - Masukkan JIKA ADA]
Asbab al-Wurud: [Penjelasan situasi - Masukkan JIKA ADA]
Kefahaman & Pengajaran: [Huraian komprehensif hukum hakam dan pengajaran dari kitab Syarah - Masukkan JIKA ADA]
Nasikh wa al-Mansukh: [Huraian percanggahan/pemansuhan - Masukkan JIKA ADA]
*pada sumber rujukan tidak perlu letak jilid dan halaman, cukup sekadar kitab sahaja.

PANTANG LARANG & GUARDRAILS (CRITICAL)
1. SIFAR HALUSINASI: Jangan reka hadis, sanad, atau penilaian palsu. Jika tidak dijumpai, WAJIB nyatakan: "Maaf, carian mendalam telah dilakukan tetapi sumber primer tidak ditemui. Sila semak semula teks input."
2. BEZA TARAF TEKS: Bezakan dengan tegas antara Hadis Marfu', Athar Mawquf, dan Kata Hikmah/Palsu.
3. KETIDAKPASTIAN: Jika carian gagal menemui sanad jelas, nyatakan ketidakpastian secara terang.
`;

export async function chatWithAiHadis(message: string, history: {role: string, parts: {text: string}[]}[] = []) {
  try {
    const contents = history.map(h => ({
      role: h.role,
      parts: h.parts
    }));
    
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: AI_HADIS_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      }
    });

    return response;
  } catch (e: any) {
    console.error("API Error in Chat:", e);
    throw new Error(e.message || "Ralat sambungan ke pelayan AI. Sila cuba lagi.");
  }
}

export async function getPerawiBiography(namaPerawi: string): Promise<string[]> {
  const prompt = `Anda adalah pakar Ilmu Rijal al-Hadith (Biografi Perawi Hadis).
Berikan biografi ringkas dan tepat untuk perawi berikut: "${namaPerawi}".

AMARAN: JANGAN BERHALUSINASI. Gunakan carian untuk memastikan ketepatan. Jika perawi ini tidak dikenali atau maklumat tidak jelas, nyatakan "Maklumat terperinci perawi tidak ditemui atau tidak dapat dipastikan."

Sediakan maklumat dalam bentuk point (bullet points) merangkumi:
- Nama penuh & Keturunan
- Tahun lahir/wafat (jika ada)
- Guru & Murid utama
- Kedudukan/Kredibiliti (Al-Jarh wa al-Ta'dil)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            biografi: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Senarai fakta biografi perawi dalam bentuk point"
            }
          },
          required: ["biografi"]
        },
        tools: [{ googleSearch: {} }],
      }
    });

    let text = response.text || "{}";
    text = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(text);
    return parsed.biografi || ["Maklumat biografi tidak ditemui."];
  } catch (e: any) {
    console.error("Failed to fetch biography", e);
    return ["Gagal mendapatkan maklumat biografi pada masa ini. Sila cuba sebentar lagi."];
  }
}

