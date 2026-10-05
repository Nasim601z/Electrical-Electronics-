import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CalculatorScreen({ onBack }) {
  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#FFF" />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>Calculator</Text>
      </View>

      <OhmLaw />
      <PowerCalc />
    </ScrollView>
  );
}

/* ============ Ohm's Law Calculator ============ */
function OhmLaw() {
  const [v, setV] = useState("");
  const [i, setI] = useState("");
  const [r, setR] = useState("");
  const [result, setResult] = useState(null);

  function calculate() {
    const V = parseFloat(v);
    const I = parseFloat(i);
    const R = parseFloat(r);

    if (!isNaN(V) && !isNaN(I) && (isNaN(R) || R === 0)) {
      setResult({ label: "Resistance", value: (V / I).toFixed(3), unit: "Ω" });
    } else if (!isNaN(V) && !isNaN(R) && (isNaN(I) || I === 0)) {
      setResult({ label: "Current", value: (V / R).toFixed(3), unit: "A" });
    } else if (!isNaN(I) && !isNaN(R) && (isNaN(V) || V === 0)) {
      setResult({ label: "Voltage", value: (I * R).toFixed(3), unit: "V" });
    } else {
      setResult({ label: "Error", value: "যেকোনো ২টি মান দিন", unit: "" });
    }
  }

  function clear() {
    setV(""); setI(""); setR(""); setResult(null);
  }

  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <MaterialCommunityIcons name="math-integral-box" size={24} color="#0284C7" />
        <Text style={s.cardTitle}>Ohm's Law Calculator</Text>
      </View>
      <Text style={s.formula}>V = I × R</Text>
      <Text style={s.help}>যেকোনো ২টি মান দিন, তৃতীয়টি বের হবে</Text>

      <Field label="Voltage (V)" value={v} onChange={setV} />
      <Field label="Current (A)" value={i} onChange={setI} />
      <Field label="Resistance (Ω)" value={r} onChange={setR} />

      <View style={s.btnRow}>
        <TouchableOpacity style={s.btnPrimary} onPress={calculate}>
          <Text style={s.btnText}>হিসাব করুন</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btnSecondary} onPress={clear}>
          <Text style={s.btnTextSecondary}>Clear</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={s.resultBox}>
          <Text style={s.resultLabel}>{result.label}</Text>
          <Text style={s.resultValue}>
            {result.value} {result.unit}
          </Text>
        </View>
      )}
    </View>
  );
}

/* ============ Power Calculator ============ */
function PowerCalc() {
  const [v, setV] = useState("");
  const [i, setI] = useState("");
  const [result, setResult] = useState(null);

  function calculate() {
    const V = parseFloat(v);
    const I = parseFloat(i);
    if (!isNaN(V) && !isNaN(I)) {
      setResult({ value: (V * I).toFixed(3), unit: "W" });
    } else {
      setResult({ value: "দুইটি মান দিন", unit: "" });
    }
  }

  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <MaterialCommunityIcons name="flash-outline" size={24} color="#D97706" />
        <Text style={s.cardTitle}>Power Calculator</Text>
      </View>
      <Text style={s.formula}>P = V × I</Text>

      <Field label="Voltage (V)" value={v} onChange={setV} />
      <Field label="Current (A)" value={i} onChange={setI} />

      <TouchableOpacity style={s.btnPrimary} onPress={calculate}>
        <Text style={s.btnText}>হিসাব করুন</Text>
      </TouchableOpacity>

      {result && (
        <View style={s.resultBox}>
          <Text style={s.resultLabel}>Power</Text>
          <Text style={s.resultValue}>
            {result.value} {result.unit}
          </Text>
        </View>
      )}
    </View>
  );
}

/* ============ Reusable Input Field ============ */
function Field({ label, value, onChange }) {
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        style={s.input}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor="#94A3B8"
      />
    </View>
  );
}

/* ============ Styles ============ */
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 16, paddingBottom: 40 },
  header: { backgroundColor: "#16A34A", borderRadius: 16, padding: 16, marginBottom: 14 },
  backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backText: { color: "#FFF", fontWeight: "bold", marginLeft: 6 },
  title: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  card: { backgroundColor: "#FFF", borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: "#E2E8F0" },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#0F172A", marginLeft: 8 },
  formula: { color: "#16A34A", fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  help: { color: "#64748B", fontSize: 12, marginBottom: 12 },
  field: { marginBottom: 10 },
  fieldLabel: { color: "#334155", fontSize: 13, fontWeight: "bold", marginBottom: 4 },
  input: { backgroundColor: "#F1F5F9", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: "#0F172A", borderWidth: 1, borderColor: "#E2E8F0" },
  btnRow: { flexDirection: "row", marginTop: 6 },
  btnPrimary: { flex: 1, backgroundColor: "#16A34A", borderRadius: 10, paddingVertical: 13, alignItems: "center", marginTop: 6 },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  btnSecondary: { marginLeft: 8, backgroundColor: "#E2E8F0", borderRadius: 10, paddingVertical: 13, paddingHorizontal: 20, alignItems: "center", marginTop: 6 },
  btnTextSecondary: { color: "#334155", fontWeight: "bold", fontSize: 14 },
  resultBox: { backgroundColor: "#DCFCE7", borderRadius: 12, padding: 14, marginTop: 12, alignItems: "center" },
  resultLabel: { color: "#166534", fontSize: 12, fontWeight: "bold", marginBottom: 4 },
  resultValue: { color: "#166534", fontSize: 22, fontWeight: "bold" },
});
