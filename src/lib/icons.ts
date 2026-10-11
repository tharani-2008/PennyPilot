import { UtensilsCrossed, ShoppingCart, Car, ShoppingBag, Clapperboard, HeartPulse, Receipt, GraduationCap, Repeat, TriangleAlert as AlertTriangle, MoveHorizontal as MoreHorizontal, Shield, Music, Headphones, Tv, Dumbbell, Wallet, LayoutDashboard, ArrowLeftRight, PiggyBank, Target, FlaskConical, ChartBar as BarChart3, Settings, Sparkles, TrendingUp, TrendingDown, ChartPie as PieChart, ChartLine as LineChart, ArrowRight, Gauge, CalendarClock, Info, CircleAlert as AlertCircle, Plus, Trash2, CreditCard as Edit, Check, X, Filter, Search, RefreshCw, Download, Bell, Menu, ChevronRight, Zap, Coffee, Bus, Film, Gamepad2, BookOpen, Stethoscope, Lightbulb, Trophy, Gift, Plane, Chrome as Home, Smartphone, Wifi, Droplet, Camera, Laptop, Watch, Footprints } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
