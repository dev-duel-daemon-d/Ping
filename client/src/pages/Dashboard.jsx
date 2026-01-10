import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard"; // Importing the new PostCard component
import {
  Gamepad2,
  Trophy,
  Users,
  Zap,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Share2,
  Heart,
  Target,
  Swords,
  Brain,
  Crosshair,
  Search,
  Bell,
  LogOut,
  Settings,
  Camera,
  Upload,
  History,
  Medal,
  Monitor,
  Download,
  Pencil,
  Mouse,
  Copy,
  Trash2,
  Plus,
  Twitter,
  Instagram,
  Youtube,
  Twitch,
  Link as LinkIcon,
  Crown,
  ChevronUp,
  ChevronDown,
  Loader2,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  Avatar,
  Modal,
  Box,
  IconButton,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { X, Check } from "lucide-react";
import {
  userService,
  notificationService,
  connectionService,
  messageService,
  uploadService,
  profileService,
  gameService,
  postService, // Add postService
  enchantmentService,
} from "../services/api";
import { subscribeUserToPush } from "../utils/pushNotifications";
import Navbar from "../components/navigation/Navbar";
import EnchantmentBubble from "../components/EnchantmentBubble";

// --- Custom Icons for Socials ---
const DiscordIcon = ({ className }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.46 13.46 0 0 0-1.063 2.193 18.068 18.068 0 0 0-4.57 0 13.513 13.513 0 0 0-1.07-2.193.076.076 0 0 0-.078-.037 19.736 19.736 0 0 0-4.885 1.515.077.077 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const TikTokIcon = ({ className }) => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.45095 19.7926C8.60723 18.4987 9.1379 17.7743 10.1379 17.0317C11.5688 16.0259 13.3561 16.5948 13.3561 16.5948V13.2197C13.7907 13.2085 14.2254 13.2343 14.6551 13.2966V17.6401C14.6551 17.6401 12.8683 17.0712 11.4375 18.0775C10.438 18.8196 9.90623 19.5446 9.7505 20.8385C9.74562 21.5411 9.87747 22.4595 10.4847 23.2536C10.3345 23.1766 10.1815 23.0889 10.0256 22.9905C8.68807 22.0923 8.44444 20.7449 8.45095 19.7926ZM22.0352 6.97898C21.0509 5.90039 20.6786 4.81139 20.5441 4.04639H21.7823C21.7823 4.04639 21.5354 6.05224 23.3347 8.02482L23.3597 8.05134C22.8747 7.7463 22.43 7.38624 22.0352 6.97898ZM28 10.0369V14.293C28 14.293 26.42 14.2312 25.2507 13.9337C23.6179 13.5176 22.5685 12.8795 22.5685 12.8795C22.5685 12.8795 21.8436 12.4245 21.785 12.3928V21.1817C21.785 21.6711 21.651 22.8932 21.2424 23.9125C20.709 25.246 19.8859 26.1212 19.7345 26.3001C19.7345 26.3001 18.7334 27.4832 16.9672 28.28C15.3752 28.9987 13.9774 28.9805 13.5596 28.9987C13.5596 28.9987 11.1434 29.0944 8.96915 27.6814C8.49898 27.3699 8.06011 27.0172 7.6582 26.6277L7.66906 26.6355C9.84383 28.0485 12.2595 27.9528 12.2595 27.9528C12.6779 27.9346 14.0756 27.9528 15.6671 27.2341C17.4317 26.4374 18.4344 25.2543 18.4344 25.2543C18.5842 25.0754 19.4111 24.2001 19.9423 22.8662C20.3498 21.8474 20.4849 20.6247 20.4849 20.1354V11.3475C20.5435 11.3797 21.2679 11.8347 21.2679 11.8347C21.2679 11.8347 22.3179 12.4734 23.9506 12.8889C25.1204 13.1864 26.7 13.2483 26.7 13.2483V9.91314C27.2404 10.0343 27.7011 10.0671 28 10.0369Z"
      fill="#EE1D52"
    />

    <path
      d="M26.7009 9.91314V13.2472C26.7009 13.2472 25.1213 13.1853 23.9515 12.8879C22.3188 12.4718 21.2688 11.8337 21.2688 11.8337C21.2688 11.8337 20.5444 11.3787 20.4858 11.3464V20.1364C20.4858 20.6258 20.3518 21.8484 19.9432 22.8672C19.4098 24.2012 18.5867 25.0764 18.4353 25.2553C18.4353 25.2553 17.4337 26.4384 15.668 27.2352C14.0765 27.9539 12.6788 27.9357 12.2604 27.9539C12.2604 27.9539 9.84473 28.0496 7.66995 26.6366L7.6591 26.6288C7.42949 26.4064 7.21336 26.1717 7.01177 25.9257C6.31777 25.0795 5.89237 24.0789 5.78547 23.7934C5.78529 23.7922 5.78529 23.791 5.78547 23.7898C5.61347 23.2937 5.25209 22.1022 5.30147 20.9482C5.38883 18.9122 6.10507 17.6625 6.29444 17.3494C6.79597 16.4957 7.44828 15.7318 8.22233 15.0919C8.90538 14.5396 9.6796 14.1002 10.5132 13.7917C11.4144 13.4295 12.3794 13.2353 13.3565 13.2197V16.5948C13.3565 16.5948 11.5691 16.028 10.1388 17.0317C9.13879 17.7743 8.60812 18.4987 8.45185 19.7926C8.44534 20.7449 8.68897 22.0923 10.0254 22.991C10.1813 23.0898 10.3343 23.1775 10.4845 23.2541C10.7179 23.5576 11.0021 23.8221 11.3255 24.0368C12.631 24.8632 13.7249 24.9209 15.1238 24.3842C16.0565 24.0254 16.7586 23.2167 17.0842 22.3206C17.2888 21.7611 17.2861 21.1978 17.2861 20.6154V4.04639H20.5417C20.6763 4.81139 21.0485 5.90039 22.0328 6.97898C22.4276 7.38624 22.8724 7.7463 23.3573 8.05134C23.5006 8.19955 24.2331 8.93231 25.1734 9.38216C25.6596 9.61469 26.1722 9.79285 26.7009 9.91314Z"
      fill="#000000"
    />

    <path
      d="M4.48926 22.7568V22.7594L4.57004 22.9784C4.56076 22.9529 4.53074 22.8754 4.48926 22.7568Z"
      fill="#69C9D0"
    />

    <path
      d="M10.5128 13.7916C9.67919 14.1002 8.90498 14.5396 8.22192 15.0918C7.44763 15.7332 6.79548 16.4987 6.29458 17.354C6.10521 17.6661 5.38897 18.9168 5.30161 20.9528C5.25223 22.1068 5.61361 23.2983 5.78561 23.7944C5.78543 23.7956 5.78543 23.7968 5.78561 23.798C5.89413 24.081 6.31791 25.0815 7.01191 25.9303C7.2135 26.1763 7.42963 26.4111 7.65924 26.6334C6.92357 26.1457 6.26746 25.5562 5.71236 24.8839C5.02433 24.0451 4.60001 23.0549 4.48932 22.7626C4.48919 22.7605 4.48919 22.7584 4.48932 22.7564V22.7527C4.31677 22.2571 3.95431 21.0651 4.00477 19.9096C4.09213 17.8736 4.80838 16.6239 4.99775 16.3108C5.4985 15.4553 6.15067 14.6898 6.92509 14.0486C7.608 13.4961 8.38225 13.0567 9.21598 12.7484C9.73602 12.5416 10.2778 12.3891 10.8319 12.2934C11.6669 12.1537 12.5198 12.1415 13.3588 12.2575V13.2196C12.3808 13.2349 11.4148 13.4291 10.5128 13.7916Z"
      fill="#69C9D0"
    />

    <path
      d="M20.5438 4.04635H17.2881V20.6159C17.2881 21.1983 17.2881 21.76 17.0863 22.3211C16.7575 23.2167 16.058 24.0253 15.1258 24.3842C13.7265 24.923 12.6326 24.8632 11.3276 24.0368C11.0036 23.823 10.7187 23.5594 10.4844 23.2567C11.5962 23.8251 12.5913 23.8152 13.8241 23.341C14.7558 22.9821 15.4563 22.1734 15.784 21.2774C15.9891 20.7178 15.9864 20.1546 15.9864 19.5726V3H20.4819C20.4819 3 20.4315 3.41188 20.5438 4.04635ZM26.7002 8.99104V9.9131C26.1725 9.79263 25.6609 9.61447 25.1755 9.38213C24.2352 8.93228 23.5026 8.19952 23.3594 8.0513C23.5256 8.1559 23.6981 8.25106 23.8759 8.33629C25.0192 8.88339 26.1451 9.04669 26.7002 8.99104Z"
      fill="#69C9D0"
    />
  </svg>
);

const SteamIcon = ({ className }) => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.56967 20.0269C4.30041 25.7964 9.65423 30 15.9906 30C23.7274 30 29.9995 23.7318 29.9995 16C29.9995 8.26803 23.7274 2 15.9906 2C8.56634 2 2.49151 7.77172 2.01172 15.0699C2.01172 17.1667 2.01172 18.0417 2.56967 20.0269Z"
      fill="url(#paint0_linear_87_8314)"
    />

    <path
      d="M15.2706 12.5629L11.8426 17.5395C11.0345 17.5028 10.221 17.7314 9.54572 18.1752L2.01829 15.0784C2.01829 15.0784 1.84411 17.9421 2.56999 20.0763L7.89147 22.2707C8.15866 23.464 8.97779 24.5107 10.1863 25.0142C12.1635 25.8398 14.4433 24.8988 15.2658 22.922C15.4799 22.4052 15.5797 21.8633 15.5652 21.3225L20.5904 17.8219C23.5257 17.8219 25.9114 15.4305 25.9114 12.4937C25.9114 9.55673 23.5257 7.16748 20.5904 7.16748C17.7553 7.16748 15.1117 9.64126 15.2706 12.5629ZM14.4469 22.5783C13.8103 24.1057 12.054 24.8303 10.5273 24.1946C9.82302 23.9014 9.29128 23.3642 8.98452 22.7237L10.7167 23.4411C11.8426 23.9098 13.1343 23.3762 13.6023 22.2514C14.0718 21.1254 13.5392 19.8324 12.4139 19.3637L10.6233 18.6222C11.3142 18.3603 12.0997 18.3507 12.8336 18.6559C13.5734 18.9635 14.1475 19.5428 14.4517 20.283C14.756 21.0233 14.7548 21.8404 14.4469 22.5783ZM20.5904 16.0434C18.6364 16.0434 17.0455 14.4511 17.0455 12.4937C17.0455 10.5379 18.6364 8.94518 20.5904 8.94518C22.5457 8.94518 24.1365 10.5379 24.1365 12.4937C24.1365 14.4511 22.5457 16.0434 20.5904 16.0434ZM17.9341 12.4883C17.9341 11.0159 19.127 9.82159 20.5964 9.82159C22.0671 9.82159 23.2599 11.0159 23.2599 12.4883C23.2599 13.9609 22.0671 15.1541 20.5964 15.1541C19.127 15.1541 17.9341 13.9609 17.9341 12.4883Z"
      fill="white"
    />

    <defs>
      <linearGradient
        id="paint0_linear_87_8314"
        x1="16.0056"
        y1="2"
        x2="16.0056"
        y2="30"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#111D2E" />

        <stop offset="0.21248" stop-color="#051839" />

        <stop offset="0.40695" stop-color="#0A1B48" />

        <stop offset="0.5811" stop-color="#132E62" />

        <stop offset="0.7376" stop-color="#144B7E" />

        <stop offset="0.87279" stop-color="#136497" />

        <stop offset="1" stop-color="#1387B8" />
      </linearGradient>
    </defs>
  </svg>
);

