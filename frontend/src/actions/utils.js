 
 export const formatRoleName = (role) =>
    role.split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");