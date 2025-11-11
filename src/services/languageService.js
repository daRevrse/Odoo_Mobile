import api from './api';

/**
 * Service de gestion des langues pour l'application Odoo Mobile
 */
class LanguageService {
  /**
   * Récupération de toutes les langues disponibles
   * @returns {Promise<Object>} Liste des langues
   */
  async getLanguages() {
    try {
      console.log('🌐 Chargement des langues depuis le serveur...');
      const response = await api.get('/res.lang');

      const { data } = response;

      // La structure de la réponse Odoo est : { count: number, results: [] }
      const languages = data.results || [];
      const count = data.count || 0;

      console.log(`✅ ${count} langue(s) récupérée(s) depuis le serveur`);

      return {
        success: true,
        data: languages,
        languages: languages,
        total: count,
        count: count,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des langues:', error);

      const errorMessage = this._handleError(error, 'Impossible de récupérer les langues');

      return {
        success: false,
        error: errorMessage,
        message: errorMessage,
        data: [],
        languages: [],
        total: 0,
        count: 0,
      };
    }
  }

  /**
   * Mise à jour de la langue de l'utilisateur
   * @param {string} langCode - Code de la langue (ex: 'fr_FR', 'en_US')
   * @returns {Promise<Object>} Résultat de la mise à jour
   */
  async updateUserLanguage(langCode) {
    try {
      // TODO: Implement user language update API call
      console.log('Mise à jour de la langue utilisateur:', langCode);

      return {
        success: true,
        message: 'Langue mise à jour avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la langue:', error);

      const errorMessage = this._handleError(error, 'Impossible de mettre à jour la langue');

      return {
        success: false,
        error: errorMessage,
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
          return 'Ressource non trouvée';
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
const languageService = new LanguageService();

export default languageService;
