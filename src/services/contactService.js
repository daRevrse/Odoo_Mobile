import api from './api';

/**
 * Service de gestion des contacts pour l'application Odoo Mobile
 */
class ContactService {
  /**
   * Récupération de tous les contacts
   * @param {Object} options - Options de pagination et filtrage
   * @param {number} options.limit - Nombre de contacts à récupérer (défaut: 50)
   * @param {number} options.offset - Décalage pour la pagination (défaut: 0)
   * @param {string} options.search - Terme de recherche optionnel
   * @param {Array} options.domain - Filtre Odoo domain optionnel
   * @param {Array} options.fields - Champs spécifiques à récupérer
   * @returns {Promise<Object>} Liste des contacts avec métadonnées
   */
  async getContacts(options = {}) {
    try {
      const {
        limit = 50,
        offset = 0,
        search = '',
        domain = [],
        fields = [],
      } = options;

      // Construire les paramètres de la requête
      const params = {
        limit,
        offset,
      };

      if (search) {
        params.search = search;
      }

      if (domain && domain.length > 0) {
        params.domain = JSON.stringify(domain);
      }

      if (fields && fields.length > 0) {
        params.fields = JSON.stringify(fields);
      }

      // Appel API pour récupérer les contacts
      const response = await api.get('/contacts', { params });

      const { data } = response;

      console.log(`${data.contacts?.length || 0} contact(s) récupéré(s)`);

      return {
        success: true,
        contacts: data.contacts || [],
        total: data.total || 0,
        limit,
        offset,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des contacts:', error);

      const errorMessage = this._handleError(error, 'Impossible de récupérer les contacts');

      throw {
        success: false,
        message: errorMessage,
        error,
      };
    }
  }

  /**
   * Récupération d'un contact spécifique par son ID
   * @param {number} id - ID du contact à récupérer
   * @param {Array} fields - Champs spécifiques à récupérer (optionnel)
   * @returns {Promise<Object>} Données du contact
   */
  async getContactById(id, fields = []) {
    try {
      // Validation de l'ID
      if (!id || typeof id !== 'number') {
        throw new Error('ID de contact invalide');
      }

      // Construire les paramètres de la requête
      const params = {};
      if (fields && fields.length > 0) {
        params.fields = JSON.stringify(fields);
      }

      // Appel API pour récupérer le contact
      const response = await api.get(`/contacts/${id}`, { params });

      const { data } = response;

      if (!data || !data.contact) {
        throw new Error('Contact non trouvé');
      }

      console.log('Contact récupéré:', data.contact.name || id);

      return {
        success: true,
        contact: data.contact,
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération du contact ${id}:`, error);

      const errorMessage = this._handleError(error, 'Impossible de récupérer le contact');

      throw {
        success: false,
        message: errorMessage,
        error,
      };
    }
  }

  /**
   * Création d'un nouveau contact
   * @param {Object} contactData - Données du contact à créer
   * @param {string} contactData.name - Nom du contact (obligatoire)
   * @param {string} contactData.email - Email du contact
   * @param {string} contactData.phone - Téléphone du contact
   * @param {string} contactData.mobile - Mobile du contact
   * @param {string} contactData.street - Adresse du contact
   * @param {string} contactData.city - Ville du contact
   * @param {string} contactData.zip - Code postal du contact
   * @param {number} contactData.country_id - ID du pays
   * @param {boolean} contactData.is_company - Est une société
   * @param {number} contactData.parent_id - ID du contact parent (si c'est un contact d'une société)
   * @returns {Promise<Object>} Contact créé avec son ID
   */
  async createContact(contactData) {
    try {
      // Validation des données obligatoires
      if (!contactData || !contactData.name) {
        throw new Error('Le nom du contact est obligatoire');
      }

      // Appel API pour créer le contact
      const response = await api.post('/contacts', contactData);

      const { data } = response;

      if (!data || !data.id) {
        throw new Error('Échec de la création du contact');
      }

      console.log('Contact créé avec succès:', data.id);

      return {
        success: true,
        contact: data.contact || data,
        id: data.id,
        message: 'Contact créé avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de la création du contact:', error);

      const errorMessage = this._handleError(error, 'Impossible de créer le contact');

      throw {
        success: false,
        message: errorMessage,
        error,
      };
    }
  }

  /**
   * Mise à jour d'un contact existant
   * @param {number} id - ID du contact à mettre à jour
   * @param {Object} contactData - Données du contact à mettre à jour
   * @returns {Promise<Object>} Contact mis à jour
   */
  async updateContact(id, contactData) {
    try {
      // Validation de l'ID
      if (!id || typeof id !== 'number') {
        throw new Error('ID de contact invalide');
      }

      // Validation des données
      if (!contactData || Object.keys(contactData).length === 0) {
        throw new Error('Aucune donnée à mettre à jour');
      }

      // Appel API pour mettre à jour le contact
      const response = await api.put(`/contacts/${id}`, contactData);

      const { data } = response;

      console.log('Contact mis à jour avec succès:', id);

      return {
        success: true,
        contact: data.contact || data,
        message: 'Contact mis à jour avec succès',
      };
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du contact ${id}:`, error);

      const errorMessage = this._handleError(error, 'Impossible de mettre à jour le contact');

      throw {
        success: false,
        message: errorMessage,
        error,
      };
    }
  }

  /**
   * Suppression d'un contact
   * @param {number} id - ID du contact à supprimer
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async deleteContact(id) {
    try {
      // Validation de l'ID
      if (!id || typeof id !== 'number') {
        throw new Error('ID de contact invalide');
      }

      // Appel API pour supprimer le contact
      await api.delete(`/contacts/${id}`);

      console.log('Contact supprimé avec succès:', id);

      return {
        success: true,
        message: 'Contact supprimé avec succès',
        id,
      };
    } catch (error) {
      console.error(`Erreur lors de la suppression du contact ${id}:`, error);

      const errorMessage = this._handleError(error, 'Impossible de supprimer le contact');

      throw {
        success: false,
        message: errorMessage,
        error,
      };
    }
  }

  /**
   * Recherche de contacts
   * @param {string} searchTerm - Terme de recherche
   * @param {number} limit - Nombre maximum de résultats
   * @returns {Promise<Object>} Résultats de la recherche
   */
  async searchContacts(searchTerm, limit = 20) {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        throw new Error('Le terme de recherche est obligatoire');
      }

      return await this.getContacts({
        search: searchTerm.trim(),
        limit,
        offset: 0,
      });
    } catch (error) {
      console.error('Erreur lors de la recherche de contacts:', error);

      const errorMessage = this._handleError(error, 'Erreur lors de la recherche');

      throw {
        success: false,
        message: errorMessage,
        error,
      };
    }
  }

  /**
   * Récupération des contacts d'une société
   * @param {number} companyId - ID de la société
   * @param {number} limit - Nombre maximum de résultats
   * @returns {Promise<Object>} Liste des contacts de la société
   */
  async getCompanyContacts(companyId, limit = 50) {
    try {
      if (!companyId || typeof companyId !== 'number') {
        throw new Error('ID de société invalide');
      }

      // Utiliser le domain Odoo pour filtrer par parent_id
      return await this.getContacts({
        domain: [['parent_id', '=', companyId]],
        limit,
        offset: 0,
      });
    } catch (error) {
      console.error(`Erreur lors de la récupération des contacts de la société ${companyId}:`, error);

      const errorMessage = this._handleError(error, 'Impossible de récupérer les contacts de la société');

      throw {
        success: false,
        message: errorMessage,
        error,
      };
    }
  }

  /**
   * Récupération des sociétés uniquement (contacts avec is_company = true)
   * @param {Object} options - Options de pagination
   * @returns {Promise<Object>} Liste des sociétés
   */
  async getCompanies(options = {}) {
    try {
      const { limit = 50, offset = 0, search = '' } = options;

      // Filtrer pour récupérer uniquement les sociétés
      return await this.getContacts({
        domain: [['is_company', '=', true]],
        limit,
        offset,
        search,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des sociétés:', error);

      const errorMessage = this._handleError(error, 'Impossible de récupérer les sociétés');

      throw {
        success: false,
        message: errorMessage,
        error,
      };
    }
  }

  /**
   * Gestion centralisée des erreurs
   * @param {Error} error - Erreur à traiter
   * @param {string} defaultMessage - Message par défaut
   * @returns {string} Message d'erreur formaté
   * @private
   */
  _handleError(error, defaultMessage) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return error.response.data?.message || 'Données invalides';
        case 404:
          return 'Contact non trouvé';
        case 409:
          return 'Conflit: Ce contact existe déjà';
        case 422:
          return error.response.data?.message || 'Données non valides';
        case 500:
          return 'Erreur serveur. Veuillez réessayer plus tard.';
        default:
          return error.response.data?.message || error.userMessage || defaultMessage;
      }
    } else if (error.request) {
      return 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
    } else if (error.message) {
      return error.message;
    }

    return defaultMessage;
  }
}

// Export d'une instance unique (singleton)
const contactService = new ContactService();

export default contactService;
