import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  Users,
  DollarSign,
  TrendingUp,
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
} from "lucide-react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAdmin } from "@/contexts/AdminContext";
import { useWallet } from "@/contexts/WalletContext";
import { useApp } from "@/contexts/AppContext";
import { useLiveStream } from "@/contexts/LiveStreamContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LightColors, DarkColors } from "@/constants/colors";

export default function AdminDashboardScreen() {
  const { isAdmin, logout, adminUser } = useAdmin();
  const { cashoutRequests } = useWallet();
  const { users, matches } = useApp();
  const { liveStreams } = useLiveStream();
  const { isDark } = useTheme();
  const Colors = isDark ? DarkColors : LightColors;

  const [selectedTab, setSelectedTab] = useState<"overview" | "cashouts">("overview");

  React.useEffect(() => {
    if (!isAdmin) {
      router.replace("/admin/login" as any);
    }
  }, [isAdmin]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/admin/login" as any);
          },
        },
      ]
    );
  };

  const pendingCashouts = cashoutRequests.filter((c) => c.status === "pending");
  const totalPendingAmount = pendingCashouts.reduce((sum, c) => sum + c.amount, 0);

  const stats = [
    {
      label: "Total Users",
      value: users.length.toString(),
      icon: Users,
      color: "#8B5CF6",
      bg: isDark ? "#3D2A6E" : "#E8DEFF",
    },
    {
      label: "Active Matches",
      value: matches.length.toString(),
      icon: TrendingUp,
      color: Colors.coral,
      bg: isDark ? "#4D2020" : Colors.coralLight,
    },
    {
      label: "Live Streams",
      value: liveStreams.filter((s) => s.isLive).length.toString(),
      icon: Eye,
      color: "#FF6B6B",
      bg: isDark ? "#4D2020" : "#FFE5E5",
    },
    {
      label: "Pending Cashouts",
      value: pendingCashouts.length.toString(),
      icon: DollarSign,
      color: "#FFA500",
      bg: isDark ? "#4D3820" : "#FFF3E0",
    },
  ];

  const renderOverview = () => (
    <>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <View
              key={index}
              style={[styles.statCard, { backgroundColor: Colors.cardBackground }]}
            >
              <View style={[styles.statIcon, { backgroundColor: stat.bg }]}>
                <Icon color={stat.color} size={24} />
              </View>
              <Text style={[styles.statValue, { color: Colors.textPrimary }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: Colors.textSecondary }]}>
                {stat.label}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.textPrimary }]}>
          Quick Actions
        </Text>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: Colors.cardBackground }]}
          onPress={() => setSelectedTab("cashouts")}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: isDark ? "#4D3820" : "#FFF3E0" }]}>
            <DollarSign color="#FFA500" size={24} />
          </View>
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, { color: Colors.textPrimary }]}>
              Pending Cashouts
            </Text>
            <Text style={[styles.actionSubtitle, { color: Colors.textSecondary }]}>
              ${totalPendingAmount.toFixed(2)} pending approval
            </Text>
          </View>
          {pendingCashouts.length > 0 && (
            <View style={[styles.badge, { backgroundColor: "#FFA500" }]}>
              <Text style={styles.badgeText}>{pendingCashouts.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  const renderCashouts = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: Colors.textPrimary }]}>
        Cashout Requests
      </Text>

      {cashoutRequests.length === 0 && (
        <View style={[styles.emptyState, { backgroundColor: Colors.cardBackground }]}>
          <DollarSign color={Colors.mediumGray} size={48} />
          <Text style={[styles.emptyText, { color: Colors.textSecondary }]}>
            No cashout requests yet
          </Text>
        </View>
      )}

      {cashoutRequests.map((cashout) => {
        const statusConfig = {
          pending: { icon: Clock, color: "#FFA500", label: "Pending" },
          processing: { icon: Clock, color: "#2196F3", label: "Processing" },
          completed: { icon: CheckCircle, color: Colors.green, label: "Completed" },
          rejected: { icon: XCircle, color: Colors.red, label: "Rejected" },
        };

        const config = statusConfig[cashout.status];
        const StatusIcon = config.icon;

        return (
          <View
            key={cashout.id}
            style={[styles.cashoutCard, { backgroundColor: Colors.cardBackground }]}
          >
            <View style={styles.cashoutHeader}>
              <View style={styles.cashoutInfo}>
                <Text style={[styles.cashoutAmount, { color: Colors.textPrimary }]}>
                  ${cashout.amount.toFixed(2)}
                </Text>
                <Text style={[styles.cashoutMethod, { color: Colors.textSecondary }]}>
                  via {cashout.method === "card" ? "Bank Card" : 
                       cashout.method === "mtn-momo" ? "MTN MoMo" : "PayPal"}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: config.color + "20" }]}>
                <StatusIcon color={config.color} size={16} />
                <Text style={[styles.statusText, { color: config.color }]}>
                  {config.label}
                </Text>
              </View>
            </View>

            <View style={styles.cashoutDetails}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: Colors.textSecondary }]}>Fee</Text>
                <Text style={[styles.detailValue, { color: Colors.coral }]}>
                  -${cashout.fee.toFixed(2)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: Colors.textSecondary }]}>Net Amount</Text>
                <Text style={[styles.detailValue, { color: Colors.green }]}>
                  ${cashout.netAmount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: Colors.textSecondary }]}>Date</Text>
                <Text style={[styles.detailValue, { color: Colors.textPrimary }]}>
                  {cashout.timestamp.toLocaleDateString()}
                </Text>
              </View>
            </View>

            {cashout.status === "pending" && (
              <View style={styles.cashoutActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => Alert.alert("Success", "Cashout approved")}
                  activeOpacity={0.8}
                >
                  <CheckCircle color="#FFFFFF" size={18} />
                  <Text style={styles.actionButtonText}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => Alert.alert("Rejected", "Cashout rejected")}
                  activeOpacity={0.8}
                >
                  <XCircle color="#FFFFFF" size={18} />
                  <Text style={styles.actionButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <LinearGradient
        colors={isDark ? ["#6D28D9", "#5B21B6", Colors.background] : ["#8B5CF6", "#A78BFA", Colors.background]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerContent}>
          <View style={styles.adminBadge}>
            <Shield color="#FFFFFF" size={20} fill="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome, {adminUser?.name}</Text>
        </View>
      </LinearGradient>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "overview" && [styles.tabActive, { borderBottomColor: Colors.coral }],
          ]}
          onPress={() => setSelectedTab("overview")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: Colors.textSecondary },
              selectedTab === "overview" && [styles.tabTextActive, { color: Colors.coral }],
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "cashouts" && [styles.tabActive, { borderBottomColor: Colors.coral }],
          ]}
          onPress={() => setSelectedTab("cashouts")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: Colors.textSecondary },
              selectedTab === "cashouts" && [styles.tabTextActive, { color: Colors.coral }],
            ]}
          >
            Cashouts
          </Text>
          {pendingCashouts.length > 0 && (
            <View style={[styles.tabBadge, { backgroundColor: Colors.coral }]}>
              <Text style={styles.tabBadgeText}>{pendingCashouts.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {selectedTab === "overview" && renderOverview()}
        {selectedTab === "cashouts" && renderCashouts()}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    alignItems: "center",
  },
  adminBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
  },
  tabBar: {
    flexDirection: "row" as const,
    paddingHorizontal: 20,
    gap: 32,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  tab: {
    paddingVertical: 16,
    position: "relative" as const,
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500" as const,
  },
  tabTextActive: {
    fontWeight: "700" as const,
  },
  tabBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    textAlign: "center" as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: "row" as const,
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    marginTop: 16,
  },
  cashoutCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cashoutHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cashoutInfo: {
    flex: 1,
  },
  cashoutAmount: {
    fontSize: 24,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  cashoutMethod: {
    fontSize: 14,
  },
  statusBadge: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  cashoutDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  cashoutActions: {
    flexDirection: "row" as const,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#FF5252",
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});
