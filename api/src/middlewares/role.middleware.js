module.exports = (requiredRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
  
      if (typeof requiredRoles === "string") {
        if (req.user.role !== requiredRoles) {
          return res.status(403).json({ message: "Accès interdit" });
        }
      } 
      else if (Array.isArray(requiredRoles)) {
        if (!requiredRoles.includes(req.user.role)) {
          return res.status(403).json({ message: "Accès interdit" });
        }
      }
  
      next();
    };
  };
  