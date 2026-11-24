import { runtime } from "../lib/runtime";
export const asset = (path: string) =>
  `${runtime.baseUrl}/${path.replace(/^\//, "")}`;
export const profile = {
  name: "Muhammad Indra",
  brand: "indra.dev",
  instagram: "https://www.instagram.com/mhmmd_.indra/",
  handle: "@mhmmd_.indra",
  intro:
    "Halo, saya Muhammad Indra. Saya senang merancang dan mengembangkan pengalaman digital yang menarik, bermanfaat, dan mudah digunakan.",
  roles: ["Web Developer", "UI/UX Enthusiast", "Creative Problem Solver"],
  about:
    "Saya mengeksplorasi pertemuan antara kode, desain, dan pembelajaran. Dari petualangan belajar Python di PyroRescue hingga edukasi lahan basah di SiagaGambut, saya senang membuat ide menjadi pengalaman yang bisa digunakan.",
  education: [
    {
      title: "SMK Negeri 1 Gambut",
      subtitle: "Teknik Komputer dan Jaringan",
      note: "Praktik industri · 2023",
    },
    {
      title: "Universitas Lambung Mangkurat",
      subtitle: "Pendidikan Komputer",
      note: "Teknologi & pendidikan",
    },
  ],
  experience: [
    {
      title: "Pueblo Science Workshop",
      subtitle: "Committee · FKIP ULM & Pueblo Science",
      note: "28–29 Mei 2025",
    },
    {
      title: "PT Suka Guna Indonesia",
      subtitle: "Praktik Kerja Industri · PC & jaringan",
      note: "3 Juli–20 Oktober 2023",
    },
    {
      title: "Pengembangan PyroRescue",
      subtitle: "UI/UX & navigasi · akun & profil pemain",
      note: "Tutorial & aset visual",
    },
  ],
  heroImage: asset("assets/indra/hero-watch.webp"),
  email: runtime.email,
  aboutImage: asset("assets/indra/about-cutout.webp"),
  spotifyPlaylistUrl: "",
};
