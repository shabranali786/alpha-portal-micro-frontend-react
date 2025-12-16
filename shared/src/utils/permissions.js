import { useSelector } from "react-redux";

export const checkPermission = (user, requiredPermissions) => {
  if (!user) return false;

  const isSuperAdmin = user?.roles?.some(
    (role) => role.toLowerCase() === "superadmin"
  );

  if (isSuperAdmin) return true;

  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  if (!user?.permissions || user.permissions.length === 0) return false;

  return requiredPermissions.some((permission) =>
    user.permissions.includes(permission)
  );
};

export const usePermission = (requiredPermissions) => {
  const { user } = useSelector((state) => state.auth);
  return checkPermission(user, requiredPermissions);
};
