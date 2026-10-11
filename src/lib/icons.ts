import {
  UtensilsCrossed, ShoppingCart, Car, ShoppingBag, Clapperboard, HeartPulse,
  Receipt, GraduationCap, Repeat, AlertTriangle, MoreHorizontal, Shield,
  Music, Headphones, Tv, Dumbbell, Wallet, LayoutDashboard, ArrowLeftRight,
  PiggyBank, Target, FlaskConical, BarChart3, Settings, Sparkles, TrendingUp,
  TrendingDown, PieChart, LineChart, ArrowRight, Gauge, CalendarClock,
  Info, AlertCircle, Plus, Trash2, Edit, Check, X, Filter, Search, RefreshCw,
  Download, Bell, Menu, ChevronRight, Zap, Coffee, Bus, Film, Gamepad2,
  BookOpen, Stethoscope, Lightbulb, Trophy, Gift, Plane, Home, Smartphone,
  Wifi, Zap as ZapIcon, Droplet, Camera, Laptop, Watch, Footprints,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed, ShoppingCart, Car, ShoppingBag, Clapperboard, HeartPulse,
  Receipt, GraduationCap, Repeat, AlertTriangle, MoreHorizontal, Shield,
  Music, Headphones, Tv, Dumbbell, Wallet, LayoutDashboard, ArrowLeftRight,
  PiggyBank, Target, FlaskConical, BarChart3, Settings, Sparkles, TrendingUp,
  TrendingDown, PieChart, LineChart, ArrowRight, Gauge, CalendarClock,
  Info, AlertCircle, Plus, Trash2, Edit, Check, X, Filter, Search, RefreshCw,
  Download, Bell, Menu, ChevronRight, Zap, Coffee, Bus, Film, Gamepad2,
  BookOpen, Stethoscope, Lightbulb, Trophy, Gift, Plane, Home, Smartphone,
  Wifi, Droplet, Camera, Laptop, Watch, Footprints,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || MoreHorizontal;
}
