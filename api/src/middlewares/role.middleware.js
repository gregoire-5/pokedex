module.exports = (requiredRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
  
      // Si un seul rôle est requis, on vérifie directement
      if (typeof requiredRoles === "string") {
        if (req.user.role !== requiredRoles) {
          return res.status(403).json({ message: "Accès interdit" });
        }
      } 
      // Si plusieurs rôles sont acceptés, on vérifie que l'utilisateur en a un
      else if (Array.isArray(requiredRoles)) {
        if (!requiredRoles.includes(req.user.role)) {
          return res.status(403).json({ message: "Accès interdit" });
        }
      }
  
      next();
    };
  };
  