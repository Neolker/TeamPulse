export const isOwner = (company, userId, admin) => {
  const isOwner = company.owner_id === userId || admin;

  return isOwner;
};
export const isManager = (company, userId) => {
  const isManager = company.users.some(
    (user) => user.user_id === userId && user.roles[0] === "0"
  );

  return isManager;
};

export const hasPriviliges = (company, userId, admin) => {
  return isOwner(company, userId, admin) || isManager(company, userId);
};
