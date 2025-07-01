import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import MealManager from '../../components/admin/MealManager';
const AdminMeals = () => {
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Meal Management" }), _jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Create and manage individual meals that can be used across nutrition plans." })] }) }), _jsx(MealManager, {})] }));
};
export default AdminMeals;