const XboxIcon = ({ className }) => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      opacity="0.852"
      cx="16"
      cy="16"
      r="14"
      fill="url(#paint0_radial_87_8329)"
    />
    <path
      d="M6.75137 26.5333C6.73227 26.5193 6.7127 26.5016 6.69312 26.4801C6.33073 26.1504 5.74045 25.6304 5.12362 24.8444C4.5909 23.6889 4.89287 21.748 6.20386 19.0075C8.05357 15.1409 11.0131 11.2151 12.2265 9.8225C11.8813 9.43732 10.8119 8.38253 9.29659 7.24477C7.7813 6.10701 6.67738 5.99047 6.29264 6.05961C6.64779 5.67443 7.47646 4.94852 8.17196 4.45964C10.3265 3.39299 14.3081 5.19543 16.0148 6.22257V13.2891C11.6642 16.6372 7.63924 21.8075 6.82536 23.8222C6.20418 25.36 6.44975 26.2128 6.69312 26.4801C6.71325 26.4984 6.73269 26.5161 6.75137 26.5333Z"
      fill="url(#paint1_linear_87_8329)"
    />
    <path
      d="M6.75137 26.5331C6.73227 26.5191 6.7127 26.5014 6.69311 26.4799C6.33072 26.1502 5.74045 25.6302 5.12362 24.8442C4.5909 23.6887 4.89287 21.7477 6.20386 19.0073C8.35133 14.5183 12.2265 9.82227 12.2265 9.82227C12.2265 9.82227 12.9185 11.5405 14.4888 14.5183C10.4444 18.1034 7.63923 21.8072 6.82536 23.822C6.20418 25.3598 6.44974 26.2126 6.69311 26.4799C6.71325 26.4982 6.73268 26.5159 6.75137 26.5331Z"
      fill="url(#paint2_linear_87_8329)"
    />
    <path
      d="M25.2779 26.5333C25.297 26.5193 25.3166 26.5016 25.3362 26.4801C25.6986 26.1504 26.2888 25.6304 26.9057 24.8444C27.4384 23.6889 27.1364 21.748 25.8254 19.0075C23.9757 15.1409 21.0162 11.2151 19.8028 9.8225C20.148 9.43732 21.2174 8.38253 22.7327 7.24477C24.248 6.10701 25.3519 5.99047 25.7367 6.05961C25.3815 5.67443 24.5528 4.94852 23.8573 4.45964C21.7028 3.39299 17.7212 5.19543 16.0145 6.22257V13.2891C20.3651 16.6372 24.3901 21.8075 25.2039 23.8222C25.8251 25.36 25.5796 26.2128 25.3362 26.4801C25.316 26.4984 25.2966 26.5161 25.2779 26.5333Z"
      fill="url(#paint3_linear_87_8329)"
    />
    <path
      d="M25.2779 26.5331C25.297 26.5191 25.3166 26.5014 25.3362 26.4799C25.6986 26.1502 26.2888 25.6302 26.9057 24.8442C27.4384 23.6887 27.1364 21.7477 25.8254 19.0073C23.678 14.5183 19.8028 9.82227 19.8028 9.82227C19.8028 9.82227 19.1108 11.5405 17.5405 14.5183C21.5849 18.1034 24.3901 21.8072 25.2039 23.822C25.8251 25.3598 25.5796 26.2126 25.3362 26.4799C25.3161 26.4982 25.2966 26.5159 25.2779 26.5331Z"
      fill="url(#paint4_linear_87_8329)"
    />
    <defs>
      <radialGradient
        id="paint0_radial_87_8329"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(16 14.5) rotate(90.0548) scale(15.5)"
      >
        <stop stop-color="#FAFAFA" />
        <stop offset="0.499976" stop-color="#EFEFEF" />
        <stop offset="0.828794" stop-color="#C0BEC0" />
        <stop offset="1" stop-color="#879288" />
      </radialGradient>
      <linearGradient
        id="paint1_linear_87_8329"
        x1="12.9925"
        y1="4.72589"
        x2="13.2296"
        y2="12.7852"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#008B00" />
        <stop offset="1" stop-color="#6CC329" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_87_8329"
        x1="10.1481"
        y1="12.6667"
        x2="12.874"
        y2="16.4"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#008C00" />
        <stop offset="1" stop-color="#48BF21" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_87_8329"
        x1="19.0368"
        y1="4.72589"
        x2="18.7997"
        y2="12.7852"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#008B00" />
        <stop offset="1" stop-color="#6CC329" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_87_8329"
        x1="21.8812"
        y1="12.6667"
        x2="19.1553"
        y2="16.4"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#008C00" />
        <stop offset="1" stop-color="#48BF21" />
      </linearGradient>
    </defs>
  </svg>
);

const PlayStationIcon = ({ className }) => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.69116 21.9548C-0.506476 22.7935 -0.284724 24.2384 2.44769 25.1419C5.18011 26.0455 8.35603 26.2323 11.1505 25.729C11.0707 25.729 11.3102 25.729 11.1505 25.729V22.8774L8.43588 23.8C7.39792 24.1355 6.35997 24.2194 5.32202 23.9677C4.5236 23.7161 4.68328 23.2129 5.64139 22.7935L11.1505 20.7806V17.6774L3.48565 20.4452C2.52754 20.7806 1.56943 21.2839 0.69116 21.9548ZM19.2146 9.37419V17.5097C22.4881 19.1871 25.0431 17.5097 25.0431 13.1484C25.0431 8.70323 23.5261 6.69032 19.1348 5.09677C16.8193 4.25806 14.4241 3.50323 12.0288 3V27.2387L17.6178 29V8.61935C17.6178 7.69677 17.6178 7.02581 18.2565 7.27742C19.1348 7.52903 19.2146 8.45161 19.2146 9.37419ZM29.5941 20.0258C27.2787 19.1871 24.8036 18.8516 22.4083 19.1032C21.0779 19.1906 19.8294 19.5869 18.5759 20.0258V23.2968L23.7656 21.2839C24.8036 20.9484 25.8415 20.8645 26.8795 21.1161C27.6779 21.3677 27.5182 21.871 26.5601 22.2903L18.5759 25.3935V28.5806L29.5941 24.3032C30.3925 23.9677 31.1111 23.5484 31.7499 22.8774C32.3088 22.0387 32.0692 20.8645 29.5941 20.0258Z"
      fill="#0070D1"
    />
  </svg>
);

const YouTubeIcon = ({ className }) => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 -7 48 48"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <title>Youtube-color</title>

    <desc>Created with Sketch.</desc>

    <defs></defs>

    <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g
        id="Color-"
        transform="translate(-200.000000, -368.000000)"
        fill="#CE1312"
      >
        <path
          d="M219.044,391.269916 L219.0425,377.687742 L232.0115,384.502244 L219.044,391.269916 Z M247.52,375.334163 C247.52,375.334163 247.0505,372.003199 245.612,370.536366 C243.7865,368.610299 241.7405,368.601235 240.803,368.489448 C234.086,368 224.0105,368 224.0105,368 L223.9895,368 C223.9895,368 213.914,368 207.197,368.489448 C206.258,368.601235 204.2135,368.610299 202.3865,370.536366 C200.948,372.003199 200.48,375.334163 200.48,375.334163 C200.48,375.334163 200,379.246723 200,383.157773 L200,386.82561 C200,390.73817 200.48,394.64922 200.48,394.64922 C200.48,394.64922 200.948,397.980184 202.3865,399.447016 C204.2135,401.373084 206.612,401.312658 207.68,401.513574 C211.52,401.885191 224,402 224,402 C224,402 234.086,401.984894 240.803,401.495446 C241.7405,401.382148 243.7865,401.373084 245.612,399.447016 C247.0505,397.980184 247.52,394.64922 247.52,394.64922 C247.52,394.64922 248,390.73817 248,386.82561 L248,383.157773 C248,379.246723 247.52,375.334163 247.52,375.334163 L247.52,375.334163 Z"
          id="Youtube"
        ></path>
      </g>
    </g>
  </svg>
);

const XIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#fff"
    className="bi bi-twitter-x"
    viewBox="0 0 16 16"
    id="Twitter-X--Streamline-Bootstrap"
    height="16"
    width="16"
  >
    <desc>Twitter X Streamline Icon: https://streamlinehq.com</desc>
    <path
      d="M12.6 0.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867 -5.07 -4.425 5.07H0.316l5.733 -6.57L0 0.75h5.063l3.495 4.633L12.601 0.75Zm-0.86 13.028h1.36L4.323 2.145H2.865z"
      strokeWidth="1"
    ></path>
  </svg>
);

const TwitchIcon = ({ className }) => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <path fill="#ffffff" d="M13 7.5l-2 2H9l-1.75 1.75V9.5H5V2h8v5.5z" />
    <g fill="#9146FF">
      <path d="M4.5 1L2 3.5v9h3V15l2.5-2.5h2L14 8V1H4.5zM13 7.5l-2 2H9l-1.75 1.75V9.5H5V2h8v5.5z" />
      <path d="M11.5 3.75h-1v3h1v-3zM8.75 3.75h-1v3h1v-3z" />
    </g>
  </svg>
);

// --- Game Logo Helper ---
const GameLogo = ({ gameName, supportedGames, className }) => {
  const game = supportedGames.find(
    (g) => g.name.toLowerCase() === gameName?.toLowerCase(),
  );

  if (game?.logo) {
    return (
      <img
        src={game.logo}
        alt={gameName}
        className={`${className} object-contain`}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "block";
        }}
      />
    );
  }

  // Fallback icon logic if needed, or simply render the fallback immediately if no logo found
  return <Gamepad2 className={`${className} text-slate-500`} />;
};

