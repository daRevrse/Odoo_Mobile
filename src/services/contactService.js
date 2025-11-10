import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clé de stockage pour le cache des contacts
const CONTACTS_CACHE_KEY = 'contacts_cache';
const CONTACTS_CACHE_TIMESTAMP_KEY = 'contacts_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

/**
 * Service de gestion des contacts pour l'application Odoo Mobile
 */
class ContactService {
  /**
   * R�cup�ration des contacts depuis le cache
   * @returns {Promise<Object|null>} Contacts en cache ou null
   * @private
   */
  async _getContactsFromCache() {
    try {
      const cachedData = await AsyncStorage.getItem(CONTACTS_CACHE_KEY);
      const timestamp = await AsyncStorage.getItem(CONTACTS_CACHE_TIMESTAMP_KEY);

      if (cachedData && timestamp) {
        const contacts = JSON.parse(cachedData);
        const cacheAge = Date.now() - parseInt(timestamp, 10);

        console.log(`📦 Cache trouvé: ${contacts.length} contacts (âge: ${Math.round(cacheAge / 1000)}s)`);

        return {
          contacts,
          isCached: true,
          cacheAge,
          isStale: cacheAge > CACHE_DURATION,
        };
      }

      return null;
    } catch (error) {
      console.error('Erreur lors de la lecture du cache:', error);
      return null;
    }
  }

