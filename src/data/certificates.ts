import { asset } from "./profile";
export type Certificate = {
  id: string;
  title: string;
  image: string;
  issuer?: string;
  year?: string;
  date?: string;
  category?: string;
  description?: string;
  thumbnail?: string;
  pages?: string[];
};
const certificate = (
  id: string,
  title: string,
  issuer: string,
  year: string,
  date: string,
  category: string,
  description: string,
  pages: string[] = [],
): Certificate => ({
  id,
  title,
  issuer,
  year,
  date,
  category,
  description,
  image: asset(`assets/certificates/${id}.webp`),
  thumbnail: asset(`assets/certificates/${id}-thumb.webp`),
  pages: pages.map((p) => asset(`assets/certificates/${p}.webp`)),
});
export const certificates: Certificate[] = [
  certificate(
    "bnsp-network-administrator",
    "Network Administrator Muda",
    "BNSP · LSP Media Informatika",
    "2024",
    "27 Maret 2024",
    "Kompetensi",
    "Sertifikasi kompetensi bidang Network and Infrastructure, kualifikasi Junior Network Administrator. Mencakup pengalamatan jaringan, jaringan nirkabel, switch, dan routing.",
  ),
  certificate(
    "pueblo-science",
    "Pueblo Science Workshop",
    "FKIP Universitas Lambung Mangkurat · Pueblo Science",
    "2025",
    "28–29 Mei 2025",
    "Kegiatan",
    "Bertugas sebagai committee pada workshop STEM Activities for Student Mental Health Resilience, kolaborasi program studi Pendidikan IPA dan Pendidikan Komputer.",
  ),
  certificate(
    "praktik-industri-sgi",
    "Praktik Kerja Industri",
    "PT Suka Guna Indonesia",
    "2023",
    "3 Juli–20 Oktober 2023",
    "Pengalaman",
    "Menyelesaikan praktik kerja industri yang mencakup diagnosis dan perawatan PC, instalasi LAN, serta perbaikan koneksi jaringan.",
  ),
  certificate(
    "praktik-industri-smk",
    "Penilaian Praktik Industri — TKJ",
    "SMK Negeri 1 Gambut",
    "2023",
    "1 November 2023",
    "Pengalaman",
    "Dokumentasi praktik industri di Suka Komputer beserta penilaian teknis dan nonteknis. Nilai hasil kerja 94,56 dengan deskripsi Sangat Baik.",
  ),
  certificate(
    "konservasi-alam",
    "Seminar Nasional Konservasi Alam",
    "BEM FKIP Universitas Lambung Mangkurat",
    "2024",
    "21 Agustus 2024",
    "Kegiatan",
    "Peserta seminar bertema Menuju Generasi Emas, Timbulkan Kesadaran Terhadap Lingkungan Melalui Konservasi Alam.",
  ),
  certificate(
    "pustakawan-digital",
    "Peran Pustakawan di Era Digital",
    "e-Guru.id",
    "2024",
    "23 September 2024",
    "Kegiatan",
    "Peserta seminar nasional Mengoptimalkan Peran Pustakawan di Era Digital dengan total 4 jam pelajaran.",
    ["pustakawan-digital-materi"],
  ),
  certificate(
    "bincang-rupawan",
    "Bincang Rupawan — Rupiah dan Pahlawan",
    "Bank Indonesia · Departemen Pengelolaan Uang",
    "2024",
    "8 November 2024",
    "Kegiatan",
    "Peserta Bincang Rupawan bertema Rupiah sebagai Rekam Jejak Abadi Semangat Kepahlawanan, Banjarmasin.",
  ),
  certificate(
    "pemira",
    "Partisipasi Pemilihan Umum Mahasiswa",
    "FKIP Universitas Lambung Mangkurat",
    "2024",
    "2024",
    "Kegiatan",
    "Berpartisipasi dalam PEMIRA FKIP ULM bertema Dari Mahasiswa Untuk Mahasiswa: Bersama Wujudkan Pemimpin yang IDEAL.",
  ),
];
