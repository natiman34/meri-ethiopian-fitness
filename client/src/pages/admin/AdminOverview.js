import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Users, Dumbbell, Utensils, MessageSquare } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { ActivityLogService } from "../../services/ActivityLogService";
const AdminOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [growthData, setGrowthData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                // Fetch dashboard stats
                const { data: statsData, error: statsError } = await supabase
                    .rpc('get_dashboard_stats');
                if (statsError)
                    throw statsError;
                setStats(statsData);
                // Fetch growth data
                const { data: growthData, error: growthError } = await supabase
                    .rpc('get_growth_data', { months: 6 });
                if (growthError)
                    throw growthError;
                setGrowthData(growthData);
                // Fetch recent activity using the new service
                const activityData = await ActivityLogService.getRecentActivityLogs(4);
                setRecentActivity(activityData);
            }
            catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-red-700", children: _jsx("p", { children: error }) }));
    }
    const getActivityIcon = (type) => {
        switch (type) {
            case "user":
                return _jsx(Users, { size: 20, className: "text-blue-600" });
            case "fitness":
                return _jsx(Dumbbell, { size: 20, className: "text-green-600" });
            case "nutrition":
                return _jsx(Utensils, { size: 20, className: "text-yellow-600" });
            case "feedback":
                return _jsx(MessageSquare, { size: 20, className: "text-purple-600" });
            default:
                return null;
        }
    };
    const getActivityBgColor = (type) => {
        switch (type) {
            case "user":
                return "bg-blue-100";
            case "fitness":
                return "bg-green-100";
            case "nutrition":
                return "bg-yellow-100";
            case "feedback":
                return "bg-purple-100";
            default:
                return "bg-gray-100";
        }
    };
    return (_jsx("div", { className: "space-y-6" }));
};
export default AdminOverview;
