import { asset } from "./profile";
export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  technologies: string[];
  features: string[];
  role?: string;
  coverImage?: string;
  gallery?: string[];
  status?: string;
  note?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  accent: string;
};
export const projects: Project[] = [
  {
    slug: "pyrorescue",
    title: "PyroRescue",
    category: "EDUCATIONAL GAME",
    summary:
      "Belajar dasar Python lewat misi pemadaman api dan penyelamatan hutan Kalimantan.",
    description:
      "Game edukasi berbasis web yang menghubungkan logika pemrograman dengan aksi visual. Pemain mempelajari variabel, perulangan, dan percabangan dalam konteks misi penyelamatan. Kode diproses melalui validator subset Python, bukan eksekusi Python bebas.",
    technologies: ["Laravel", "PHP", "JavaScript", "Phaser", "MySQL", "Vite"],
    features: [
      "Misi bertema kebakaran hutan Kalimantan",
      "Tiga level: variabel, perulangan, dan percabangan",
      "Editor kode dengan Run, Hint, dan Reset",
      "Akun pemain dan progres level",
    ],
    role: "UI/UX dan navigasi, akun dan profil pemain, tutorial serta aset visual. Kontribusi tercantum pada halaman pengembang proyek.",
    accent: "fire",
    coverImage: asset("assets/projects/pyrorescue/cover.webp"),
    gallery: [],
  },
  {
    slug: "siagagambut",
    title: "SiagaGambut",
    category: "INTERACTIVE LEARNING",
    summary:
      "Memahami lahan basah dan mitigasi karhutla melalui materi serta skenario berbasis keputusan.",
    description:
      "Media pembelajaran interaktif mengenai ekosistem lahan basah, gambut, dan mitigasi karhutla di Kalimantan. Pendekatan Decision-Based Learning mengajak pengguna memahami situasi, memilih tindakan, dan merefleksikan konsekuensinya.",
    technologies: [
      "Laravel",
      "PHP",
      "Livewire",
      "Tailwind CSS",
      "MySQL",
      "Vite",
    ],
    features: [
      "Katalog modul dan pelajaran dengan pencarian",
      "Pencatatan progres materi",
      "Demo tiga skenario bercabang",
      "Dashboard learner dan inventaris admin",
    ],
    status: "Dalam pengembangan",
    note: "Demo skenario sudah tersedia. Riwayat simulasi permanen, pengerjaan kuis, dan editor konten masih dalam pengembangan.",
    role: "Anggota Kelompok 11 bersama Ridho Julianor Rizky dan Dzatma Lagustira.",
    coverImage: asset("assets/projects/siagagambut/cover.webp"),
    gallery: [
      asset("assets/projects/siagagambut/demo.webp"),
      asset("assets/projects/siagagambut/lesson.webp"),
    ],
    accent: "forest",
  },
  {
    slug: "sipkos",
    title: "SIPKOS",
    category: "WEB APPLICATION",
    summary:
      "Pencarian kos dengan filter fasilitas, detail hunian, dan alur pemesanan dalam satu aplikasi.",
    description:
      "Aplikasi pencarian dan pemesanan kos berbasis Laravel. Pengguna dapat mencari hunian berdasarkan kata kunci, tipe, harga maksimal, AC, WiFi, dan kamar mandi dalam. Admin mengelola data kos dan daftar booking.",
    technologies: [
      "Laravel",
      "PHP",
      "JavaScript",
      "Tailwind CSS",
      "MySQL",
      "Vite",
    ],
    features: [
      "Pencarian dan filter kos",
      "Detail hunian dan rekomendasi lokasi",
      "Booking dan unggah bukti pembayaran",
      "Ringkasan booking dan bukti PDF",
      "Pengelolaan data kos oleh admin",
    ],
    note: "Riwayat booking pengguna saat ini bergantung pada sesi terakhir. Integrasi chatbot memerlukan konfigurasi dan verifikasi terpisah.",
    coverImage: asset("assets/projects/sipkos/cover.webp"),
    accent: "violet",
  },
];
