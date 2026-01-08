import api from "./api";

/**
 * Service pour gérer les employés via l'API Odoo
 */

/**
 * Récupérer la liste des employés
 * @returns {Promise<Array>} Liste des employés
 */
export const getEmployees = async () => {
  try {
    console.log("📡 Récupération de la liste des employés...");
    const response = await api.get("/hr.employee");

    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      console.log(`✅ ${response.data.count} employés récupérés`);
      return {
        count: response.data.count,
        employees: response.data.results,
      };
    }

    return { count: 0, employees: [] };
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des employés:", error);
    throw error;
  }
};

/**
 * Récupérer les détails d'un employé par son ID
 * @param {number} employeeId - ID de l'employé
 * @returns {Promise<Object>} Détails de l'employé
 */
export const getEmployeeById = async (employeeId) => {
  try {
    console.log(`📡 Récupération de l'employé ${employeeId}...`);
    const response = await api.get(`/hr.employee/${employeeId}`);

    if (response.data) {
      console.log(`✅ Employé ${employeeId} récupéré`);
      return response.data;
    }

    return null;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération de l'employé ${employeeId}:`, error);
    throw error;
  }
};

/**
 * Créer un nouvel employé
 * @param {Object} employeeData - Données de l'employé
 * @returns {Promise<Object>} Employé créé
 */
export const createEmployee = async (employeeData) => {
  try {
    console.log("📡 Création d'un nouvel employé...");
    const response = await api.post("/hr.employee", employeeData);

    if (response.data) {
      console.log("✅ Employé créé avec succès");
      return response.data;
    }

    throw new Error("Réponse invalide du serveur");
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'employé:", error);
    throw error;
  }
};

/**
 * Rechercher des employés par nom
 * @param {string} searchTerm - Terme de recherche
 * @param {Array} employees - Liste des employés à filtrer
 * @returns {Array} Employés filtrés
 */
export const searchEmployees = (searchTerm, employees) => {
  if (!searchTerm) return employees;

  const term = searchTerm.toLowerCase();
  return employees.filter((employee) => {
    const name = (employee.name && typeof employee.name === 'string') ? employee.name.toLowerCase() : "";
    const jobTitle = (employee.job_title && typeof employee.job_title === 'string') ? employee.job_title.toLowerCase() : "";
    const jobName = (employee.job_id?.display_name && typeof employee.job_id.display_name === 'string') ? employee.job_id.display_name.toLowerCase() : "";
    const department = (employee.department_id?.display_name && typeof employee.department_id.display_name === 'string') ? employee.department_id.display_name.toLowerCase() : "";

    return name.includes(term) || jobTitle.includes(term) || jobName.includes(term) || department.includes(term);
  });
};

export default {
  getEmployees,
  getEmployeeById,
  createEmployee,
  searchEmployees,
};
