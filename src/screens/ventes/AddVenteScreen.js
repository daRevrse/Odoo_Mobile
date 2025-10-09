import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddVenteScreen({ route, navigation }) {
  const { vente } = route.params || {};
  const isEdit = !!vente;

  const [form, setForm] = useState({
    client: vente?.client || "",
    date: vente?.date || new Date().toLocaleDateString("fr-FR"),
    dateEcheance: vente?.dateEcheance || "",
    reference: vente?.reference || "",
    moyenPaiement: vente?.moyenPaiement || "Virement bancaire",
    statut: vente?.statut || "En attente",
    notes: vente?.notes || "",
  });

  const [articles, setArticles] = useState(
    vente?.articles || [
      { nom: "", quantite: "1", prixUnitaire: "", total: "0" },
    ]
  );

  const moyensPaiement = [
    "Virement bancaire",
    "Espèces",
    "Chèque",
    "Mobile Money",
    "Carte bancaire",
  ];

  const statutsVente = ["En attente", "Payée", "En retard", "Annulée"];

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleArticleChange = (index, field, value) => {
    const newArticles = [...articles];
    newArticles[index][field] = value;

    // Calcul automatique du total
    if (field === "quantite" || field === "prixUnitaire") {
      const quantite = parseFloat(newArticles[index].quantite) || 0;
      const prixUnitaire =
        parseFloat(newArticles[index].prixUnitaire.replace(/[^0-9]/g, "")) || 0;
      newArticles[index].total = `${(
        quantite * prixUnitaire
      ).toLocaleString()} FCFA`;
    }

    setArticles(newArticles);
  };

  const handleAddArticle = () => {
    setArticles([
      ...articles,
      { nom: "", quantite: "1", prixUnitaire: "", total: "0" },
    ]);
  };

  const handleRemoveArticle = (index) => {
    if (articles.length > 1) {
      const newArticles = articles.filter((_, i) => i !== index);
      setArticles(newArticles);
    }
  };

  const calculateTotal = () => {
    const total = articles.reduce((sum, article) => {
      const articleTotal =
        parseFloat(article.total.replace(/[^0-9]/g, "")) || 0;
      return sum + articleTotal;
    }, 0);
    return total.toLocaleString();
  };

  const calculateTVA = () => {
    const total = parseFloat(calculateTotal().replace(/[^0-9]/g, "")) || 0;
    const tva = total * 0.18;
    return tva.toLocaleString();
  };

  const calculateTTC = () => {
    const total = parseFloat(calculateTotal().replace(/[^0-9]/g, "")) || 0;
    const ttc = total * 1.18;
    return ttc.toLocaleString();
  };

  const handleSave = () => {
    // Validation
    if (!form.client.trim()) {
      Alert.alert("Erreur", "Le client est obligatoire");
      return;
    }

    const hasValidArticle = articles.some(
      (a) => a.nom.trim() && parseFloat(a.quantite) > 0
    );
    if (!hasValidArticle) {
      Alert.alert("Erreur", "Ajoutez au moins un article valide");
      return;
    }

    // Sauvegarde
    Alert.alert(
      "Succès",
      isEdit ? "Vente modifiée avec succès" : "Vente créée avec succès",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? "Modifier la vente" : "Nouvelle vente"}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Informations générales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS GÉNÉRALES</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Client <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.client}
                onChangeText={(value) => handleChange("client", value)}
                style={styles.input}
                placeholder="Nom du client"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Date de vente</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  value={form.date}
                  onChangeText={(value) => handleChange("date", value)}
                  style={styles.input}
                  placeholder="JJ/MM/AAAA"
                />
              </View>
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Date échéance</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  value={form.dateEcheance}
                  onChangeText={(value) => handleChange("dateEcheance", value)}
                  style={styles.input}
                  placeholder="JJ/MM/AAAA"
                />
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Référence</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.reference}
                onChangeText={(value) => handleChange("reference", value)}
                style={styles.input}
                placeholder="REF-2025-001"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Moyen de paiement</Text>
            <View style={styles.selectContainer}>
              {moyensPaiement.map((moyen) => (
                <TouchableOpacity
                  key={moyen}
                  style={[
                    styles.selectOption,
                    form.moyenPaiement === moyen && styles.selectOptionActive,
                  ]}
                  onPress={() => handleChange("moyenPaiement", moyen)}
                >
                  <Text
                    style={[
                      styles.selectOptionText,
                      form.moyenPaiement === moyen &&
                        styles.selectOptionTextActive,
                    ]}
                  >
                    {moyen}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Statut</Text>
            <View style={styles.selectContainer}>
              {statutsVente.map((statut) => (
                <TouchableOpacity
                  key={statut}
                  style={[
                    styles.selectOption,
                    form.statut === statut && styles.selectOptionActive,
                  ]}
                  onPress={() => handleChange("statut", statut)}
                >
                  <Text
                    style={[
                      styles.selectOptionText,
                      form.statut === statut && styles.selectOptionTextActive,
                    ]}
                  >
                    {statut}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Articles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ARTICLES</Text>
            <TouchableOpacity
              style={styles.addArticleButton}
              onPress={handleAddArticle}
            >
              <Ionicons name="add-circle" size={24} color="#990000" />
            </TouchableOpacity>
          </View>

          {articles.map((article, index) => (
            <View key={index} style={styles.articleCard}>
              <View style={styles.articleHeader}>
                <Text style={styles.articleLabel}>Article {index + 1}</Text>
                {articles.length > 1 && (
                  <TouchableOpacity onPress={() => handleRemoveArticle(index)}>
                    <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                  </TouchableOpacity>
                )}
              </View>

              <TextInput
                value={article.nom}
                onChangeText={(value) =>
                  handleArticleChange(index, "nom", value)
                }
                style={styles.articleInput}
                placeholder="Nom de l'article"
              />

              <View style={styles.row}>
                <TextInput
                  value={article.quantite}
                  onChangeText={(value) =>
                    handleArticleChange(index, "quantite", value)
                  }
                  style={[styles.articleInput, styles.halfWidth]}
                  placeholder="Qté"
                  keyboardType="numeric"
                />
                <TextInput
                  value={article.prixUnitaire}
                  onChangeText={(value) =>
                    handleArticleChange(index, "prixUnitaire", value)
                  }
                  style={[styles.articleInput, styles.halfWidth]}
                  placeholder="Prix unitaire"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.articleTotal}>
                <Text style={styles.articleTotalLabel}>Total :</Text>
                <Text style={styles.articleTotalValue}>{article.total}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Calculs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MONTANTS</Text>
          <View style={styles.calculRow}>
            <Text style={styles.calculLabel}>Montant HT</Text>
            <Text style={styles.calculValue}>{calculateTotal()} FCFA</Text>
          </View>
          <View style={styles.calculRow}>
            <Text style={styles.calculLabel}>TVA (18%)</Text>
            <Text style={styles.calculValue}>{calculateTVA()} FCFA</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL TTC</Text>
            <Text style={styles.totalValue}>{calculateTTC()} FCFA</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTES</Text>
          <View style={styles.formGroup}>
            <View style={[styles.inputContainer, styles.textareaContainer]}>
              <TextInput
                value={form.notes}
                onChangeText={(value) => handleChange("notes", value)}
                style={[styles.input, styles.textarea]}
                placeholder="Ajoutez des notes sur cette vente..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  saveText: {
    color: "#990000",
    fontSize: 16,
    fontWeight: "600",
  },

  // Sections
  section: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    paddingTop: 16,
    paddingBottom: 16,
    letterSpacing: 0.5,
  },
  addArticleButton: {
    padding: 8,
  },

  // Form
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#E74C3C",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 15,
    color: "#333",
  },
  textareaContainer: {
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  textarea: {
    minHeight: 100,
    paddingVertical: 0,
  },

  // Row
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },

  // Select
  selectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  selectOptionActive: {
    backgroundColor: "#990000",
    borderColor: "#990000",
  },
  selectOptionText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  selectOptionTextActive: {
    color: "#fff",
  },

  // Articles
  articleCard: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  articleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  articleLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
  },
  articleInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    fontSize: 14,
  },
  articleTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  articleTotalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  articleTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#990000",
  },

  // Calculs
  calculRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  calculLabel: {
    fontSize: 14,
    color: "#666",
  },
  calculValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#990000",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#990000",
  },

  bottomSpace: {
    height: 40,
  },
});
