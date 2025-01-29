 
 export const formatRoleName = (role) =>{
  //console.log('role', role);
  return (
    role.split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  )
 }