import api from "./api";

/**
 * Service pour gérer les opportunités CRM via l'API Odoo
 */

/**
 * Récupérer la liste des opportunités/leads CRM
 * @returns {Promise<Object>} Liste des opportunités avec count
 */
export const getLeads = async () => {
  try {
    console.log("📡 Récupération de la liste des opportunités CRM...");
    const response = await api.get("/crm.lead");

    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      console.log(`✅ ${response.data.count} opportunités récupérées`);
      return {
        count: response.data.count,
        leads: response.data.results,
      };
    }

    return { count: 0, leads: [] };
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des opportunités:", error);
    throw error;
  }
};

/**
 * Récupérer les détails d'une opportunité par son ID
 * @param {number} leadId - ID de l'opportunité
 * @returns {Promise<Object>} Détails de l'opportunité
 */
export const getLeadById = async (leadId) => {
  try {
    console.log(`📡 Récupération de l'opportunité ${leadId}...`);
    const response = await api.get(`/crm.lead/${leadId}`);

    if (response.data) {
      console.log(`✅ Opportunité ${leadId} récupérée`);
      return response.data;
    }

    return null;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération de l'opportunité ${leadId}:`, error);
    throw error;
  }
};

/**
 * Créer une nouvelle opportunité/lead
 * @param {Object} leadData - Données de l'opportunité
 * @returns {Promise<Object>} Opportunité créée
 */
export const createLead = async (leadData) => {
  try {
    console.log("📡 Création d'une nouvelle opportunité...");
    const response = await api.post("/crm.lead", leadData);

    if (response.data) {
      console.log("✅ Opportunité créée avec succès");
      return response.data;
    }

    throw new Error("Réponse invalide du serveur");
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'opportunité:", error);
    throw error;
  }
};

/**
 * Rechercher des opportunités par nom ou partenaire
 * @param {string} searchTerm - Terme de recherche
 * @param {Array} leads - Liste des opportunités à filtrer
 * @returns {Array} Opportunités filtrées
 */
export const searchLeads = (searchTerm, leads) => {
  if (!searchTerm) return leads;

  const term = searchTerm.toLowerCase();
  return leads.filter((lead) => {
    const name = (lead.name && typeof lead.name === 'string') ? lead.name.toLowerCase() : "";
    const partnerName = (lead.partner_name && typeof lead.partner_name === 'string') ? lead.partner_name.toLowerCase() : "";
    const contactName = (lead.contact_name && typeof lead.contact_name === 'string') ? lead.contact_name.toLowerCase() : "";
    const stageName = (lead.stage_id?.display_name && typeof lead.stage_id.display_name === 'string') ? lead.stage_id.display_name.toLowerCase() : "";

    return name.includes(term) || partnerName.includes(term) || contactName.includes(term) || stageName.includes(term);
  });
};

/**
 * Filtrer les opportunités par type
 * @param {string} type - "lead" ou "opportunity"
 * @param {Array} leads - Liste des opportunités
 * @returns {Array} Opportunités filtrées
 */
export const filterLeadsByType = (type, leads) => {
  if (!type) return leads;
  return leads.filter((lead) => lead.type === type);
};

/**
 * Filtrer les opportunités par étape
 * @param {number} stageId - ID de l'étape
 * @param {Array} leads - Liste des opportunités
 * @returns {Array} Opportunités filtrées
 */
export const filterLeadsByStage = (stageId, leads) => {
  if (!stageId) return leads;
  return leads.filter((lead) => lead.stage_id?.id === stageId);
};

export default {
  getLeads,
  getLeadById,
  createLead,
  searchLeads,
  filterLeadsByType,
  filterLeadsByStage,
};
