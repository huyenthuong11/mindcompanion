"use client";

import ProtectedRoute from "../../components/ProtectedRoute";

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <div>Profile page</div>
        </ProtectedRoute>
    );
}