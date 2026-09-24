import { ArrowIcon } from "@/components/arrow-icon";
import { CulturalMotif } from "@/components/cultural-motif";
import type { Metadata } from "next";
import { VolunteerForm } from "@/components/volunteer-form";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/sukarelawan", "Sukarelawan", "Ikut melestarikan bahasa daerah Kalimantan Tengah bersama Hapakat.");
const roles = [
  { icon: "◉", title: "Penutur & narator", text: "Membawakan cerita dengan suara dan pelafalan bahasa daerah." },
  { icon: "✎", title: "Penulis cerita", text: "Menuliskan kisah setempat agar dapat dinikmati generasi berikutnya." },
  { icon: "✳", title: "Ilustrator", text: "Menghidupkan suasana cerita melalui gambar dan warna." },
  { icon: "▤", title: "Penyunting", text: "Membantu menjaga ketepatan bahasa dan mutu cerita." },
];

export default function VolunteerPage() {
  return <main><section className="page-hero volunteer-page-hero"><div className="wrap"><div className="section-kicker">SUKARELAWAN / HAPAKAT</div><h1>Bahasa terjaga<br />karena <em>kita bersama.</em></h1><p>Hapakat tumbuh melalui suara, tulisan, gambar, dan waktu yang diberikan banyak orang. Temukan peran yang cocok untukmu.</p><a className="button button-primary" href="#daftar">Ikut berkontribusi <span aria-hidden="true"><ArrowIcon /></span></a></div></section><section className="section-pad roles-section section-with-motif"><CulturalMotif side="left" /><div className="wrap"><div className="section-heading"><div><div className="section-kicker">CARA BERKONTRIBUSI</div><h2>Ada banyak cara<br /><em>menjaga cerita.</em></h2></div><p>Kolaborasi terbuka untuk siapa saja yang peduli pada cerita dan bahasa daerah Kalimantan Tengah.</p></div><div className="role-grid">{roles.map((role, index) => <article className="role-card" key={role.title}><span className="role-number">0{index + 1}</span><span className="role-icon" aria-hidden="true">{role.icon}</span><h3>{role.title}</h3><p>{role.text}</p></article>)}</div></div></section><section className="form-section section-pad" id="daftar"><div className="wrap form-layout"><div className="form-intro"><div className="section-kicker">GABUNG BERSAMA HAPAKAT</div><h2>Suaramu bisa<br /><em>berarti besar.</em></h2><p>Ceritakan peran yang kamu minati dan bagaimana kamu ingin terlibat. Data pendaftaran tersimpan secara privat untuk tim pengelola.</p><div className="form-side-note"><span>✦</span><p>Tidak perlu pengalaman profesional. Kedekatanmu dengan bahasa dan cerita daerah sudah menjadi awal yang baik.</p></div></div><VolunteerForm /></div></section></main>;
}