// --- Socials Display Component ---
const SocialsDisplay = ({ socials, isOwnProfile, onEdit }) => {
  const socialConfig = [
    {
      key: "twitter",
      icon: XIcon,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
      border: "border-sky-400/20",
      hover: "hover:bg-sky-400/20",
      label: "Twitter",
      urlPrefix: "https://twitter.com/",
    },
    {
      key: "instagram",
      icon: Instagram,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      hover: "hover:bg-pink-500/20",
      label: "Instagram",
      urlPrefix: "https://instagram.com/",
    },
    {
      key: "twitch",
      icon: TwitchIcon,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20",
      hover: "hover:bg-purple-400/20",
      label: "Twitch",
      urlPrefix: "https://twitch.tv/",
    },
    {
      key: "youtube",
      icon: YouTubeIcon,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      hover: "hover:bg-red-500/20",
      label: "YouTube",
      urlPrefix: "https://youtube.com/",
    },
    {
      key: "tiktok",
      icon: TikTokIcon,
      color: "text-[#ff0050]",
      bg: "bg-[#ff0050]/10",
      border: "border-[#ff0050]/20",
      hover: "hover:bg-[#ff0050]/20",
      label: "TikTok",
      urlPrefix: "https://tiktok.com/@",
    },
    {
      key: "discord",
      icon: DiscordIcon,
      color: "text-indigo-400",
      bg: "bg-indigo-400/10",
      border: "border-indigo-400/20",
      hover: "hover:bg-indigo-400/20",
      label: "Discord",
      isCopy: true,
    },
    {
      key: "steam",
      icon: SteamIcon,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
      hover: "hover:bg-blue-400/20",
      label: "Steam",
      urlPrefix: "https://steamcommunity.com/profiles/",
    },
    {
      key: "psn",
      icon: PlayStationIcon,
      color: "text-blue-600",
      bg: "bg-blue-600/10",
      border: "border-blue-600/20",
      hover: "hover:bg-blue-600/20",
      label: "PS5",
      isCopy: true,
    },
    {
      key: "xbox",
      icon: XboxIcon,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      hover: "hover:bg-green-500/20",
      label: "Xbox",
      isCopy: true,
    },
  ];

  const hasSocials = socialConfig.some((s) => socials?.[s.key]);

  if (!hasSocials && !isOwnProfile) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-6 mb-8 relative">
      {socialConfig.map((social) => {
        const handle = socials?.[social.key];
        if (!handle) return null;

        const Icon = social.icon;

        if (social.isCopy) {
          return (
            <div
              key={social.key}
              onClick={() => {
                navigator.clipboard.writeText(handle);
                // Could add a toast here
                alert(`Copied ${handle} to clipboard!`);
              }}
              className={`flex items-center justify-center sm:justify-start gap-0 sm:gap-2 p-2 sm:px-3 sm:py-1.5 rounded-full border ${social.bg} ${social.border} ${social.color} ${social.hover} transition-all cursor-pointer group`}
            >
              <Icon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="text-xs font-bold hidden sm:block">
                {social.key === "steam" ? "Steam" : handle}
              </span>
            </div>
          );
        }

        return (
          <a
            key={social.key}
            href={`${social.urlPrefix}${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center sm:justify-start gap-0 sm:gap-2 p-2 sm:px-3 sm:py-1.5 rounded-full border ${social.bg} ${social.border} ${social.color} ${social.hover} transition-all cursor-pointer group no-underline`}
          >
            <Icon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="text-xs font-bold hidden sm:block">
              {social.key === "steam" ? "Steam" : handle}
            </span>
          </a>
        );
      })}

      {isOwnProfile && (
        <button
          onClick={onEdit}
          className="ml-2 p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
          title="Edit Socials"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

// --- Game Edit Modal ---
const GameEditModal = ({
  open,
  onClose,
  onSave,
  editingGame,
  supportedGames,
}) => {
  const [formData, setFormData] = useState({
    game: "",
    genre: "",
    role: "",
    rank: "",
    peakRank: "",
    isPrimary: false,
  });
  const [isOther, setIsOther] = useState(false);
  const [saving, setSaving] = useState(false);

  const GENRES = [
    "First-Person Shooter (FPS)",
    "Battle Royale",
    "Multiplayer Online Battle Arena (MOBA)",
    "Real-Time Strategy (RTS)",
    "Fighting Games",
    "Sports Games (Simulation)",
    "Racing Games (Sim Racing)",
    "Digital Card Games (CCG/TCG)",
    "Auto-Battlers (Auto Chess)",
    "Survival Multiplayer",
  ];

  useEffect(() => {
    if (editingGame) {
      const isKnown = supportedGames.some((g) => g.name === editingGame.game);
      setFormData({
        game: editingGame.game || "",
        genre: editingGame.genre || "",
        role: editingGame.role || "",
        rank: editingGame.rank || "",
        peakRank: editingGame.peakRank || "",
        isPrimary: editingGame.isPrimary || false,
      });
      setIsOther(!isKnown && !!editingGame.game);
    } else {
      setFormData({
        game: "",
        genre: "",
        role: "",
        rank: "",
        peakRank: "",
        isPrimary: false,
      });
      setIsOther(false);
    }
  }, [editingGame, open, supportedGames]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.game.trim() || !formData.role.trim() || !formData.rank.trim())
      return;

    setSaving(true);
    try {
      await onSave(formData, editingGame?._id);
      onClose();
    } catch (err) {
      console.error("Failed to save game:", err);
    }
    setSaving(false);
  };

  return (
    <EditModal
      open={open}
      onClose={onClose}
      title={editingGame ? "Edit Game Experience" : "Add Game Experience"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Game *
          </label>
          {isOther ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.game}
                  onChange={(e) =>
                    setFormData({ ...formData, game: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
                  placeholder="Enter game name"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsOther(false);
                    setFormData({ ...formData, game: "", genre: "" });
                  }}
                  className="px-3 bg-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Genre *
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) =>
                    setFormData({ ...formData, genre: e.target.value })
                  }
                  className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 appearance-none"
                  required
                >
                  <option value="" disabled>
                    Select a genre
                  </option>
                  {GENRES.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <select
              value={formData.game}
              onChange={(e) => {
                if (e.target.value === "Other") {
                  setIsOther(true);
                  setFormData({ ...formData, game: "", genre: "" });
                } else {
                  const selectedGame = supportedGames.find(
                    (g) => g.name === e.target.value,
                  );
                  setFormData({
                    ...formData,
                    game: e.target.value,
                    genre: selectedGame?.genre || "",
                  });
                }
              }}
              className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 appearance-none"
              required
            >
              <option value="" disabled>
                Select a game
              </option>
              {supportedGames.map((game) => (
                <option key={game._id} value={game.name}>
                  {game.name}
                </option>
              ))}
              <option value="Other">Other...</option>
            </select>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Role *
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
              placeholder="e.g. Duelist"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Current Rank *
            </label>
            <input
              type="text"
              value={formData.rank}
              onChange={(e) =>
                setFormData({ ...formData, rank: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
              placeholder="e.g. Ascendant 2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Peak Rank (Optional)
          </label>
          <input
            type="text"
            value={formData.peakRank}
            onChange={(e) =>
              setFormData({ ...formData, peakRank: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
            placeholder="e.g. Immortal 3"
          />
        </div>

        <div
          className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer"
          onClick={() =>
            setFormData((prev) => ({ ...prev, isPrimary: !prev.isPrimary }))
          }
        >
          <div
            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.isPrimary ? "bg-primary border-primary" : "border-slate-500"}`}
          >
            {formData.isPrimary && <Check className="w-3.5 h-3.5 text-black" />}
          </div>
          <span className="text-sm font-medium text-slate-200">
            Set as Primary Game
          </span>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !formData.game.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            {saving ? "Saving..." : editingGame ? "Update" : "Add Game"}
          </button>
        </div>
      </form>
    </EditModal>
  );
};

// --- Socials Edit Modal ---
const SocialsEditModal = ({ open, onClose, onSave, currentSocials }) => {
  const [formData, setFormData] = useState({
    twitter: "",
    instagram: "",
    twitch: "",
    youtube: "",
    tiktok: "",
    discord: "",
    steam: "",
    psn: "",
    xbox: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentSocials) {
      setFormData({
        twitter: currentSocials.twitter || "",
        instagram: currentSocials.instagram || "",
        twitch: currentSocials.twitch || "",
        youtube: currentSocials.youtube || "",
        tiktok: currentSocials.tiktok || "",
        discord: currentSocials.discord || "",
        steam: currentSocials.steam || "",
        psn: currentSocials.psn || "",
        xbox: currentSocials.xbox || "",
      });
    }
  }, [currentSocials, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error("Failed to save socials:", err);
    }
    setSaving(false);
  };

  const socialInputs = [
    {
      key: "twitter",
      label: "Twitter Handle",
      icon: XIcon,
      placeholder: "@username",
    },
    {
      key: "instagram",
      label: "Instagram Handle",
      icon: Instagram,
      placeholder: "@username",
    },
    {
      key: "twitch",
      label: "Twitch Channel",
      icon: TwitchIcon,
      placeholder: "username",
    },
    {
      key: "youtube",
      label: "YouTube Channel",
      icon: YouTubeIcon,
      placeholder: "@channel",
    },
    {
      key: "tiktok",
      label: "TikTok Handle",
      icon: TikTokIcon,
      placeholder: "@username",
    },
    {
      key: "discord",
      label: "Discord Username",
      icon: DiscordIcon,
      placeholder: "username#0000",
    },
    {
      key: "steam",
      label: "Steam ID",
      icon: SteamIcon,
      placeholder: "custom_id",
    },
    {
      key: "psn",
      label: "PSN ID",
      icon: PlayStationIcon,
      placeholder: "Online ID",
    },
    {
      key: "xbox",
      label: "Xbox Gamertag",
      icon: XboxIcon,
      placeholder: "Gamertag",
    },
  ];

  return (
    <EditModal open={open} onClose={onClose} title="Edit Social Links">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialInputs.map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
                <Icon className="w-4 h-4" /> {label}
              </label>
              <input
                type="text"
                value={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-white/10 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            {saving ? "Saving..." : "Save Socials"}
          </button>
        </div>
      </form>
    </EditModal>
  );
};

// --- Helper Components ---
const NotificationMenu = ({
  anchorEl,
  open,
  onClose,
  notifications,
  onAccept,
  onMarkRead,
  onOpenChat,
}) => {
  // Group message notifications by sender - only show unread
  const groupedNotifications = React.useMemo(() => {
    const messagesByUser = new Map();
    const otherNotifs = [];

    notifications.forEach((notif) => {
      // Skip read notifications
      if (notif.isRead) return;

      if (notif.type === "message") {
        const senderId = notif.sender?._id || notif.sender;
        if (messagesByUser.has(senderId)) {
          const existing = messagesByUser.get(senderId);
          existing.count += 1;
          existing.ids.push(notif._id);
        } else {
          messagesByUser.set(senderId, {
            ...notif,
            count: 1,
            ids: [notif._id],
            hasUnread: true,
            isGrouped: true,
          });
        }
      } else {
        otherNotifs.push(notif);
      }
    });

    return [...otherNotifs, ...Array.from(messagesByUser.values())];
  }, [notifications]);

  const handleGroupMarkRead = (ids) => {
    ids.forEach((id) => onMarkRead(id));
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          maxHeight: 400,
          width: 350,
          backgroundColor: "#1b1f23",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "white",
        },
      }}
    >
      <Typography
        variant="h6"
        className="p-4 border-b border-white/10 text-slate-200"
      >
        Notifications
      </Typography>
      {groupedNotifications.length === 0 ? (
        <MenuItem className="justify-center text-slate-500 py-8">
          No new notifications
        </MenuItem>
      ) : (
        groupedNotifications.map((notif) => (
          <MenuItem
            key={notif._id}
            className={`flex flex-col items-start gap-2 border-b border-white/5 p-4 ${notif.hasUnread || !notif.isRead ? "bg-white/5" : ""}`}
            onClick={() => {
              if (notif.type === "message") {
                // Open chat with this sender
                if (onOpenChat) onOpenChat(notif.sender);
                onClose();
              }
              if (notif.isGrouped && notif.hasUnread) {
                handleGroupMarkRead(notif.ids);
              } else if (!notif.isRead) {
                onMarkRead(notif._id);
              }
            }}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="relative">
                <Avatar
                  src={notif.sender?.avatar}
                  className="w-10 h-10 border border-primary/30"
                >
                  {notif.sender?.username?.[0]}
                </Avatar>
                {notif.isGrouped && notif.count > 1 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-black">
                      {notif.count}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <Typography
                  variant="subtitle2"
                  className="text-slate-200 font-bold truncate"
                >
                  {notif.sender?.username}
                </Typography>
                <Typography variant="body2" className="text-slate-400 text-xs">
                  {notif.type === "connection_request" &&
                    "sent you a connection request"}
                  {notif.type === "connection_accepted" &&
                    "accepted your connection request"}
                  {notif.type === "message" &&
                    (notif.count > 1
                      ? `sent you ${notif.count} messages`
                      : "sent you a message")}
                </Typography>
              </div>
            </div>

            {notif.type === "connection_request" && !notif.isRead && (
              <div className="flex gap-2 w-full mt-2 pl-12">
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<Check size={14} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAccept(notif.relatedId, notif._id);
                  }}
                  sx={{
                    bgcolor: "#84cc16",
                    color: "black",
                    "&:hover": { bgcolor: "#65a30d" },
                  }}
                >
                  Accept
                </Button>
              </div>
            )}
          </MenuItem>
        ))
      )}
    </Menu>
  );
};

// --- Chat Modal with Jelly Animation ---
const ChatModal = ({ open, onClose, recipient, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = React.useRef(null);
  const typingTimeoutRef = React.useRef(null);
  const { socket } = useSocket();

  const recipientId = recipient?._id || recipient?.id;

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chat history
  useEffect(() => {
    if (open && recipientId) {
      setLoading(true);
      messageService
        .getHistory(recipientId)
        .then((res) => {
          setMessages(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch messages", err);
          setLoading(false);
        });
    }
  }, [open, recipientId]);

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    if (socket && open) {
      const handleReceive = (data) => {
        if (data.senderId === recipientId) {
          setMessages((prev) => [
            ...prev,
            {
              _id: data._id,
              sender: { _id: data.senderId, username: data.senderName },
              content: data.content,
              createdAt: data.createdAt,
            },
          ]);
        }
      };

      const handleSent = (data) => {
        if (data.recipientId === recipientId) {
          setMessages((prev) => [
            ...prev,
            {
              _id: data._id,
              sender: { _id: currentUser?._id || currentUser?.id },
              content: data.content,
              createdAt: data.createdAt,
            },
          ]);
        }
      };

      const handleTyping = (data) => {
        if (data.userId === recipientId) {
          setIsTyping(data.isTyping);
        }
      };

      socket.on("message:receive", handleReceive);
      socket.on("message:sent", handleSent);
      socket.on("typing:indicator", handleTyping);

      return () => {
        socket.off("message:receive", handleReceive);
        socket.off("message:sent", handleSent);
        socket.off("typing:indicator", handleTyping);
      };
    }
  }, [socket, open, recipientId, currentUser]);

  const handleSend = () => {
    if (!newMessage.trim() || !socket) return;

    socket.emit("message:private", {
      recipientId,
      content: newMessage.trim(),
    });

    setNewMessage("");
    socket.emit("typing:stop", { recipientId });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTypingChange = (e) => {
    setNewMessage(e.target.value);

    if (socket && recipientId) {
      socket.emit("typing:start", { recipientId });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing:stop", { recipientId });
      }, 1500);
    }
  };

  const isMine = (msg) => {
    const senderId = msg.sender?._id || msg.sender;
    const myId = currentUser?._id || currentUser?.id;
    return senderId === myId || senderId?.toString() === myId?.toString();
  };

  // Jelly animation variants
  const jellyVariants = {
    hidden: {
      opacity: 0,
      scale: 0.3,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      y: 30,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-bg-dark/70 backdrop-blur-md" />

          {/* Chat Modal with Jelly Effect */}
          <motion.div
            variants={jellyVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg h-[600px] bg-gradient-to-b from-[#1a1e22] to-[#0d0f11] border border-white/10 rounded-3xl shadow-2xl shadow-primary/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-bg-dark/30">
              <div className="relative">
                <Avatar
                  src={recipient?.avatar}
                  className="w-12 h-12 border-2 border-primary/50"
                >
                  {recipient?.username?.[0]?.toUpperCase()}
                </Avatar>
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 ${recipient?.status === "online" ? "bg-green-500" : "bg-slate-600"} rounded-full border-2 border-[#1a1e22]`}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">
                  {recipient?.username}
                </h3>
                <p className="text-xs text-slate-400">
                  {isTyping ? (
                    <span className="text-primary flex items-center gap-1">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        typing...
                      </motion.span>
                    </span>
                  ) : recipient?.status === "online" ? (
                    "Online"
                  ) : (
                    "Offline"
                  )}
                </p>
              </div>
              <IconButton
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </IconButton>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                  />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <motion.div
                    key={msg._id || idx}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`flex ${isMine(msg) ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                        isMine(msg)
                          ? "bg-gradient-to-r from-primary to-secondary text-black rounded-br-md"
                          : "bg-white/10 text-white rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p
                        className={`text-[10px] mt-1 ${isMine(msg) ? "text-black/60" : "text-slate-500"}`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-bg-dark/30">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTypingChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FindModal = ({ open, onClose, onConnect, connections = [] }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get the IDs of all connections to filter them out
  const connectionIds = React.useMemo(() => {
    return connections.map((conn) => conn._id || conn.id);
  }, [connections]);

  useEffect(() => {
    if (open) {
      searchUsers("");
    }
  }, [open]);

  const searchUsers = async (q) => {
    setLoading(true);
    try {
      const response = await userService.search(q);
      const allUsers = response.data.users || [];
      // Filter out users who are already connections
      const filteredUsers = allUsers.filter(
        (user) => !connectionIds.includes(user._id),
      );
      setResults(filteredUsers);
    } catch (error) {
      console.error("Search failed", error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    const q = e.target.value;
    setQuery(q);
    searchUsers(q);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
          },
        },
      }}
    >
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-bg-card border border-white/10 rounded-2xl p-6 shadow-2xl outline-none">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Find Players</h2>
          <IconButton
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X />
          </IconButton>
        </div>

        <div className="bg-white/5 rounded-full px-4 py-2 border border-white/10 mb-6 flex items-center">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <InputBase
            placeholder="Search by username..."
            value={query}
            onChange={handleSearch}
            className="w-full text-slate-200"
            sx={{ color: "inherit" }}
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {results.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar} className="border border-primary/30">
                  {user.username[0]}
                </Avatar>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">
                    {user.username}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {user.bio || "No bio available"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onConnect(user._id)}
                className="px-3 py-1 bg-primary/10 text-primary border border-primary/50 rounded-full text-xs font-bold hover:bg-primary hover:text-black transition-all"
              >
                Connect
              </button>
            </div>
          ))}
          {results.length === 0 && !loading && (
            <div className="text-center text-slate-500 py-8">
              No players found
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

const NavigationDialog = ({ open, onClose }) => {
  const navItems = [
    { name: "Feed", path: "/feed" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Contests", path: "/contests" },
    { name: "Premium", path: "/premium" },
    { name: "Teams", path: "/teams" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Blur Background */}
          <div className="absolute inset-0 bg-bg-dark/60 backdrop-blur-md" />

          {/* Dialog Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 bg-bg-card border border-white/10 rounded-2xl p-8 shadow-2xl min-w-[300px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Menu</h2>
              <IconButton
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </IconButton>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all group"
                >
                  <span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-lg font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProfileMenu = ({ anchorEl, open, onClose, onLogout, onEditProfile }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <Settings className="w-4 h-4" />,
      label: "Settings",
      action: () => {
        navigate("/settings");
        onClose();
      },
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Edit Profile",
      action: () => {
        if (onEditProfile) onEditProfile();
        onClose();
      },
    },
    {
      icon: <Bell className="w-4 h-4" />,
      label: "Enable Notifications",
      action: async () => {
        await subscribeUserToPush();
        onClose();
      },
    },
    {
      icon: <LogOut className="w-4 h-4" />,
      label: "Logout",
      action: onLogout,
      danger: true,
    },
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        style: {
          backgroundColor: "#1b1f23",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "white",
          borderRadius: "12px",
          minWidth: "180px",
          marginTop: "8px",
        },
      }}
    >
      {menuItems.map((item) => (
        <MenuItem
          key={item.label}
          onClick={item.action}
          className={`flex items-center gap-3 px-4 py-3 ${item.danger ? "hover:bg-red-500/10 text-red-400" : "hover:bg-white/10 text-slate-300"}`}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </MenuItem>
      ))}
    </Menu>
  );
};

// NOTE: Local navigation components below are UNUSED.
// The Dashboard now uses the shared Navbar from "../components/navigation/Navbar"

const _LocalNavbar_UNUSED = ({
  user,
  logout,
  onConnectionUpdate,
  onOpenChat,
  onEditProfile,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [navDialogOpen, setNavDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const searchRef = React.useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Search users
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          const res = await userService.search(searchQuery);
          setSearchResults(res.data.users || []);
          setShowSearchDropdown(true);
        } catch (err) {
          console.error("Search failed", err);
        }
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserSelect = (username) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchDropdown(false);
    navigate(`/dashboard/${username}`);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("notification:new", (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
      });
      return () => socket.off("notification:new");
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const handleAccept = async (requestId, notifId) => {
    try {
      await connectionService.acceptRequest(requestId);
      await notificationService.markRead(notifId);

      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n)),
      );

      if (onConnectionUpdate) onConnectionUpdate();
    } catch (error) {
      console.error("Failed to accept request", error);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Failed to mark read", error);
    }
  };

  const handleLogout = () => {
    setProfileAnchorEl(null);
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/80 backdrop-blur-md border-b border-white/10 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button */}
            <IconButton
              onClick={() => setNavDialogOpen(true)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <div className="flex flex-col gap-1">
                <span className="w-5 h-0.5 bg-current rounded-full" />
                <span className="w-5 h-0.5 bg-current rounded-full" />
                <span className="w-5 h-0.5 bg-current rounded-full" />
              </div>
            </IconButton>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Gamepad2 className="w-8 h-8 text-primary transition-transform group-hover:rotate-12" />
                <div className="absolute inset-0 bg-primary blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden md:block">
                Ping
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block" ref={searchRef}>
              <div className="flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() =>
                    searchResults.length > 0 && setShowSearchDropdown(true)
                  }
                  className="bg-transparent border-none focus:outline-none text-sm text-slate-200 placeholder:text-slate-500 w-64"
                />
              </div>
              {/* Search Results Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result._id}
                      onClick={() => handleUserSelect(result.username)}
                      className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                    >
                      <Avatar
                        src={result.avatar}
                        className="w-9 h-9 border border-primary/30"
                      >
                        {result.username?.[0]?.toUpperCase()}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-200 text-sm truncate">
                          {result.username}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {result.bio || "No bio"}
                        </p>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${result.status === "online" ? "bg-green-500" : "bg-slate-600"}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              {/* Notification Button */}
              <IconButton
                onClick={(e) => setNotifAnchorEl(e.currentTarget)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Bell className="w-5 h-5" />
                </Badge>
              </IconButton>

              {/* Profile Avatar with Dropdown */}
              <IconButton
                onClick={(e) => setProfileAnchorEl(e.currentTarget)}
                className="p-0"
              >
                <Avatar
                  src={user?.avatar}
                  className="w-8 h-8 border border-primary/50 cursor-pointer hover:border-primary transition-colors"
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Notification Menu */}
      <NotificationMenu
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={() => setNotifAnchorEl(null)}
        notifications={notifications}
        onAccept={handleAccept}
        onMarkRead={handleMarkRead}
        onOpenChat={onOpenChat}
      />

      {/* Profile Menu */}
      <ProfileMenu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={() => setProfileAnchorEl(null)}
        onLogout={handleLogout}
        onEditProfile={onEditProfile}
      />

      {/* Navigation Dialog */}
      <NavigationDialog
        open={navDialogOpen}
        onClose={() => setNavDialogOpen(false)}
      />
    </>
  );
};

const StatBar = ({ label, value, color = "bg-primary" }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs mb-1">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200 font-bold">{value}%</span>
    </div>
    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
);

const GameCard = ({ game, role, rank, icon: Icon }) => (
  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-800 to-black flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <h4 className="font-bold text-slate-200">{game}</h4>
      <p className="text-xs text-slate-400">
        {role} • <span className="text-primary">{rank}</span>
      </p>
    </div>
  </div>
);

// --- Team History Card with Glowing Aura ---
const TeamHistoryCard = ({ team }) => (
  <div className="relative min-w-[220px] max-w-[220px] group flex-shrink-0">
    {/* Glowing lime aura effect */}
    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
    <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-110" />

    {/* Card content */}
    <div className="relative bg-bg-card border border-primary/30 group-hover:border-primary/60 rounded-2xl p-5 transition-all duration-300 h-full">
      <div className="flex items-center gap-3 mb-3">
        {/* Team Logo */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-primary/40 flex items-center justify-center overflow-hidden">
          {team.logo ? (
            <img
              src={team.logo}
              alt={team.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary font-bold text-lg">
              {team.name?.[0]}
            </span>
          )}
        </div>
        {/* Team Name */}
        <h4 className="font-bold text-white text-sm">{team.name}</h4>
      </div>

      {/* Details */}
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
        {team.details}
      </p>
    </div>
  </div>
);

// --- Team History Timeline ---
const TeamHistoryTimeline = ({
  teams,
  isOwnProfile,
  onEdit,
  onAdd,
  onDelete,
}) => {
  const scrollContainerRef = React.useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-bg-card border border-white/5 rounded-2xl p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg text-white">
            Team History Timeline
          </h3>
        </div>
        {isOwnProfile && (
          <button
            onClick={onAdd}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4 text-slate-400 hover:text-primary" />
          </button>
        )}
      </div>

      <div className="relative group overflow-visible">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-bg-dark/90 backdrop-blur-md border border-primary/30 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100 shadow-lg shadow-black/50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto overflow-y-visible pt-4 pb-4 scrollbar-hide scroll-smooth px-6 mx-4"
        >
          {teams.length > 0 ? (
            teams.map((team) => (
              <div
                key={team._id || team.id}
                className="relative min-w-[220px] max-w-[220px] group/card flex-shrink-0"
              >
                {/* Animated Green Flame Effect */}
                <div className="flame-container">
                  <div className="flame-layer-1" />
                  <div className="flame-layer-2" />
                  <div className="flame-layer-3" />
                  {/* Ember particles */}
                  <div className="ember-particle" />
                  <div className="ember-particle" />
                  <div className="ember-particle" />
                  <div className="ember-particle" />
                  <div className="ember-particle" />
                </div>

                {/* Animated glowing border */}
                <div className="flame-glow-border" />

                {/* Card content */}
                <div className="relative bg-bg-card border border-primary/30 group-hover/card:border-primary/60 rounded-2xl p-5 transition-all duration-300 h-full z-10">
                  <div className="flex items-center gap-3 mb-3">
                    {/* Team Logo */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-primary/40 flex items-center justify-center overflow-hidden">
                      {team.logo ? (
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-primary font-bold text-lg">
                          {team.name?.[0]}
                        </span>
                      )}
                    </div>
                    {/* Team Name */}
                    <h4 className="font-bold text-white text-sm flex-1">
                      {team.name}
                    </h4>

                    {/* Edit/Delete buttons */}
                    {isOwnProfile && (
                      <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(team)}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Pencil className="w-3 h-3 text-slate-400 hover:text-primary" />
                        </button>
                        <button
                          onClick={() => onDelete(team._id)}
                          className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {team.details}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-500 text-sm px-4 py-8">
              No team history yet.
            </div>
          )}

          {/* Add Team Card - only show for own profile */}
          {isOwnProfile && (
            <div
              onClick={onAdd}
              className="relative min-w-[220px] max-w-[220px] flex-shrink-0 border-2 border-dashed border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-slate-500 hover:border-primary/50 hover:text-primary transition-all cursor-pointer group h-[140px]"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl">+</span>
              </div>
              <span className="text-xs font-medium">Add Team</span>
            </div>
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-bg-dark/90 backdrop-blur-md border border-primary/30 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100 shadow-lg shadow-black/50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

// --- Experience and Tournaments ---
const ExperienceTournaments = ({
  tournaments,
  isOwnProfile,
  onEdit,
  onAdd,
  onDelete,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="bg-bg-card border border-white/5 rounded-2xl p-6 mb-6"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Medal className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg text-white">
          Experience and Tournaments
        </h3>
      </div>
      {isOwnProfile && (
        <button
          onClick={onAdd}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Pencil className="w-4 h-4 text-slate-400 hover:text-primary" />
        </button>
      )}
    </div>

    <div className="space-y-3">
      {tournaments.length > 0 ? (
        tournaments.map((tournament) => (
          <div
            key={tournament._id || tournament.id}
            className="bg-white/5 border border-white/5 rounded-xl px-5 py-4 hover:bg-white/10 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="font-medium text-slate-200">
                  {tournament.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {tournament.placement && (
                  <span className="text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">
                    {tournament.placement}
                  </span>
                )}
                {isOwnProfile && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(tournament)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Pencil className="w-3 h-3 text-slate-400 hover:text-primary" />
                    </button>
                    <button
                      onClick={() => onDelete(tournament._id)}
                      className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-slate-500 text-sm px-4 py-4">
          No tournament experience yet.
        </div>
      )}

      {/* Add More Placeholder - only show for own profile */}
      {isOwnProfile && (
        <div
          onClick={onAdd}
          className="border-2 border-dashed border-white/10 rounded-xl px-5 py-4 flex items-center justify-center text-slate-500 hover:border-primary/50 hover:text-primary transition-all cursor-pointer"
        >
          <span className="text-sm font-medium">+ Add Tournament</span>
        </div>
      )}
    </div>
  </motion.div>
);

// --- Setup & Config ---
const SetupConfig = ({ setup, isOwnProfile, onEdit, onCopy, copiedField }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35 }}
    className="bg-bg-card border border-white/5 rounded-2xl p-6 h-full"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Monitor className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg text-white">Setup & Config</h3>
      </div>
      {isOwnProfile && (
        <button
          onClick={onEdit}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Pencil className="w-4 h-4 text-slate-400 hover:text-primary" />
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 group relative">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1">
            <span className="font-medium text-slate-200 block">
              DPI + Game sens
            </span>
            <span className="text-xs text-slate-500">
              {setup?.dpi || 800} DPI • {setup?.sensitivity || 0.35} sens
            </span>
          </div>
          <button
            onClick={() =>
              onCopy(
                `${setup?.dpi || 800} DPI, ${setup?.sensitivity || 0.35} sens`,
                "dpi",
              )
            }
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            {copiedField === "dpi" ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400 hover:text-primary" />
            )}
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 group relative">
        <div className="flex items-center gap-3">
          <Monitor className="w-5 h-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1">
            <span className="font-medium text-slate-200 block">
              Aspect ratio
            </span>
            <span className="text-xs text-slate-500">
              {setup?.aspectRatio || "16:9"} •{" "}
              {setup?.resolution || "1920x1080"}
            </span>
          </div>
          <button
            onClick={() =>
              onCopy(
                `${setup?.aspectRatio || "16:9"}, ${setup?.resolution || "1920x1080"}`,
                "aspect",
              )
            }
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            {copiedField === "aspect" ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400 hover:text-primary" />
            )}
          </button>
        </div>
      </div>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 group mb-6">
      <div className="flex items-center gap-3">
        <Mouse className="w-5 h-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="flex-1 min-w-0">
          <span className="font-medium text-slate-200 block">
            Preferred Mouse and crosshair code
          </span>
          <span className="text-xs text-slate-500 truncate block">
            {setup?.mouse || "Not set"}{" "}
            {setup?.crosshairCode ? `• ${setup.crosshairCode}` : ""}
          </span>
        </div>
        <button
          onClick={() => onCopy(setup?.crosshairCode || "", "crosshair")}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
        >
          {copiedField === "crosshair" ? (
            <Check className="w-4 h-4 text-primary" />
          ) : (
            <Copy className="w-4 h-4 text-slate-400 hover:text-primary" />
          )}
        </button>
      </div>
    </div>
  </motion.div>
);

// --- Skills Section ---
const SkillsSection = ({
  skills = [],
  isOwnProfile,
  onAddSkill,
  onRemoveSkill,
}) => {
  const [newSkill, setNewSkill] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onAddSkill(newSkill.trim());
      setNewSkill("");
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    } else if (e.key === "Escape") {
      setNewSkill("");
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-bg-card border border-white/5 rounded-2xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg text-white">Skills</h3>
        </div>
        {isOwnProfile && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-slate-400 hover:text-primary" />
          </button>
        )}
      </div>

      {/* Add skill input */}
      {isOwnProfile && isAdding && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter a skill..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 text-sm"
            autoFocus
          />
          <button
            onClick={handleAddSkill}
            disabled={!newSkill.trim()}
            className="px-4 py-2 bg-primary text-black rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            Add
          </button>
          <button
            onClick={() => {
              setNewSkill("");
              setIsAdding(false);
            }}
            className="px-3 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Skills display */}
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group flex items-center gap-1 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary"
            >
              <span>{skill}</span>
              {isOwnProfile && (
                <button
                  onClick={() => onRemoveSkill(skill)}
                  className="ml-1 p-0.5 hover:bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-slate-500 text-sm">
            {isOwnProfile
              ? "Click + to add your skills"
              : "No skills added yet"}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// --- Edit Modal Base Component ---
const EditModal = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        onClick={onClose}
      >
        {/* Blur Backdrop */}
        <div className="absolute inset-0 bg-bg-dark/60 backdrop-blur-md" />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative z-10 bg-bg-card border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <IconButton
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </IconButton>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Team Edit Modal ---
const TeamEditModal = ({ open, onClose, onSave, editingTeam }) => {
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    details: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTeam) {
      setFormData({
        name: editingTeam.name || "",
        logo: editingTeam.logo || "",
        details: editingTeam.details || "",
      });
    } else {
      setFormData({ name: "", logo: "", details: "" });
    }
  }, [editingTeam, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      await onSave(formData, editingTeam?._id);
      onClose();
    } catch (err) {
      console.error("Failed to save team:", err);
    }
    setSaving(false);
  };

  return (
    <EditModal
      open={open}
      onClose={onClose}
      title={editingTeam ? "Edit Team" : "Add Team"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Team Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
            placeholder="Enter team name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Logo URL
          </label>
          <input
            type="text"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Details / Experience
          </label>
          <textarea
            value={formData.details}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 resize-none"
            placeholder="Describe your role and experience with this team..."
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !formData.name.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            {saving ? "Saving..." : editingTeam ? "Update" : "Add Team"}
          </button>
        </div>
      </form>
    </EditModal>
  );
};

// --- Tournament Edit Modal ---
const TournamentEditModal = ({ open, onClose, onSave, editingTournament }) => {
  const [formData, setFormData] = useState({
    name: "",
    placement: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTournament) {
      setFormData({
        name: editingTournament.name || "",
        placement: editingTournament.placement || "",
        description: editingTournament.description || "",
      });
    } else {
      setFormData({ name: "", placement: "", description: "" });
    }
  }, [editingTournament, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      await onSave(formData, editingTournament?._id);
      onClose();
    } catch (err) {
      console.error("Failed to save tournament:", err);
    }
    setSaving(false);
  };

  return (
    <EditModal
      open={open}
      onClose={onClose}
      title={editingTournament ? "Edit Tournament" : "Add Tournament"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Tournament Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
            placeholder="Enter tournament name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Placement / Result
          </label>
          <input
            type="text"
            value={formData.placement}
            onChange={(e) =>
              setFormData({ ...formData, placement: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
            placeholder="e.g., 1st Place, Top 8, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Description (for Portfolio)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 resize-none"
            placeholder="Describe your experience, achievements, team composition, etc."
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !formData.name.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            {saving
              ? "Saving..."
              : editingTournament
                ? "Update"
                : "Add Tournament"}
          </button>
        </div>
      </form>
    </EditModal>
  );
};

// --- Setup Edit Modal ---
const SetupEditModal = ({ open, onClose, onSave, currentSetup }) => {
  const [formData, setFormData] = useState({
    dpi: 800,
    sensitivity: 0.35,
    aspectRatio: "16:9",
    resolution: "1920x1080",
    mouse: "",
    crosshairCode: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentSetup) {
      setFormData({
        dpi: currentSetup.dpi || 800,
        sensitivity: currentSetup.sensitivity || 0.35,
        aspectRatio: currentSetup.aspectRatio || "16:9",
        resolution: currentSetup.resolution || "1920x1080",
        mouse: currentSetup.mouse || "",
        crosshairCode: currentSetup.crosshairCode || "",
      });
    }
  }, [currentSetup, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error("Failed to save setup:", err);
    }
    setSaving(false);
  };

  return (
    <EditModal open={open} onClose={onClose} title="Edit Gaming Setup">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              DPI
            </label>
            <input
              type="number"
              value={formData.dpi}
              onChange={(e) =>
                setFormData({ ...formData, dpi: Number(e.target.value) })
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
              placeholder="800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Sensitivity
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.sensitivity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sensitivity: Number(e.target.value),
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
              placeholder="0.35"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Aspect Ratio
            </label>
            <input
              type="text"
              value={formData.aspectRatio}
              onChange={(e) =>
                setFormData({ ...formData, aspectRatio: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
              placeholder="16:9"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Resolution
            </label>
            <input
              type="text"
              value={formData.resolution}
              onChange={(e) =>
                setFormData({ ...formData, resolution: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
              placeholder="1920x1080"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Mouse
          </label>
          <input
            type="text"
            value={formData.mouse}
            onChange={(e) =>
              setFormData({ ...formData, mouse: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
            placeholder="e.g., Logitech G Pro X Superlight"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Crosshair Code
          </label>
          <input
            type="text"
            value={formData.crosshairCode}
            onChange={(e) =>
              setFormData({ ...formData, crosshairCode: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
            placeholder="0;P;c;5;h;0;m;1;0l;4;0o;2;0a;1;0f;0;1b;0"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            {saving ? "Saving..." : "Save Setup"}
          </button>
        </div>
      </form>
    </EditModal>
  );
};

// --- Connections Modal ---
const ConnectionsModal = ({
  open,
  onClose,
  onMessage,
  onConnect,
  currentUser,
  targetUserId,
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (targetUserId) {
        const res = await connectionService.getConnections(targetUserId);
        setUsers(res.data.map(user => ({ ...user, connectionStatus: "connected" })));
      } else {
        const res = await userService.getExploreUsers();
        setUsers(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
    setLoading(false);
  };

  const handleConnect = async (userId) => {
    try {
      await connectionService.sendRequest(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, connectionStatus: "pending_sent" } : u,
        ),
      );
      if (onConnect) onConnect(userId);
    } catch (error) {
      console.error("Connection request failed", error);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
          },
        },
      }}
    >
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-bg-card border border-white/10 rounded-2xl p-6 shadow-2xl outline-none max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            {targetUserId ? "All Connections" : "All Players"}
          </h2>
          <IconButton
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X />
          </IconButton>
        </div>

        {!targetUserId && (
          <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/10 mb-6 flex items-center">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <InputBase
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-slate-200"
              sx={{ color: "inherit" }}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-primary/30 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar
                      src={user.avatar}
                      className="w-12 h-12 border border-primary/30"
                    >
                      {user.username?.[0]}
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 ${user.status === "online" ? "bg-green-500" : "bg-slate-600"} rounded-full border-2 border-[#1b1f23]`}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-lg flex items-center gap-2">
                      {user.username}
                      {user.connectionStatus === "connected" && (
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">
                          Connected
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-slate-400 max-w-[250px] truncate">
                      {user.bio || "No bio available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    to={`/dashboard/${user.username}`}
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <Users className="w-5 h-5" />
                  </Link>

                  {targetUserId ? (
                    <button
                      onClick={() => {
                        onMessage(user);
                        onClose();
                      }}
                      className="p-2 sm:px-4 sm:py-2 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">Message</span>
                    </button>
                  ) : user.connectionStatus === "connected" ? (
                    <button
                      onClick={() => {
                        onMessage(user);
                        onClose();
                      }}
                      className="p-2 sm:px-4 sm:py-2 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">Message</span>
                    </button>
                  ) : user.connectionStatus === "pending_sent" ? (
                    <button
                      disabled
                      className="px-4 py-2 bg-white/5 text-slate-500 rounded-lg font-bold flex items-center gap-2 cursor-not-allowed border border-white/5"
                    >
                      <Clock className="w-4 h-4" /> Sent
                    </button>
                  ) : user.connectionStatus === "pending_received" ? (
                    <button
                      disabled
                      className="px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-lg font-bold flex items-center gap-2 border border-yellow-500/20"
                    >
                      Check Requests
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(user._id)}
                      className="px-4 py-2 bg-primary text-black rounded-lg font-bold hover:bg-primary transition-all flex items-center gap-2 shadow-lg shadow-primary/10"
                    >
                      <Plus className="w-4 h-4" /> Connect
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 py-10">
              {targetUserId ? "No connections yet" : "No players found"}
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

// --- Edit Profile Modal ---
const EditProfileModal = ({ open, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    tagline: "",
    bio: "",
    location: "",
    phoneNumber: "",
    languages: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        fullName: user.fullName || "",
        tagline: user.tagline || "",
        bio: user.bio || "",
        location: user.location || "",
        phoneNumber: user.phoneNumber || "",
        languages: user.languages || [],
      });
    }
  }, [user, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditModal open={open} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
            placeholder="Username"
            required
            minLength={3}
            maxLength={30}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
            placeholder="John Doe"
            maxLength={50}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Tagline (displayed under username)
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) =>
              setFormData({ ...formData, tagline: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
            placeholder="e.g. Professional FPS Player | Content Creator"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 resize-none"
            placeholder="Tell us about yourself..."
            maxLength={160}
          />
          <div className="text-right text-xs text-slate-500 mt-1">
            {formData.bio.length}/160
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
            placeholder="e.g. Los Angeles, CA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
            placeholder="e.g. +1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Languages (comma-separated)
          </label>
          <input
            type="text"
            value={formData.languages.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                languages: e.target.value
                  .split(",")
                  .map((lang) => lang.trim())
                  .filter((lang) => lang.length > 0),
              })
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
            placeholder="e.g. English, Spanish, French"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </EditModal>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { username: viewedUsername } = useParams();
  const { user, logout, loading } = useAuth();
  const [postTab, setPostTab] = useState("professional");
  const [posts, setPosts] = useState([]); // Real posts state
  const [postsLoading, setPostsLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [connections, setConnections] = useState([]);
  const [showFindModal, setShowFindModal] = useState(false);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);
  const [viewedUser, setViewedUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const postsScrollRef = React.useRef(null);

  const scrollPostsLeft = () => {
    if (postsScrollRef.current) {
      postsScrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollPostsRight = () => {
    if (postsScrollRef.current) {
      postsScrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  // Profile data state
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [gameExperiences, setGameExperiences] = useState([]);
  const [supportedGames, setSupportedGames] = useState([]);
  const [gamingSetup, setGamingSetup] = useState({
    dpi: 800,
    sensitivity: 0.35,
    aspectRatio: "16:9",
    resolution: "1920x1080",
    mouse: "",
    crosshairCode: "",
  });
  const [socials, setSocials] = useState({
    twitter: "",
    instagram: "",
    twitch: "",
    youtube: "",
    tiktok: "",
    discord: "",
  });

  // Modal state
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showSocialsModal, setShowSocialsModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editingTournament, setEditingTournament] = useState(null);
  const [editingGame, setEditingGame] = useState(null);

  // Copy feedback state
  const [copiedField, setCopiedField] = useState(null);

  // Enchantment state
  const [hasEnchanted, setHasEnchanted] = useState(false);
  const [enchantmentCount, setEnchantmentCount] = useState(0);
  const [enchantmentLoading, setEnchantmentLoading] = useState(false);

  // Avatar dropdown menu state
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  // Determine if viewing own profile or another user's
  const isOwnProfile = !viewedUsername || viewedUsername === user?.username;
  const displayUser = isOwnProfile ? user : viewedUser;

  // Check if the viewed user is already a connection
  const isConnected = React.useMemo(() => {
    if (isOwnProfile || !viewedUser) return false;
    const viewedId = viewedUser._id || viewedUser.id;
    return connections.some(
      (conn) =>
        (conn._id || conn.id) === viewedId ||
        conn.username === viewedUser.username,
    );
  }, [connections, viewedUser, isOwnProfile]);

  const fetchConnections = async (userId = null) => {
    try {
      const response = await connectionService.getConnections(userId);
      setConnections(response.data);
    } catch (error) {
      console.error("Failed to fetch connections", error);
    }
  };

  const fetchSupportedGames = async () => {
    try {
      const res = await gameService.getAll();
      setSupportedGames(res.data);
    } catch (error) {
      console.error("Failed to fetch supported games", error);
    }
  };

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      // Pass the viewed user's ID to filter posts
      const userId = displayUser?._id || displayUser?.id;
      const res = await postService.getAll(postTab, userId);
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setPostsLoading(false);
    }
  };

  React.useEffect(() => {
    if (displayUser) {
      fetchPosts();
    }
  }, [postTab, displayUser?._id || displayUser?.id]); // Refetch when tab or user changes

  React.useEffect(() => {
    fetchSupportedGames();
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  React.useEffect(() => {
    if (user) {
      const targetId = isOwnProfile
        ? user._id || user.id
        : viewedUser?._id || viewedUser?.id;

      if (!isOwnProfile && !targetId) {
        setConnections([]);
        return;
      }

      fetchConnections(targetId);
    }
  }, [user, viewedUsername, viewedUser, isOwnProfile]);

  // Fetch viewed user's profile when navigating to /dashboard/:username
  React.useEffect(() => {
    const fetchViewedUser = async () => {
      if (!isOwnProfile && viewedUsername) {
        setProfileLoading(true);
        try {
          const res = await userService.getProfile(viewedUsername);
          setViewedUser(res.data.user);
        } catch (err) {
          console.error("Failed to fetch user profile", err);
          setViewedUser(null);
        }
        setProfileLoading(false);
      } else {
        setViewedUser(null);
      }
    };
    fetchViewedUser();
  }, [viewedUsername, isOwnProfile]);

  const handleConnect = async (userId) => {
    try {
      await connectionService.sendRequest(userId);
      // Optional: Show success feedback or close modal
      setShowFindModal(false);
      // Refresh connections or show toast
    } catch (error) {
      console.error("Connection request failed", error);
    }
  };

  // Enchantment functions
  const fetchEnchantmentStatus = async (userId) => {
    if (!userId) return;
    try {
      const res = await enchantmentService.getStatus(userId);
      setHasEnchanted(res.data.hasEnchanted);
      setEnchantmentCount(res.data.count);
    } catch (error) {
      console.error("Failed to fetch enchantment status", error);
    }
  };

  const handleEnchantToggle = async () => {
    const targetId = viewedUser?._id || viewedUser?.id;
    if (!targetId || enchantmentLoading) return;

    setEnchantmentLoading(true);
    try {
      const res = await enchantmentService.toggle(targetId);
      setHasEnchanted(res.data.hasEnchanted);
      setEnchantmentCount(res.data.count);
    } catch (error) {
      console.error("Failed to toggle enchantment", error);
    }
    setEnchantmentLoading(false);
  };

  // Fetch enchantment status when viewing another user's profile
  // For own profile, just show the count (can't enchant self)
  React.useEffect(() => {
    if (!isOwnProfile && viewedUser) {
      const userId = viewedUser._id || viewedUser.id;
      fetchEnchantmentStatus(userId);
      // Also get the count from the user object if available
      if (viewedUser.enchantmentCount !== undefined) {
        setEnchantmentCount(viewedUser.enchantmentCount);
      }
    } else if (isOwnProfile) {
      // For own profile, show the current user's enchantment count
      setHasEnchanted(false); // Can't enchant self
      // Use displayUser to get the count (works for both user and refreshed data)
      const ownCount =
        displayUser?.enchantmentCount || user?.enchantmentCount || 0;
      setEnchantmentCount(ownCount);
    }
  }, [viewedUser, isOwnProfile, user, displayUser]);

  // Listen for real-time enchantment updates via socket
  const { socket } = useSocket();
  React.useEffect(() => {
    if (!socket) return;

    const handleEnchantmentUpdate = (data) => {
      // Check if the update is for the currently displayed user OR for own profile
      const currentUserId = displayUser?._id || displayUser?.id;
      const ownUserId = user?._id || user?.id;
      if (
        data.userId === currentUserId ||
        (isOwnProfile && data.userId === ownUserId)
      ) {
        setEnchantmentCount(data.count);
      }
    };

    socket.on("enchantment:update", handleEnchantmentUpdate);

    return () => {
      socket.off("enchantment:update", handleEnchantmentUpdate);
    };
  }, [socket, displayUser, user, isOwnProfile]);

  // Fetch profile data (teams, tournaments, setup)
  const fetchProfileData = async () => {
    try {
      const username = isOwnProfile ? null : viewedUsername;
      const res = username
        ? await profileService.getDataByUsername(username)
        : await profileService.getData();

      if (res.data) {
        setTeams(res.data.teamHistory || []);
        setTournaments(res.data.tournamentExperience || []);
        setGameExperiences(res.data.gameExperiences || []);
        setGamingSetup(
          res.data.gamingSetup || {
            dpi: 800,
            sensitivity: 0.35,
            aspectRatio: "16:9",
            resolution: "1920x1080",
            mouse: "",
            crosshairCode: "",
          },
        );
        setSocials(
          res.data.socials || {
            twitter: "",
            instagram: "",
            twitch: "",
            youtube: "",
            tiktok: "",
            discord: "",
          },
        );
      }
    } catch (error) {
      console.error("Failed to fetch profile data", error);
    }
  };

  React.useEffect(() => {
    if (user || viewedUsername) {
      fetchProfileData();
    }
  }, [user, viewedUsername, isOwnProfile]);

  // Team handlers
  const handleSaveTeam = async (formData, teamId) => {
    try {
      if (teamId) {
        const res = await profileService.updateTeam(teamId, formData);
        setTeams(res.data);
      } else {
        const res = await profileService.addTeam(formData);
        setTeams(res.data);
      }
    } catch (error) {
      console.error("Failed to save team", error);
      throw error;
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      const res = await profileService.deleteTeam(teamId);
      setTeams(res.data);
    } catch (error) {
      console.error("Failed to delete team", error);
    }
  };

  // Game handlers
  const handleSaveGame = async (formData, gameId) => {
    try {
      if (gameId) {
        const res = await profileService.updateGame(gameId, formData);
        setGameExperiences(res.data);
      } else {
        const res = await profileService.addGame(formData);
        setGameExperiences(res.data);
      }
    } catch (error) {
      console.error("Failed to save game", error);
      throw error;
    }
  };

  const handleDeleteGame = async (gameId) => {
    try {
      const res = await profileService.deleteGame(gameId);
      setGameExperiences(res.data);
    } catch (error) {
      console.error("Failed to delete game", error);
    }
  };

  // Tournament handlers
  const handleSaveTournament = async (formData, tournamentId) => {
    try {
      if (tournamentId) {
        const res = await profileService.updateTournament(
          tournamentId,
          formData,
        );
        setTournaments(res.data);
      } else {
        const res = await profileService.addTournament(formData);
        setTournaments(res.data);
      }
    } catch (error) {
      console.error("Failed to save tournament", error);
      throw error;
    }
  };

  const handleDeleteTournament = async (tournamentId) => {
    try {
      const res = await profileService.deleteTournament(tournamentId);
      setTournaments(res.data);
    } catch (error) {
      console.error("Failed to delete tournament", error);
    }
  };

  // Setup handler
  const handleSaveSetup = async (formData) => {
    try {
      const res = await profileService.updateSetup(formData);
      setGamingSetup(res.data);
    } catch (error) {
      console.error("Failed to save setup", error);
      throw error;
    }
  };

  // Socials handler
  const handleSaveSocials = async (formData) => {
    try {
      const res = await profileService.updateSocials(formData);
      setSocials(res.data);
    } catch (error) {
      console.error("Failed to save socials", error);
      throw error;
    }
  };

  // Copy to clipboard handler
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  // Open chat from notification
  const openChatWithUser = (sender) => {
    setChatRecipient(sender);
    setShowChatModal(true);
  };

  // Handle image upload (avatar or banner)
  const handleImageUpload = async (file, type) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      if (type === "avatar") setUploadingAvatar(true);
      if (type === "banner") setUploadingBanner(true);

      const response = await uploadService.uploadImage(formData);
      const imageUrl = response.data.url;

      // Update user profile
      const updateData =
        type === "avatar" ? { avatar: imageUrl } : { bannerImage: imageUrl };

      await userService.updateProfile(updateData);

      // Refetch user data
      window.location.reload();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      if (type === "avatar") setUploadingAvatar(false);
      if (type === "banner") setUploadingBanner(false);
    }
  };

  // Profile Edit Handler
  const handleSaveProfile = async (formData) => {
    try {
      const res = await userService.updateProfile(formData);
      // Determine if we need to reload or just update local state
      // Since userService.updateProfile returns the updated user, we should update the auth context if possible
      // But for now, a reload ensures everything (including token claims if any) matches,
      // though typically a reload isn't needed if we update the context.
      // Assuming useAuth provides a way to update user or we just reload.
      window.location.reload();
    } catch (error) {
      console.error("Failed to save profile", error);
      throw error; // Re-throw for modal to handle
    }
  };

  // Skills Handlers
  const handleAddSkill = async (skill) => {
    try {
      const updatedSkills = [...(displayUser?.skills || []), skill];
      await userService.updateProfile({ skills: updatedSkills });
      window.location.reload();
    } catch (error) {
      console.error("Failed to add skill", error);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    try {
      const updatedSkills = (displayUser?.skills || []).filter(
        (s) => s !== skillToRemove,
      );
      await userService.updateProfile({ skills: updatedSkills });
      window.location.reload();
    } catch (error) {
      console.error("Failed to remove skill", error);
    }
  };

  // --- Mock Data --- (REMOVED: games array)

  if (loading || profileLoading) return null;

  // If viewing another user but profile not found
  if (!isOwnProfile && !viewedUser && !profileLoading) {
    return (
      <div className="min-h-screen bg-bg-dark text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-primary text-black rounded-full font-bold hover:bg-primary transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- Filter Games ---
  const primaryGame = gameExperiences.find((g) => g.isPrimary);
  const secondaryGames = gameExperiences.filter((g) => !g.isPrimary);

  return (
    <div className="min-h-screen bg-bg-dark text-slate-200 font-sans selection:bg-primary/30 overflow-hidden relative">
      {/* Mouse Glow Effect */}
      <div
        className="fixed w-[300px] h-[300px] bg-primary rounded-full filter blur-[100px] opacity-20 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          left: `${mousePos.x - 150}px`,
          top: `${mousePos.y - 150}px`,
        }}
      />
      <Navbar
        user={user}
        logout={() => {
          logout();
          navigate("/");
        }}
        onConnectionUpdate={fetchConnections}
        onOpenChat={openChatWithUser}
        onEditProfile={() => setShowEditProfileModal(true)}
      />

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-20">
        {/* --- Profile Section --- */}
        <div className="relative mb-8 group">
          {/* Banner */}
          <div className="h-64 rounded-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
            <img
              src={
                displayUser?.bannerImage ||
                "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=1600&q=80"
              }
              alt="Banner"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Upload banner button - only show for own profile */}
            {isOwnProfile && (
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(e.target.files[0], "banner")
                  }
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 bg-bg-dark/50 backdrop-blur-md rounded-full cursor-pointer hover:bg-bg-dark/70 transition-colors border border-white/20"
                >
                  {uploadingBanner ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                    />
                  ) : (
                    <Camera className="w-4 h-4 text-white" />
                  )}
                  <span className="text-white text-sm font-medium hidden sm:block">
                    Change Banner
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Avatar & Info */}
          <div className="absolute -bottom-[13rem] lg:-bottom-48 left-0 right-0 flex flex-col items-center z-20">
            <div className="relative">
              <div
                className="w-32 h-32 rounded-full p-1 bg-bg-dark relative group cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAvatarMenu(!showAvatarMenu);
                }}
              >
                <Avatar
                  src={displayUser?.avatar}
                  className="w-full h-full border-4 border-[#1b1f23]"
                  sx={{ width: "100%", height: "100%", fontSize: "3rem" }}
                >
                  {displayUser?.username?.charAt(0).toUpperCase()}
                </Avatar>

                {/* Enchantment Bubble - displays to the right of avatar */}
                <EnchantmentBubble count={enchantmentCount} />

                {/* Loading / Hover Overlay */}
                {(isOwnProfile || uploadingAvatar) && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-bg-dark/60 ${uploadingAvatar ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity rounded-full z-10`}
                  >
                    {uploadingAvatar ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                      />
                    ) : (
                      <Settings className="w-8 h-8 text-white drop-shadow-md" />
                    )}
                  </div>
                )}
              </div>

              {/* Status Dot */}
              <div
                className={`absolute bottom-2 right-2 w-6 h-6 ${displayUser?.status === "online" ? "bg-green-500" : "bg-slate-600"} border-4 border-black rounded-full z-20`}
              />

              {/* Avatar Dropdown Menu */}
              <AnimatePresence>
                {showAvatarMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-56 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60]"
                  >
                    {isOwnProfile && (
                      <label className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors text-sm text-slate-200 hover:text-white border-b border-white/5">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleImageUpload(e.target.files[0], "avatar");
                            setShowAvatarMenu(false);
                          }}
                          className="hidden"
                        />
                        <Camera className="w-4 h-4 text-primary" />
                        Change Avatar
                      </label>
                    )}

                    <button
                      onClick={() => {
                        window.print();
                        setShowAvatarMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors text-sm text-slate-200 hover:text-white text-left"
                    >
                      <Download className="w-4 h-4 text-primary" />
                      Download PDF
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                {displayUser?.username}
                <Zap className="w-5 h-5 text-primary fill-primary" />
              </h1>
              <p className="text-slate-400 font-medium mt-1">
                {displayUser?.tagline ||
                  "Professional FPS Player | Content Creator"}
              </p>

              {/* --- Socials Display --- */}
              <SocialsDisplay
                socials={socials}
                isOwnProfile={isOwnProfile}
                onEdit={() => setShowSocialsModal(true)}
              />

              {/* Message, Connect, and Back buttons for viewing other profiles */}
              {!isOwnProfile && (
                <div className="mt-4 flex gap-2 sm:gap-3 justify-center flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowChatModal(true)}
                    className="px-4 py-1.5 sm:px-6 sm:py-2 bg-gradient-to-r from-primary to-secondary text-black rounded-full font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 text-sm sm:text-base"
                  >
                    <MessageSquare className="w-4 h-4" /> Message
                  </motion.button>

                  {/* Enchant Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleEnchantToggle}
                    disabled={enchantmentLoading}
                    className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-bold transition-all flex items-center gap-2 border disabled:opacity-50 text-sm sm:text-base
                      ${
                        hasEnchanted
                          ? "bg-primary/20 text-primary border-primary"
                          : "bg-white/10 text-white border-white/20 hover:border-primary/50 hover:text-primary"
                      }`}
                  >
                    <Sparkles
                      className={`w-4 h-4 ${hasEnchanted ? "fill-primary" : ""}`}
                    />
                    {enchantmentLoading
                      ? "..."
                      : hasEnchanted
                        ? "Enchanted ✓"
                        : "Enchant"}
                  </motion.button>

                  {!isConnected && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        handleConnect(viewedUser?._id || viewedUser?.id)
                      }
                      className="px-4 py-1.5 sm:px-6 sm:py-2 bg-white/10 text-primary rounded-full font-bold hover:bg-primary/20 transition-all flex items-center gap-2 border border-primary/50 text-sm sm:text-base"
                    >
                      <Users className="w-4 h-4" /> +Connect
                    </motion.button>
                  )}
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-1.5 sm:px-6 sm:py-2 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-colors border border-white/20 text-sm sm:text-base"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-[12rem]" /> {/* Spacer for profile overlap */}
        {/* --- Grid Section --- */}
        <div className="mb-6 flex justify-end">
          {Notification.permission === "default" && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={subscribeUserToPush}
              className="px-4 py-2 bg-primary text-black font-bold rounded-full flex items-center gap-2 hover:bg-primary transition-colors shadow-lg"
            >
              <Bell className="w-4 h-4" /> Enable Push Notifications
            </motion.button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Focus Game & Experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 bg-bg-card border border-white/5 rounded-2xl p-6 h-[400px] flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg text-white">
                  Focus Game & Experience
                </h3>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => {
                    setEditingGame(null);
                    setShowGameModal(true);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-primary"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>

            {gameExperiences.length > 0 ? (
              <div className="flex flex-col h-full gap-4 overflow-hidden">
                {/* Primary Game Box - Highlighted */}
                {primaryGame && (
                  <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/50 rounded-xl p-4 flex items-center gap-4 relative group shrink-0">
                    <div className="absolute top-2 right-2 opacity-100">
                      <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    </div>
                    {isOwnProfile && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-dark/50 rounded-lg p-1 backdrop-blur-sm z-10">
                        <button
                          onClick={() => {
                            setEditingGame(primaryGame);
                            setShowGameModal(true);
                          }}
                          className="p-1 hover:bg-white/20 rounded-md transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5 text-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteGame(primaryGame._id)}
                          className="p-1 hover:bg-red-500/20 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    )}

                    <div className="w-16 h-16 rounded-xl bg-bg-dark border-2 border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10 overflow-hidden">
                      <GameLogo
                        gameName={primaryGame.game}
                        supportedGames={supportedGames}
                        className="w-full h-full p-2"
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">
                        {primaryGame.game}
                      </h4>
                      <p className="text-sm text-primary font-medium mb-1">
                        {primaryGame.role}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="bg-white/10 px-2 py-0.5 rounded text-white border border-white/10">
                          {primaryGame.rank}
                        </span>
                        {primaryGame.peakRank && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500">
                              Peak: {primaryGame.peakRank}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Secondary Games List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                  {secondaryGames.length > 0
                    ? secondaryGames.map((game) => (
                        <div
                          key={game._id}
                          className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3 hover:bg-white/10 transition-colors group relative"
                        >
                          {isOwnProfile && (
                            <div className="absolute right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingGame(game);
                                  setShowGameModal(true);
                                }}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                              </button>
                              <button
                                onClick={() => handleDeleteGame(game._id)}
                                className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                              </button>
                            </div>
                          )}
                          <div className="w-10 h-10 rounded-lg bg-bg-dark/40 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                            <GameLogo
                              gameName={game.game}
                              supportedGames={supportedGames}
                              className="w-full h-full p-1.5"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-200 text-sm truncate">
                              {game.game}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>{game.role}</span>
                              <span>•</span>
                              <span className="text-primary/80">
                                {game.rank}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    : !primaryGame && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
                          <p>No games added yet.</p>
                          {isOwnProfile && (
                            <p>Click the + button to add your experience.</p>
                          )}
                        </div>
                      )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-white/10 rounded-xl text-slate-500">
                <Gamepad2 className="w-10 h-10 mb-2 opacity-50" />
                <p>No games added yet</p>
                {isOwnProfile && (
                  <button
                    onClick={() => {
                      setEditingGame(null);
                      setShowGameModal(true);
                    }}
                    className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-primary transition-colors"
                  >
                    Add Your First Game
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Stat Graphs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-bg-card border border-white/5 rounded-2xl p-6 h-[400px] flex flex-col"
          >
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-white">Stats Graph</h3>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
              <StatBar label="Aim / Accuracy" value={92} color="bg-red-500" />
              <StatBar label="Game Sense" value={85} color="bg-blue-500" />
              <StatBar label="Teamwork" value={88} color="bg-green-500" />
              <StatBar label="Utility Usage" value={76} color="bg-purple-500" />
            </div>
          </motion.div>
        </div>
        {/* --- Connections --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-bg-card border border-white/5 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-white">Connections</h3>
            </div>
            {isOwnProfile && (
              <button
                onClick={() => setShowConnectionsModal(true)}
                className="text-xs text-primary hover:underline bg-transparent border-none cursor-pointer"
              >
                View All
              </button>
            )}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {connections.length > 0 ? (
              connections.map((conn) => (
                <div
                  key={conn._id}
                  onClick={() => navigate(`/dashboard/${conn.username}`)}
                  className="flex flex-col items-center min-w-[80px] group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 group-hover:border-primary transition-colors mb-2 overflow-hidden">
                    <Avatar
                      src={conn.avatar}
                      className="w-full h-full"
                      sx={{ width: "100%", height: "100%" }}
                    >
                      {conn.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  </div>
                  <span className="text-xs text-slate-400 font-medium truncate w-full text-center group-hover:text-white transition-colors">
                    {conn.username}
                  </span>
                  <span className="text-[10px] text-slate-600 truncate w-full text-center">
                    {conn.status === "online" ? "Online" : "Offline"}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm px-4">
                No connections yet. Go find some players!
              </div>
            )}
            {isOwnProfile && (
              <div
                onClick={() => setShowFindModal(true)}
                className="flex flex-col items-center justify-center min-w-[80px] cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center group-hover:border-slate-500 transition-colors mb-2">
                  <span className="text-slate-500 group-hover:text-white transition-colors">
                    +
                  </span>
                </div>
                <span className="text-xs text-slate-500">Find</span>
              </div>
            )}
          </div>
        </motion.div>
        <FindModal
          open={showFindModal}
          onClose={() => setShowFindModal(false)}
          onConnect={handleConnect}
          connections={connections}
        />
        <ConnectionsModal
          open={showConnectionsModal}
          onClose={() => setShowConnectionsModal(false)}
          onMessage={openChatWithUser}
          onConnect={() => fetchConnections(isOwnProfile ? null : viewedUser?._id)}
          currentUser={user}
          targetUserId={isOwnProfile ? null : viewedUser?._id}
        />
        {/* Chat Modal */}
        <ChatModal
          open={showChatModal}
          onClose={() => {
            setShowChatModal(false);
            setChatRecipient(null);
          }}
          recipient={chatRecipient || viewedUser}
          currentUser={user}
        />
        {/* --- Team History Timeline --- */}
        <TeamHistoryTimeline
          teams={teams}
          isOwnProfile={isOwnProfile}
          onEdit={(team) => {
            setEditingTeam(team);
            setShowTeamModal(true);
          }}
          onAdd={() => {
            setEditingTeam(null);
            setShowTeamModal(true);
          }}
          onDelete={handleDeleteTeam}
        />
        {/* --- Experience and Tournaments --- */}
        <ExperienceTournaments
          tournaments={tournaments}
          isOwnProfile={isOwnProfile}
          onEdit={(tournament) => {
            setEditingTournament(tournament);
            setShowTournamentModal(true);
          }}
          onAdd={() => {
            setEditingTournament(null);
            setShowTournamentModal(true);
          }}
          onDelete={handleDeleteTournament}
        />
        {/* --- Setup & Config + Skills Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SetupConfig
            setup={gamingSetup}
            isOwnProfile={isOwnProfile}
            onEdit={() => setShowSetupModal(true)}
            onCopy={handleCopy}
            copiedField={copiedField}
          />
          <SkillsSection
            skills={displayUser?.skills || []}
            isOwnProfile={isOwnProfile}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
          />
        </div>
        {/* Edit Modals */}
        <TeamEditModal
          open={showTeamModal}
          onClose={() => {
            setShowTeamModal(false);
            setEditingTeam(null);
          }}
          onSave={handleSaveTeam}
          editingTeam={editingTeam}
        />
        <TournamentEditModal
          open={showTournamentModal}
          onClose={() => {
            setShowTournamentModal(false);
            setEditingTournament(null);
          }}
          onSave={handleSaveTournament}
          editingTournament={editingTournament}
        />
        <SetupEditModal
          open={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          onSave={handleSaveSetup}
          currentSetup={gamingSetup}
        />
        <SocialsEditModal
          open={showSocialsModal}
          onClose={() => setShowSocialsModal(false)}
          onSave={handleSaveSocials}
          currentSocials={socials}
        />
        <EditProfileModal
          open={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          user={user}
          onSave={handleSaveProfile}
        />
        <GameEditModal
          open={showGameModal}
          onClose={() => {
            setShowGameModal(false);
            setEditingGame(null);
          }}
          onSave={handleSaveGame}
          editingGame={editingGame}
          supportedGames={supportedGames}
        />
        {/* --- Posts Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mb-12"
        >
          {/* Header Section */}
          <div className="flex flex-col items-center mb-8">
            {/* Feed Tabs */}
            <div className="bg-bg-dark/40 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 flex gap-1 shadow-2xl mb-8">
              {["professional", "casual"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPostTab(tab)}
                  className={`relative px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden ${
                    postTab === tab
                      ? "text-black shadow-lg shadow-primary/25"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {postTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-xl"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab === "professional" ? (
                      <Trophy size={16} />
                    ) : (
                      <MessageSquare size={16} />
                    )}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                </button>
              ))}
            </div>

            {/* Create Post (Only on own profile) */}
            {isOwnProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={postTab}
                className="w-full "
              >
                <CreatePost onPostCreated={fetchPosts} type={postTab} />
              </motion.div>
            )}
          </div>

          {/* Horizontal Posts Slider */}
          <div className="relative group">
            {/* Navigation Arrows */}
            <button
              onClick={scrollPostsLeft}
              className="absolute -left-2 md:-left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-bg-dark/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100 shadow-xl shadow-black/50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollPostsRight}
              className="absolute -right-2 md:-right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-bg-dark/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100 shadow-xl shadow-black/50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Scroll Container */}
            <div
              ref={postsScrollRef}
              className="flex gap-6 overflow-x-auto pb-8 pt-2 px-4 scrollbar-hide scroll-smooth snap-x"
            >
              {postsLoading ? (
                <div className="w-full flex justify-center py-20">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post._id}
                    className="min-w-[350px] max-w-[350px] md:min-w-[400px] md:max-w-[400px] snap-center h-full"
                  >
                    <PostCard
                      post={post}
                      onDelete={(id) =>
                        setPosts((prev) => prev.filter((p) => p._id !== id))
                      }
                    />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-20 text-slate-500 bg-bg-card border border-white/5 rounded-2xl mx-auto max-w-4xl">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">
                    No posts yet in {postTab} feed.
                  </p>
                  {isOwnProfile && (
                    <p className="text-sm mt-2 text-slate-400">
                      Be the first to post!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
