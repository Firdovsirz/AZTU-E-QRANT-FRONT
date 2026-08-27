import { Link } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PageMeta from "../../components/common/PageMeta";
import ProjectMemberships from "../../components/projectMemberships/ProjectMemberships";
import { Announcement, getAnnouncements } from "../../services/announcement/announcement";
import AztuLogoLight from "../../../public/aztu-logo-light.png";
import GrantLogoLight from "../../../public/e-grant-logo-light.png";

interface Action {
  to: string;
  icon: ReactNode;
  label: string;
  desc: string;
  accent: string;
}

function ActionCard({ to, icon, label, desc, accent }: Action) {
  return (
    <Link to={to} className="group block">
      <div className="relative h-full overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 p-5 shadow-theme-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-theme-lg dark:border-white/[0.06] dark:bg-white/[0.03]">
        <span className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-30`} />
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          {icon}
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold tracking-tight text-gray-800 dark:text-white/90">{label}</span>
            <ArrowForwardIcon className="size-5 -translate-x-1 text-gray-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-brand-500 group-hover:opacity-100 dark:text-gray-600" />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
        </div>
      </div>
    </Link>
  );
}

function formatDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("az-AZ", { year: "numeric", month: "long", day: "numeric" });
}

export default function Home() {
  const role = useSelector((state: RootState) => state.auth.projectRole);
  const finKod = useSelector((state: RootState) => state.auth.fin_kod);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    getAnnouncements().then(setAnnouncements).catch((err) => console.error("Failed to fetch announcements", err));
  }, []);

  const today = new Date().toLocaleDateString("az-AZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const actions: Action[] = [
    { to: "/projects", icon: <WorkIcon />, label: "Layihələr", desc: "Bütün layihələrə baxış", accent: "from-brand-500 to-brand-600" },
    { to: `/user-details/${finKod}`, icon: <AccountCircleIcon />, label: "Şəxsi məlumatlar", desc: "Profil və tarixçə", accent: "from-purple-500 to-purple-600" },
  ];
  if (role === 0) {
    actions.push({ to: "/project-offer", icon: <SchoolIcon />, label: "Layihə detalları", desc: "Layihə təklifiniz", accent: "from-cyan-500 to-blue-500" });
    // A lead may also serve as an executor on one further project.
    actions.push({ to: "/collaborator-project", icon: <GroupsIcon />, label: "İcraçı olduğum layihə", desc: "Qoşulduğunuz layihə", accent: "from-sky-500 to-indigo-500" });
    actions.push({ to: "/messages", icon: <ChatBubbleOutlineIcon />, label: "Mesajlar", desc: "Admin ilə yazışma", accent: "from-emerald-500 to-teal-500" });
  }
  if (role === 1) {
    actions.push({ to: "/collaborator-project", icon: <GroupsIcon />, label: "İcraçı olduğum layihələr", desc: "Komanda layihələriniz", accent: "from-cyan-500 to-blue-500" });
  }
  if (role === 2) {
    actions.push({ to: "/competitions", icon: <EmojiEventsOutlinedIcon />, label: "Müsabiqələr", desc: "Müsabiqə idarəetməsi", accent: "from-amber-500 to-orange-500" });
    actions.push({ to: "/messages-admin", icon: <ChatBubbleOutlineIcon />, label: "Mesajlar", desc: "İstifadəçi söhbətləri", accent: "from-emerald-500 to-teal-500" });
  }

  return (
    <>
      <PageMeta
        title="AzTU Daxili Qrant Müsabiqəsi"
        description="Azərbaycan Texniki Universitetinin daxili elmi-tədqiqat və innovasiya qrant müsabiqəsi platforması."
      />

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-purple-600 px-6 py-10 text-white shadow-xl sm:px-10 sm:py-12">
        {/* decorative layers */}
        <span className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '22px 22px' }}
        />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> {today}
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
              AzTU Daxili Qrant Müsabiqəsi
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              Elmi-tədqiqat və innovasiya layihələrinin şəffaflıq, rəqabət və elmi keyfiyyət
              prinsipləri əsasında maliyyələşdirilməsi platforması.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-5 rounded-2xl bg-white/10 p-5 backdrop-blur-md ring-1 ring-white/20">
            <img src={AztuLogoLight} alt="AzTU" className="h-14 w-auto md:h-16" />
            <span className="h-12 w-px bg-white/20" />
            <img src={GrantLogoLight} alt="e-Grant" className="h-14 w-auto md:h-16" />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((a) => <ActionCard key={a.to} {...a} />)}
      </div>

      {/* What this user takes part in right now. Admins take part in nothing,
          so they are not asked. */}
      {(role === 0 || role === 1) && <ProjectMemberships />}

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 text-white">
              <CampaignOutlinedIcon className="size-5" />
            </span>
            <h2 className="text-lg font-bold tracking-tight text-gray-800 dark:text-white/90">Elanlar</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 p-5 shadow-theme-sm backdrop-blur-sm transition-shadow hover:shadow-theme-md dark:border-white/[0.06] dark:bg-white/[0.03]"
              >
                <span className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-500 to-purple-500" />
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white/90">{announcement.title}</h3>
                  {announcement.created_at && (
                    <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">{formatDate(announcement.created_at)}</span>
                  )}
                </div>
                <div
                  className="announcement-html mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
