export const mockUsers = [
    {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        phone: "+251 11 234 5678",
        address: "Addis Ababa, Ethiopia",
    },
    {
        id: "2",
        name: "Nutritionist User",
        email: "nutritionist@example.com",
        role: "nutritionist",
        phone: "+251 11 234 5679",
        address: "Addis Ababa, Ethiopia",
    },
    {
        id: "3",
        name: "Planner User",
        email: "planner@example.com",
        role: "planner",
        phone: "+251 11 234 5680",
        address: "Addis Ababa, Ethiopia",
    },
    {
        id: "4",
        name: "Regular User",
        email: "user@example.com",
        role: "user",
        phone: "+251 11 234 5681",
        address: "Addis Ababa, Ethiopia",
    },
];
export const findUserByEmail = (email) => {
    return mockUsers.find((user) => user.email === email);
};
