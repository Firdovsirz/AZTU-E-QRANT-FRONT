import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PieChartIcon,
  PlugInIcon,
  UserCircleIcon,
} from "../icons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import AddIcon from '@mui/icons-material/Add';
import { useCallback, useState } from "react";
import WorkIcon from '@mui/icons-material/Work';
import { Link, useLocation } from "react-router";
import PeopleIcon from '@mui/icons-material/People';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useSidebar } from "../context/SidebarContext";
import GrantLogoDark from "../../public/aztu-logo-dark.png";
import GrantLogoLight from "../../public/aztu-logo-light.png";
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import HistoryIcon from '@mui/icons-material/History';
import GroupsIcon from '@mui/icons-material/Groups';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Əsas",
    path: "/home",
  },
  {
    icon: <WorkIcon />,
    name: "Lahiyələr",
    path: "/projects",
  },
  {
    icon: <UserCircleIcon />,
    name: "Şəxsi məlumatlar",
    path: "/user-details/:fin_kod",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const projectRole = useSelector((state: RootState) => state.auth.projectRole);

  const navItemsWithProject = [
    ...navItems,
    ...(projectRole === 0
      ? [
        {
          icon: <PeopleIcon />,
          name: "Təsdiq gözləyən icraçılar",
          path: "/approve-waiting-users"
        },
        {
          icon: <UserCircleIcon />,
          name: "Lahiyə Detalları",
          subItems: [
            { name: "Layihənin təklifi", path: "/project-offer", pro: false },
            { name: "Layihəm", path: "/my-project", pro: false },
            { name: "Layihə komandası", path: "/collaborators", pro: false },
            { name: "Layihədə görüləcək işlər (ay üzrə)", path: "/project-activities", pro: false, new: true },
            { name: "Rüblük Elmi-Texniki Hesabat", path: "/quarterly-report", pro: false, new: true },
          ],
        },
        {
          icon: <UserCircleIcon />,
          name: "Lahiyə Smetası",
          subItems: [
            { name: "Layihə smetası", path: "/main-smeta", pro: false },
            {
              name: "Layihə rəhbərinin və icraçıların xidmət haqqı smetası",
              path: "/project-smeta-salary",
              pro: false,
            },
            {
              name: "Avadanlıq, cihaz, qurğu və mal-materialların satınalınması smetası",
              path: "/project-smeta-tools",
              pro: false,
            },
            {
              name: "İşlərin və xidmətlərin satınalınması smetası",
              path: "/project-smeta-services",
              pro: false,
            },
            {
              name: "Layihə üzrə icarə xərclər smetası",
              path: "/project-smeta-expences",
              pro: false,
            },
            {
              name: "Digər birbaşa xərclər smetası",
              path: "/project-smeta-other-expences",
              pro: false,
            },
          ],
        },
        {
          icon: <GroupsIcon />,
          name: "İcraçı olduğum layihə",
          path: "/collaborator-project"
        },
        {
          icon: <SwapHorizIcon />,
          name: "Rol dəyişikliyi",
          path: "/role-change"
        },
        {
          icon: <ChatBubbleOutlineIcon />,
          name: "Mesajlar",
          path: "/messages"
        },
        {
          icon: <HistoryIcon />,
          name: "Layihə tarixçəm",
          path: "/my-history"
        },
      ]
      : projectRole === 2 ? [
        {
          icon: <EmojiEventsOutlinedIcon />,
          name: "Müsabiqələr",
          path: "/competitions"
        },
        {
          icon: <PeopleOutlineIcon />,
          name: "Ekspertlər",
          path: "/experts"
        },
        {
          icon: <AddIcon />,
          name: "Yeni ekspert",
          path: "/new-expert"
        },
        {
          icon: <PeopleOutlineIcon />,
          name: "Təsdiq gözləyən istifadəçilər",
          path: "/approve-waiting-auth-users"
        },
        {
          icon: <BookmarkBorderIcon />,
          name: "Prioritetlər",
          path: "/prioritets"
        },
        {
          icon: <CampaignOutlinedIcon />,
          name: "Elanlar",
          path: "/announcements"
        },
        {
          icon: <VpnKeyIcon />,
          name: "Rol və icazələr",
          path: "/role-permissions"
        },
        {
          icon: <SwapHorizIcon />,
          name: "Rol dəyişiklik sorğuları",
          path: "/role-change-requests"
        },
        {
          icon: <ChatBubbleOutlineIcon />,
          name: "Mesajlar",
          path: "/messages-admin"
        },
        {
          icon: <WorkIcon />,
          name: "Təqdim edilmiş layihələr",
          path: "/projects/submitted",
        },
        {
          icon: <Inventory2OutlinedIcon />,
          name: "Arxiv",
          path: "/projects/archive"
        },
      ] : projectRole === 1 ? [
        {
          icon: <WorkIcon />,
          name: "İcraçı olduğum layihələr",
          path: "/collaborator-project"
        },
        {
          icon: <SwapHorizIcon />,
          name: "Rol dəyişikliyi",
          path: "/role-change"
        },
        {
          icon: <HistoryIcon />,
          name: "Layihə tarixçəm",
          path: "/my-history"
        },
      ]
        : []),
  ];

  const { isExpanded, isMobileOpen, isHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    [...navItemsWithProject, ...othersItems].forEach((item) => {
      if (item.subItems) {
        initialState[item.name] = true;
      }
    });
    return initialState;
  });

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-1.5">
      {items.map((nav, index) => (
        <li key={index}>
          {nav.subItems ? (
            <div
              onClick={() => toggleSubmenu(nav.name)}
              className={`menu-item group ${openSubmenus[nav.name] ? "menu-item-active" : "menu-item-inactive"} cursor-pointer ${!isExpanded && !isHovered
                ? "lg:justify-center"
                : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size menu-item-icon-active`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenus[nav.name] ? "rotate-180" : ""} text-brand-500`}
                />
              )}
            </div>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                {isActive(nav.path) && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-gradient-to-b from-brand-500 to-purple-500 shadow-[0_0_10px_rgba(24,47,121,0.6)]" />
                )}
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && openSubmenus[nav.name] && (isExpanded || isHovered || isMobileOpen) && (
            <div className="mt-1.5 ml-5 pl-4 border-l border-dashed border-gray-200 dark:border-white/[0.08]">
              <ul className="space-y-0.5">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`relative menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      <span className="flex-1 leading-snug pr-2">{subItem.name}</span>
                      <span className="flex items-center gap-1 ml-auto shrink-0">
                        {subItem.new && (
                          <span
                            className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-error-500 to-orange-500 text-white shadow-[0_2px_8px_-2px_rgba(240,68,56,0.55)]"
                          >
                            YENİ
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-3 left-0 backdrop-blur-2xl bg-white/85 dark:bg-gray-950/80 dark:border-white/[0.06] text-gray-900 h-screen transition-all duration-300 ease-out z-50 border-r border-gray-200/60 shadow-[1px_0_24px_-12px_rgba(20,19,61,0.10)]
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && undefined}
      onMouseLeave={() => undefined}
    >
      <div
        className={`py-6 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start px-2"
          }`}
      >
        <Link to="/home" className="group relative flex items-center justify-center rounded-2xl transition-all">
          <span className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-br from-brand-500/15 via-purple-500/10 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
          <img
            src={GrantLogoLight}
            alt="Logo Light"
            className={`relative ${isExpanded || isHovered ? "h-[88px]" : "h-[36px]"} hidden dark:block transition-all duration-300`}
          />
          <img
            src={GrantLogoDark}
            alt="Logo Dark"
            className={`relative ${isExpanded || isHovered ? "h-[88px]" : "h-[36px]"} block dark:hidden transition-all duration-300`}
          />
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-[11px] font-semibold tracking-[0.12em] uppercase flex leading-[20px] text-gray-400 dark:text-gray-500 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Əsas keçidlər"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItemsWithProject)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;