  /**
   * Sauvegarde des contacts dans le cache
   * @param {Array} contacts - Liste des contacts à mettre en cache
   * @private
   */
  async _saveContactsToCache(contacts) {
    try {
      await AsyncStorage.setItem(CONTACTS_CACHE_KEY, JSON.stringify(contacts));
      await AsyncStorage.setItem(CONTACTS_CACHE_TIMESTAMP_KEY, Date.now().toString());
      console.log(`💾 ${contacts.length} contacts mis en cache`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du cache:', error);
    }
  }

  /**
   * Effacement du cache des contacts
   */
  async clearCache() {
    try {
      await AsyncStorage.multiRemove([CONTACTS_CACHE_KEY, CONTACTS_CACHE_TIMESTAMP_KEY]);
      console.log('🗑️ Cache des contacts effacé');
    } catch (error) {
      console.error('Erreur lors de l\'effacement du cache:', error);
    }
  }


  /**
   * R�cup�ration de tous les contacts avec syst�me de cache
   * @param {Object} options - Options de pagination et filtrage
   * @param {number} options.limit - Nombre de contacts � r�cup�rer (d�faut: 50)
   * @param {number} options.offset - D�calage pour la pagination (d�faut: 0)
   * @param {string} options.search - Terme de recherche optionnel
   * @param {Array} options.domain - Filtre Odoo domain optionnel
   * @param {Array} options.fields - Champs sp�cifiques � r�cup�rer
   * @param {boolean} options.forceRefresh - Forcer le rechargement sans cache (d�faut: false)
   * @param {boolean} options.useCache - Utiliser le cache si disponible (d�faut: true)
   * @returns {Promise<Object>} Liste des contacts avec m�tadonn�es
   */
  async getContacts(options = {}) {
    try {
      const {
        limit = 50,
        offset = 0,
        search = '',
        domain = [],
        fields = [],
        forceRefresh = false,
        useCache = true,
      } = options;

      // Vérifier si on peut utiliser le cache (uniquement pour les requêtes simples sans filtres)
      const isSimpleQuery = !search && domain.length === 0 && offset === 0;
      const canUseCache = useCache && isSimpleQuery && !forceRefresh;

      // Essayer de récupérer depuis le cache si applicable
      if (canUseCache) {
        const cachedResult = await this._getContactsFromCache();

        if (cachedResult) {
          const { contacts: cachedContacts, isStale } = cachedResult;

          // Retourner immédiatement les données en cache
          return {
            success: true,
            data: cachedContacts,
            contacts: cachedContacts,
            total: cachedContacts.length,
            count: cachedContacts.length,
            limit,
            offset,
            fromCache: true,
            isStale,
          };
        }
      }

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

      // Appel API pour récupérer les contacts depuis /res.partner
      console.log('🌐 Chargement des contacts depuis le serveur...');
      const response = await api.get('/res.partner', { params });

      const { data } = response;

      // La structure de la réponse Odoo est : { count: number, results: [] }
      const contacts = data.results || [];
      const count = data.count || 0;

      console.log(`✅ ${count} contact(s) récupéré(s) depuis le serveur`);

      // Sauvegarder dans le cache si c'est une requête simple
      if (isSimpleQuery) {
        await this._saveContactsToCache(contacts);
      }

      return {
        success: true,
        data: contacts,
        contacts: contacts, // Pour compatibilité avec l'ancien code
        total: count,
        count: count,
        limit,
        offset,
        fromCache: false,
      };
    } catch (error) {
      console.error('Erreur lors de la r�cup�ration des contacts:', error);

      const errorMessage = this._handleError(error, 'Impossible de r�cup�rer les contacts');

      return {
        success: false,
        error: errorMessage,
        message: errorMessage,
        data: [],
        contacts: [],
        total: 0,
        count: 0,
      };
    }
  }

  /**
   * R�cup�ration d'un contact sp�cifique par son ID
   * @param {number} id - ID du contact � r�cup�rer
   * @param {Array} fields - Champs sp�cifiques � r�cup�rer (optionnel)
   * @returns {Promise<Object>} Donn�es du contact
   */
  async getContactById(id, fields = []) {
    try {
      // Validation de l'ID
      if (!id || typeof id !== 'number') {
        throw new Error('ID de contact invalide');
      }

      // Construire les param�tres de la requ�te
      const params = {};
      if (fields && fields.length > 0) {
        params.fields = JSON.stringify(fields);
      }

      // Appel API pour r�cup�rer le contact
      const response = await api.get(`/res.partner/${id}`, { params });

      const { data } = response;

      if (!data) {
        throw new Error('Contact non trouv�');
      }

      console.log('Contact r�cup�r�:', data.name || id);

      return {
        success: true,
        contact: data,
        data: data,
      };
    } catch (error) {
      console.error(`Erreur lors de la r�cup�ration du contact ${id}:`, error);

      const errorMessage = this._handleError(error, 'Impossible de r�cup�rer le contact');

      throw {
        success: false,
        message: errorMessage,
        error,
      };
    }
  }

  /**
   * Cr�ation d'un nouveau contact
   * @param {Object} contactData - Donn�es du contact � cr�er
   * @param {string} contactData.name - Nom du contact (obligatoire)
   * @param {string} contactData.email - Email du contact
   * @param {string} contactData.phone - T�l�phone du contact
   * @param {string} contactData.mobile - Mobile du contact
   * @param {string} contactData.street - Adresse du contact
   * @param {string} contactData.city - Ville du contact
   * @param {string} contactData.zip - Code postal du contact
   * @param {number} contactData.country_id - ID du pays
   * @param {boolean} contactData.is_company - Est une soci�t�
   * @param {number} contactData.parent_id - ID du contact parent (si c'est un contact d'une soci�t�)
   * @returns {Promise<Object>} Contact cr�� avec son ID
   */
  async createContact(contactData) {
    try {
      // Validation des donn�es obligatoires
      if (!contactData || !contactData.name) {
        throw new Error('Le nom du contact est obligatoire');
      }

      // Appel API pour cr�er le contact
      const response = await api.post('/res.partner', contactData);

      const { data } = response;

      if (!data || !data.id) {
        throw new Error('�chec de la cr�ation du contact');
      }

      console.log('Contact cr�� avec succ�s:', data.id);

      // Effacer le cache pour forcer le rechargement
      await this.clearCache();

      return {
        success: true,
        contact: data,
        data: data,
        id: data.id,
        message: 'Contact cr�� avec succ�s',
      };
    } catch (error) {
      console.error('Erreur lors de la cr�ation du contact:', error);

      const errorMessage = this._handleError(error, 'Impossible de cr�er le contact');

      throw {
        success: false,
        message: errorMessage,
        error,
      };
    }
  }

  /**
   * Mise � jour d'un contact existant
   * @param {number} id - ID du contact � mettre � jour
   * @param {Object} contactData - Donn�es du contact � mettre � jour
   * @returns {Promise<Object>} Contact mis � jour
   */
  async updateContact(id, contactData) {
    try {
      // Validation de l'ID
      if (!id || typeof id !== 'number') {
        throw new Error('ID de contact invalide');
      }

      // Validation des donn�es
      if (!contactData || Object.keys(contactData).length === 0) {
        throw new Error('Aucune donn�e � mettre � jour');
      }

      // Appel API pour mettre � jour le contact
      const response = await api.put(`/res.partner/${id}`, contactData);

      const { data } = response;

      console.log('Contact mis � jour avec succ�s:', id);

      // Effacer le cache pour forcer le rechargement
      await this.clearCache();

      return {
        success: true,
        contact: data,
        data: data,
        message: 'Contact mis � jour avec succ�s',
      };
    } catch (error) {
      console.error(`Erreur lors de la mise � jour du contact ${id}:`, error);

      const errorMessage = this._handleError(error, 'Impossible de mettre � jour le contact');

      throw {
        success: false,
        message: errorMessage,
        error,
      };
    }
  }

  /**
   * Suppression d'un contact
   * @param {number} id - ID du contact � supprimer
   * @returns {Promise<Object>} R�sultat de la suppression
   */
  async deleteContact(id) {
    try {
      // Validation de l'ID
      if (!id || typeof id !== 'number') {
        throw new Error('ID de contact invalide');
      }

      // Appel API pour supprimer le contact
      await api.delete(`/res.partner/${id}`);

      console.log('Contact supprim� avec succ�s:', id);

      // Effacer le cache pour forcer le rechargement
      await this.clearCache();

      return {
        success: true,
        message: 'Contact supprim� avec succ�s',
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
   * @param {number} limit - Nombre maximum de r�sultats
   * @returns {Promise<Object>} R�sultats de la recherche
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
   * R�cup�ration des contacts d'une soci�t�
   * @param {number} companyId - ID de la soci�t�
   * @param {number} limit - Nombre maximum de r�sultats
   * @returns {Promise<Object>} Liste des contacts de la soci�t�
   */
  async getCompanyContacts(companyId, limit = 50) {
    try {
      if (!companyId || typeof companyId !== 'number') {
        throw new Error('ID de soci�t� invalide');
      }

      // Utiliser le domain Odoo pour filtrer par parent_id
      return await this.getContacts({
        domain: [['parent_id', '=', companyId]],
        limit,
        offset: 0,
      });
    } catch (error) {
      console.error(`Erreur lors de la r�cup�ration des contacts de la soci�t� ${companyId}:`, error);

      const errorMessage = this._handleError(error, 'Impossible de r�cup�rer les contacts de la soci�t�');

      throw {
        success: false,
        message: errorMessage,
        error,
      };
    }
  }

  /**
   * R�cup�ration des soci�t�s uniquement (contacts avec is_company = true)
   * @param {Object} options - Options de pagination
   * @returns {Promise<Object>} Liste des soci�t�s
   */
  async getCompanies(options = {}) {
    try {
      const { limit = 50, offset = 0, search = '' } = options;

      // Filtrer pour r�cup�rer uniquement les soci�t�s
      return await this.getContacts({
        domain: [['is_company', '=', true]],
        limit,
        offset,
        search,
      });
    } catch (error) {
      console.error('Erreur lors de la r�cup�ration des soci�t�s:', error);

      const errorMessage = this._handleError(error, 'Impossible de r�cup�rer les soci�t�s');

      throw {
        success: false,
        message: errorMessage,
        error,
      };
    }
  }

  /**
   * Gestion centralis�e des erreurs
   * @param {Error} error - Erreur � traiter
   * @param {string} defaultMessage - Message par d�faut
   * @returns {string} Message d'erreur format�
   * @private
   */
  _handleError(error, defaultMessage) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return error.response.data?.message || 'Donn�es invalides';
        case 404:
          return 'Contact non trouv�';
        case 409:
          return 'Conflit: Ce contact existe d�j�';
        case 422:
          return error.response.data?.message || 'Donn�es non valides';
        case 500:
          return 'Erreur serveur. Veuillez r�essayer plus tard.';
        default:
          return error.response.data?.message || error.userMessage || defaultMessage;
      }
    } else if (error.request) {
      return 'Impossible de se connecter au serveur. V�rifiez votre connexion internet.';
    } else if (error.message) {
      return error.message;
    }

    return defaultMessage;
  }
}

// Export d'une instance unique (singleton)
const contactService = new ContactService();

export default contactService;
