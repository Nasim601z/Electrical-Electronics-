import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
/*
==================================================
SECTION REGISTRY
নতুন Home Section যোগ করতে হলে এই array-এর শেষে
আরেকটি object যোগ করবে।
==================================================
*/

const SECTION_REGISTRY = [
  {
    id: "electrical",
    title: "Electrical",
    subtitle: "Basic electrical শেখা",
    description:
      "Voltage, Current, Resistance, AC, DC, Wiring এবং Motor সম্পর্কে শিখুন।",
    icon: "lightning-bolt",
    color: "#0284C7",
  },

  {
    id: "electronics",
    title: "Electronics",
    subtitle: "Components ও circuit",
    description:
      "Resistor, Capacitor, Diode, LED, Transistor এবং IC সম্পর্কে শিখুন।",
    icon: "chip",
    color: "#7C3AED",
  },

  {
    id: "calculation",
    title: "Calculation",
    subtitle: "বিভিন্ন হিসাব করুন",
    description:
      "Ohm’s Law, Power, Energy এবং Resistor-এর হিসাব করুন।",
    icon: "calculator-variant",
    color: "#16A34A",
  },

  {
    id: "safety",
    title: "Safety",
    subtitle: "নিরাপত্তা নিয়ম",
    description:
      "Electrical shock, fire, short circuit এবং wiring safety সম্পর্কে জানুন।",
    icon: "shield-check",
    color: "#EA580C",
  },

  {
    id: "measurement",
    title: "Measurement & Testing",
    subtitle: "Parts ও device পরীক্ষা",
    description:
      "Multimeter দিয়ে Voltage, Current, Resistance এবং Parts পরীক্ষা শিখুন।",
    icon: "gauge",
    color: "#0891B2",
  },

  {
    id: "power",
    title: "Power & Unit",
    subtitle: "Watt, Unit ও খরচ",
    description:
      "Volt, Ampere, Watt, Unit এবং আনুমানিক বিদ্যুৎ খরচ হিসাব করুন।",
    icon: "flash",
    color: "#D97706",
  },

  {
    id: "plc",
    title: "PLC Course",
    subtitle: "Ladder, wiring ও automation",
    description:
      "PLC fundamentals, ladder logic, wiring, motor control ও troubleshooting শিখুন।",
    icon: "cog-box",
    color: "#1E3A8A",
  },

  {
    id: "job",
    title: "Job Preparation",
    subtitle: "CV, interview ও practical test",
    description:
      "CV, interview প্রশ্ন, technical Q&A ও practical test-এর প্রস্তুতি নিন।",
    icon: "briefcase-account",
    color: "#BE123C",
  },

];

/*
==================================================
FUTURE SECTION PLACE
ভবিষ্যতে এখানে নতুন Home Section যোগ করতে পারবে।

উদাহরণ:

{
  id: "troubleshooting",
  title: "Troubleshooting",
  subtitle: "সমস্যা খুঁজে সমাধান",
  description: "Fan, Light, Motor ও Circuit-এর সমস্যা সমাধান করুন।",
  icon: "tools",
  color: "#DB2777",
},

==================================================
*/

/*
==================================================
ELECTRICAL LESSON DATA
Electrical section-এর সব topic ও lesson এখানে থাকবে।
নতুন lesson যোগ করতে এই array-তে object যোগ করবে।
==================================================
*/

const ELECTRICAL_LESSONS = [
  {
    id: "voltage",
    title: "Voltage কী?",
    subtitle: "বিদ্যুৎ চাপ সম্পর্কে জানুন",
    icon: "sine-wave",
    color: "#0284C7",
    lesson: [
      "Voltage হলো বৈদ্যুতিক চাপ, যা current-কে circuit-এর মধ্যে প্রবাহিত হতে সাহায্য করে।",
      "Voltage-এর একক হলো Volt এবং এর প্রতীক V।",
      "Battery, adapter ও power supply voltage প্রদান করে।",
    ],
    formula: "Voltage = Current × Resistance\nV = I × R",
    example: "উদাহরণ: 12V battery মানে battery-টির voltage হলো 12 Volt।",
    safety:
      "Voltage মাপার সময় multimeter সঠিক mode-এ রাখুন এবং mains voltage-এর ক্ষেত্রে প্রশিক্ষিত ব্যক্তির সাহায্য নিন।",
  },

  {
    id: "current",
    title: "Current কী?",
    subtitle: "বিদ্যুৎ প্রবাহ সম্পর্কে জানুন",
    icon: "current-ac",
    color: "#0891B2",
    lesson: [
      "Current হলো circuit-এর মধ্যে electric charge-এর প্রবাহ।",
      "Current-এর একক হলো Ampere এবং এর প্রতীক A।",
      "একটি device কত current নিচ্ছে তা জানলে তার power সম্পর্কে ধারণা পাওয়া যায়।",
    ],
    formula: "Current = Voltage ÷ Resistance\nI = V ÷ R",
    example: "উদাহরণ: 12V voltage এবং 6Ω resistance হলে current = 2A।",
    safety:
      "Current মাপার সময় multimeter ভুলভাবে parallel-এ সংযোগ করবেন না। এতে short circuit হতে পারে।",
  },

  {
    id: "resistance",
    title: "Resistance কী?",
    subtitle: "বিদ্যুৎ প্রবাহের বাধা",
    icon: "resistor",
    color: "#7C3AED",
    lesson: [
      "Resistance হলো current প্রবাহের বিরুদ্ধে circuit-এর বাধা।",
      "Resistance-এর একক হলো Ohm এবং এর প্রতীক Ω।",
      "Resistor circuit-এর current নিয়ন্ত্রণ করতে ব্যবহার করা হয়।",
    ],
    formula: "Resistance = Voltage ÷ Current\nR = V ÷ I",
    example: "উদাহরণ: 10V voltage এবং 2A current হলে resistance = 5Ω।",
    safety:
      "Resistance মাপার আগে circuit-এর power সম্পূর্ণ বন্ধ করুন। Live circuit-এ resistance mode ব্যবহার করবেন না।",
  },

  {
    id: "ohms-law",
    title: "Ohm’s Law",
    subtitle: "Voltage, Current ও Resistance-এর সম্পর্ক",
    icon: "math-integral-box",
    color: "#16A34A",
    lesson: [
      "Ohm’s Law voltage, current এবং resistance-এর মধ্যে সম্পর্ক দেখায়।",
      "এই সূত্র ব্যবহার করে যেকোনো দুটি মান জানা থাকলে তৃতীয় মান বের করা যায়।",
      "Electrical calculation-এর জন্য এটি সবচেয়ে গুরুত্বপূর্ণ সূত্রগুলোর একটি।",
    ],
    formula: "V = I × R\nI = V ÷ R\nR = V ÷ I",
    example: "উদাহরণ: I = 2A এবং R = 6Ω হলে V = 2 × 6 = 12V।",
    safety:
      "কোনো বাস্তব circuit-এ কাজ করার আগে voltage rating এবং component rating পরীক্ষা করুন।",
  },

  {
    id: "ac-dc",
    title: "AC ও DC",
    subtitle: "দুই ধরনের বিদ্যুৎ সম্পর্কে জানুন",
    icon: "current-dc",
    color: "#EA580C",
    lesson: [
      "DC বা Direct Current একই দিকে প্রবাহিত হয়। Battery সাধারণত DC supply দেয়।",
      "AC বা Alternating Current-এর দিক সময়ের সঙ্গে পরিবর্তিত হয়। বাসাবাড়ির mains supply সাধারণত AC।",
      "DC circuit-এ polarity গুরুত্বপূর্ণ, কিন্তু AC circuit-এ polarity পরিবর্তনশীল।",
    ],
    formula: "DC: একদিকে প্রবাহ\nAC: দিক পরিবর্তনশীল",
    example: "উদাহরণ: Battery হলো DC source, আর wall socket হলো AC source।",
    safety:
      "AC mains voltage অত্যন্ত বিপজ্জনক। প্রশিক্ষণ ছাড়া mains circuit খুলে পরীক্ষা করবেন না।",
  },

  {
    id: "series-circuit",
    title: "Series Circuit",
    subtitle: "একটির পর একটি সংযোগ",
    icon: "transit-connection-variant",
    color: "#9333EA",
    lesson: [
      "Series circuit-এ component-গুলো একটির পর একটি সংযুক্ত থাকে।",
      "Series circuit-এ একই current সব component-এর মধ্য দিয়ে প্রবাহিত হয়।",
      "একটি component open হলে পুরো circuit বন্ধ হয়ে যেতে পারে।",
    ],
    formula: "Total Resistance = R1 + R2 + R3",
    example: "R1 = 2Ω এবং R2 = 3Ω হলে total resistance = 5Ω।",
    safety:
      "Circuit পরিবর্তন করার আগে power supply বন্ধ করুন এবং connection diagram দেখে কাজ করুন।",
  },

  {
    id: "parallel-circuit",
    title: "Parallel Circuit",
    subtitle: "আলাদা branch-এ সংযোগ",
    icon: "source-branch",
    color: "#2563EB",
    lesson: [
      "Parallel circuit-এ component-গুলো আলাদা আলাদা branch-এ সংযুক্ত থাকে।",
      "Parallel circuit-এর প্রতিটি branch-এ voltage সাধারণত সমান থাকে।",
      "একটি branch বন্ধ হলেও অন্য branch কাজ করতে পারে।",
    ],
    formula: "1/R = 1/R1 + 1/R2 + 1/R3",
    example: "বাসাবাড়ির light ও fan সাধারণত parallel connection-এ থাকে।",
    safety:
      "Parallel connection করার আগে প্রতিটি branch-এর voltage rating পরীক্ষা করুন।",
  },

  {
    id: "power",
    title: "Electrical Power",
    subtitle: "Device কত power ব্যবহার করছে",
    icon: "flash-outline",
    color: "#D97706",
    lesson: [
      "Electrical power হলো কোনো device কত দ্রুত electrical energy ব্যবহার করছে।",
      "Power-এর একক হলো Watt এবং এর প্রতীক W।",
      "Voltage ও current জানা থাকলে basic power হিসাব করা যায়।",
    ],
    formula: "Power = Voltage × Current\nP = V × I",
    example: "220V এবং 2A হলে power = 220 × 2 = 440W।",
    safety:
      "Device-এর rated voltage ও rated watt-এর চেয়ে বেশি supply ব্যবহার করবেন না।",
  },

  {
    id: "earthing",
    title: "Earthing কী?",
    subtitle: "নিরাপত্তার জন্য earthing",
    icon: "connection",
    color: "#059669",
    lesson: [
      "Earthing fault current-কে নিরাপদ পথে মাটিতে পাঠাতে সাহায্য করে।",
      "এটি electric shock-এর ঝুঁকি কমাতে গুরুত্বপূর্ণ ভূমিকা রাখে।",
      "বাড়ির electrical installation-এ সঠিক earthing থাকা জরুরি।",
    ],
    formula: "Earthing = Fault current-এর নিরাপদ পথ",
    example: "Metal body appliance-এ fault হলে earthing মানুষকে shock থেকে রক্ষা করতে সাহায্য করে।",
    safety:
      "Earthing পরীক্ষা ও installation অবশ্যই qualified electrician দিয়ে করান।",
  },

  {
    id: "fuse-mcb",
    title: "Fuse ও MCB",
    subtitle: "Circuit protection device",
    icon: "fuse",
    color: "#DC2626",
    lesson: [
      "Fuse অতিরিক্ত current হলে গলে গিয়ে circuit বিচ্ছিন্ন করে।",
      "MCB অতিরিক্ত current বা short circuit হলে circuit trip করে।",
      "Fuse একবার নষ্ট হলে পরিবর্তন করতে হয়, কিন্তু MCB reset করা যায়।",
    ],
    formula: "Overcurrent → Protection device → Circuit disconnect",
    example: "Short circuit হলে fuse গলে যেতে পারে অথবা MCB trip করতে পারে।",
    safety:
      "সঠিক rating-এর fuse বা MCB ব্যবহার করুন। Fuse-এর জায়গায় তার লাগানো অত্যন্ত বিপজ্জনক।",
  },
];



/*
==================================================
NAVIGATION: Back ও Home
Back = এক ধাপ পিছনে, Home = সরাসরি মূল Home। সব section এই একটি component ব্যবহার করে।
==================================================
*/
const HomeContext = React.createContext(() => {});

function NavRow({ onBack, light = true }) {
  const goHome = React.useContext(HomeContext);
  const color = light ? "#FFFFFF" : "#0F172A";
  const pill = {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: light ? "rgba(255,255,255,0.22)" : "#E2E8F0",
  };
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <TouchableOpacity onPress={onBack || goHome} style={pill} activeOpacity={0.8}>
        <MaterialCommunityIcons name="arrow-left" size={20} color={color} />
        <Text style={{ color, fontWeight: "bold", marginLeft: 6 }}>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goHome} style={pill} activeOpacity={0.8}>
        <MaterialCommunityIcons name="home" size={20} color={color} />
        <Text style={{ color, fontWeight: "bold", marginLeft: 6 }}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}

/*
==================================================
MODULE: electrical_app.js
==================================================
*/
const ElectricalModule = (() => {
  /* =====================================================
     ELECTRICAL CONTENT
     নতুন topic যোগ করতে শুধু ELECTRICAL_TOPICS-এ object যোগ করুন।
     ===================================================== */
  const ELECTRICAL_TOPICS = [
    {
      id: "voltage",
      category: "Basic Electrical",
      title: "Voltage (V)",
      icon: "flash",
      summary: "Voltage হলো circuit-এর electrical pressure।",
      full: "Voltage current-কে circuit-এর মধ্যে প্রবাহিত হতে সাহায্য করে। এর একক Volt (V)। Battery, adapter ও power supply voltage দিতে পারে।",
      formula: "V = I × R",
      example: "12V battery মানে battery-এর nominal voltage 12 Volt।",
      test: "Voltage সাধারণত multimeter-এর ACV বা DCV mode-এ parallel connection দিয়ে মাপা হয়।",
      safety: "Mains voltage মাপার আগে সঠিক range, probe port ও safety category নিশ্চিত করুন।",
      viva: "Voltage-এর একক কী? উত্তর: Volt (V)।",
    },
    {
      id: "current",
      category: "Basic Electrical",
      title: "Current (A)",
      icon: "current-ac",
      summary: "Current হলো electric charge-এর প্রবাহ।",
      full: "Current circuit-এর মধ্যে charge flow বোঝায়। এর একক Ampere (A)। কোনো device কত current নিচ্ছে তা power ও wire selection বুঝতে সাহায্য করে।",
      formula: "I = V ÷ R",
      example: "12V এবং 6Ω হলে I = 12 ÷ 6 = 2A।",
      test: "Current মাপতে clamp meter বেশি নিরাপদ। সাধারণ multimeter হলে circuit-এর series-এ সংযোগ করতে হয়।",
      safety: "Current mode-এ multimeter-কে সরাসরি voltage source-এর দুই পাশে লাগাবেন না—short circuit হতে পারে।",
      viva: "Current-এর একক কী? উত্তর: Ampere (A)।",
    },
    {
      id: "resistance",
      category: "Basic Electrical",
      title: "Resistance (Ω)",
      icon: "resistor",
      summary: "Resistance current প্রবাহে বাধা দেয়।",
      full: "Resistance circuit-এ current সীমিত করে। এর একক Ohm (Ω)। Resistor, wire length, material ও temperature resistance-কে প্রভাবিত করতে পারে।",
      formula: "R = V ÷ I",
      example: "10V ও 2A হলে R = 10 ÷ 2 = 5Ω।",
      test: "Resistance মাপার আগে circuit-এর power সম্পূর্ণ বন্ধ করুন এবং capacitor discharge করুন।",
      safety: "Live circuit-এ resistance বা continuity mode ব্যবহার করবেন না।",
      viva: "Resistance-এর একক কী? উত্তর: Ohm (Ω)।",
    },
    {
      id: "ohm",
      category: "Basic Electrical",
      title: "Ohm’s Law",
      icon: "math-integral-box",
      summary: "Voltage, Current ও Resistance-এর সম্পর্ক।",
      full: "Ohm’s Law অনুযায়ী voltage বাড়লে resistance একই থাকলে current বাড়ে। এই সূত্র basic electrical calculation-এর ভিত্তি।",
      formula: "V = I × R | I = V ÷ R | R = V ÷ I",
      example: "I = 2A এবং R = 6Ω হলে V = 12V।",
      test: "পরিমাপ করা V ও I দিয়ে R হিসাব করে component-এর expected value-এর সঙ্গে তুলনা করুন।",
      safety: "Component-এর voltage, current ও power rating অতিক্রম করবেন না।",
      viva: "Ohm’s Law-এর মূল সূত্র কী? উত্তর: V = I × R।",
    },
    {
      id: "acdc",
      category: "Basic Electrical",
      title: "AC ও DC",
      icon: "sine-wave",
      summary: "Alternating Current ও Direct Current।",
      full: "DC একদিকে প্রবাহিত হয়, যেমন battery। AC-এর দিক ও মান সময়ের সঙ্গে পরিবর্তিত হয়, যেমন সাধারণ mains supply।",
      formula: "DC = একমুখী প্রবাহ | AC = পরিবর্তনশীল প্রবাহ",
      example: "Battery সাধারণত DC এবং wall socket সাধারণত AC source।",
      test: "Multimeter-এ ACV বা DCV নির্বাচন করার আগে source-এর ধরন নিশ্চিত করুন।",
      safety: "AC mains নিয়ে প্রশিক্ষণ ছাড়া কাজ করবেন না।",
      viva: "AC-এর পূর্ণরূপ কী? উত্তর: Alternating Current।",
    },
    {
      id: "series-parallel",
      category: "Circuit",
      title: "Series ও Parallel Circuit",
      icon: "transit-connection-variant",
      summary: "Component সংযোগের দুটি মৌলিক পদ্ধতি।",
      full: "Series circuit-এ component একটির পর একটি থাকে এবং একই current প্রবাহিত হয়। Parallel circuit-এ আলাদা branch থাকে এবং branch-গুলোতে voltage সাধারণত সমান থাকে।",
      formula: "Series: Rt = R1 + R2 | Parallel: 1/Rt = 1/R1 + 1/R2",
      example: "বাড়ির light ও fan সাধারণত parallel connection-এ থাকে।",
      test: "Power বন্ধ করে diagram দেখে continuity ও connection যাচাই করুন।",
      safety: "ভুল branch বা short connection তৈরি করবেন না।",
      viva: "Parallel circuit-এর একটি branch নষ্ট হলে অন্য branch সবসময় বন্ধ হয় না।",
    },
    {
      id: "power-energy",
      category: "Calculation",
      title: "Power, Energy ও Unit",
      icon: "flash-outline",
      summary: "Device কত Watt ও কত Unit ব্যবহার করে।",
      full: "Power হলো energy ব্যবহারের হার। Energy consumption সাধারণত kWh বা Unit-এ হিসাব করা হয়।",
      formula: "P = V × I | Unit = Power(kW) × Time(hour)",
      example: "100W fan 8 ঘণ্টা চললে: 0.1 × 8 = 0.8 Unit/day।",
      test: "Voltage ও current meter দিয়ে নিয়ে power হিসাব করুন; smart energy meter হলে সরাসরি kWh পড়ুন।",
      safety: "শুধু app-এর হিসাবকে actual billing reading ধরে নেবেন না।",
      viva: "1 Unit বিদ্যুৎ কত? উত্তর: 1 kWh।",
    },
    {
      id: "wiring-tools",
      category: "Wiring ও Tools",
      title: "Wiring Tools ও মাপজোক",
      icon: "toolbox-outline",
      summary: "Wiring-এর কাজে প্রয়োজনীয় tools ও পরিমাপ।",
      full: "Tape measure দিয়ে distance, wire stripper দিয়ে insulation, cutter দিয়ে wire, tester দিয়ে phase এবং multimeter দিয়ে voltage, resistance ও continuity পরীক্ষা করা হয়।",
      formula: "Load current = Total load(W) ÷ Voltage(V)",
      example: "Cable route-এর length মেপে cutting-এর আগে extra allowance রাখুন।",
      test: "Wire size, cable length, terminal tightness ও continuity আলাদা আলাদাভাবে যাচাই করুন।",
      safety: "Insulated tools, gloves ও eye protection ব্যবহার করুন।",
      viva: "Clamp meter-এর সুবিধা কী? উত্তর: circuit না খুলে current মাপা যায়।",
    },
    {
      id: "house-wiring",
      category: "Wiring ও Installation",
      title: "House Wiring Basics",
      icon: "home-lightning-bolt-outline",
      summary: "Light, fan, socket ও DB wiring-এর ধারণা।",
      full: "House wiring-এ phase, neutral ও earth-এর সঠিক পরিচয়, switch-এর অবস্থান, distribution board এবং protection device গুরুত্বপূর্ণ।",
      formula: "Load total = সব device-এর rated power-এর যোগফল",
      example: "Light ও fan-এর switch সাধারণত phase line-এ বসানো হয়।",
      test: "Power off করে continuity, polarity, insulation এবং earth connection পরীক্ষা করুন।",
      safety: "Wire colour দেখে একা সিদ্ধান্ত নেবেন না; tester ও approved diagram দিয়ে যাচাই করুন।",
      viva: "Earth wire-এর উদ্দেশ্য কী? উত্তর: fault current-এর নিরাপদ পথ দেওয়া।",
    },
    {
      id: "wire-size",
      category: "Wiring ও Installation",
      title: "Wire Size ও Voltage Drop",
      icon: "ruler-square",
      summary: "Load অনুযায়ী cable নির্বাচন।",
      full: "Wire size নির্বাচন করতে load current, cable length, installation method, ambient temperature ও permissible voltage drop বিবেচনা করা হয়।",
      formula: "Voltage drop = Current × Cable resistance",
      example: "দূরত্ব বাড়লে একই load-এ voltage drop বাড়তে পারে।",
      test: "Load চালু অবস্থায় source ও load-end voltage তুলনা করে drop বুঝুন।",
      safety: "শুধু অনুমান করে cable size নির্বাচন করবেন না; local code ও qualified electrician-এর পরামর্শ নিন।",
      viva: "ছোট wire-এ বড় load দিলে কী হতে পারে? উত্তর: অতিরিক্ত heating ও fire risk।",
    },
    {
      id: "fuse-mcb-rccb",
      category: "Protection",
      title: "Fuse, MCB, RCCB ও RCBO",
      icon: "shield-check",
      summary: "Overcurrent ও leakage protection।",
      full: "Fuse অতিরিক্ত current হলে গলে circuit বিচ্ছিন্ন করে। MCB overload ও short circuit-এ trip করে। RCCB leakage বা residual current শনাক্ত করে। RCBO overcurrent ও leakage দুটোই সামলায়।",
      formula: "Fault → Protection device trip → Supply disconnect",
      example: "RCCB মানুষের shock risk কমাতে সাহায্য করতে পারে, তবে এটি earthing-এর বিকল্প নয়।",
      test: "MCB/RCCB-এর test button, terminal tightness ও trip condition qualified person দিয়ে যাচাই করুন।",
      safety: "Fuse-এর জায়গায় wire লাগাবেন না এবং protection device bypass করবেন না।",
      viva: "RCCB কী শনাক্ত করে? উত্তর: residual/leakage current।",
    },
    {
      id: "earthing",
      category: "Protection",
      title: "Earthing ও Bonding",
      icon: "earth",
      summary: "Fault current-এর নিরাপদ পথ।",
      full: "Earthing exposed metal body-কে নিরাপদ potential-এ রাখতে এবং fault current-কে protection device পর্যন্ত পৌঁছাতে সাহায্য করে।",
      formula: "Fault current → Earth path → Protection operation",
      example: "Metal-body appliance-এ insulation fault হলে earthing shock risk কমাতে সাহায্য করে।",
      test: "Earth continuity ও earth resistance approved tester দিয়ে পরীক্ষা করুন।",
      safety: "Earthing wire কখনো neutral-এর সঙ্গে ইচ্ছেমতো short করবেন না।",
      viva: "Earthing-এর মূল উদ্দেশ্য কী? উত্তর: fault current-এর নিরাপদ পথ।",
    },
    {
      id: "relay-contactor",
      category: "Control ও Motor",
      title: "Relay ও Contactor",
      icon: "switch",
      summary: "Control signal দিয়ে load চালু-বন্দ করা।",
      full: "Relay ছোট control signal দিয়ে contact operate করে। Contactor বেশি current-এর motor বা load switching-এর জন্য ব্যবহৃত হয়। NO, NC ও Common contact চিনতে হবে।",
      formula: "Coil energized → Contact state change",
      example: "Contactor coil energize হলে main contact motor-এ supply দিতে পারে।",
      test: "Coil resistance, contact continuity ও NO/NC state power off অবস্থায় পরীক্ষা করুন।",
      safety: "Coil voltage ও contact rating না মিলিয়ে connection করবেন না।",
      viva: "NO-এর পূর্ণরূপ কী? উত্তর: Normally Open।",
    },
    {
      id: "dol",
      category: "Control ও Motor",
      title: "DOL Starter",
      icon: "engine-outline",
      summary: "Direct-On-Line motor starter।",
      full: "DOL starter motor-কে সরাসরি line voltage-এ চালু করে। এতে সাধারণত contactor, overload relay, start button, stop button ও auxiliary holding contact থাকে।",
      formula: "START → Coil ON → Contactor hold → Motor runs",
      example: "Overload হলে overload relay trip করে contactor coil circuit খুলতে পারে।",
      test: "Main circuit, control circuit, coil voltage, overload setting ও emergency stop আলাদাভাবে পরীক্ষা করুন।",
      safety: "Motor nameplate current অনুযায়ী overload setting দিন; live panel-এ কাজ করবেন না।",
      viva: "DOL-এর পূর্ণরূপ কী? উত্তর: Direct-On-Line।",
    },
    {
      id: "star-delta",
      category: "Control ও Motor",
      title: "Star-Delta Starter",
      icon: "source-branch",
      summary: "Starting current কমানোর motor method।",
      full: "Star-delta starter motor start-এর সময় star connection এবং পরে delta connection ব্যবহার করে। Timer ও interlock সঠিকভাবে কাজ করতে হয়।",
      formula: "Start: Star → Timer delay → Run: Delta",
      example: "Star ও delta contactor একই সময়ে ON হলে dangerous short হতে পারে।",
      test: "Timer, interlock, contactor sequence, motor terminal ও rotation পরীক্ষা করুন।",
      safety: "Electrical ও mechanical interlock ছাড়া star-delta চালাবেন না।",
      viva: "Star-delta starter-এর উদ্দেশ্য কী? উত্তর: starting current কমানো।",
    },
    {
      id: "motor",
      category: "Motor",
      title: "Motor ও Winding Testing",
      icon: "engine",
      summary: "Motor terminal, winding ও direction পরীক্ষা।",
      full: "Motor testing-এ nameplate data, terminal identification, winding resistance, insulation, bearing condition ও rotation দেখা হয়।",
      formula: "Three-phase sequence পরিবর্তন → Motor rotation পরিবর্তন হতে পারে",
      example: "তিন phase-এর যেকোনো দুইটি বদলালে অনেক induction motor-এর direction বদলায়।",
      test: "Power off করে winding resistance, insulation resistance ও terminal continuity পরীক্ষা করুন।",
      safety: "Megger ব্যবহারের আগে sensitive electronics disconnect করুন এবং rotating parts থেকে দূরে থাকুন।",
      viva: "Motor বেশি গরম হওয়ার কারণ কী? উত্তর: overload, low voltage, poor ventilation বা winding fault হতে পারে।",
    },
    {
      id: "troubleshooting",
      category: "Troubleshooting",
      title: "Fault Finding Method",
      icon: "magnify-scan",
      summary: "সমস্যা ধাপে ধাপে খুঁজে বের করা।",
      full: "প্রথমে symptom লিখুন, supply ও protection check করুন, visual inspection করুন, diagram অনুসরণ করুন, তারপর measurement নিয়ে fault isolate করুন।",
      formula: "Observe → Isolate → Measure → Repair → Retest",
      example: "MCB trip করলে বারবার reset না করে load আলাদা করে short বা overload খুঁজুন।",
      test: "Continuity, voltage, insulation, current ও temperature—প্রয়োজন অনুযায়ী পরীক্ষা করুন।",
      safety: "কাজের আগে isolate, lock/tag এবং absence-of-voltage verification করুন।",
      viva: "Troubleshooting-এর প্রথম ধাপ কী? উত্তর: symptom ও safety condition যাচাই।",
    },
    {
      id: "safety",
      category: "Safety",
      title: "Electrical Safety",
      icon: "alert-octagon",
      summary: "Shock, fire ও arc থেকে নিরাপত্তা।",
      full: "Electrical safety-তে supply isolate করা, tester দিয়ে dead verify করা, PPE ব্যবহার, dry working condition, correct tools এবং safe distance বজায় রাখা জরুরি।",
      formula: "Isolate → Lock/Tag → Test dead → Work → Recheck",
      example: "ভেজা হাতে socket বা switch স্পর্শ করলে shock risk বেড়ে যায়।",
      test: "কাজের আগে voltage absence, earth continuity ও protective device condition যাচাই করুন।",
      safety: "220/240V বা 380/415V live কাজ প্রশিক্ষিত ও অনুমোদিত electrician ছাড়া করবেন না।",
      viva: "Electrical fire-এ পানি কেন নয়? উত্তর: পানি conductive হওয়ায় shock ও fire risk বাড়তে পারে।",
    },
  ];

  const GROUPS = [
    { id: "all", title: "সব বিষয়", icon: "view-grid-outline", color: "#0284C7" },
    { id: "Basic Electrical", title: "Basic Electrical", icon: "flash", color: "#0284C7" },
    { id: "Circuit", title: "Circuit", icon: "source-branch", color: "#7C3AED" },
    { id: "Calculation", title: "Calculation", icon: "calculator", color: "#16A34A" },
    { id: "Wiring ও Tools", title: "Wiring ও Tools", icon: "toolbox-outline", color: "#0891B2" },
    { id: "Wiring ও Installation", title: "Wiring ও Installation", icon: "home-lightning-bolt-outline", color: "#0F766E" },
    { id: "Protection", title: "Protection", icon: "shield-check", color: "#DC2626" },
    { id: "Control ও Motor", title: "Control ও Motor", icon: "switch", color: "#D97706" },
    { id: "Motor", title: "Motor", icon: "engine", color: "#B45309" },
    { id: "Troubleshooting", title: "Troubleshooting", icon: "magnify-scan", color: "#DB2777" },
    { id: "Safety", title: "Safety", icon: "alert-octagon", color: "#C2410C" },
  ];

  function App() {
    const [page, setPage] = useState("home");
    const [group, setGroup] = useState("all");
    const [search, setSearch] = useState("");
    const [topic, setTopic] = useState(null);

    const filtered = useMemo(() => {
      const q = search.trim().toLowerCase();
      return ELECTRICAL_TOPICS.filter((item) => {
        const byGroup = group === "all" || item.category === group;
        const bySearch = !q || `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(q);
        return byGroup && bySearch;
      });
    }, [group, search]);

    if (page === "detail" && topic) {
      return <TopicDetail topic={topic} onBack={() => { setTopic(null); setPage("topics"); }} />;
    }
    if (page === "topics") {
      return <ElectricalTopics group={group} setGroup={setGroup} search={search} setSearch={setSearch} topics={filtered} onBack={() => setPage("home")} onOpen={(item) => { setTopic(item); setPage("detail"); }} />;
    }
    return <Home onOpen={() => setPage("topics")} />;
  }

  function Home({ onOpen }) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}><NavRow light={false} />
        <View style={styles.hero}>
          <View style={styles.heroIcon}><MaterialCommunityIcons name="lightning-bolt" size={36} color="#FACC15" /></View>
          <Text style={styles.kicker}>LEARNING APP</Text>
          <Text style={styles.heroTitle}>Electrical বাংলা</Text>
          <Text style={styles.heroText}>Basic থেকে practical electrical পর্যন্ত ধাপে ধাপে শিখুন।</Text>
        </View>
        <Text style={styles.heading}>Electrical Section</Text>
        <Text style={styles.muted}>Wiring, measurement, motor, protection, calculation ও safety—সব এক জায়গায়।</Text>
        <TouchableOpacity style={styles.startCard} onPress={onOpen} activeOpacity={0.85}>
          <View style={styles.startIcon}><MaterialCommunityIcons name="book-open-variant" size={30} color="#FFFFFF" /></View>
          <View style={{ flex: 1 }}><Text style={styles.startTitle}>Electrical Topics শুরু করুন</Text><Text style={styles.startText}>{ELECTRICAL_TOPICS.length}টি detailed topic ও lesson</Text></View>
          <MaterialCommunityIcons name="arrow-right" size={25} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.info}><MaterialCommunityIcons name="shield-check-outline" size={24} color="#0369A1" /><Text style={styles.infoText}>এটি শিক্ষামূলক guide। Live mains, panel, motor বা industrial wiring-এ কাজের আগে qualified electrician-এর সাহায্য নিন।</Text></View>
      </ScrollView>
    );
  }

  function ElectricalTopics({ group, setGroup, search, setSearch, topics, onBack, onOpen }) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Header title="Electrical Topics" icon="lightning-bolt" color="#0284C7" onBack={onBack} />
        <View style={styles.search}><MaterialCommunityIcons name="magnify" size={21} color="#64748B" /><TextInput value={search} onChangeText={setSearch} placeholder="Topic খুঁজুন..." placeholderTextColor="#94A3B8" style={styles.input} /></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupScroll}>
          {GROUPS.map((item) => <TouchableOpacity key={item.id} onPress={() => setGroup(item.id)} style={[styles.groupChip, group === item.id && { backgroundColor: item.color, borderColor: item.color }]}><MaterialCommunityIcons name={item.icon} size={17} color={group === item.id ? "#FFFFFF" : item.color} /><Text style={[styles.chipText, group === item.id && { color: "#FFFFFF" }]}>{item.title}</Text></TouchableOpacity>)}
        </ScrollView>
        <Text style={styles.heading}>Topic List ({topics.length})</Text>
        {topics.map((item, index) => <TouchableOpacity key={item.id} style={styles.topicCard} onPress={() => onOpen(item)} activeOpacity={0.8}><View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View><View style={styles.topicIcon}><MaterialCommunityIcons name={item.icon} size={23} color="#0284C7" /></View><View style={{ flex: 1 }}><Text style={styles.topicTitle}>{item.title}</Text><Text style={styles.topicSummary}>{item.category} • {item.summary}</Text></View><MaterialCommunityIcons name="chevron-right" size={23} color="#0284C7" /></TouchableOpacity>)}
        {!topics.length && <Text style={styles.empty}>কোনো topic পাওয়া যায়নি।</Text>}
      </ScrollView>
    );
  }

  function TopicDetail({ topic, onBack }) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Header title={topic.title} icon={topic.icon} color="#0284C7" onBack={onBack} />
        <Text style={styles.badge}>{topic.category}</Text>
        <Card title="সহজ ভাষায় জানুন" icon="book-open-variant" color="#0284C7"><Text style={styles.body}>{topic.full}</Text></Card>
        <Card title="Formula / মূল ধারণা" icon="function-variant" color="#16A34A" green><Text style={styles.formula}>{topic.formula}</Text></Card>
        <Card title="উদাহরণ" icon="lightbulb-on-outline" color="#A16207" yellow><Text style={styles.body}>{topic.example}</Text></Card>
        <Card title="কীভাবে পরীক্ষা বা মাপবেন" icon="gauge" color="#0891B2" blue><Text style={styles.body}>{topic.test}</Text></Card>
        <Card title="Viva প্রশ্ন" icon="help-circle-outline" color="#7C3AED" purple><Text style={styles.body}>{topic.viva}</Text></Card>
        <Card title="Safety Note" icon="shield-alert-outline" color="#C2410C" orange><Text style={styles.body}>{topic.safety}</Text></Card>
        <TouchableOpacity style={styles.backButtonLarge} onPress={onBack}><MaterialCommunityIcons name="arrow-left" size={20} color="#FFFFFF" /><Text style={styles.backLargeText}>Topic List-এ ফিরে যান</Text></TouchableOpacity>
      </ScrollView>
    );
  }

  function Header({ title, icon, color, onBack }) {
    return <View style={[styles.header, { backgroundColor: color }]}><NavRow onBack={onBack} /><View style={styles.headerRow}><MaterialCommunityIcons name={icon} size={31} color="#FFFFFF" /><Text style={styles.headerTitle}>{title}</Text></View></View>;
  }

  function Card({ title, icon, color, children, green, yellow, blue, purple, orange }) {
    const backgroundColor = green ? "#F0FDF4" : yellow ? "#FEF3C7" : blue ? "#E0F2FE" : purple ? "#F3E8FF" : orange ? "#FFEDD5" : "#FFFFFF";
    return <View style={[styles.card, { backgroundColor, borderLeftColor: color }]}><View style={styles.cardTitleRow}><MaterialCommunityIcons name={icon} size={22} color={color} /><Text style={[styles.cardTitle, { color }]}>{title}</Text></View>{children}</View>;
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    content: { padding: 16, paddingBottom: 35 },
    hero: { backgroundColor: "#0F172A", borderRadius: 16, padding: 14, marginBottom: 10 },
    heroIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#1E293B", alignItems: "center", justifyContent: "center", marginBottom: 8 },
    kicker: { color: "#94A3B8", fontSize: 11, fontWeight: "bold", letterSpacing: 1 },
    heroTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginTop: 3 },
    heroText: { color: "#CBD5E1", fontSize: 12, lineHeight: 18, marginTop: 6 },
    heading: { color: "#0F172A", fontSize: 21, fontWeight: "bold", marginTop: 6, marginBottom: 6 },
    muted: { color: "#64748B", fontSize: 14, lineHeight: 21, marginBottom: 16 },
    startCard: { backgroundColor: "#0284C7", borderRadius: 17, padding: 12, flexDirection: "row", alignItems: "center", marginBottom: 11 },
    startIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#0EA5E9", alignItems: "center", justifyContent: "center", marginRight: 13 },
    startTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
    startText: { color: "#E0F2FE", fontSize: 11, marginTop: 2 },
    info: { backgroundColor: "#E0F2FE", borderRadius: 14, padding: 15, flexDirection: "row", alignItems: "flex-start" },
    infoText: { color: "#0C4A6E", flex: 1, fontSize: 13, lineHeight: 20, marginLeft: 9 },
    header: { borderRadius: 16, padding: 14, marginBottom: 10 },
    back: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    backText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold", marginLeft: 7 },
    headerRow: { flexDirection: "row", alignItems: "center" },
    headerTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginLeft: 9, flex: 1 },
    search: { height: 50, backgroundColor: "#FFFFFF", borderRadius: 13, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 12 },
    input: { flex: 1, color: "#1E293B", fontSize: 15, marginLeft: 8 },
    groupScroll: { marginBottom: 14 },
    groupChip: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 20, paddingVertical: 9, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", marginRight: 8 },
    chipText: { color: "#334155", fontSize: 12, marginLeft: 5 },
    topicCard: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 12, marginBottom: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0" },
    number: { width: 29, height: 29, borderRadius: 15, backgroundColor: "#0284C7", alignItems: "center", justifyContent: "center", marginRight: 9 },
    numberText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 },
    topicIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: "#E0F2FE", alignItems: "center", justifyContent: "center", marginRight: 10 },
    topicTitle: { color: "#0F172A", fontSize: 15, fontWeight: "bold" },
    topicSummary: { color: "#64748B", fontSize: 11, lineHeight: 17, marginTop: 3 },
    empty: { color: "#64748B", textAlign: "center", marginTop: 30 },
    badge: { alignSelf: "flex-start", color: "#0369A1", backgroundColor: "#E0F2FE", borderRadius: 15, paddingVertical: 6, paddingHorizontal: 11, fontSize: 12, fontWeight: "bold", marginBottom: 12 },
    card: { borderRadius: 15, padding: 16, marginBottom: 12, borderLeftWidth: 5 },
    cardTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 9 },
    cardTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 8 },
    body: { color: "#334155", fontSize: 14, lineHeight: 22 },
    formula: { color: "#166534", fontSize: 16, lineHeight: 25, fontWeight: "bold" },
    backButtonLarge: { backgroundColor: "#0284C7", borderRadius: 11, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4 },
    backLargeText: { color: "#FFFFFF", fontWeight: "bold", marginLeft: 7 },
  });

  return App;
})();

/*
==================================================
MODULE: electronics_app.js
==================================================
*/
const ElectronicsModule = (() => {
  /* =====================================================
     ELECTRONICS CONTENT
     নতুন topic যোগ করতে শুধু ELECTRONICS_TOPICS-এ object যোগ করুন।
     ===================================================== */
  const ELECTRONICS_TOPICS = [
    {
      id: "resistor",
      category: "Basic Components",
      title: "Resistor",
      icon: "resistor",
      summary: "Current সীমিত করা ও voltage ভাগ করার component।",
      full: "Resistor circuit-এ current control করে এবং voltage drop তৈরি করে। এর resistance Ohm (Ω)-এ মাপা হয়। Resistor-এর power rating ও tolerance-ও গুরুত্বপূর্ণ।",
      formula: "V = I × R | P = I²R",
      example: "12V source-এ 1kΩ resistor লাগালে current প্রায় 12mA হবে, যদি অন্য load না থাকে।",
      test: "Power off করে multimeter resistance mode-এ মাপুন। Circuit-এর মধ্যে parallel path থাকলে reading বদলাতে পারে।",
      safety: "Resistor-এর watt rating-এর চেয়ে বেশি power ব্যবহার করলে overheating হতে পারে।",
      viva: "Resistor-এর কাজ কী? উত্তর: Current সীমিত করা ও voltage drop তৈরি করা।",
    },
    {
      id: "color-code",
      category: "Basic Components",
      title: "Resistor Color Code",
      icon: "palette-outline",
      summary: "রঙের band দেখে resistor value বের করা।",
      full: "চার-band resistor-এ প্রথম দুইটি band significant digit, তৃতীয়টি multiplier এবং চতুর্থটি tolerance বোঝায়। Band পড়ার সময় tolerance band সাধারণত আলাদা দূরত্বে থাকে।",
      formula: "Value = প্রথম digits × multiplier",
      example: "Brown-Black-Red-Gold = 10 × 100 = 1000Ω = 1kΩ, tolerance ±5%。",
      test: "Color code থেকে value বের করে multimeter reading-এর সঙ্গে তুলনা করুন।",
      safety: "Color faded হলে শুধু চোখে অনুমান না করে meter দিয়ে যাচাই করুন।",
      viva: "Gold band সাধারণত কী বোঝায়? উত্তর: ±5% tolerance।",
    },
    {
      id: "capacitor",
      category: "Passive Components",
      title: "Capacitor",
      icon: "battery-charging-outline",
      summary: "Electric charge সঞ্চয় করা component।",
      full: "Capacitor electric charge জমা রাখে এবং filtering, coupling, timing ও motor starting-এ ব্যবহৃত হয়। Capacitance-এর একক Farad, µF, nF ও pF।",
      formula: "Q = C × V",
      example: "1000µF capacitor power supply ripple কমাতে ব্যবহৃত হতে পারে।",
      test: "Power off করে capacitor discharge করুন; capacitance meter বা suitable multimeter mode দিয়ে পরীক্ষা করুন।",
      safety: "বড় capacitor power বন্ধ হওয়ার পরও charge ধরে রাখতে পারে—discharge না করে touch করবেন না।",
      viva: "Capacitance-এর একক কী? উত্তর: Farad (F)।",
    },
    {
      id: "diode",
      category: "Semiconductor",
      title: "Diode",
      icon: "arrow-right-bold",
      summary: "Current একদিকে যেতে দেওয়া component।",
      full: "Diode সাধারণত forward direction-এ current pass করে এবং reverse direction-এ বাধা দেয়। Rectifier, protection ও signal circuit-এ এটি ব্যবহৃত হয়।",
      formula: "Forward bias → Conduct | Reverse bias → Block",
      example: "Silicon diode-এর forward voltage সাধারণত প্রায় 0.6–0.7V হতে পারে, তবে device অনুযায়ী বদলায়।",
      test: "Multimeter diode mode-এ forward reading এবং reverse OL বা high reading তুলনা করুন।",
      safety: "Diode-এর polarity ও maximum reverse voltage না জেনে circuit-এ বসাবেন না।",
      viva: "Diode-এর cathode কীভাবে চেনা যায়? উত্তর: অনেক diode body-তে band দিয়ে cathode দেখানো থাকে।",
    },
    {
      id: "led",
      category: "Semiconductor",
      title: "LED",
      icon: "led-on",
      summary: "আলো উৎপন্ন করা semiconductor diode।",
      full: "LED বা Light Emitting Diode forward current পেলে আলো দেয়। LED-এর সঙ্গে সাধারণত current-limiting resistor ব্যবহার করতে হয়।",
      formula: "R = (Vs − Vf) ÷ I",
      example: "5V supply, Vf 2V ও 10mA current হলে R = 300Ω; কাছাকাছি standard value নিতে হয়।",
      test: "Diode mode-এ polarity ঠিক রেখে low-current test করুন। Long leg সাধারণত anode, flat side বা short leg cathode হতে পারে—সবসময় নিশ্চিত হয়ে নিন।",
      safety: "LED-তে সরাসরি supply দিলে অতিরিক্ত current-এ LED নষ্ট হতে পারে।",
      viva: "LED-এর পূর্ণরূপ কী? উত্তর: Light Emitting Diode।",
    },
    {
      id: "zener",
      category: "Semiconductor",
      title: "Zener Diode",
      icon: "arrow-collapse-right",
      summary: "Reference ও voltage regulation-এর জন্য diode।",
      full: "Zener diode reverse breakdown অঞ্চলে কাজ করে এবং নির্দিষ্ট voltage reference বা regulation-এ ব্যবহৃত হয়।",
      formula: "Reverse breakdown voltage ≈ Zener voltage",
      example: "5.1V Zener ছোট reference circuit-এ প্রায় 5.1V reference দিতে পারে, current limit ঠিক থাকলে।",
      test: "সাধারণ diode test দিয়ে পুরো Zener behaviour বোঝা যায় না; proper current-limited test circuit দরকার।",
      safety: "Zener-এর power rating ও series resistor না মিলালে অতিরিক্ত heat হতে পারে।",
      viva: "Zener diode কোথায় কাজ করে? উত্তর: Reverse breakdown অঞ্চলে।",
    },
    {
      id: "transistor",
      category: "Semiconductor",
      title: "BJT Transistor",
      icon: "transistor",
      summary: "Switch ও amplifier হিসেবে ব্যবহৃত তিন-terminal device।",
      full: "BJT-এর প্রধান terminal হলো Base, Collector ও Emitter। এটি ছোট base current দিয়ে বড় collector current control করতে পারে। NPN ও PNP দুই ধরনের হয়।",
      formula: "Ic ≈ β × Ib",
      example: "NPN transistor দিয়ে relay coil drive করার সময় base resistor ও flyback diode ব্যবহার করা হয়।",
      test: "Diode mode-এ base-emitter ও base-collector junction পরীক্ষা করুন; pinout datasheet থেকে নিশ্চিত করুন।",
      safety: "Pinout না জেনে transistor বসাবেন না এবং maximum voltage/current/power rating অতিক্রম করবেন না।",
      viva: "BJT-এর তিন terminal কী? উত্তর: Base, Collector, Emitter।",
    },
    {
      id: "mosfet",
      category: "Semiconductor",
      title: "MOSFET",
      icon: "transistor-outline",
      summary: "Voltage-controlled electronic switch।",
      full: "MOSFET-এর Gate voltage দিয়ে Drain-Source conduction নিয়ন্ত্রণ করা হয়। Switching power supply, motor control ও battery circuit-এ এটি জনপ্রিয়।",
      formula: "Gate voltage → Channel control",
      example: "Logic-level MOSFET microcontroller signal দিয়ে low-voltage load switch করতে পারে।",
      test: "Datasheet অনুযায়ী Gate, Drain ও Source pin চিহ্নিত করে body diode ও short test করুন।",
      safety: "Gate static electricity-তে ক্ষতিগ্রস্ত হতে পারে; anti-static handling ও gate voltage limit মানুন।",
      viva: "MOSFET কী দিয়ে control হয়? উত্তর: Gate-source voltage দিয়ে।",
    },
    {
      id: "relay",
      category: "Switching ও Control",
      title: "Relay",
      icon: "relay",
      summary: "Coil দিয়ে electrically isolated switching।",
      full: "Relay coil energize হলে mechanical contact state বদলায়। এতে coil, Common, NO ও NC contact থাকে। Low-voltage control দিয়ে অন্য circuit switch করা যায়।",
      formula: "Coil energized → COM changes from NC to NO",
      example: "12V relay coil microcontroller বা transistor driver দিয়ে চালানো যায়।",
      test: "Coil resistance মাপুন, rated voltage দিন এবং COM-NO/NC continuity পরিবর্তন হচ্ছে কি না দেখুন।",
      safety: "Mains load-এর contact rating, insulation distance ও enclosure নিশ্চিত না করে relay ব্যবহার করবেন না।",
      viva: "NO ও NC-এর পূর্ণরূপ কী? উত্তর: Normally Open ও Normally Closed।",
    },
    {
      id: "transformer",
      category: "Power Electronics",
      title: "Transformer",
      icon: "transmission-tower",
      summary: "AC voltage step-up বা step-down করা device।",
      full: "Transformer electromagnetic induction-এর মাধ্যমে AC voltage পরিবর্তন করে। এতে primary ও secondary winding থাকে। DC-তে সাধারণ transformer কাজ করে না।",
      formula: "Vp/Vs = Np/Ns",
      example: "Step-down transformer 230V AC-কে কম AC voltage-এ নামাতে পারে।",
      test: "Power off করে winding continuity, insulation এবং rated AC output পরীক্ষা করুন।",
      safety: "Primary side mains-এ যুক্ত থাকতে পারে; exposed terminal touch করবেন না।",
      viva: "Transformer কোন principle-এ কাজ করে? উত্তর: Mutual induction।",
    },
    {
      id: "rectifier",
      category: "Power Electronics",
      title: "Rectifier ও Bridge",
      icon: "sine-wave",
      summary: "AC থেকে pulsating DC তৈরি করা।",
      full: "Rectifier diode ব্যবহার করে AC waveform-এর এক বা দুই half-cycle ব্যবহার করে DC তৈরি করে। Bridge rectifier সাধারণত চারটি diode দিয়ে তৈরি হয়।",
      formula: "AC input → Diode rectifier → Pulsating DC → Filter capacitor",
      example: "Bridge rectifier-এর পরে capacitor ripple কমাতে সাহায্য করে।",
      test: "Diode mode-এ চারটি junction পরীক্ষা করুন; polarity ও output waveform যাচাই করুন।",
      safety: "Rectifier-এর DC side capacitor charged থাকতে পারে—discharge না করে touch করবেন না।",
      viva: "Bridge rectifier-এ সাধারণত কয়টি diode থাকে? উত্তর: চারটি।",
    },
    {
      id: "voltage-regulator",
      category: "Power Electronics",
      title: "Voltage Regulator",
      icon: "sine-wave",
      summary: "Output voltage স্থির রাখার circuit।",
      full: "Voltage regulator input পরিবর্তন বা load পরিবর্তন হলেও output voltage নির্দিষ্ট রাখার চেষ্টা করে। Linear ও switching regulator দুই ধরনের হতে পারে।",
      formula: "Input voltage > regulated output voltage + dropout margin",
      example: "7805 regulator suitable condition-এ প্রায় 5V output দিতে পারে।",
      test: "Input, output, ground reference ও load current মাপুন; regulator heating লক্ষ্য করুন।",
      safety: "Maximum input voltage, dropout, heat dissipation ও short protection datasheet অনুযায়ী রাখুন।",
      viva: "Regulator-এর কাজ কী? উত্তর: Stable output voltage দেওয়া।",
    },
    {
      id: "ic",
      category: "Integrated Circuits",
      title: "IC ও Datasheet",
      icon: "integrated-circuit-chip",
      summary: "এক chip-এ বহু electronic function।",
      full: "IC বা Integrated Circuit-এর মধ্যে transistor, resistor ও অন্যান্য circuit element একসঙ্গে থাকে। Pinout, supply voltage ও truth table বুঝতে datasheet পড়তে হয়।",
      formula: "Pinout + Supply rating + Function = Safe use",
      example: "Timer IC, op-amp, logic IC ও microcontroller বিভিন্ন কাজে ব্যবহৃত হয়।",
      test: "Datasheet দেখে VCC ও GND ঠিক করুন, supply current ও input-output behaviour মাপুন।",
      safety: "উল্টো pin connection বা wrong supply voltage দিলে IC স্থায়ীভাবে নষ্ট হতে পারে।",
      viva: "IC-এর পূর্ণরূপ কী? উত্তর: Integrated Circuit।",
    },
    {
      id: "opamp",
      category: "Integrated Circuits",
      title: "Op-Amp",
      icon: "amplifier",
      summary: "Signal amplify ও compare করার circuit।",
      full: "Operational amplifier differential input ব্যবহার করে amplification, filtering, buffering ও comparison-এ কাজ করে। বাস্তব op-amp-এর supply ও input limits থাকে।",
      formula: "Vout = Gain × (V+ − V−)",
      example: "Comparator circuit-এ input voltage reference-এর বেশি হলে output state বদলাতে পারে।",
      test: "Supply rails, input voltage, output saturation ও feedback connection পরীক্ষা করুন।",
      safety: "Input common-mode range ও output current limit অতিক্রম করবেন না।",
      viva: "Op-amp-এর দুটি input কী? উত্তর: Inverting ও Non-inverting input।",
    },
    {
      id: "sensor",
      category: "Sensors ও Modules",
      title: "Sensor",
      icon: "access-point",
      summary: "তাপ, আলো, দূরত্ব বা movement detect করা।",
      full: "Sensor physical quantity-কে electrical signal-এ রূপান্তর করে। Temperature, light, sound, pressure ও motion sensor বহুল ব্যবহৃত।",
      formula: "Physical quantity → Sensor → Electrical signal",
      example: "LDR আলো বাড়লে resistance পরিবর্তন করে; thermistor temperature-এর সঙ্গে resistance বদলায়।",
      test: "Power ও ground ঠিক রেখে condition পরিবর্তন করুন এবং output voltage/resistance observe করুন।",
      safety: "Sensor-এর supply voltage, polarity ও environmental rating মেনে চলুন।",
      viva: "LDR কী sense করে? উত্তর: আলো বা light intensity।",
    },
    {
      id: "pcb",
      category: "PCB ও Practical",
      title: "PCB ও Circuit Track",
      icon: "developer-board",
      summary: "Printed Circuit Board-এর track ও soldering।",
      full: "PCB component ধরে রাখে এবং copper track দিয়ে electrical connection তৈরি করে। Solder joint, polarity, track break ও short ভালোভাবে পরীক্ষা করতে হয়।",
      formula: "Schematic → PCB layout → Component placement → Solder → Test",
      example: "Continuity mode দিয়ে track-এর দুই প্রান্ত connected কি না দেখা যায়।",
      test: "Power off করে visual inspection, continuity, short-to-ground ও polarity পরীক্ষা করুন।",
      safety: "Soldering iron গরম থাকে; ventilation, eye protection ও ESD precautions ব্যবহার করুন।",
      viva: "PCB-এর পূর্ণরূপ কী? উত্তর: Printed Circuit Board।",
    },
    {
      id: "smps",
      category: "Power Electronics",
      title: "SMPS ও Adapter",
      icon: "power-plug",
      summary: "Efficient switching power supply।",
      full: "SMPS high-frequency switching ব্যবহার করে AC বা DC input থেকে regulated output তৈরি করে। Adapter-এর label-এ input, output voltage, current ও polarity লেখা থাকে।",
      formula: "Output power ≈ Voltage × Current",
      example: "12V 2A adapter-এর maximum rated output প্রায় 24W হতে পারে।",
      test: "Label অনুযায়ী output voltage, polarity, no-load ও load behaviour পরীক্ষা করুন।",
      safety: "SMPS খুললেও primary capacitor charged থাকতে পারে; mains isolation ছাড়া repair করবেন না।",
      viva: "Adapter label-এ 12V 2A কী বোঝায়? উত্তর: 12V output এবং সর্বোচ্চ প্রায় 2A rated current।",
    },
    {
      id: "troubleshooting",
      category: "Testing ও Fault Finding",
      title: "Electronics Fault Finding",
      icon: "magnify-scan",
      summary: "Board বা device-এর সমস্যা ধাপে ধাপে খোঁজা।",
      full: "প্রথমে symptom লিখুন, burn mark বা loose solder দেখুন, supply rail check করুন, ground reference নিন, signal path অনুসরণ করুন এবং component isolate করুন।",
      formula: "Observe → Power check → Signal trace → Component test → Retest",
      example: "Device dead হলে আগে input fuse, adapter output, regulator output ও ground পরীক্ষা করুন।",
      test: "Voltage, resistance, continuity, diode mode, current draw ও waveform প্রয়োজন অনুযায়ী মাপুন।",
      safety: "Power off করে resistance/continuity test করুন এবং charged capacitor discharge করুন।",
      viva: "Board troubleshooting-এর প্রথম measurement কী হতে পারে? উত্তর: Supply rail ও ground reference check।",
    },
    {
      id: "esd",
      category: "Safety",
      title: "ESD ও Electronics Safety",
      icon: "shield-alert-outline",
      summary: "Static electricity থেকে component রক্ষা।",
      full: "ESD বা Electrostatic Discharge sensitive IC, MOSFET ও sensor নষ্ট করতে পারে। Grounded wrist strap, anti-static mat ও proper handling ব্যবহার করা ভালো।",
      formula: "Safe handling = Grounding + Correct polarity + Current limit",
      example: "MOSFET-এর gate touch করার আগে body discharge করা উচিত।",
      test: "Power polarity, current limit, fuse ও bench supply setting double-check করুন।",
      safety: "Mains isolated না হলে oscilloscope ground clip ভুল জায়গায় লাগাবেন না।",
      viva: "ESD-এর পূর্ণরূপ কী? উত্তর: Electrostatic Discharge।",
    },
  ];

  const GROUPS = [
    { id: "all", title: "সব বিষয়", icon: "view-grid-outline", color: "#7C3AED" },
    { id: "Basic Components", title: "Basic Components", icon: "resistor", color: "#7C3AED" },
    { id: "Passive Components", title: "Passive", icon: "battery-charging-outline", color: "#0891B2" },
    { id: "Semiconductor", title: "Semiconductor", icon: "chip", color: "#2563EB" },
    { id: "Switching ও Control", title: "Switching", icon: "relay", color: "#D97706" },
    { id: "Power Electronics", title: "Power Electronics", icon: "power-plug", color: "#DC2626" },
    { id: "Integrated Circuits", title: "IC ও Op-Amp", icon: "integrated-circuit-chip", color: "#16A34A" },
    { id: "Sensors ও Modules", title: "Sensors", icon: "access-point", color: "#0891B2" },
    { id: "PCB ও Practical", title: "PCB", icon: "developer-board", color: "#9333EA" },
    { id: "Testing ও Fault Finding", title: "Testing", icon: "magnify-scan", color: "#DB2777" },
    { id: "Safety", title: "Safety", icon: "shield-alert-outline", color: "#C2410C" },
  ];

  function App() {
    const [page, setPage] = useState("home");
    const [group, setGroup] = useState("all");
    const [search, setSearch] = useState("");
    const [topic, setTopic] = useState(null);

    const filtered = useMemo(() => {
      const q = search.trim().toLowerCase();
      return ELECTRONICS_TOPICS.filter((item) => {
        const byGroup = group === "all" || item.category === group;
        const text = `${item.title} ${item.summary} ${item.category}`.toLowerCase();
        return byGroup && (!q || text.includes(q));
      });
    }, [group, search]);

    if (page === "detail" && topic) return <TopicDetail topic={topic} onBack={() => { setTopic(null); setPage("topics"); }} />;
    if (page === "topics") return <ElectronicsTopics group={group} setGroup={setGroup} search={search} setSearch={setSearch} topics={filtered} onBack={() => setPage("home")} onOpen={(item) => { setTopic(item); setPage("detail"); }} />;
    return <Home onOpen={() => setPage("topics")} />;
  }

  function Home({ onOpen }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}><NavRow light={false} />
      <View style={styles.hero}>
        <View style={styles.heroIcon}><MaterialCommunityIcons name="chip" size={36} color="#C4B5FD" /></View>
        <Text style={styles.kicker}>LEARNING APP</Text>
        <Text style={styles.heroTitle}>Electronics বাংলা</Text>
        <Text style={styles.heroText}>Component থেকে PCB ও practical testing পর্যন্ত ধাপে ধাপে শিখুন।</Text>
      </View>
      <Text style={styles.heading}>Electronics Section</Text>
      <Text style={styles.muted}>Components, semiconductor, power supply, sensor, PCB, testing ও safety—সব এক জায়গায়।</Text>
      <TouchableOpacity style={styles.startCard} onPress={onOpen} activeOpacity={0.85}>
        <View style={styles.startIcon}><MaterialCommunityIcons name="book-open-variant" size={30} color="#FFFFFF" /></View>
        <View style={{ flex: 1 }}><Text style={styles.startTitle}>Electronics Topics শুরু করুন</Text><Text style={styles.startText}>{ELECTRONICS_TOPICS.length}টি detailed topic ও lesson</Text></View>
        <MaterialCommunityIcons name="arrow-right" size={25} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.info}><MaterialCommunityIcons name="shield-check-outline" size={24} color="#6D28D9" /><Text style={styles.infoText}>Capacitor discharge, ESD protection এবং mains isolation না মেনে electronics repair করবেন না।</Text></View>
    </ScrollView>;
  }

  function ElectronicsTopics({ group, setGroup, search, setSearch, topics, onBack, onOpen }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header title="Electronics Topics" icon="chip" color="#7C3AED" onBack={onBack} />
      <View style={styles.search}><MaterialCommunityIcons name="magnify" size={21} color="#64748B" /><TextInput value={search} onChangeText={setSearch} placeholder="Topic খুঁজুন..." placeholderTextColor="#94A3B8" style={styles.input} /></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupScroll}>
        {GROUPS.map((item) => <TouchableOpacity key={item.id} onPress={() => setGroup(item.id)} style={[styles.groupChip, group === item.id && { backgroundColor: item.color, borderColor: item.color }]}><MaterialCommunityIcons name={item.icon} size={17} color={group === item.id ? "#FFFFFF" : item.color} /><Text style={[styles.chipText, group === item.id && { color: "#FFFFFF" }]}>{item.title}</Text></TouchableOpacity>)}
      </ScrollView>
      <Text style={styles.heading}>Topic List ({topics.length})</Text>
      {topics.map((item, index) => <TouchableOpacity key={item.id} style={styles.topicCard} onPress={() => onOpen(item)} activeOpacity={0.8}><View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View><View style={styles.topicIcon}><MaterialCommunityIcons name={item.icon} size={23} color="#7C3AED" /></View><View style={{ flex: 1 }}><Text style={styles.topicTitle}>{item.title}</Text><Text style={styles.topicSummary}>{item.category} • {item.summary}</Text></View><MaterialCommunityIcons name="chevron-right" size={23} color="#7C3AED" /></TouchableOpacity>)}
      {!topics.length && <Text style={styles.empty}>কোনো topic পাওয়া যায়নি।</Text>}
    </ScrollView>;
  }

  function TopicDetail({ topic, onBack }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header title={topic.title} icon={topic.icon} color="#7C3AED" onBack={onBack} />
      <Text style={styles.badge}>{topic.category}</Text>
      <Card title="সহজ ভাষায় জানুন" icon="book-open-variant" color="#7C3AED"><Text style={styles.body}>{topic.full}</Text></Card>
      <Card title="Formula / মূল ধারণা" icon="function-variant" color="#16A34A" green><Text style={styles.formula}>{topic.formula}</Text></Card>
      <Card title="উদাহরণ" icon="lightbulb-on-outline" color="#A16207" yellow><Text style={styles.body}>{topic.example}</Text></Card>
      <Card title="কীভাবে পরীক্ষা করবেন" icon="gauge" color="#0891B2" blue><Text style={styles.body}>{topic.test}</Text></Card>
      <Card title="Viva প্রশ্ন" icon="help-circle-outline" color="#7C3AED" purple><Text style={styles.body}>{topic.viva}</Text></Card>
      <Card title="Safety Note" icon="shield-alert-outline" color="#C2410C" orange><Text style={styles.body}>{topic.safety}</Text></Card>
      <TouchableOpacity style={styles.backButtonLarge} onPress={onBack}><MaterialCommunityIcons name="arrow-left" size={20} color="#FFFFFF" /><Text style={styles.backLargeText}>Topic List-এ ফিরে যান</Text></TouchableOpacity>
    </ScrollView>;
  }

  function Header({ title, icon, color, onBack }) {
    return <View style={[styles.header, { backgroundColor: color }]}><NavRow onBack={onBack} /><View style={styles.headerRow}><MaterialCommunityIcons name={icon} size={31} color="#FFFFFF" /><Text style={styles.headerTitle}>{title}</Text></View></View>;
  }

  function Card({ title, icon, color, children, green, yellow, blue, purple, orange }) {
    const backgroundColor = green ? "#F0FDF4" : yellow ? "#FEF3C7" : blue ? "#E0F2FE" : purple ? "#F3E8FF" : orange ? "#FFEDD5" : "#FFFFFF";
    return <View style={[styles.card, { backgroundColor, borderLeftColor: color }]}><View style={styles.cardTitleRow}><MaterialCommunityIcons name={icon} size={22} color={color} /><Text style={[styles.cardTitle, { color }]}>{title}</Text></View>{children}</View>;
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FAF8FF" },
    content: { padding: 16, paddingBottom: 35 },
    hero: { backgroundColor: "#241044", borderRadius: 16, padding: 14, marginBottom: 10 },
    heroIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#3B1D68", alignItems: "center", justifyContent: "center", marginBottom: 8 },
    kicker: { color: "#C4B5FD", fontSize: 11, fontWeight: "bold", letterSpacing: 1 },
    heroTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginTop: 3 },
    heroText: { color: "#E9D5FF", fontSize: 12, lineHeight: 18, marginTop: 6 },
    heading: { color: "#0F172A", fontSize: 21, fontWeight: "bold", marginTop: 6, marginBottom: 6 },
    muted: { color: "#64748B", fontSize: 14, lineHeight: 21, marginBottom: 16 },
    startCard: { backgroundColor: "#7C3AED", borderRadius: 17, padding: 12, flexDirection: "row", alignItems: "center", marginBottom: 11 },
    startIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#8B5CF6", alignItems: "center", justifyContent: "center", marginRight: 13 },
    startTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
    startText: { color: "#EDE9FE", fontSize: 11, marginTop: 2 },
    info: { backgroundColor: "#F3E8FF", borderRadius: 14, padding: 15, flexDirection: "row", alignItems: "flex-start" },
    infoText: { color: "#581C87", flex: 1, fontSize: 13, lineHeight: 20, marginLeft: 9 },
    header: { borderRadius: 16, padding: 14, marginBottom: 10 },
    back: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    backText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold", marginLeft: 7 },
    headerRow: { flexDirection: "row", alignItems: "center" },
    headerTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginLeft: 9, flex: 1 },
    search: { height: 50, backgroundColor: "#FFFFFF", borderRadius: 13, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 12 },
    input: { flex: 1, color: "#1E293B", fontSize: 15, marginLeft: 8 },
    groupScroll: { marginBottom: 14 },
    groupChip: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 20, paddingVertical: 9, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", marginRight: 8 },
    chipText: { color: "#334155", fontSize: 12, marginLeft: 5 },
    topicCard: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 12, marginBottom: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0" },
    number: { width: 29, height: 29, borderRadius: 15, backgroundColor: "#7C3AED", alignItems: "center", justifyContent: "center", marginRight: 9 },
    numberText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 },
    topicIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: "#F3E8FF", alignItems: "center", justifyContent: "center", marginRight: 10 },
    topicTitle: { color: "#0F172A", fontSize: 15, fontWeight: "bold" },
    topicSummary: { color: "#64748B", fontSize: 11, lineHeight: 17, marginTop: 3 },
    empty: { color: "#64748B", textAlign: "center", marginTop: 30 },
    badge: { alignSelf: "flex-start", color: "#6D28D9", backgroundColor: "#F3E8FF", borderRadius: 15, paddingVertical: 6, paddingHorizontal: 11, fontSize: 12, fontWeight: "bold", marginBottom: 12 },
    card: { borderRadius: 15, padding: 16, marginBottom: 12, borderLeftWidth: 5 },
    cardTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 9 },
    cardTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 8 },
    body: { color: "#334155", fontSize: 14, lineHeight: 22 },
    formula: { color: "#166534", fontSize: 16, lineHeight: 25, fontWeight: "bold" },
    backButtonLarge: { backgroundColor: "#7C3AED", borderRadius: 11, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4 },
    backLargeText: { color: "#FFFFFF", fontWeight: "bold", marginLeft: 7 },
  });

  return App;
})();

/*
==================================================
MODULE: calculation_app.js
==================================================
*/
const CalculationModule = (() => {
  /* =====================================================
     CALCULATION CONTENT
     নতুন calculator/topic যোগ করতে শুধু CALCULATION_TOPICS-এ object যোগ করুন।
     ===================================================== */
  const CALCULATION_TOPICS = [
    {
      id: "ohms-law",
      category: "Basic Formula",
      title: "Ohm’s Law Calculator",
      icon: "math-integral-box",
      summary: "Voltage, Current ও Resistance বের করুন।",
      full: "Ohm’s Law ব্যবহার করে যেকোনো দুটি মান জানা থাকলে তৃতীয় মান বের করা যায়। Voltage, current ও resistance-এর unit সঠিকভাবে ব্যবহার করতে হবে।",
      formula: "V = I × R | I = V ÷ R | R = V ÷ I",
      example: "I = 2A এবং R = 6Ω হলে V = 12V।",
      inputs: "দুটি মান দিন: V ও I, অথবা V ও R, অথবা I ও R।",
      result: "ফলাফল: Voltage (V), Current (A) অথবা Resistance (Ω)।",
      safety: "বাস্তব circuit-এ calculation করার আগে component rating ও measured value যাচাই করুন।",
      viva: "Ohm’s Law-এর মূল সূত্র কী? উত্তর: V = I × R।",
    },
    {
      id: "power",
      category: "Power ও Energy",
      title: "Power Calculator",
      icon: "flash-outline",
      summary: "Watt, Volt, Ampere ও Resistance থেকে power।",
      full: "Electrical power হলো electrical energy ব্যবহারের হার। DC বা simple resistive load-এর ক্ষেত্রে voltage ও current দিয়ে power বের করা যায়।",
      formula: "P = V × I | P = I²R | P = V²/R",
      example: "220V ও 2A হলে P = 440W।",
      inputs: "Voltage (V), Current (A), Resistance (Ω)—প্রয়োজন অনুযায়ী মান দিন।",
      result: "ফলাফল: Power Watt (W)-এ দেখাবে।",
      safety: "Device-এর rated watt ও supply rating অতিক্রম করবেন না।",
      viva: "Power-এর একক কী? উত্তর: Watt (W)।",
    },
    {
      id: "energy-unit",
      category: "Power ও Energy",
      title: "Energy ও Unit Calculator",
      icon: "counter",
      summary: "কত kWh বা Unit বিদ্যুৎ ব্যবহার হচ্ছে।",
      full: "বিদ্যুৎ বিলের Unit বলতে সাধারণত kilowatt-hour (kWh) বোঝায়। Device-এর power এবং চালানোর সময় জানা থাকলে energy consumption হিসাব করা যায়।",
      formula: "Unit = Power(kW) × Time(hour)",
      example: "100W = 0.1kW; 8 ঘণ্টায় Unit = 0.1 × 8 = 0.8 kWh।",
      inputs: "Device Power (W), দিনে কত ঘণ্টা, মাসে কত দিন দিন।",
      result: "ফলাফল: Daily Unit, Monthly Unit ও আনুমানিক খরচ।",
      safety: "App-এর হিসাব estimate; actual bill tariff, meter reading ও power factor-এর কারণে আলাদা হতে পারে।",
      viva: "1 Unit বিদ্যুৎ কত? উত্তর: 1 kWh।",
    },
    {
      id: "bill",
      category: "Power ও Energy",
      title: "Electricity Bill Estimate",
      icon: "currency-bdt",
      summary: "Unit ও rate দিয়ে আনুমানিক বিল।",
      full: "বিদ্যুৎ খরচের আনুমানিক হিসাব করতে total kWh-কে প্রতি Unit-এর rate দিয়ে গুণ করা হয়। বাস্তব বিলে slab, demand charge, VAT ও অন্যান্য charge থাকতে পারে।",
      formula: "Estimated cost = Total Unit × Rate per Unit",
      example: "100 Unit × 8 টাকা = আনুমানিক 800 টাকা, অন্যান্য charge ছাড়া।",
      inputs: "Monthly Unit এবং প্রতি Unit-এর rate দিন।",
      result: "ফলাফল: Estimated electricity cost।",
      safety: "এটি billing estimate; official bill হিসেবে ব্যবহার করবেন না।",
      viva: "বিদ্যুৎ বিলের Unit কী দিয়ে মাপা হয়? উত্তর: kWh।",
    },
    {
      id: "ac-power",
      category: "AC Calculation",
      title: "AC Power Calculator",
      icon: "sine-wave",
      summary: "Single-phase AC-এর real power হিসাব।",
      full: "AC load-এর real power বের করতে voltage, current এবং power factor দরকার হতে পারে। Resistive load-এ power factor প্রায় 1 হতে পারে, motor load-এ কম হতে পারে।",
      formula: "P = V × I × PF",
      example: "230V × 5A × 0.8 PF = 920W।",
      inputs: "Voltage (V), Current (A), Power Factor (0–1)।",
      result: "ফলাফল: Approximate real power Watt-এ।",
      safety: "Mains measurement qualified person ও suitable meter দিয়ে করুন।",
      viva: "Power factor কী? উত্তর: Apparent power-এর কত অংশ real power তা বোঝায়।",
    },
    {
      id: "three-phase",
      category: "AC Calculation",
      title: "Three-Phase Power",
      icon: "source-branch",
      summary: "Three-phase load-এর power হিসাব।",
      full: "Balanced three-phase system-এ line voltage, line current ও power factor ব্যবহার করে মোট real power হিসাব করা যায়।",
      formula: "P = √3 × VL × IL × PF",
      example: "400V, 10A, PF 0.8 হলে P প্রায় 5.54kW।",
      inputs: "Line Voltage, Line Current ও Power Factor দিন।",
      result: "ফলাফল: Three-phase real power।",
      safety: "Three-phase panel বা motor measurement প্রশিক্ষণ ছাড়া করবেন না।",
      viva: "Three-phase formula-তে √3 কেন থাকে? উত্তর: তিন phase-এর vector relationship-এর কারণে।",
    },
    {
      id: "resistor-series",
      category: "Resistor ও Network",
      title: "Series Resistor",
      icon: "transit-connection-variant",
      summary: "Series resistor-এর total resistance।",
      full: "Series connection-এ resistor একটির পর একটি যুক্ত থাকে এবং total resistance হলো সব resistor-এর যোগফল।",
      formula: "Rt = R1 + R2 + R3 + ...",
      example: "100Ω + 220Ω + 330Ω = 650Ω।",
      inputs: "প্রতিটি resistor-এর value Ω-এ দিন।",
      result: "ফলাফল: Total resistance এবং প্রয়োজনে voltage division।",
      safety: "প্রতিটি resistor-এর power dissipation হিসাব করে rating নির্বাচন করুন।",
      viva: "Series circuit-এ current কেমন? উত্তর: একই current প্রবাহিত হয়।",
    },
    {
      id: "resistor-parallel",
      category: "Resistor ও Network",
      title: "Parallel Resistor",
      icon: "source-branch",
      summary: "Parallel resistor-এর equivalent resistance।",
      full: "Parallel resistor network-এ equivalent resistance সবচেয়ে ছোট resistor-এর চেয়েও কম হতে পারে। দুইটি resistor-এর জন্য সহজ formula ব্যবহার করা যায়।",
      formula: "1/Rt = 1/R1 + 1/R2 + ... | দুইটির ক্ষেত্রে Rt = R1R2/(R1+R2)",
      example: "100Ω ও 100Ω parallel হলে Rt = 50Ω।",
      inputs: "Parallel-এ থাকা resistor value দিন।",
      result: "ফলাফল: Equivalent resistance।",
      safety: "Power rating, branch current ও resistor heating যাচাই করুন।",
      viva: "Parallel circuit-এ voltage কেমন? উত্তর: প্রতিটি branch-এ সাধারণত সমান।",
    },
    {
      id: "voltage-divider",
      category: "Resistor ও Network",
      title: "Voltage Divider",
      icon: "call-split",
      summary: "দুই resistor দিয়ে output voltage বের করা।",
      full: "Voltage divider input voltage-এর একটি অংশ output হিসেবে দেয়। Load যুক্ত হলে output বদলাতে পারে, তাই load resistance বিবেচনা করা দরকার।",
      formula: "Vout = Vin × R2/(R1 + R2)",
      example: "Vin 12V, R1 1kΩ, R2 1kΩ হলে Vout = 6V।",
      inputs: "Input voltage, R1 ও R2 দিন।",
      result: "ফলাফল: Divider output voltage।",
      safety: "Voltage divider-কে high-current power supply হিসেবে ব্যবহার করবেন না।",
      viva: "Voltage divider-এর output কখন load-এর কারণে কমে? উত্তর: Load resistance যথেষ্ট কম হলে।",
    },
    {
      id: "led-resistor",
      category: "Resistor ও Network",
      title: "LED Resistor Calculator",
      icon: "led-on",
      summary: "LED-এর জন্য current-limiting resistor।",
      full: "LED-কে সরাসরি supply-তে না লাগিয়ে series resistor ব্যবহার করা হয়। Supply voltage, LED forward voltage এবং desired current দিয়ে resistor বের হয়।",
      formula: "R = (Vs − Vf) ÷ I",
      example: "Vs 5V, Vf 2V, I 0.01A হলে R = 300Ω।",
      inputs: "Supply voltage, LED forward voltage ও current দিন।",
      result: "ফলাফল: Minimum resistor value এবং suggested standard value।",
      safety: "LED current rating অতিক্রম করবেন না এবং resistor watt rating যাচাই করুন।",
      viva: "LED-এর সঙ্গে resistor কেন লাগে? উত্তর: Current সীমিত করার জন্য।",
    },
    {
      id: "current-voltage-drop",
      category: "Wiring Calculation",
      title: "Voltage Drop",
      icon: "arrow-down-bold",
      summary: "Cable-এ voltage কত কমছে।",
      full: "Cable-এর resistance ও load current-এর কারণে source থেকে load পর্যন্ত voltage কমে যায়। Cable length, material, cross-section ও current voltage drop-কে প্রভাবিত করে।",
      formula: "Vdrop = I × Rcable",
      example: "Current 5A এবং cable resistance 0.4Ω হলে drop = 2V।",
      inputs: "Current ও cable resistance, অথবা approved cable data দিন।",
      result: "ফলাফল: Voltage drop এবং percentage drop।",
      safety: "Cable size নির্বাচন শুধু app-এর estimate দিয়ে করবেন না; local code ও electrician-এর পরামর্শ নিন।",
      viva: "Voltage drop বেশি হলে কী হতে পারে? উত্তর: Device performance কমে ও cable heating হতে পারে।",
    },
    {
      id: "wire-load",
      category: "Wiring Calculation",
      title: "Load ও Wire Current",
      icon: "cable-data",
      summary: "Total load থেকে current বের করা।",
      full: "একাধিক device-এর watt যোগ করে total load বের করা যায়। তারপর supply voltage দিয়ে ভাগ করলে approximate current পাওয়া যায়।",
      formula: "I = Total Power ÷ Voltage",
      example: "1000W load at 230V হলে current প্রায় 4.35A।",
      inputs: "সব device-এর Watt এবং supply voltage দিন।",
      result: "ফলাফল: Approximate load current।",
      safety: "Starting current, continuous load, ambient condition ও cable derating বিবেচনা করুন।",
      viva: "Load current জানলে কী নির্বাচন করা যায়? উত্তর: Cable, fuse বা protection rating-এর প্রাথমিক ধারণা।",
    },
    {
      id: "fuse-mcb",
      category: "Protection Calculation",
      title: "Fuse ও MCB Selection Guide",
      icon: "shield-check",
      summary: "Load current অনুযায়ী protection-এর প্রাথমিক হিসাব।",
      full: "Protection device এমন হতে হবে যাতে normal load চলতে পারে এবং abnormal overcurrent হলে circuit বিচ্ছিন্ন হয়। বাস্তবে cable capacity, fault current ও code মানতে হয়।",
      formula: "Design current ≤ Protective device rating ≤ Cable capacity",
      example: "প্রাথমিক design-এ load current থেকে সামান্য margin নেওয়া হয়, কিন্তু cable capacity কখনো অতিক্রম করা যাবে না।",
      inputs: "Load current, cable capacity ও device type দিন।",
      result: "ফলাফল: Preliminary protection range—final selection নয়।",
      safety: "শুধু calculated current দেখে MCB বসাবেন না; electrician ও local standard অনুসরণ করুন।",
      viva: "MCB rating cable capacity-এর বেশি হলে কী ঝুঁকি? উত্তর: Cable overheat হওয়ার ঝুঁকি।",
    },
    {
      id: "battery-runtime",
      category: "Battery Calculation",
      title: "Battery Backup Time",
      icon: "battery-clock-outline",
      summary: "Battery কতক্ষণ load চালাতে পারে।",
      full: "Battery backup estimate করতে battery voltage, Ah capacity, load watt এবং system efficiency জানা দরকার। বাস্তবে battery age, temperature ও discharge limit-এর কারণে সময় কমতে পারে।",
      formula: "Time ≈ Battery Wh × Efficiency ÷ Load W",
      example: "12V × 100Ah = 1200Wh; 300W load ও 80% efficiency হলে সময় ≈ 3.2 ঘণ্টা।",
      inputs: "Battery Voltage, Ah, Load Watt ও efficiency দিন।",
      result: "ফলাফল: Approximate backup time।",
      safety: "Battery short circuit, reverse polarity ও over-discharge থেকে রক্ষা করুন।",
      viva: "Battery energy কীভাবে বের করা যায়? উত্তর: Wh = V × Ah।",
    },
    {
      id: "capacitor-reactance",
      category: "AC Calculation",
      title: "Capacitive Reactance",
      icon: "capacitor",
      summary: "AC-তে capacitor-এর opposition।",
      full: "Capacitive reactance frequency ও capacitance-এর উপর নির্ভর করে। Frequency বাড়লে capacitive reactance কমে।",
      formula: "Xc = 1/(2πfC)",
      example: "Frequency বা capacitance বাড়ালে Xc কমে যায়।",
      inputs: "Frequency (Hz) ও capacitance (F) দিন।",
      result: "ফলাফল: Capacitive reactance Ohm-এ।",
      safety: "Mains capacitor, snubber বা power factor circuit design প্রশিক্ষণ ছাড়া করবেন না।",
      viva: "Capacitive reactance frequency বাড়লে কী হয়? উত্তর: কমে।",
    },
    {
      id: "inductive-reactance",
      category: "AC Calculation",
      title: "Inductive Reactance",
      icon: "sine-wave",
      summary: "AC-তে inductor-এর opposition।",
      full: "Inductive reactance frequency ও inductance-এর সঙ্গে বাড়ে। Motor ও coil circuit বুঝতে এটি গুরুত্বপূর্ণ।",
      formula: "XL = 2πfL",
      example: "Frequency দ্বিগুণ হলে একই L-এর জন্য XL দ্বিগুণ হয়।",
      inputs: "Frequency (Hz) ও inductance (H) দিন।",
      result: "ফলাফল: Inductive reactance Ohm-এ।",
      safety: "Coil current বন্ধ করার সময় induced voltage তৈরি হতে পারে; flyback protection ব্যবহার করুন।",
      viva: "Inductive reactance frequency বাড়লে কী হয়? উত্তর: বাড়ে।",
    },
    {
      id: "frequency-period",
      category: "AC Calculation",
      title: "Frequency ও Time Period",
      icon: "timer-outline",
      summary: "Hz ও waveform period-এর সম্পর্ক।",
      full: "Frequency হলো প্রতি সেকেন্ডে cycle-এর সংখ্যা এবং period হলো একটি cycle সম্পন্ন করতে সময়।",
      formula: "T = 1/f | f = 1/T",
      example: "50Hz waveform-এর period = 0.02 second বা 20ms।",
      inputs: "Frequency বা time period দিন।",
      result: "ফলাফল: Hz বা second/millisecond।",
      safety: "High-frequency circuit probe করার সময় oscilloscope rating ও grounding নিশ্চিত করুন।",
      viva: "50Hz-এর period কত? উত্তর: 20ms।",
    },
    {
      id: "transformer",
      category: "Transformer ও Motor",
      title: "Transformer Ratio",
      icon: "transmission-tower",
      summary: "Turns ratio থেকে voltage ও current ধারণা।",
      full: "Ideal transformer-এ primary ও secondary voltage turns ratio-এর সঙ্গে সম্পর্কিত। বাস্তব transformer-এ loss থাকে।",
      formula: "Vp/Vs = Np/Ns",
      example: "Turns ratio 10:1 হলে 230V primary থেকে ideal secondary প্রায় 23V হতে পারে।",
      inputs: "Primary voltage, turns ratio অথবা primary/secondary turns দিন।",
      result: "ফলাফল: Approximate secondary voltage।",
      safety: "Transformer primary side mains হতে পারে; output low হলেও primary safe ধরে নেবেন না।",
      viva: "Transformer DC-তে কেন কাজ করে না? উত্তর: পরিবর্তনশীল magnetic flux প্রয়োজন।",
    },
    {
      id: "motor-current",
      category: "Transformer ও Motor",
      title: "Motor Current Estimate",
      icon: "engine-outline",
      summary: "Motor power থেকে approximate current।",
      full: "Motor current estimate-এ voltage, power, efficiency ও power factor বিবেচনা করা হয়। Starting current running current-এর চেয়ে অনেক বেশি হতে পারে।",
      formula: "Single phase: I ≈ P/(V×η×PF) | Three phase: I ≈ P/(√3×V×η×PF)",
      example: "Motor nameplate data না থাকলে estimate শুধু preliminary planning-এর জন্য।",
      inputs: "Motor power, voltage, efficiency, PF ও phase type দিন।",
      result: "ফলাফল: Approximate running current।",
      safety: "Starter, overload ও cable selection-এর final decision nameplate ও measured current দেখে নিন।",
      viva: "Motor starting current কেন বেশি? উত্তর: শুরুতে back EMF কম থাকে।",
    },
    {
      id: "power-factor",
      category: "AC Calculation",
      title: "Power Factor",
      icon: "angle-acute",
      summary: "Real, apparent ও reactive power-এর সম্পর্ক।",
      full: "Power factor real power ও apparent power-এর অনুপাত। Motor ও inductive load-এ PF সাধারণত 1-এর কম হয়।",
      formula: "PF = P/S | S = V×I (single phase)",
      example: "P 800W এবং S 1000VA হলে PF = 0.8।",
      inputs: "Real power (W) ও apparent power (VA), অথবা voltage/current দিন।",
      result: "ফলাফল: Power factor এবং প্রয়োজনে VA।",
      safety: "Power factor correction capacitor design qualified engineer ছাড়া করবেন না।",
      viva: "PF-এর সর্বোচ্চ মান কত? উত্তর: Ideal condition-এ 1।",
    },
    {
      id: "decibel",
      category: "Electronics Calculation",
      title: "Gain ও Decibel",
      icon: "chart-line",
      summary: "Amplifier gain ও dB হিসাব।",
      full: "Amplifier input signal-এর তুলনায় output কত বেড়েছে বা কমেছে তা gain দিয়ে বোঝানো হয়। Voltage gain-এর dB formula electronics-এ ব্যবহৃত হয়।",
      formula: "Gain = Vout/Vin | dB = 20 log10(Vout/Vin)",
      example: "Vout 2V এবং Vin 1V হলে voltage gain 2, প্রায় 6.02dB।",
      inputs: "Input ও output voltage বা power দিন।",
      result: "ফলাফল: Linear gain ও decibel।",
      safety: "Signal generator বা amplifier input rating অতিক্রম করবেন না।",
      viva: "dB কী বোঝায়? উত্তর: Logarithmic gain বা loss-এর মাপ।",
    },
    {
      id: "efficiency",
      category: "Power ও Energy",
      title: "Efficiency Calculator",
      icon: "percent-outline",
      summary: "Input power-এর কত অংশ useful output।",
      full: "Efficiency কোনো system কতটা effective তা দেখায়। Output power input power-এর চেয়ে বেশি হতে পারে না; বাকি অংশ loss হিসেবে heat ইত্যাদিতে যায়।",
      formula: "Efficiency(%) = Output/Input × 100",
      example: "Input 100W ও output 85W হলে efficiency = 85%।",
      inputs: "Input power ও output power দিন।",
      result: "ফলাফল: Efficiency percentage এবং loss power।",
      safety: "Low efficiency মানে heating হতে পারে; ventilation ও thermal protection নিশ্চিত করুন।",
      viva: "Efficiency কি 100%-এর বেশি হতে পারে? উত্তর: বাস্তব passive system-এ নয়।",
    },
  ];

  const GROUPS = [
    { id: "all", title: "সব বিষয়", icon: "view-grid-outline", color: "#16A34A" },
    { id: "Basic Formula", title: "Basic Formula", icon: "math-integral-box", color: "#0284C7" },
    { id: "Power ও Energy", title: "Power ও Energy", icon: "flash-outline", color: "#D97706" },
    { id: "AC Calculation", title: "AC Calculation", icon: "sine-wave", color: "#7C3AED" },
    { id: "Resistor ও Network", title: "Resistor Network", icon: "source-branch", color: "#2563EB" },
    { id: "Wiring Calculation", title: "Wiring", icon: "cable-data", color: "#0891B2" },
    { id: "Protection Calculation", title: "Protection", icon: "shield-check", color: "#DC2626" },
    { id: "Battery Calculation", title: "Battery", icon: "battery-clock-outline", color: "#059669" },
    { id: "Transformer ও Motor", title: "Motor ও Transformer", icon: "engine-outline", color: "#B45309" },
    { id: "Electronics Calculation", title: "Electronics", icon: "chart-line", color: "#9333EA" },
  ];

  function App() {
    const [page, setPage] = useState("home");
    const [group, setGroup] = useState("all");
    const [search, setSearch] = useState("");
    const [topic, setTopic] = useState(null);

    const filtered = useMemo(() => {
      const q = search.trim().toLowerCase();
      return CALCULATION_TOPICS.filter((item) => {
        const byGroup = group === "all" || item.category === group;
        const text = `${item.title} ${item.summary} ${item.category}`.toLowerCase();
        return byGroup && (!q || text.includes(q));
      });
    }, [group, search]);

    if (page === "detail" && topic) return <TopicDetail topic={topic} onBack={() => { setTopic(null); setPage("topics"); }} />;
    if (page === "topics") return <CalculationTopics group={group} setGroup={setGroup} search={search} setSearch={setSearch} topics={filtered} onBack={() => setPage("home")} onOpen={(item) => { setTopic(item); setPage("detail"); }} />;
    return <Home onOpen={() => setPage("topics")} />;
  }

  function Home({ onOpen }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}><NavRow light={false} />
      <View style={styles.hero}>
        <View style={styles.heroIcon}><MaterialCommunityIcons name="calculator-variant" size={36} color="#BBF7D0" /></View>
        <Text style={styles.kicker}>PRACTICAL TOOLS</Text>
        <Text style={styles.heroTitle}>Calculation বাংলা</Text>
        <Text style={styles.heroText}>Formula, load, power, unit, wiring ও electronics calculation এক জায়গায়।</Text>
      </View>
      <Text style={styles.heading}>Calculation Section</Text>
      <Text style={styles.muted}>Basic formula থেকে motor, battery, AC, wiring, protection ও bill estimate পর্যন্ত।</Text>
      <TouchableOpacity style={styles.startCard} onPress={onOpen} activeOpacity={0.85}>
        <View style={styles.startIcon}><MaterialCommunityIcons name="calculator-variant" size={30} color="#FFFFFF" /></View>
        <View style={{ flex: 1 }}><Text style={styles.startTitle}>Calculation শুরু করুন</Text><Text style={styles.startText}>{CALCULATION_TOPICS.length}টি detailed calculation guide</Text></View>
        <MaterialCommunityIcons name="arrow-right" size={25} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.info}><MaterialCommunityIcons name="information-outline" size={24} color="#166534" /><Text style={styles.infoText}>Calculation result design বা live electrical work-এর final approval নয়। Cable, protection ও mains work-এর জন্য local code ও qualified electrician অনুসরণ করুন।</Text></View>
    </ScrollView>;
  }

  function CalculationTopics({ group, setGroup, search, setSearch, topics, onBack, onOpen }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header title="Calculation" icon="calculator-variant" color="#16A34A" onBack={onBack} />
      <View style={styles.search}><MaterialCommunityIcons name="magnify" size={21} color="#64748B" /><TextInput value={search} onChangeText={setSearch} placeholder="Calculation খুঁজুন..." placeholderTextColor="#94A3B8" style={styles.input} /></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupScroll}>
        {GROUPS.map((item) => <TouchableOpacity key={item.id} onPress={() => setGroup(item.id)} style={[styles.groupChip, group === item.id && { backgroundColor: item.color, borderColor: item.color }]}><MaterialCommunityIcons name={item.icon} size={17} color={group === item.id ? "#FFFFFF" : item.color} /><Text style={[styles.chipText, group === item.id && { color: "#FFFFFF" }]}>{item.title}</Text></TouchableOpacity>)}
      </ScrollView>
      <Text style={styles.heading}>Calculation List ({topics.length})</Text>
      {topics.map((item, index) => <TouchableOpacity key={item.id} style={styles.topicCard} onPress={() => onOpen(item)} activeOpacity={0.8}><View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View><View style={styles.topicIcon}><MaterialCommunityIcons name={item.icon} size={23} color="#16A34A" /></View><View style={{ flex: 1 }}><Text style={styles.topicTitle}>{item.title}</Text><Text style={styles.topicSummary}>{item.category} • {item.summary}</Text></View><MaterialCommunityIcons name="chevron-right" size={23} color="#16A34A" /></TouchableOpacity>)}
      {!topics.length && <Text style={styles.empty}>কোনো calculation পাওয়া যায়নি।</Text>}
    </ScrollView>;
  }

  function TopicDetail({ topic, onBack }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header title={topic.title} icon={topic.icon} color="#16A34A" onBack={onBack} />
      <Text style={styles.badge}>{topic.category}</Text>
      <Card title="কী হিসাব করে" icon="book-open-variant" color="#16A34A"><Text style={styles.body}>{topic.full}</Text></Card>
      <Card title="Formula" icon="function-variant" color="#16A34A" green><Text style={styles.formula}>{topic.formula}</Text></Card>
      <Card title="কী input লাগবে" icon="form-textbox" color="#0284C7" blue><Text style={styles.body}>{topic.inputs}</Text></Card>
      <Card title="উদাহরণ" icon="lightbulb-on-outline" color="#A16207" yellow><Text style={styles.body}>{topic.example}</Text></Card>
      <Card title="ফলাফল কীভাবে বুঝবেন" icon="chart-line" color="#2563EB" blue><Text style={styles.body}>{topic.result}</Text></Card>
      <Card title="Viva প্রশ্ন" icon="help-circle-outline" color="#7C3AED" purple><Text style={styles.body}>{topic.viva}</Text></Card>
      <Card title="Safety Note" icon="shield-alert-outline" color="#C2410C" orange><Text style={styles.body}>{topic.safety}</Text></Card>
      <TouchableOpacity style={styles.backButtonLarge} onPress={onBack}><MaterialCommunityIcons name="arrow-left" size={20} color="#FFFFFF" /><Text style={styles.backLargeText}>Calculation List-এ ফিরে যান</Text></TouchableOpacity>
    </ScrollView>;
  }

  function Header({ title, icon, color, onBack }) {
    return <View style={[styles.header, { backgroundColor: color }]}><NavRow onBack={onBack} /><View style={styles.headerRow}><MaterialCommunityIcons name={icon} size={31} color="#FFFFFF" /><Text style={styles.headerTitle}>{title}</Text></View></View>;
  }

  function Card({ title, icon, color, children, green, yellow, blue, purple, orange }) {
    const backgroundColor = green ? "#F0FDF4" : yellow ? "#FEF3C7" : blue ? "#E0F2FE" : purple ? "#F3E8FF" : orange ? "#FFEDD5" : "#FFFFFF";
    return <View style={[styles.card, { backgroundColor, borderLeftColor: color }]}><View style={styles.cardTitleRow}><MaterialCommunityIcons name={icon} size={22} color={color} /><Text style={[styles.cardTitle, { color }]}>{title}</Text></View>{children}</View>;
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7FCF8" },
    content: { padding: 16, paddingBottom: 35 },
    hero: { backgroundColor: "#052E16", borderRadius: 16, padding: 14, marginBottom: 10 },
    heroIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#14532D", alignItems: "center", justifyContent: "center", marginBottom: 8 },
    kicker: { color: "#86EFAC", fontSize: 11, fontWeight: "bold", letterSpacing: 1 },
    heroTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginTop: 3 },
    heroText: { color: "#BBF7D0", fontSize: 12, lineHeight: 18, marginTop: 6 },
    heading: { color: "#0F172A", fontSize: 21, fontWeight: "bold", marginTop: 6, marginBottom: 6 },
    muted: { color: "#64748B", fontSize: 14, lineHeight: 21, marginBottom: 16 },
    startCard: { backgroundColor: "#16A34A", borderRadius: 17, padding: 12, flexDirection: "row", alignItems: "center", marginBottom: 11 },
    startIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#22C55E", alignItems: "center", justifyContent: "center", marginRight: 13 },
    startTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
    startText: { color: "#DCFCE7", fontSize: 11, marginTop: 2 },
    info: { backgroundColor: "#DCFCE7", borderRadius: 14, padding: 15, flexDirection: "row", alignItems: "flex-start" },
    infoText: { color: "#166534", flex: 1, fontSize: 13, lineHeight: 20, marginLeft: 9 },
    header: { borderRadius: 16, padding: 14, marginBottom: 10 },
    back: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    backText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold", marginLeft: 7 },
    headerRow: { flexDirection: "row", alignItems: "center" },
    headerTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginLeft: 9, flex: 1 },
    search: { height: 50, backgroundColor: "#FFFFFF", borderRadius: 13, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 12 },
    input: { flex: 1, color: "#1E293B", fontSize: 15, marginLeft: 8 },
    groupScroll: { marginBottom: 14 },
    groupChip: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 20, paddingVertical: 9, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", marginRight: 8 },
    chipText: { color: "#334155", fontSize: 12, marginLeft: 5 },
    topicCard: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 12, marginBottom: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0" },
    number: { width: 29, height: 29, borderRadius: 15, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center", marginRight: 9 },
    numberText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 },
    topicIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center", marginRight: 10 },
    topicTitle: { color: "#0F172A", fontSize: 15, fontWeight: "bold" },
    topicSummary: { color: "#64748B", fontSize: 11, lineHeight: 17, marginTop: 3 },
    empty: { color: "#64748B", textAlign: "center", marginTop: 30 },
    badge: { alignSelf: "flex-start", color: "#166534", backgroundColor: "#DCFCE7", borderRadius: 15, paddingVertical: 6, paddingHorizontal: 11, fontSize: 12, fontWeight: "bold", marginBottom: 12 },
    card: { borderRadius: 15, padding: 16, marginBottom: 12, borderLeftWidth: 5 },
    cardTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 9 },
    cardTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 8 },
    body: { color: "#334155", fontSize: 14, lineHeight: 22 },
    formula: { color: "#166534", fontSize: 16, lineHeight: 25, fontWeight: "bold" },
    backButtonLarge: { backgroundColor: "#16A34A", borderRadius: 11, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4 },
    backLargeText: { color: "#FFFFFF", fontWeight: "bold", marginLeft: 7 },
  });

  return App;
})();

/*
==================================================
MODULE: safety_app.js
==================================================
*/
const SafetyModule = (() => {
  /* =====================================================
     SAFETY CONTENT
     নতুন safety topic যোগ করতে শুধু SAFETY_TOPICS-এ object যোগ করুন।
     ===================================================== */
  const SAFETY_TOPICS = [
    {
      id: "golden-rules",
      category: "Basic Safety",
      title: "Electrical Safety-এর মূল নিয়ম",
      icon: "shield-check",
      summary: "কাজ শুরুর আগে নিরাপত্তার মৌলিক ধাপ।",
      full: "Electrical কাজের আগে supply isolate করুন, circuit dead কি না test করুন, সঠিক diagram ও tools ব্যবহার করুন এবং কাজ শেষে connection ও cover পুনরায় পরীক্ষা করুন।",
      steps: "১) Identify করুন  ২) Isolate করুন  ৩) Lock/Tag করুন  ৪) Test dead করুন  ৫) কাজ করুন  ৬) Recheck করুন",
      danger: "কাজ জানা না থাকলে live electrical system-এ নিজে কাজ করবেন না।",
      emergency: "ঝুঁকি মনে হলে কাজ বন্ধ করে area নিরাপদ করুন এবং qualified electrician ডাকুন।",
      viva: "Electrical safety-এর প্রথম ধাপ কী? উত্তর: Supply isolate করা।",
    },
    {
      id: "shock",
      category: "Shock Prevention",
      title: "Electric Shock প্রতিরোধ",
      icon: "flash-alert",
      summary: "Shock হওয়ার কারণ ও বাঁচার উপায়।",
      full: "মানুষের শরীর দিয়ে current প্রবাহিত হলে electric shock হতে পারে। Wet skin, damaged insulation, poor earthing ও direct contact ঝুঁকি বাড়ায়।",
      steps: "Dry condition রাখুন, insulated tools ব্যবহার করুন, এক হাতে কাজের practice ও safe distance মানুন, damaged cable বদলান।",
      danger: "কম voltage-ও ভেজা পরিবেশে বিপজ্জনক হতে পারে। Mains voltage প্রাণঘাতী হতে পারে।",
      emergency: "মানুষকে সরাসরি ছুঁয়ে টানবেন না; আগে supply বন্ধ করুন, emergency service ডাকুন এবং প্রশিক্ষণ থাকলে first aid দিন।",
      viva: "Wet skin কেন বেশি ঝুঁকিপূর্ণ? উত্তর: শরীরের resistance কমে current বেশি প্রবাহিত হতে পারে।",
    },
    {
      id: "isolation",
      category: "Isolation ও LOTO",
      title: "Isolation ও Lockout/Tagout",
      icon: "lock-outline",
      summary: "Supply যেন ভুল করে আবার চালু না হয়।",
      full: "Isolation মানে equipment-কে সব energy source থেকে বিচ্ছিন্ন করা। Lockout/Tagout-এ isolator lock করা ও warning tag লাগানো হয়, যাতে অন্য কেউ supply চালু না করে।",
      steps: "Shutdown → Isolate → Lock → Tag → Test dead → Work → Remove tools → Authorized re-energize",
      danger: "শুধু switch off যথেষ্ট নয়; back-feed, stored energy ও multiple supply check করতে হবে।",
      emergency: "Lock বা tag bypass করবেন না। Responsible person ও supervisor-কে জানান।",
      viva: "LOTO-এর উদ্দেশ্য কী? উত্তর: কাজের সময় accidental re-energization ঠেকানো।",
    },
    {
      id: "test-dead",
      category: "Testing Safety",
      title: "Test Before Touch",
      icon: "multimeter",
      summary: "ছোঁয়ার আগে circuit dead কি না যাচাই।",
      full: "Voltage detector বা multimeter ব্যবহার করে circuit dead কি না যাচাই করা জরুরি। Meter আগে known live source-এ test, circuit test, পরে known live source-এ আবার test করা ভালো practice।",
      steps: "Prove meter → Test circuit → Re-prove meter",
      danger: "ভুল range, damaged lead বা wrong port reading-কে unsafe করতে পারে।",
      emergency: "Unexpected voltage পেলে কাজ বন্ধ করুন এবং source খুঁজে isolate করুন।",
      viva: "Test-before-touch কেন? উত্তর: Switch off হলেও circuit energized থাকতে পারে।",
    },
    {
      id: "ppe",
      category: "PPE ও Tools",
      title: "PPE ও Insulated Tools",
      icon: "hard-hat",
      summary: "Personal Protective Equipment-এর সঠিক ব্যবহার।",
      full: "PPE-এর মধ্যে insulated gloves, safety shoes, eye protection, helmet, arc-rated clothing ও face shield থাকতে পারে। কাজের voltage ও hazard অনুযায়ী PPE নির্বাচন করতে হয়।",
      steps: "PPE inspect করুন → সঠিক size নিন → damaged হলে বদলান → কাজ শেষে পরিষ্কার ও store করুন।",
      danger: "PPE shock-proof করার নিশ্চয়তা নয়; এটি risk কমায়, isolation-এর বিকল্প নয়।",
      emergency: "Torn glove, cracked face shield বা damaged tool হলে সঙ্গে সঙ্গে ব্যবহার বন্ধ করুন।",
      viva: "PPE-এর পূর্ণরূপ কী? উত্তর: Personal Protective Equipment।",
    },
    {
      id: "wet-area",
      category: "Environment Safety",
      title: "Wet Area Safety",
      icon: "water-alert",
      summary: "পানি ও ভেজা পরিবেশে electrical ঝুঁকি।",
      full: "পানি electrical conductivity বাড়াতে পারে এবং শরীরের resistance কমাতে পারে। Bathroom, outdoor বা wet area-তে suitable enclosure, RCD/RCCB ও proper earthing দরকার।",
      steps: "Area dry করুন → Supply isolate করুন → Water source বন্ধ করুন → Suitable IP-rated equipment ব্যবহার করুন।",
      danger: "ভেজা হাতে switch, plug বা equipment touch করবেন না।",
      emergency: "ভেজা equipment চালু করবেন না; isolate করে qualified person দিয়ে পরীক্ষা করান।",
      viva: "Wet area-তে কোন protection গুরুত্বপূর্ণ? উত্তর: Appropriate RCD/RCCB, earthing ও suitable enclosure।",
    },
    {
      id: "fire",
      category: "Fire Safety",
      title: "Electrical Fire",
      icon: "fire-alert",
      summary: "Electrical fire চিনুন ও নিরাপদে প্রতিক্রিয়া দিন।",
      full: "Overload, short circuit, loose connection, overheating ও damaged insulation থেকে electrical fire হতে পারে। আগুনের আগে smell, smoke, sparking বা hot outlet দেখা যেতে পারে।",
      steps: "Alarm দিন → মানুষকে সরান → নিরাপদ হলে supply isolate করুন → suitable extinguisher ব্যবহার করুন → emergency service ডাকুন।",
      danger: "Energized electrical fire-এ পানি ঢালবেন না।",
      emergency: "Power off না হওয়া পর্যন্ত safe distance রাখুন; local fire service-এর নির্দেশ অনুসরণ করুন।",
      viva: "Electrical fire-এ পানি কেন নয়? উত্তর: পানি conductive হওয়ায় shock ও fire ছড়ানোর ঝুঁকি থাকে।",
    },
    {
      id: "overload",
      category: "Fire Prevention",
      title: "Overload ও Overheating",
      icon: "thermometer-alert",
      summary: "এক circuit-এ অতিরিক্ত load-এর ঝুঁকি।",
      full: "এক circuit-এর cable, socket বা protection rating-এর বেশি load দিলে heating, insulation damage ও fire হতে পারে। Multi-plug ও extension-এর rating মানতে হবে।",
      steps: "Load list করুন → Total current হিসাব করুন → Cable/protection rating মিলান → Hot spot ও smell check করুন।",
      danger: "Extension strip cascade, loose plug ও underrated cable ব্যবহার করবেন না।",
      emergency: "গরম socket বা smoke দেখলে safe হলে supply off করুন এবং ব্যবহার বন্ধ করুন।",
      viva: "Overload-এর ফল কী হতে পারে? উত্তর: Cable heating, insulation damage ও fire।",
    },
    {
      id: "short-circuit",
      category: "Fault Safety",
      title: "Short Circuit Safety",
      icon: "connection",
      summary: "Low-resistance fault-এর বিপদ।",
      full: "Phase-neutral বা অন্য conductors অনিচ্ছাকৃতভাবে যুক্ত হলে short circuit হয়। এতে খুব বেশি current, arc, heat ও protection trip হতে পারে।",
      steps: "Supply isolate করুন → Fault area identify করুন → Continuity/insulation test করুন → Fault repair করুন → Controlled re-energize করুন।",
      danger: "MCB বারবার reset করে চালাবেন না; এতে fault ও fire risk বাড়ে।",
      emergency: "Arc বা burning smell হলে দূরে সরে supply isolate করুন এবং expert ডাকুন।",
      viva: "Short circuit-এ current কেন বাড়ে? উত্তর: Circuit resistance খুব কমে যায়।",
    },
    {
      id: "earthing",
      category: "Protection",
      title: "Earthing ও Bonding Safety",
      icon: "earth",
      summary: "Fault current-এর নিরাপদ পথ।",
      full: "Earthing exposed metal body-কে নিরাপদ potential-এ রাখে এবং fault current protection device-এর মাধ্যমে supply disconnect করতে সাহায্য করে।",
      steps: "Earth conductor identify করুন → continuity test করুন → earth resistance approved tester দিয়ে মাপুন → connection protect করুন।",
      danger: "Neutral wire-কে ইচ্ছেমতো earth হিসেবে ব্যবহার করবেন না।",
      emergency: "Metal body-তে shock বা tingling হলে equipment বন্ধ করে qualified electrician ডাকুন।",
      viva: "Earthing কি shock পুরোপুরি বন্ধ করে? উত্তর: এটি risk কমায়, কিন্তু isolation ও protection-এর বিকল্প নয়।",
    },
    {
      id: "fuse-mcb",
      category: "Protection",
      title: "Fuse, MCB, RCCB ও RCBO",
      icon: "shield-check",
      summary: "Protection device bypass না করার নিয়ম।",
      full: "Fuse ও MCB overcurrent/short circuit থেকে protection দেয়। RCCB leakage current শনাক্ত করে। RCBO overcurrent ও leakage দুটো protection একসঙ্গে দিতে পারে।",
      steps: "Correct rating নির্বাচন করুন → Test button ব্যবহার করুন → Trip-এর কারণ খুঁজুন → Bypass করবেন না।",
      danger: "Fuse-এর জায়গায় wire বা বড় rating-এর breaker বসানো বিপজ্জনক।",
      emergency: "Protection trip করলে root cause না জেনে বারবার reset করবেন না।",
      viva: "RCCB কী detect করে? উত্তর: Residual বা leakage current।",
    },
    {
      id: "capacitor",
      category: "Stored Energy",
      title: "Capacitor Discharge Safety",
      icon: "battery-alert",
      summary: "Power off-এর পরও capacitor-এর charge।",
      full: "Power supply, inverter, motor বা flash circuit-এর capacitor supply off হওয়ার পরও charge ধরে রাখতে পারে। Stored energy shock দিতে পারে।",
      steps: "Power isolate করুন → অপেক্ষা করুন → rated discharge tool দিয়ে discharge করুন → meter দিয়ে zero/ safe voltage verify করুন।",
      danger: "Screwdriver দিয়ে capacitor short করে discharge করা unsafe এবং component damage করতে পারে।",
      emergency: "Discharge নিশ্চিত না হলে enclosure touch বা খুলবেন না।",
      viva: "Capacitor discharge কেন দরকার? উত্তর: Stored electrical energy নিরাপদে কমানোর জন্য।",
    },
    {
      id: "battery",
      category: "Battery Safety",
      title: "Battery ও DC Safety",
      icon: "battery-alert-variant-outline",
      summary: "Battery short, polarity ও charging safety।",
      full: "Battery low voltage হলেও high short-circuit current দিতে পারে। Reverse polarity, overcharge, puncture, heat ও wrong charger থেকে fire বা damage হতে পারে।",
      steps: "Polarity check করুন → Correct charger ব্যবহার করুন → Fuse দিন → Ventilation রাখুন → swelling হলে isolate করুন।",
      danger: "Battery terminal short করবেন না এবং damaged/swollen lithium battery ব্যবহার করবেন না।",
      emergency: "Smoke, swelling বা heating হলে দূরে সরে fire/emergency guidance নিন; damaged cell পানিতে ফেলবেন না।",
      viva: "Battery-তে fuse কেন দেওয়া হয়? উত্তর: Short বা অতিরিক্ত current সীমিত করার জন্য।",
    },
    {
      id: "multimeter",
      category: "Instrument Safety",
      title: "Multimeter Safety",
      icon: "multimeter",
      summary: "Meter range, port ও lead-এর সঠিক ব্যবহার।",
      full: "Voltage, current, resistance ও continuity-এর জন্য আলাদা mode ও port থাকে। Measurement type না বুঝে dial বা lead setting ভুল করলে arc বা meter damage হতে পারে।",
      steps: "Function select করুন → Lead port check করুন → Highest suitable range নিন → Probe placement verify করুন → Reading নিন।",
      danger: "Current port-এ lead রেখে voltage source-এ parallel connection করবেন না।",
      emergency: "Meter arc করলে পিছিয়ে যান, supply isolate করুন এবং meter inspect না করে ব্যবহার করবেন না।",
      viva: "Resistance মাপার আগে কী করতে হয়? উত্তর: Circuit power off ও capacitor discharge।",
    },
    {
      id: "clamp-meter",
      category: "Instrument Safety",
      title: "Clamp Meter Safety",
      icon: "current-ac",
      summary: "Circuit না খুলে current মাপার নিরাপদ পদ্ধতি।",
      full: "Clamp meter conductor-এর চারপাশের magnetic field থেকে current মাপে। একসঙ্গে phase ও neutral clamp করলে reading cancel হতে পারে।",
      steps: "Correct AC/DC mode নিন → এক conductor clamp করুন → jaw সম্পূর্ণ বন্ধ করুন → rating-এর মধ্যে reading নিন।",
      danger: "Bare live conductor, damaged clamp বা rating-এর বেশি current-এ ব্যবহার করবেন না।",
      emergency: "Unexpected flash বা damaged insulation দেখলে measurement বন্ধ করুন।",
      viva: "Clamp meter-এর সুবিধা কী? উত্তর: Circuit না খুলে current মাপা যায়।",
    },
    {
      id: "soldering",
      category: "Workshop Safety",
      title: "Soldering ও Hot Tool Safety",
      icon: "soldering-iron",
      summary: "Soldering iron, flux ও fumes-এর নিরাপত্তা।",
      full: "Soldering iron-এর tip খুব গরম থাকে। Proper stand, ventilation, eye protection ও clean workbench ব্যবহার করুন। Lead-containing solder হলে hygiene মেনে চলুন।",
      steps: "Stand ব্যবহার করুন → Ventilation চালু রাখুন → Tip touch করবেন না → কাজ শেষে iron unplug করুন → হাত ধুয়ে নিন।",
      danger: "গরম iron তার বা plastic-এর ওপর রাখবেন না।",
      emergency: "Burn হলে ঠান্ডা running water-এ রাখুন; গুরুতর হলে medical care নিন।",
      viva: "Soldering-এর সময় ventilation কেন? উত্তর: Flux ও solder fumes কমানোর জন্য।",
    },
    {
      id: "ladder",
      category: "Work-at-Height",
      title: "Ladder ও Height Safety",
      icon: "ladder",
      summary: "উঁচু জায়গায় wiring-এর নিরাপদ কাজ।",
      full: "Ladder stable, dry ও suitable height-এর হতে হবে। Electrical কাজের জন্য conductive metal ladder এড়িয়ে insulated/approved ladder ব্যবহার করা উচিত।",
      steps: "Ground check করুন → Ladder secure করুন → Three-point contact রাখুন → Overreach করবেন না → Tools belt ব্যবহার করুন।",
      danger: "Live wire-এর কাছে metal ladder ব্যবহার করবেন না।",
      emergency: "Ladder unstable হলে উঠবেন না; নিচের area barricade করুন।",
      viva: "Three-point contact কী? উত্তর: দুই হাত ও এক পা, অথবা দুই পা ও এক হাত support-এ থাকা।",
    },
    {
      id: "confined-space",
      category: "Work Environment",
      title: "Confined Space ও Ventilation",
      icon: "air-filter",
      summary: "বন্ধ বা কম বাতাসের জায়গায় কাজের ঝুঁকি।",
      full: "Confined space-এ oxygen কম, toxic gas, heat বা emergency exit-এর সমস্যা থাকতে পারে। Electrical equipment ও battery charging-এ ventilation গুরুত্বপূর্ণ।",
      steps: "Entry permit/checklist → Gas/air test → Ventilation → Attendant → Communication → Rescue plan।",
      danger: "একাই confined space-এ প্রবেশ করবেন না।",
      emergency: "ভেতরে কেউ অসুস্থ হলে প্রশিক্ষণ ছাড়া ভেতরে ঢুকে rescue করতে যাবেন না; emergency team ডাকুন।",
      viva: "Confined space-এ attendant কেন? উত্তর: বাইরে থেকে monitoring ও emergency response-এর জন্য।",
    },
    {
      id: "arc-flash",
      category: "High Voltage ও Arc",
      title: "Arc Flash Awareness",
      icon: "flash-triangle",
      summary: "Arc, blast, heat ও flying metal-এর ঝুঁকি।",
      full: "Arc flash accidental short বা fault থেকে তৈরি হতে পারে এবং intense heat, light, pressure ও molten metal ছুড়তে পারে। Risk assessment ও arc-rated PPE প্রয়োজন।",
      steps: "De-energize সম্ভব কি না দেখুন → Boundary নির্ধারণ করুন → Qualified person → Arc-rated PPE → Safe approach।",
      danger: "Live panel খুলে inspection বা tightening করবেন না।",
      emergency: "Arc হলে alarm দিন, area ছাড়ুন এবং emergency response শুরু করুন।",
      viva: "Arc flash-এর প্রধান hazard কী? উত্তর: তীব্র heat, blast pressure ও molten metal।",
    },
    {
      id: "emergency-shock",
      category: "Emergency Response",
      title: "Shock হলে কী করবেন",
      icon: "ambulance",
      summary: "Electric shock-এর জরুরি প্রতিক্রিয়া।",
      full: "Shock victim-কে rescue করার আগে নিজের safety নিশ্চিত করুন। Supply isolate করা সবচেয়ে গুরুত্বপূর্ণ। Victim unconscious হলে trained responder emergency service ও CPR protocol অনুসরণ করবে।",
      steps: "Supply off → Emergency call → Area safe → Breathing check → Trained first aid/CPR → Medical evaluation।",
      danger: "Supply live থাকা অবস্থায় victim-কে খালি হাতে touch করবেন না।",
      emergency: "জরুরি নম্বরে ফোন করুন এবং local emergency instruction অনুসরণ করুন।",
      viva: "Shock victim touch করার আগে কী করবেন? উত্তর: Electrical source isolate করবেন।",
    },
    {
      id: "household",
      category: "Home Safety",
      title: "বাড়ির Electrical Safety",
      icon: "home-alert-outline",
      summary: "ঘরের socket, plug, fan ও appliance safety।",
      full: "Damaged cord, loose socket, overloaded extension, exposed wire ও child access household electrical accident-এর সাধারণ কারণ।",
      steps: "Damaged cord বদলান → Socket cover রাখুন → Load distribute করুন → Water থেকে দূরে রাখুন → Periodic inspection করুন।",
      danger: "Three-pin plug-এর earth pin ভেঙে ব্যবহার করবেন না।",
      emergency: "Burn smell, sparking বা warm socket হলে appliance বন্ধ করে qualified electrician ডাকুন।",
      viva: "Socket গরম হওয়ার কারণ কী হতে পারে? উত্তর: Overload, loose contact বা poor connection।",
    },
    {
      id: "signage",
      category: "Work Control",
      title: "Warning Sign ও Barricade",
      icon: "sign-caution",
      summary: "অন্য মানুষকে electrical hazard থেকে দূরে রাখা।",
      full: "Maintenance বা exposed wiring-এর সময় warning sign, barrier ও access control ব্যবহার করুন। Area clean ও cable route safe রাখুন।",
      steps: "Hazard identify → Sign লাগান → Barrier দিন → Access control করুন → কাজ শেষে sign সরান।",
      danger: "Open panel বা floor cable unattended রাখবেন না।",
      emergency: "Unauthorized person ঢুকলে কাজ বন্ধ করে area আবার secure করুন।",
      viva: "Barricade কেন? উত্তর: মানুষকে hazard area থেকে দূরে রাখতে।",
    },
    {
      id: "inspection",
      category: "Inspection ও Maintenance",
      title: "Safety Inspection Checklist",
      icon: "clipboard-check-outline",
      summary: "কাজের আগে ও পরে safety check।",
      full: "Inspection-এ cable insulation, plug, earth, enclosure, breaker, label, ventilation, loose terminal, heat mark ও emergency access দেখা হয়।",
      steps: "Visual check → Mechanical check → Electrical test → Record → Corrective action → Recheck।",
      danger: "শুধু visual check যথেষ্ট নয়; প্রয়োজন অনুযায়ী approved test instrument ব্যবহার করুন।",
      emergency: "Critical defect পেলে equipment service থেকে সরান এবং tag করুন।",
      viva: "Maintenance record কেন? উত্তর: Fault history, accountability ও safe recheck-এর জন্য।",
    },
  ];

  const GROUPS = [
    { id: "all", title: "সব বিষয়", icon: "view-grid-outline", color: "#EA580C" },
    { id: "Basic Safety", title: "Basic Safety", icon: "shield-check", color: "#0284C7" },
    { id: "Shock Prevention", title: "Shock", icon: "flash-alert", color: "#DC2626" },
    { id: "Isolation ও LOTO", title: "Isolation/LOTO", icon: "lock-outline", color: "#7C3AED" },
    { id: "Testing Safety", title: "Testing", icon: "multimeter", color: "#0891B2" },
    { id: "PPE ও Tools", title: "PPE ও Tools", icon: "hard-hat", color: "#D97706" },
    { id: "Environment Safety", title: "Environment", icon: "water-alert", color: "#0284C7" },
    { id: "Fire Safety", title: "Fire", icon: "fire-alert", color: "#DC2626" },
    { id: "Fire Prevention", title: "Overload", icon: "thermometer-alert", color: "#C2410C" },
    { id: "Fault Safety", title: "Fault", icon: "connection", color: "#DB2777" },
    { id: "Protection", title: "Protection", icon: "shield-check", color: "#059669" },
    { id: "Stored Energy", title: "Stored Energy", icon: "battery-alert", color: "#B45309" },
    { id: "Battery Safety", title: "Battery", icon: "battery-alert-variant-outline", color: "#059669" },
    { id: "Instrument Safety", title: "Instruments", icon: "multimeter", color: "#0891B2" },
    { id: "Workshop Safety", title: "Workshop", icon: "soldering-iron", color: "#9333EA" },
    { id: "Work-at-Height", title: "Height", icon: "ladder", color: "#2563EB" },
    { id: "Work Environment", title: "Environment", icon: "air-filter", color: "#0F766E" },
    { id: "High Voltage ও Arc", title: "Arc Flash", icon: "flash-triangle", color: "#DC2626" },
    { id: "Emergency Response", title: "Emergency", icon: "ambulance", color: "#B91C1C" },
    { id: "Home Safety", title: "Home", icon: "home-alert-outline", color: "#16A34A" },
    { id: "Work Control", title: "Work Control", icon: "sign-caution", color: "#D97706" },
    { id: "Inspection ও Maintenance", title: "Inspection", icon: "clipboard-check-outline", color: "#7C3AED" },
  ];

  function App() {
    const [page, setPage] = useState("home");
    const [group, setGroup] = useState("all");
    const [search, setSearch] = useState("");
    const [topic, setTopic] = useState(null);

    const filtered = useMemo(() => {
      const q = search.trim().toLowerCase();
      return SAFETY_TOPICS.filter((item) => {
        const byGroup = group === "all" || item.category === group;
        const text = `${item.title} ${item.summary} ${item.category}`.toLowerCase();
        return byGroup && (!q || text.includes(q));
      });
    }, [group, search]);

    if (page === "detail" && topic) return <TopicDetail topic={topic} onBack={() => { setTopic(null); setPage("topics"); }} />;
    if (page === "topics") return <SafetyTopics group={group} setGroup={setGroup} search={search} setSearch={setSearch} topics={filtered} onBack={() => setPage("home")} onOpen={(item) => { setTopic(item); setPage("detail"); }} />;
    return <Home onOpen={() => setPage("topics")} />;
  }

  function Home({ onOpen }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}><NavRow light={false} />
      <View style={styles.hero}>
        <View style={styles.heroIcon}><MaterialCommunityIcons name="shield-check" size={36} color="#FED7AA" /></View>
        <Text style={styles.kicker}>SAFETY FIRST</Text>
        <Text style={styles.heroTitle}>Safety বাংলা</Text>
        <Text style={styles.heroText}>Electrical কাজের আগে hazard চিনুন, risk কমান এবং নিরাপদে কাজ করুন।</Text>
      </View>
      <Text style={styles.heading}>Safety Section</Text>
      <Text style={styles.muted}>Shock, fire, PPE, LOTO, tools, battery, measurement, emergency ও practical safety—সব এক জায়গায়।</Text>
      <TouchableOpacity style={styles.startCard} onPress={onOpen} activeOpacity={0.85}>
        <View style={styles.startIcon}><MaterialCommunityIcons name="shield-alert-outline" size={30} color="#FFFFFF" /></View>
        <View style={{ flex: 1 }}><Text style={styles.startTitle}>Safety Topics শুরু করুন</Text><Text style={styles.startText}>{SAFETY_TOPICS.length}টি detailed safety guide</Text></View>
        <MaterialCommunityIcons name="arrow-right" size={25} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.info}><MaterialCommunityIcons name="alert-octagon-outline" size={24} color="#9A3412" /><Text style={styles.infoText}>Safety guide কোনো live electrical training বা emergency service-এর বিকল্প নয়। 220/240V, 380/415V, panel ও industrial কাজ qualified person ছাড়া করবেন না।</Text></View>
    </ScrollView>;
  }

  function SafetyTopics({ group, setGroup, search, setSearch, topics, onBack, onOpen }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header title="Safety Topics" icon="shield-check" color="#EA580C" onBack={onBack} />
      <View style={styles.search}><MaterialCommunityIcons name="magnify" size={21} color="#64748B" /><TextInput value={search} onChangeText={setSearch} placeholder="Safety topic খুঁজুন..." placeholderTextColor="#94A3B8" style={styles.input} /></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupScroll}>
        {GROUPS.map((item) => <TouchableOpacity key={item.id} onPress={() => setGroup(item.id)} style={[styles.groupChip, group === item.id && { backgroundColor: item.color, borderColor: item.color }]}><MaterialCommunityIcons name={item.icon} size={17} color={group === item.id ? "#FFFFFF" : item.color} /><Text style={[styles.chipText, group === item.id && { color: "#FFFFFF" }]}>{item.title}</Text></TouchableOpacity>)}
      </ScrollView>
      <Text style={styles.heading}>Safety List ({topics.length})</Text>
      {topics.map((item, index) => <TouchableOpacity key={item.id} style={styles.topicCard} onPress={() => onOpen(item)} activeOpacity={0.8}><View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View><View style={styles.topicIcon}><MaterialCommunityIcons name={item.icon} size={23} color="#EA580C" /></View><View style={{ flex: 1 }}><Text style={styles.topicTitle}>{item.title}</Text><Text style={styles.topicSummary}>{item.category} • {item.summary}</Text></View><MaterialCommunityIcons name="chevron-right" size={23} color="#EA580C" /></TouchableOpacity>)}
      {!topics.length && <Text style={styles.empty}>কোনো safety topic পাওয়া যায়নি।</Text>}
    </ScrollView>;
  }

  function TopicDetail({ topic, onBack }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header title={topic.title} icon={topic.icon} color="#EA580C" onBack={onBack} />
      <Text style={styles.badge}>{topic.category}</Text>
      <Card title="সহজ ভাষায় জানুন" icon="book-open-variant" color="#EA580C"><Text style={styles.body}>{topic.full}</Text></Card>
      <Card title="নিরাপদে কাজের ধাপ" icon="format-list-numbered" color="#0284C7" blue><Text style={styles.body}>{topic.steps}</Text></Card>
      <Card title="কী বিপদ হতে পারে" icon="alert-octagon" color="#DC2626" red><Text style={styles.body}>{topic.danger}</Text></Card>
      <Card title="জরুরি অবস্থায়" icon="ambulance" color="#B91C1C" red><Text style={styles.body}>{topic.emergency}</Text></Card>
      <Card title="Viva প্রশ্ন" icon="help-circle-outline" color="#7C3AED" purple><Text style={styles.body}>{topic.viva}</Text></Card>
      <TouchableOpacity style={styles.backButtonLarge} onPress={onBack}><MaterialCommunityIcons name="arrow-left" size={20} color="#FFFFFF" /><Text style={styles.backLargeText}>Safety List-এ ফিরে যান</Text></TouchableOpacity>
    </ScrollView>;
  }

  function Header({ title, icon, color, onBack }) {
    return <View style={[styles.header, { backgroundColor: color }]}><NavRow onBack={onBack} /><View style={styles.headerRow}><MaterialCommunityIcons name={icon} size={31} color="#FFFFFF" /><Text style={styles.headerTitle}>{title}</Text></View></View>;
  }

  function Card({ title, icon, color, children, blue, purple, red }) {
    const backgroundColor = blue ? "#E0F2FE" : purple ? "#F3E8FF" : red ? "#FEE2E2" : "#FFEDD5";
    return <View style={[styles.card, { backgroundColor, borderLeftColor: color }]}><View style={styles.cardTitleRow}><MaterialCommunityIcons name={icon} size={22} color={color} /><Text style={[styles.cardTitle, { color }]}>{title}</Text></View>{children}</View>;
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFAF7" },
    content: { padding: 16, paddingBottom: 35 },
    hero: { backgroundColor: "#431407", borderRadius: 16, padding: 14, marginBottom: 10 },
    heroIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#7C2D12", alignItems: "center", justifyContent: "center", marginBottom: 8 },
    kicker: { color: "#FED7AA", fontSize: 11, fontWeight: "bold", letterSpacing: 1 },
    heroTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginTop: 3 },
    heroText: { color: "#FFEDD5", fontSize: 12, lineHeight: 18, marginTop: 6 },
    heading: { color: "#0F172A", fontSize: 21, fontWeight: "bold", marginTop: 6, marginBottom: 6 },
    muted: { color: "#64748B", fontSize: 14, lineHeight: 21, marginBottom: 16 },
    startCard: { backgroundColor: "#EA580C", borderRadius: 17, padding: 12, flexDirection: "row", alignItems: "center", marginBottom: 11 },
    startIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#F97316", alignItems: "center", justifyContent: "center", marginRight: 13 },
    startTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
    startText: { color: "#FFEDD5", fontSize: 11, marginTop: 2 },
    info: { backgroundColor: "#FFEDD5", borderRadius: 14, padding: 15, flexDirection: "row", alignItems: "flex-start" },
    infoText: { color: "#9A3412", flex: 1, fontSize: 13, lineHeight: 20, marginLeft: 9 },
    header: { borderRadius: 16, padding: 14, marginBottom: 10 },
    back: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    backText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold", marginLeft: 7 },
    headerRow: { flexDirection: "row", alignItems: "center" },
    headerTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginLeft: 9, flex: 1 },
    search: { height: 50, backgroundColor: "#FFFFFF", borderRadius: 13, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 12 },
    input: { flex: 1, color: "#1E293B", fontSize: 15, marginLeft: 8 },
    groupScroll: { marginBottom: 14 },
    groupChip: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 20, paddingVertical: 9, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", marginRight: 8 },
    chipText: { color: "#334155", fontSize: 12, marginLeft: 5 },
    topicCard: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 12, marginBottom: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0" },
    number: { width: 29, height: 29, borderRadius: 15, backgroundColor: "#EA580C", alignItems: "center", justifyContent: "center", marginRight: 9 },
    numberText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 },
    topicIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: "#FFEDD5", alignItems: "center", justifyContent: "center", marginRight: 10 },
    topicTitle: { color: "#0F172A", fontSize: 15, fontWeight: "bold" },
    topicSummary: { color: "#64748B", fontSize: 11, lineHeight: 17, marginTop: 3 },
    empty: { color: "#64748B", textAlign: "center", marginTop: 30 },
    badge: { alignSelf: "flex-start", color: "#C2410C", backgroundColor: "#FFEDD5", borderRadius: 15, paddingVertical: 6, paddingHorizontal: 11, fontSize: 12, fontWeight: "bold", marginBottom: 12 },
    card: { borderRadius: 15, padding: 16, marginBottom: 12, borderLeftWidth: 5 },
    cardTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 9 },
    cardTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 8 },
    body: { color: "#334155", fontSize: 14, lineHeight: 22 },
    backButtonLarge: { backgroundColor: "#EA580C", borderRadius: 11, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4 },
    backLargeText: { color: "#FFFFFF", fontWeight: "bold", marginLeft: 7 },
  });

  return App;
})();

/*
==================================================
MODULE: measurement_testing_app.js
==================================================
*/
const MeasurementModule = (() => {
  /* =====================================================
     MEASUREMENT & TESTING CONTENT
     নতুন topic যোগ করতে শুধু MEASUREMENT_TOPICS-এ object যোগ করুন।
     ===================================================== */
  const MEASUREMENT_TOPICS = [
    {
      id: "multimeter-intro",
      category: "Meter Basics",
      title: "Multimeter পরিচিতি",
      icon: "multimeter",
      summary: "Dial, display, port ও probe চেনা।",
      full: "Digital multimeter voltage, current, resistance, continuity, diode এবং অনেক ক্ষেত্রে capacitance ও frequency মাপতে পারে। Measurement-এর আগে function, range, lead port ও CAT rating নিশ্চিত করুন।",
      steps: "১) Black lead COM-এ দিন  ২) Red lead-এর port function অনুযায়ী নিন  ৩) Dial select করুন  ৪) Test করুন  ৫) Reading বুঝুন",
      good: "Display stable, range correct এবং probe/lead intact থাকলে measurement শুরু করা যায়।",
      warning: "Current port-এ red lead রেখে voltage source-এ parallel connection করবেন না।",
      viva: "Black probe সাধারণত কোন port-এ থাকে? উত্তর: COM port।",
      animate: true,
    },
    {
      id: "ac-voltage",
      category: "Voltage Measurement",
      title: "AC Voltage মাপা",
      icon: "sine-wave",
      summary: "AC source বা mains-এর voltage guide।",
      full: "AC voltage মাপার সময় multimeter-এর ACV mode ব্যবহার করা হয় এবং probes source-এর দুই terminal-এর parallel-এ রাখা হয়।",
      steps: "ACV select করুন → Suitable range নিন → Probes parallel-এ ধরুন → Reading নিন → Supply isolate করুন।",
      good: "Expected range-এর stable reading পাওয়া গেলে source voltage সম্পর্কে ধারণা পাওয়া যায়।",
      warning: "Mains voltage প্রাণঘাতী হতে পারে; qualified electrician ও CAT-rated meter ছাড়া মাপবেন না।",
      viva: "AC voltage মাপতে কোন mode? উত্তর: ACV।",
      animate: true,
    },
    {
      id: "dc-voltage",
      category: "Voltage Measurement",
      title: "DC Voltage মাপা",
      icon: "current-dc",
      summary: "Battery, adapter ও DC supply-এর voltage।",
      full: "DC voltage মাপতে DCV mode ব্যবহার করা হয়। Red probe positive এবং black probe negative/reference-এ রাখলে সাধারণত positive reading পাওয়া যায়।",
      steps: "DCV select করুন → Red positive-এ → Black negative-এ → Reading নিন → Polarity লক্ষ্য করুন।",
      good: "Battery label বা expected output-এর কাছাকাছি reading পাওয়া স্বাভাবিক হতে পারে।",
      warning: "Reverse polarity হলে minus sign আসতে পারে; wrong range বা short connection এড়ান।",
      viva: "DC voltage-এ polarity কেন গুরুত্বপূর্ণ? উত্তর: Positive ও negative terminal নির্দিষ্ট থাকে।",
      animate: true,
    },
    {
      id: "current",
      category: "Current Measurement",
      title: "Current মাপা",
      icon: "current-ac",
      summary: "Device কত Ampere নিচ্ছে।",
      full: "Current circuit-এর series path-এ মাপা হয়। সাধারণ ব্যবহারকারীর জন্য suitable clamp meter বেশি নিরাপদ, কারণ circuit না খুলেই current মাপা যায়।",
      steps: "Clamp meter হলে এক conductor clamp করুন → Correct AC/DC mode নিন → Reading নিন। Multimeter হলে circuit isolate করে series connection দিন।",
      good: "Measured current device rating ও expected calculation-এর সঙ্গে তুলনা করুন।",
      warning: "Multimeter current mode-এ probes parallel করলে short circuit হতে পারে।",
      viva: "Clamp meter-এর সুবিধা কী? উত্তর: Circuit না খুলে current মাপা যায়।",
      animate: true,
    },
    {
      id: "resistance",
      category: "Resistance ও Continuity",
      title: "Resistance মাপা",
      icon: "resistor",
      summary: "Resistor বা winding-এর Ohm value।",
      full: "Resistance মাপতে Ω mode ব্যবহার করা হয়। Accurate reading-এর জন্য circuit power off এবং parallel path বিচ্ছিন্ন থাকা দরকার।",
      steps: "Power off → Capacitor discharge → Ω mode → Component-এর দুই পাশে probe → Reading নিন।",
      good: "Expected value-এর কাছাকাছি reading tolerance-এর মধ্যে থাকলে component ভালো হতে পারে।",
      warning: "Live circuit-এ resistance mode ব্যবহার করবেন না।",
      viva: "Resistance মাপার আগে কী করতে হয়? উত্তর: Power off ও capacitor discharge।",
      animate: true,
    },
    {
      id: "continuity",
      category: "Resistance ও Continuity",
      title: "Continuity Test",
      icon: "connection",
      summary: "Wire বা track connected কি না।",
      full: "Continuity mode কম resistance হলে beep দিতে পারে। এটি wire, fuse, switch, PCB track বা connector-এর connection পরীক্ষা করতে কাজে লাগে।",
      steps: "Continuity mode → দুই probe touch করে beep যাচাই → Test points-এ probe ধরুন → Beep/OL বুঝুন।",
      good: "Connected path-এ low resistance বা beep, open path-এ OL/no beep দেখা যেতে পারে।",
      warning: "Power on circuit-এ continuity test করবেন না।",
      viva: "Continuity beep কী বোঝায়? উত্তর: Low-resistance conductive path থাকার সম্ভাবনা।",
      animate: true,
    },
    {
      id: "diode",
      category: "Component Testing",
      title: "Diode Test",
      icon: "arrow-right-bold",
      summary: "Forward ও reverse behaviour পরীক্ষা।",
      full: "Diode mode-এ forward direction-এ voltage drop এবং reverse direction-এ high/OL reading দেখা যায়। Pin polarity আগে identify করতে হবে।",
      steps: "Diode mode → Red anode, black cathode → Forward reading → Probe reverse করুন → Reverse reading তুলনা করুন।",
      good: "Forward reading ও reverse high reading সাধারণ diode behaviour-এর সঙ্গে মিলে।",
      warning: "Circuit-এর অন্য component parallel থাকলে in-circuit reading ভুল হতে পারে।",
      viva: "Diode forward direction-এ কী করে? উত্তর: Current conduct করে।",
      animate: true,
    },
    {
      id: "led",
      category: "Component Testing",
      title: "LED Test",
      icon: "led-on",
      summary: "LED জ্বলছে কি না ও polarity পরীক্ষা।",
      full: "Diode mode-এ LED সামান্য আলো দিতে পারে, তবে meter-এর test current অনুযায়ী ফল বদলায়। Anode ও cathode ঠিকভাবে চেনা জরুরি।",
      steps: "Diode mode → Red anode-এ → Black cathode-এ → Light/forward reading দেখুন → Reverse test করুন।",
      good: "Forward direction-এ light বা forward drop এবং reverse-এ no conduction পাওয়া যেতে পারে।",
      warning: "Power supply-তে LED লাগালে current-limiting resistor ব্যবহার করুন।",
      viva: "LED-এর সঙ্গে resistor কেন লাগে? উত্তর: Current limit করার জন্য।",
      animate: true,
    },
    {
      id: "capacitor",
      category: "Component Testing",
      title: "Capacitor Test",
      icon: "capacitor",
      summary: "Capacitance, leakage ও charge behaviour।",
      full: "Capacitor test করার আগে সম্পূর্ণ discharge করতে হয়। Capacitance meter, ESR meter বা suitable multimeter function ব্যবহার করা যায়।",
      steps: "Power off → Discharge → Capacitance mode → Leads connect → Value/ESR compare করুন।",
      good: "Measured capacitance label-এর tolerance-এর মধ্যে ও leakage/ESR acceptable হলে ভালো হতে পারে।",
      warning: "Charged capacitor shock দিতে পারে; screwdriver দিয়ে random short করবেন না।",
      viva: "Capacitor test-এর আগে সবচেয়ে জরুরি কী? উত্তর: Safe discharge।",
      animate: true,
    },
    {
      id: "resistor",
      category: "Component Testing",
      title: "Resistor Test",
      icon: "resistor",
      summary: "Value ও damage পরীক্ষা।",
      full: "Resistor-এর value color code বা schematic থেকে অনুমান করে multimeter reading-এর সঙ্গে তুলনা করা হয়। Burn mark বা cracked body থাকলে replace দরকার হতে পারে।",
      steps: "Circuit power off → এক leg lift প্রয়োজন হলে → Ω mode → দুই terminal-এ probe → Reading compare করুন।",
      good: "Reading tolerance-এর মধ্যে ও body visibly healthy হলে resistor সাধারণত ঠিক থাকতে পারে।",
      warning: "In-circuit parallel path reading কম দেখাতে পারে।",
      viva: "Color code কেন ব্যবহার করা হয়? উত্তর: Resistor-এর nominal value ও tolerance চেনার জন্য।",
    },
    {
      id: "fuse",
      category: "Protection Testing",
      title: "Fuse Test",
      icon: "fuse",
      summary: "Fuse open না intact।",
      full: "Fuse-এর continuity test করে fuse intact কি না দেখা যায়। Fuse-এর rating, type ও voltage rating replacement-এর সময় অবশ্যই মেলাতে হবে।",
      steps: "Supply isolate → Fuse remove/isolate → Continuity mode → দুই end-এ probe → Beep/OL দেখুন।",
      good: "Intact fuse-এ low resistance/beep; blown fuse-এ OL/no beep।",
      warning: "Fuse blown হলে কারণ না খুঁজে বড় rating বা wire দিয়ে replace করবেন না।",
      viva: "Fuse-এর কাজ কী? উত্তর: অতিরিক্ত current-এ circuit বিচ্ছিন্ন করা।",
    },
    {
      id: "switch",
      category: "Wiring Testing",
      title: "Switch Test",
      icon: "toggle-switch",
      summary: "Switch ON/OFF contact কাজ করছে কি না।",
      full: "Power off অবস্থায় switch-এর continuity পরীক্ষা করা যায়। ON অবস্থায় low resistance এবং OFF অবস্থায় open reading expected হতে পারে।",
      steps: "Power isolate → Switch terminals identify → Continuity mode → ON/OFF করে reading দেখুন।",
      good: "ON-এ continuity এবং OFF-এ no continuity পাওয়া উচিত, switch type অনুযায়ী।",
      warning: "Live switch box খুলে test করবেন না।",
      viva: "Switch-এর ON অবস্থায় কী থাকে? উত্তর: Conductive path তৈরি হয়।",
    },
    {
      id: "battery",
      category: "Battery ও Power",
      title: "Battery Test",
      icon: "battery-high",
      summary: "Battery voltage ও condition-এর প্রাথমিক পরীক্ষা।",
      full: "DCV mode-এ battery voltage মাপা যায়। শুধু no-load voltage দিয়ে battery health সম্পূর্ণ বোঝা যায় না; load test বা internal resistance দরকার হতে পারে।",
      steps: "DCV select → Red positive → Black negative → No-load voltage → প্রয়োজনে load test।",
      good: "Label voltage-এর কাছাকাছি reading battery-এর charge সম্পর্কে ধারণা দেয়।",
      warning: "Battery terminals short করবেন না এবং reverse polarity এড়ান।",
      viva: "No-load voltage কি battery health-এর সম্পূর্ণ প্রমাণ? উত্তর: না, load test-ও দরকার হতে পারে।",
    },
    {
      id: "adapter",
      category: "Battery ও Power",
      title: "Adapter ও Charger Test",
      icon: "power-plug",
      summary: "Output voltage, polarity ও load behaviour।",
      full: "Adapter label-এ input, output, current ও polarity দেখে DCV mode-এ output পরীক্ষা করুন। No-load reading কিছু adapter-এ rated value থেকে আলাদা হতে পারে।",
      steps: "Label পড়ুন → DCV select → Polarity identify → Output measure → Suitable load-এ recheck করুন।",
      good: "Output voltage, polarity ও current capability device requirement-এর সঙ্গে মিলে।",
      warning: "Wrong voltage বা polarity device নষ্ট করতে পারে।",
      viva: "12V 2A adapter কী বোঝায়? উত্তর: 12V output ও সর্বোচ্চ প্রায় 2A rated current।",
    },
    {
      id: "motor-winding",
      category: "Motor ও Transformer",
      title: "Motor Winding Test",
      icon: "engine-outline",
      summary: "Winding resistance ও insulation।",
      full: "Motor power isolate করে winding terminal identify, phase-to-phase resistance compare এবং insulation test করা হয়। Nameplate ও manufacturer data অনুসরণ করতে হবে।",
      steps: "Isolate → Discharge → Terminal identify → Resistance compare → Insulation test → Mechanical inspection।",
      good: "Similar winding-এর resistance balanced এবং insulation acceptable হলে condition ভালো হতে পারে।",
      warning: "Megger sensitive electronics-এর সঙ্গে connected অবস্থায় ব্যবহার করবেন না।",
      viva: "Winding resistance অসমান হলে কী বোঝাতে পারে? উত্তর: Winding fault, connection issue বা measurement problem হতে পারে।",
    },
    {
      id: "transformer-winding",
      category: "Motor ও Transformer",
      title: "Transformer Winding Test",
      icon: "transmission-tower",
      summary: "Primary/secondary continuity ও insulation।",
      full: "Transformer winding-এর continuity, resistance ও insulation পরীক্ষা করা হয়। Primary side mains হতে পারে এবং secondary output low হলেও primary hazard থাকে।",
      steps: "Power isolate → Capacitor discharge → Winding pairs identify → Resistance compare → Insulation test।",
      good: "Expected winding continuity ও no-short-to-core reading পাওয়া দরকার।",
      warning: "Primary terminal touch করবেন না; enclosure খোলার আগে safe isolation করুন।",
      viva: "Transformer-এ primary ও secondary কী? উত্তর: Input ও output winding।",
    },
    {
      id: "insulation",
      category: "Advanced Testing",
      title: "Insulation Resistance Test",
      icon: "shield-lock-outline",
      summary: "Cable বা winding-এর insulation leakage।",
      full: "Insulation tester বা megger উচ্চ DC test voltage দিয়ে insulation resistance মাপে। Test voltage equipment-এর rating অনুযায়ী নির্বাচন করতে হবে।",
      steps: "Equipment isolate → Sensitive electronics disconnect → Test voltage select → Test → Discharge → Record করুন।",
      good: "Higher insulation resistance সাধারণত ভালো insulation নির্দেশ করে, তবে standard ও equipment অনুযায়ী limit বদলায়।",
      warning: "Test শেষে cable বা winding-এ charge থাকতে পারে; discharge না করে touch করবেন না।",
      viva: "Megger কী মাপে? উত্তর: Insulation resistance।",
    },
    {
      id: "earth-resistance",
      category: "Advanced Testing",
      title: "Earth Resistance Test",
      icon: "earth",
      summary: "Earthing system-এর resistance পরীক্ষা।",
      full: "Earth tester ও approved method ব্যবহার করে earthing electrode-এর resistance মাপা হয়। Soil, electrode depth, moisture ও parallel paths ফলাফলকে প্রভাবিত করে।",
      steps: "Approved test method → Test leads/electrodes বসান → Reading নিন → Record করুন → Standard-এর সঙ্গে compare করুন।",
      good: "Local code, site design ও system requirement অনুযায়ী acceptable value হতে হবে।",
      warning: "শুধু multimeter দিয়ে earth resistance-এর final certification করবেন না।",
      viva: "Earth resistance বেশি হলে কী ঝুঁকি? উত্তর: Fault current path দুর্বল হয়ে protection operation প্রভাবিত হতে পারে।",
    },
    {
      id: "clamp",
      category: "Advanced Testing",
      title: "Clamp Meter Measurement",
      icon: "current-ac",
      summary: "এক conductor ধরে current মাপা।",
      full: "Clamp meter-এর jaw এক conductor-এর চারপাশে বসাতে হয়। Phase ও neutral একসঙ্গে clamp করলে magnetic field cancel হয়ে ভুল reading হতে পারে।",
      steps: "Correct range/mode → এক conductor নির্বাচন → Jaw close → Stable reading → Load condition record করুন।",
      good: "Measured current load calculation ও nameplate data-এর সঙ্গে তুলনা করুন।",
      warning: "Bare live parts, damaged clamp বা meter rating-এর বাইরে measurement করবেন না।",
      viva: "Phase ও neutral একসঙ্গে clamp করলে কী হতে পারে? উত্তর: Reading খুব কম বা প্রায় zero দেখাতে পারে।",
    },
    {
      id: "oscilloscope",
      category: "Advanced Testing",
      title: "Oscilloscope Basic Test",
      icon: "waveform",
      summary: "Waveform, frequency ও ripple দেখা।",
      full: "Oscilloscope voltage waveform সময়ের সঙ্গে দেখায়। Probe compensation, ground reference, bandwidth ও input limit বুঝে ব্যবহার করতে হয়।",
      steps: "Probe setting → Ground reference → Time/div → Volt/div → Trigger → Waveform observe করুন।",
      good: "Expected amplitude, frequency, noise ও ripple waveform-এর সঙ্গে compare করুন।",
      warning: "Mains বা floating high-side-এ সাধারণ ground clip ভুলভাবে লাগালে short/arc হতে পারে। Differential probe দরকার হতে পারে।",
      viva: "Oscilloscope কী দেখায়? উত্তর: Voltage-এর time-domain waveform।",
    },
    {
      id: "measurement-record",
      category: "Documentation",
      title: "Measurement Record ও Result",
      icon: "clipboard-text-outline",
      summary: "Reading লিখে compare করা।",
      full: "ভালো testing-এ শুধু reading নয়—date, equipment, range, test condition, reference value, result ও action record করা হয়।",
      steps: "Device ID → Test condition → Instrument → Reading → Expected value → Pass/Check → Action লিখুন।",
      good: "Repeatable ও traceable record থাকলে fault trend বুঝতে সহজ হয়।",
      warning: "একটি reading দেখে final diagnosis করবেন না; symptom ও related measurement মিলিয়ে দেখুন।",
      viva: "Measurement record কেন? উত্তর: Comparison, troubleshooting ও future maintenance-এর জন্য।",
    },
    {
      id: "safe-measurement",
      category: "Testing Safety",
      title: "Safe Measurement Checklist",
      icon: "check-decagram-outline",
      summary: "প্রতিটি test-এর আগে শেষ safety check।",
      full: "Meter CAT rating, lead condition, function, range, port, PPE, isolation, probe placement ও working environment—সব যাচাই করে measurement নিন।",
      steps: "Right meter → Right function → Right range → Right port → Right connection → Right reading।",
      good: "Test plan ও hazard control clear থাকলে measurement safe ও repeatable হয়।",
      warning: "Confused হলে probe না লাগিয়ে কাজ বন্ধ করুন এবং qualified person-এর সাহায্য নিন।",
      viva: "Measurement-এর আগে পাঁচটি কী check? উত্তর: Meter, function, range, port ও connection।",
    },
  ];

  const GROUPS = [
    { id: "all", title: "সব বিষয়", icon: "view-grid-outline", color: "#0891B2" },
    { id: "Meter Basics", title: "Meter Basics", icon: "multimeter", color: "#0284C7" },
    { id: "Voltage Measurement", title: "Voltage", icon: "sine-wave", color: "#2563EB" },
    { id: "Current Measurement", title: "Current", icon: "current-ac", color: "#7C3AED" },
    { id: "Resistance ও Continuity", title: "Resistance", icon: "resistor", color: "#16A34A" },
    { id: "Component Testing", title: "Components", icon: "chip", color: "#9333EA" },
    { id: "Protection Testing", title: "Protection", icon: "fuse", color: "#DC2626" },
    { id: "Wiring Testing", title: "Wiring", icon: "toggle-switch", color: "#0F766E" },
    { id: "Battery ও Power", title: "Battery/Power", icon: "battery-high", color: "#D97706" },
    { id: "Motor ও Transformer", title: "Motor/Transformer", icon: "engine-outline", color: "#B45309" },
    { id: "Advanced Testing", title: "Advanced", icon: "waveform", color: "#7C3AED" },
    { id: "Documentation", title: "Record", icon: "clipboard-text-outline", color: "#64748B" },
    { id: "Testing Safety", title: "Safety", icon: "shield-check", color: "#EA580C" },
  ];

  const ANIMATION_STEPS = [
    { title: "Meter প্রস্তুত করুন", text: "Black lead COM port-এ এবং red lead voltage/Ω port-এ দিন।", display: "READY", mode: "Ω" },
    { title: "Ω mode নির্বাচন করুন", text: "Dial ঘুরিয়ে resistance mode নির্বাচন করুন।", display: "Ω MODE", mode: "Ω" },
    { title: "Probe component-এ ধরুন", text: "Power off resistor-এর দুই terminal-এ দুই probe ধরুন।", display: "MEASURE", mode: "Ω" },
    { title: "Reading বুঝুন", text: "Display-তে value এসেছে; expected value-এর সঙ্গে তুলনা করুন।", display: "1.00 kΩ", mode: "Ω" },
  ];

  function App() {
    const [page, setPage] = useState("home");
    const [group, setGroup] = useState("all");
    const [search, setSearch] = useState("");
    const [topic, setTopic] = useState(null);

    const filtered = useMemo(() => {
      const q = search.trim().toLowerCase();
      return MEASUREMENT_TOPICS.filter((item) => {
        const byGroup = group === "all" || item.category === group;
        const text = `${item.title} ${item.summary} ${item.category}`.toLowerCase();
        return byGroup && (!q || text.includes(q));
      });
    }, [group, search]);

    if (page === "animation") return <AnimationScreen onBack={() => setPage("topics")} />;
    if (page === "detail" && topic) return <TopicDetail topic={topic} onBack={() => { setTopic(null); setPage("topics"); }} />;
    if (page === "topics") return <MeasurementTopics group={group} setGroup={setGroup} search={search} setSearch={setSearch} topics={filtered} onBack={() => setPage("home")} onOpen={(item) => { setTopic(item); setPage("detail"); }} onAnimation={() => setPage("animation")} />;
    return <Home onOpen={() => setPage("topics")} />;
  }

  function Home({ onOpen }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}><NavRow light={false} />
      <View style={styles.hero}>
        <View style={styles.heroIcon}><MaterialCommunityIcons name="gauge" size={36} color="#A5F3FC" /></View>
        <Text style={styles.kicker}>PRACTICAL GUIDE</Text>
        <Text style={styles.heroTitle}>Measurement বাংলা</Text>
        <Text style={styles.heroText}>Meter দিয়ে মাপুন, testing বুঝুন এবং result নিরাপদে interpret করুন।</Text>
      </View>
      <Text style={styles.heading}>Measurement & Testing</Text>
      <Text style={styles.muted}>Voltage, current, resistance, component, motor, transformer, insulation, earth ও safe measurement guide।</Text>
      <TouchableOpacity style={styles.startCard} onPress={onOpen} activeOpacity={0.85}>
        <View style={styles.startIcon}><MaterialCommunityIcons name="gauge" size={30} color="#FFFFFF" /></View>
        <View style={{ flex: 1 }}><Text style={styles.startTitle}>Measurement Topics শুরু করুন</Text><Text style={styles.startText}>{MEASUREMENT_TOPICS.length}টি detailed testing guide</Text></View>
        <MaterialCommunityIcons name="arrow-right" size={25} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.animationPromo}><MaterialCommunityIcons name="play-circle-outline" size={30} color="#0E7490" /><View style={{ flex: 1, marginLeft: 10 }}><Text style={styles.promoTitle}>Animated Practical Guide</Text><Text style={styles.promoText}>Multimeter দিয়ে resistor মাপার sample animation দেখুন।</Text></View></View>
      <View style={styles.info}><MaterialCommunityIcons name="shield-alert-outline" size={24} color="#9A3412" /><Text style={styles.infoText}>App নিজে voltage বা current মাপে না। Actual measurement-এর জন্য suitable meter এবং trained person প্রয়োজন।</Text></View>
    </ScrollView>;
  }

  function MeasurementTopics({ group, setGroup, search, setSearch, topics, onBack, onOpen, onAnimation }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header title="Measurement & Testing" icon="gauge" color="#0891B2" onBack={onBack} />
      <TouchableOpacity style={styles.animationButton} onPress={onAnimation}><MaterialCommunityIcons name="play-circle" size={24} color="#FFFFFF" /><Text style={styles.animationButtonText}>Animated Sample দেখুন</Text><MaterialCommunityIcons name="arrow-right" size={22} color="#FFFFFF" /></TouchableOpacity>
      <View style={styles.search}><MaterialCommunityIcons name="magnify" size={21} color="#64748B" /><TextInput value={search} onChangeText={setSearch} placeholder="Testing topic খুঁজুন..." placeholderTextColor="#94A3B8" style={styles.input} /></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupScroll}>{GROUPS.map((item) => <TouchableOpacity key={item.id} onPress={() => setGroup(item.id)} style={[styles.groupChip, group === item.id && { backgroundColor: item.color, borderColor: item.color }]}><MaterialCommunityIcons name={item.icon} size={17} color={group === item.id ? "#FFFFFF" : item.color} /><Text style={[styles.chipText, group === item.id && { color: "#FFFFFF" }]}>{item.title}</Text></TouchableOpacity>)}</ScrollView>
      <Text style={styles.heading}>Testing List ({topics.length})</Text>
      {topics.map((item, index) => <TouchableOpacity key={item.id} style={styles.topicCard} onPress={() => onOpen(item)} activeOpacity={0.8}><View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View><View style={styles.topicIcon}><MaterialCommunityIcons name={item.icon} size={23} color="#0891B2" /></View><View style={{ flex: 1 }}><Text style={styles.topicTitle}>{item.title}</Text><Text style={styles.topicSummary}>{item.category} • {item.summary}</Text></View><MaterialCommunityIcons name="chevron-right" size={23} color="#0891B2" /></TouchableOpacity>)}
      {!topics.length && <Text style={styles.empty}>কোনো testing topic পাওয়া যায়নি।</Text>}
    </ScrollView>;
  }

  function AnimationScreen({ onBack }) {
    const [step, setStep] = useState(0);
    const pulse = useRef(new Animated.Value(1)).current;
    const red = useRef(new Animated.Value(0)).current;
    const black = useRef(new Animated.Value(0)).current;
    const display = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const loop = Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1.07, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]));
      loop.start();
      return () => loop.stop();
    }, [pulse]);

    useEffect(() => {
      Animated.parallel([
        Animated.timing(red, { toValue: step >= 2 ? 1 : 0, duration: 700, useNativeDriver: true }),
        Animated.timing(black, { toValue: step >= 2 ? 1 : 0, duration: 700, useNativeDriver: true }),
        Animated.timing(display, { toValue: step >= 3 ? 1 : 0, duration: 800, useNativeDriver: true }),
      ]).start();
    }, [step, red, black, display]);

    const redMove = red.interpolate({ inputRange: [0, 1], outputRange: [-18, 0] });
    const blackMove = black.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
    const displayOpacity = display.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });
    const current = ANIMATION_STEPS[step];

    return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header title="Animated Demonstration" icon="play-circle-outline" color="#0891B2" onBack={onBack} />
      <Text style={styles.badge}>Multimeter দিয়ে Resistor মাপা</Text>
      <View style={styles.progressBox}><View style={styles.progressTop}><Text style={styles.progressLabel}>ধাপ {step + 1} / {ANIMATION_STEPS.length}</Text><Text style={styles.progressLabel}>{Math.round(((step + 1) / ANIMATION_STEPS.length) * 100)}%</Text></View><View style={styles.progressBg}><View style={[styles.progressFill, { width: `${((step + 1) / ANIMATION_STEPS.length) * 100}%` }]} /></View></View>
      <View style={styles.demoCard}>
        <View style={styles.meter}>
          <View style={styles.meterTop}><MaterialCommunityIcons name="multimeter" size={28} color="#CBD5E1" /><Text style={styles.meterLabel}>DIGITAL MULTIMETER</Text></View>
          <Animated.View style={[styles.display, { opacity: displayOpacity, transform: [{ scale: pulse }] }]}><Text style={styles.displayText}>{current.display}</Text></Animated.View>
          <View style={styles.dial}><MaterialCommunityIcons name="rotate-right" size={25} color="#FACC15" /><Text style={styles.dialText}>{current.mode}</Text></View>
          <View style={styles.ports}><View style={styles.portBlack} /><View style={styles.portRed} /></View>
        </View>
        <View style={styles.probeArea}>
          <Animated.View style={[styles.probe, styles.redProbe, { transform: [{ translateX: redMove }] }]}><View style={styles.redHandle} /><View style={styles.tip} /><Text style={styles.probeText}>RED</Text></Animated.View>
          <Animated.View style={[styles.probe, styles.blackProbe, { transform: [{ translateX: blackMove }] }]}><View style={styles.blackHandle} /><View style={styles.tip} /><Text style={styles.probeText}>BLACK</Text></Animated.View>
          <View style={styles.resistor}><View style={styles.wire} /><View style={styles.bodyResistor}><View style={styles.bandOne} /><View style={styles.bandTwo} /><View style={styles.bandThree} /></View><View style={styles.wire} /></View>
        </View>
      </View>
      <View style={styles.stepCard}><View style={styles.stepCircle}><Text style={styles.stepNumber}>{step + 1}</Text></View><View style={{ flex: 1 }}><Text style={styles.stepTitle}>{current.title}</Text><Text style={styles.stepText}>{current.text}</Text></View></View>
      <View style={styles.resultBox}><MaterialCommunityIcons name={step === 3 ? "check-circle" : "information-outline"} size={24} color={step === 3 ? "#16A34A" : "#0369A1"} /><Text style={styles.resultText}>{step === 3 ? "Reading পাওয়া গেছে: Resistor Good" : "পরের ধাপে যেতে নিচের button চাপুন"}</Text></View>
      <View style={styles.navRow}><TouchableOpacity style={[styles.navButton, step === 0 && styles.disabled]} disabled={step === 0} onPress={() => setStep(step - 1)}><MaterialCommunityIcons name="arrow-left" size={20} color={step === 0 ? "#94A3B8" : "#0F172A"} /><Text style={[styles.navText, step === 0 && styles.disabledText]}>আগের ধাপ</Text></TouchableOpacity>{step < ANIMATION_STEPS.length - 1 ? <TouchableOpacity style={styles.nextButton} onPress={() => setStep(step + 1)}><Text style={styles.nextText}>পরের ধাপ</Text><MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" /></TouchableOpacity> : <TouchableOpacity style={styles.resetButton} onPress={() => setStep(0)}><MaterialCommunityIcons name="restart" size={20} color="#FFFFFF" /><Text style={styles.nextText}>আবার দেখুন</Text></TouchableOpacity>}</View>
      <View style={styles.warning}><MaterialCommunityIcons name="alert-outline" size={23} color="#C2410C" /><Text style={styles.warningText}>Resistance মাপার আগে power বন্ধ করুন। Live circuit-এ Ω mode ব্যবহার করবেন না।</Text></View>
    </ScrollView>;
  }

  function TopicDetail({ topic, onBack }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}><Header title={topic.title} icon={topic.icon} color="#0891B2" onBack={onBack} /><Text style={styles.badge}>{topic.category}</Text><Card title="সহজ ভাষায় জানুন" icon="book-open-variant" color="#0891B2"><Text style={styles.body}>{topic.full}</Text></Card><Card title="ধাপে ধাপে কীভাবে করবেন" icon="format-list-numbered" color="#0284C7" blue><Text style={styles.body}>{topic.steps}</Text></Card><Card title="ভালো result কেমন" icon="check-circle-outline" color="#16A34A" green><Text style={styles.body}>{topic.good}</Text></Card><Card title="Safety Warning" icon="shield-alert-outline" color="#C2410C" orange><Text style={styles.body}>{topic.warning}</Text></Card><Card title="Viva প্রশ্ন" icon="help-circle-outline" color="#7C3AED" purple><Text style={styles.body}>{topic.viva}</Text></Card>{topic.animate && <TouchableOpacity style={styles.animationButton} onPress={() => {}}><MaterialCommunityIcons name="animation-play" size={23} color="#FFFFFF" /><Text style={styles.animationButtonText}>এই topic-এর animation পরের ধাপে যোগ হবে</Text></TouchableOpacity>}<TouchableOpacity style={styles.backButtonLarge} onPress={onBack}><MaterialCommunityIcons name="arrow-left" size={20} color="#FFFFFF" /><Text style={styles.backLargeText}>Testing List-এ ফিরে যান</Text></TouchableOpacity></ScrollView>;
  }

  function Header({ title, icon, color, onBack }) { return <View style={[styles.header, { backgroundColor: color }]}><NavRow onBack={onBack} /><View style={styles.headerRow}><MaterialCommunityIcons name={icon} size={31} color="#FFFFFF" /><Text style={styles.headerTitle}>{title}</Text></View></View>; }
  function Card({ title, icon, color, children, blue, green, purple, orange }) { const backgroundColor = blue ? "#E0F2FE" : green ? "#F0FDF4" : purple ? "#F3E8FF" : orange ? "#FFEDD5" : "#FFFFFF"; return <View style={[styles.card, { backgroundColor, borderLeftColor: color }]}><View style={styles.cardTitleRow}><MaterialCommunityIcons name={icon} size={22} color={color} /><Text style={[styles.cardTitle, { color }]}>{title}</Text></View>{children}</View>; }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5FCFD" }, content: { padding: 16, paddingBottom: 35 },
    hero: { backgroundColor: "#083344", borderRadius: 16, padding: 14, marginBottom: 10 }, heroIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#155E75", alignItems: "center", justifyContent: "center", marginBottom: 8 }, kicker: { color: "#A5F3FC", fontSize: 11, fontWeight: "bold", letterSpacing: 1 }, heroTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginTop: 3 }, heroText: { color: "#CFFAFE", fontSize: 12, lineHeight: 18, marginTop: 6 },
    heading: { color: "#0F172A", fontSize: 21, fontWeight: "bold", marginTop: 6, marginBottom: 6 }, muted: { color: "#64748B", fontSize: 14, lineHeight: 21, marginBottom: 16 }, startCard: { backgroundColor: "#0891B2", borderRadius: 17, padding: 12, flexDirection: "row", alignItems: "center", marginBottom: 11 }, startIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#06B6D4", alignItems: "center", justifyContent: "center", marginRight: 13 }, startTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" }, startText: { color: "#CFFAFE", fontSize: 11, marginTop: 2 }, animationPromo: { backgroundColor: "#CFFAFE", borderRadius: 15, padding: 15, flexDirection: "row", alignItems: "center", marginBottom: 15 }, promoTitle: { color: "#0E7490", fontSize: 16, fontWeight: "bold" }, promoText: { color: "#155E75", fontSize: 12, lineHeight: 18, marginTop: 3 }, info: { backgroundColor: "#FFEDD5", borderRadius: 14, padding: 15, flexDirection: "row", alignItems: "flex-start" }, infoText: { color: "#9A3412", flex: 1, fontSize: 13, lineHeight: 20, marginLeft: 9 },
    header: { borderRadius: 16, padding: 14, marginBottom: 10 }, back: { flexDirection: "row", alignItems: "center", marginBottom: 20 }, backText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold", marginLeft: 7 }, headerRow: { flexDirection: "row", alignItems: "center" }, headerTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginLeft: 9, flex: 1 }, search: { height: 50, backgroundColor: "#FFFFFF", borderRadius: 13, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 12 }, input: { flex: 1, color: "#1E293B", fontSize: 15, marginLeft: 8 }, groupScroll: { marginBottom: 14 }, groupChip: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 20, paddingVertical: 9, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", marginRight: 8 }, chipText: { color: "#334155", fontSize: 12, marginLeft: 5 }, topicCard: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 12, marginBottom: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0" }, number: { width: 29, height: 29, borderRadius: 15, backgroundColor: "#0891B2", alignItems: "center", justifyContent: "center", marginRight: 9 }, numberText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 }, topicIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: "#CFFAFE", alignItems: "center", justifyContent: "center", marginRight: 10 }, topicTitle: { color: "#0F172A", fontSize: 15, fontWeight: "bold" }, topicSummary: { color: "#64748B", fontSize: 11, lineHeight: 17, marginTop: 3 }, empty: { color: "#64748B", textAlign: "center", marginTop: 30 }, badge: { alignSelf: "flex-start", color: "#0E7490", backgroundColor: "#CFFAFE", borderRadius: 15, paddingVertical: 6, paddingHorizontal: 11, fontSize: 12, fontWeight: "bold", marginBottom: 12 },
    animationButton: { backgroundColor: "#0891B2", borderRadius: 12, padding: 14, flexDirection: "row", alignItems: "center", marginBottom: 14 }, animationButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold", flex: 1, marginLeft: 8 }, progressBox: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 15, marginBottom: 15 }, progressTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 9 }, progressLabel: { color: "#475569", fontSize: 13, fontWeight: "bold" }, progressBg: { height: 8, backgroundColor: "#E2E8F0", borderRadius: 8, overflow: "hidden" }, progressFill: { height: 8, backgroundColor: "#0891B2", borderRadius: 8 }, demoCard: { backgroundColor: "#CFFAFE", borderRadius: 18, padding: 15, minHeight: 325, marginBottom: 14 }, meter: { backgroundColor: "#334155", width: 155, height: 190, borderRadius: 17, alignSelf: "center", padding: 12 }, meterTop: { alignItems: "center" }, meterLabel: { color: "#CBD5E1", fontSize: 7, fontWeight: "bold", marginTop: 3 }, display: { backgroundColor: "#BAE6FD", borderRadius: 5, padding: 9, marginTop: 10, alignItems: "center" }, displayText: { color: "#075985", fontSize: 17, fontWeight: "bold" }, dial: { alignItems: "center", marginTop: 10 }, dialText: { color: "#FACC15", fontSize: 18, fontWeight: "bold" }, ports: { flexDirection: "row", justifyContent: "space-around", marginTop: 8 }, portBlack: { width: 14, height: 14, backgroundColor: "#020617", borderRadius: 7 }, portRed: { width: 14, height: 14, backgroundColor: "#EF4444", borderRadius: 7 }, probeArea: { height: 105, flexDirection: "row", justifyContent: "center", alignItems: "flex-end", marginTop: -3 }, probe: { position: "absolute", bottom: 28, alignItems: "center" }, redProbe: { left: 55 }, blackProbe: { right: 55 }, redHandle: { width: 13, height: 45, backgroundColor: "#EF4444", borderRadius: 7, transform: [{ rotate: "28deg" }] }, blackHandle: { width: 13, height: 45, backgroundColor: "#111827", borderRadius: 7, transform: [{ rotate: "-28deg" }] }, tip: { width: 5, height: 15, backgroundColor: "#64748B", transform: [{ rotate: "28deg" }], marginTop: -3 }, probeText: { color: "#475569", fontSize: 9, fontWeight: "bold", marginTop: 4 }, resistor: { position: "absolute", bottom: 18, flexDirection: "row", alignItems: "center" }, wire: { width: 28, height: 3, backgroundColor: "#64748B" }, bodyResistor: { width: 72, height: 27, borderRadius: 7, backgroundColor: "#FDE68A", borderWidth: 1, borderColor: "#A16207", flexDirection: "row", justifyContent: "space-around", alignItems: "center" }, bandOne: { width: 6, height: 27, backgroundColor: "#92400E" }, bandTwo: { width: 6, height: 27, backgroundColor: "#DC2626" }, bandThree: { width: 6, height: 27, backgroundColor: "#1D4ED8" }, stepCard: { backgroundColor: "#FFFFFF", borderRadius: 15, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 12 }, stepCircle: { width: 43, height: 43, borderRadius: 22, backgroundColor: "#0891B2", alignItems: "center", justifyContent: "center", marginRight: 13 }, stepNumber: { color: "#FFFFFF", fontSize: 19, fontWeight: "bold" }, stepTitle: { color: "#0F172A", fontSize: 17, fontWeight: "bold" }, stepText: { color: "#64748B", fontSize: 13, lineHeight: 19, marginTop: 5 }, resultBox: { backgroundColor: "#DCFCE7", borderRadius: 13, padding: 14, flexDirection: "row", alignItems: "center", marginBottom: 15 }, resultText: { color: "#166534", fontSize: 13, fontWeight: "bold", marginLeft: 9, flex: 1 }, navRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }, navButton: { backgroundColor: "#FFFFFF", borderRadius: 10, padding: 13, flexDirection: "row", alignItems: "center" }, disabled: { backgroundColor: "#E2E8F0" }, navText: { color: "#0F172A", fontSize: 13, fontWeight: "bold", marginLeft: 6 }, disabledText: { color: "#94A3B8" }, nextButton: { backgroundColor: "#0369A1", borderRadius: 10, padding: 13, flexDirection: "row", alignItems: "center" }, resetButton: { backgroundColor: "#16A34A", borderRadius: 10, padding: 13, flexDirection: "row", alignItems: "center" }, nextText: { color: "#FFFFFF", fontSize: 13, fontWeight: "bold", marginRight: 6 }, warning: { backgroundColor: "#FFEDD5", borderRadius: 13, padding: 14, flexDirection: "row", alignItems: "center" }, warningText: { color: "#9A3412", fontSize: 12, lineHeight: 18, marginLeft: 9, flex: 1 },
    card: { borderRadius: 15, padding: 16, marginBottom: 12, borderLeftWidth: 5 }, cardTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 9 }, cardTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 8 }, body: { color: "#334155", fontSize: 14, lineHeight: 22 }, backButtonLarge: { backgroundColor: "#0891B2", borderRadius: 11, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4 }, backLargeText: { color: "#FFFFFF", fontWeight: "bold", marginLeft: 7 },
  });

  return App;
})();

/*
==================================================
MODULE: power_unit_troubleshooting_app.js
==================================================
*/
const PowerFaultModule = (() => {
  /* =====================================================
     POWER, UNIT, TROUBLESHOOTING & FAULT CONTENT
     নতুন topic যোগ করতে শুধু POWER_FAULT_TOPICS-এ object যোগ করুন।
     ===================================================== */
  const POWER_FAULT_TOPICS = [
    {
      id: "watt",
      category: "Power Basics",
      title: "Watt কী এবং Power কীভাবে বুঝবেন",
      icon: "flash-outline",
      summary: "Device কত power ব্যবহার করছে।",
      full: "Watt হলো electrical power-এর একক। কোনো device প্রতি মুহূর্তে কত হারে electrical energy ব্যবহার বা রূপান্তর করছে তা Watt দিয়ে বোঝানো হয়। Device label, nameplate বা meter থেকে power সম্পর্কে ধারণা পাওয়া যায়।",
      formula: "P = V × I | 1 kW = 1000 W",
      test: "Voltage ও current মাপুন, অথবা device label-এর rated Watt পড়ুন। Resistive load-এ P প্রায় V×I হতে পারে; motor/SMPS-এ power factor বিবেচনা করুন।",
      fault: "Rated power-এর তুলনায় input power অস্বাভাবিক বেশি হলে overload, friction, short, poor efficiency বা measurement error হতে পারে।",
      action: "Load, cable, supply voltage, current, heating ও nameplate মিলিয়ে qualified person দিয়ে diagnosis করুন।",
      viva: "Power-এর একক কী? উত্তর: Watt।",
    },
    {
      id: "unit",
      category: "Power ও Unit",
      title: "বিদ্যুৎ-এর Unit বা kWh",
      icon: "counter",
      summary: "Meter-এর 1 Unit কী বোঝায়।",
      full: "বিদ্যুৎ বিলের Unit সাধারণত kilowatt-hour বা kWh। কোনো 1kW load এক ঘণ্টা চললে প্রায় 1 Unit energy ব্যবহার হয়।",
      formula: "Unit = Power(kW) × Time(hour)",
      test: "Device Watt, চলার সময় এবং meter reading record করুন। একাধিক device হলে প্রত্যেকটির Unit যোগ করুন।",
      fault: "Unit হঠাৎ বেড়ে গেলে hidden load, faulty appliance, leakage, বেশি operating time, meter issue বা হিসাবের ভুল হতে পারে।",
      action: "Main meter reading, appliance-by-appliance test এবং off-load observation করুন; meter tampering বা unsafe bypass করবেন না।",
      viva: "1 Unit বিদ্যুৎ কত? উত্তর: 1 kWh।",
    },
    {
      id: "bill",
      category: "Power ও Unit",
      title: "Electricity Bill গভীরভাবে বোঝা",
      icon: "receipt-text-outline",
      summary: "Unit, slab, rate ও অতিরিক্ত charge।",
      full: "Electricity bill শুধু Unit × rate নয়। Tariff slab, demand charge, service charge, VAT, fuel adjustment বা local billing rule থাকতে পারে।",
      formula: "Estimated cost = Energy Unit × Applicable rate + other charges",
      test: "বর্তমান ও আগের meter reading, billing days, tariff slab এবং bill-এর breakdown মিলিয়ে দেখুন।",
      fault: "Bill বেশি হলে reading ভুল, estimated bill, slab change, meter issue অথবা household load increase হতে পারে।",
      action: "নিজে meter খুলবেন না; bill provider-এর official complaint channel ব্যবহার করুন এবং reading-এর ছবি রাখুন।",
      viva: "Bill-এর Unit কী দিয়ে মাপা হয়? উত্তর: kWh।",
    },
    {
      id: "load-list",
      category: "Load Analysis",
      title: "Load List তৈরি",
      icon: "format-list-bulleted",
      summary: "সব appliance-এর power ও running time।",
      full: "Load list-এ device name, rated Watt, quantity, daily hours, monthly days, starting current এবং essential/non-essential status লিখলে consumption বোঝা সহজ হয়।",
      formula: "Monthly Unit = (Watt × quantity × hours × days) ÷ 1000",
      test: "Label reading ও actual clamp-meter reading compare করুন।",
      fault: "Load list-এ device বাদ পড়লে bill estimate কম হবে এবং circuit overload বোঝা যাবে না।",
      action: "High-power load আলাদা mark করুন এবং unnecessary standby load identify করুন।",
      viva: "Load list কেন দরকার? উত্তর: Consumption, capacity ও fault analysis-এর জন্য।",
    },
    {
      id: "standby",
      category: "Energy Saving",
      title: "Standby Power ও Hidden Load",
      icon: "power-sleep",
      summary: "বন্ধ মনে হলেও device-এর power usage।",
      full: "TV, charger, set-top box, router, inverter ও adapter off/standby অবস্থায় সামান্য power নিতে পারে। অনেক device একসঙ্গে থাকলে মাসে উল্লেখযোগ্য Unit হতে পারে।",
      formula: "Standby Unit = Standby Watt × hours × days ÷ 1000",
      test: "Plug-in energy meter বা clamp/appropriate meter দিয়ে condition অনুযায়ী মাপুন।",
      fault: "Standby power অস্বাভাবিক বেশি হলে faulty adapter, battery charging loop বা device control fault থাকতে পারে।",
      action: "প্রয়োজন না হলে switch-off করুন; smart plug বা timer ব্যবহার করার আগে rating নিশ্চিত করুন।",
      viva: "Standby load কী? উত্তর: Device active না থাকলেও যে ছোট power ব্যবহার হয়।",
    },
    {
      id: "power-factor",
      category: "AC Power",
      title: "Power Factor ও Apparent Power",
      icon: "angle-acute",
      summary: "Watt, VA, VAR ও current-এর সম্পর্ক।",
      full: "Real power Watt-এ useful work করে, apparent power VA-তে এবং reactive power VAR-এ প্রকাশ করা হয়। Power factor কম হলে একই useful power-এর জন্য current বেশি লাগতে পারে।",
      formula: "PF = W/VA | Single phase apparent power S = V×I",
      test: "Power analyzer বা suitable meter দিয়ে V, I, W, VA ও PF record করুন।",
      fault: "Motor, transformer বা poor capacitor correction-এর কারণে PF কম হতে পারে; অতিরিক্ত capacitor-ও সমস্যা তৈরি করতে পারে।",
      action: "Power factor correction design qualified engineer-এর মাধ্যমে করুন; শুধু capacitor লাগানো সমাধান নয়।",
      viva: "PF-এর ideal value কত? উত্তর: 1।",
    },
    {
      id: "voltage-low",
      category: "Power Fault",
      title: "Low Voltage Fault",
      icon: "arrow-down-bold",
      summary: "Supply voltage কমে গেলে লক্ষণ ও পরীক্ষা।",
      full: "Low voltage-এর কারণে light dim, motor slow, relay drop, adapter reset, heating ও equipment malfunction হতে পারে। Loose connection, long cable, overload বা supply issue কারণ হতে পারে।",
      formula: "Voltage drop = I × R",
      test: "No-load ও full-load voltage source এবং load-এর কাছে মাপুন; terminal, neutral ও cable drop compare করুন।",
      fault: "Load-এর কাছে voltage source-এর চেয়ে অনেক কম হলে cable/connection overload বা high resistance suspect করুন।",
      action: "Loose terminal tighten/repair qualified person দিয়ে করান; protection bypass করে voltage বাড়াবেন না।",
      viva: "Load-এর কাছে voltage কম হওয়ার কারণ কী? উত্তর: Voltage drop, loose connection বা overloaded supply।",
    },
    {
      id: "high-voltage",
      category: "Power Fault",
      title: "High Voltage Fault",
      icon: "arrow-up-bold",
      summary: "Rated voltage-এর বেশি হলে ঝুঁকি।",
      full: "High voltage device insulation, capacitor, LED, motor ও electronics নষ্ট করতে পারে। Neutral issue, regulator fault, incorrect supply বা measurement error কারণ হতে পারে।",
      formula: "Actual voltage must remain within equipment rated range",
      test: "CAT-rated meter দিয়ে source, neutral-earth এবং load voltage compare করুন; meter function ও reference confirm করুন।",
      fault: "একাধিক circuit-এ high voltage হলে supply/neutral issue; একটি device-এ হলে local wiring/regulator fault সন্দেহ করুন।",
      action: "Equipment disconnect করে supply authority/qualified electrician ডাকুন; high voltage-এ test চালিয়ে যাবেন না।",
      viva: "High voltage-এর ফল কী? উত্তর: Insulation breakdown, overheating বা device damage।",
    },
    {
      id: "overload",
      category: "Power Fault",
      title: "Overload Fault",
      icon: "thermometer-alert",
      summary: "Circuit capacity-এর বেশি load।",
      full: "এক circuit-এ cable, socket বা breaker rating-এর বেশি load হলে current বাড়ে, voltage drop ও heating হয় এবং protection trip করতে পারে।",
      formula: "Load current ≈ Total Power ÷ Voltage",
      test: "Total load list করুন, clamp meter দিয়ে running current মাপুন এবং cable/protection rating মিলান।",
      fault: "Breaker trip, hot socket, burning smell, flickering light বা warm cable overload-এর লক্ষণ।",
      action: "Load ভাগ করুন, damaged connection repair করুন এবং cable/protection final selection code অনুযায়ী করুন।",
      viva: "Overload-এর সাধারণ লক্ষণ কী? উত্তর: Heating, voltage drop, trip ও burning smell।",
    },
    {
      id: "short",
      category: "Power Fault",
      title: "Short Circuit Fault",
      icon: "flash-alert",
      summary: "Phase-neutral বা line-line fault।",
      full: "Short circuit-এ resistance খুব কমে গিয়ে fault current দ্রুত বেড়ে যায়। Arc, spark, MCB trip, fuse blow বা PCB damage হতে পারে।",
      formula: "Fault current rises when circuit impedance falls",
      test: "Power isolate করে visual inspection, resistance/continuity এবং insulation test করুন; live short test করবেন না।",
      fault: "Switch on করলেই trip, burnt track, blown fuse বা flash দেখা short-এর লক্ষণ হতে পারে।",
      action: "Fault location isolate করুন; বারবার breaker reset বা fuse bypass করবেন না।",
      viva: "Short circuit-এ current কেন বেশি? উত্তর: Circuit impedance খুব কমে যায়।",
    },
    {
      id: "leakage",
      category: "Power Fault",
      title: "Earth Leakage Fault",
      icon: "water-alert",
      summary: "Current intended path ছেড়ে earth-এ যাওয়া।",
      full: "Insulation damage, moisture, faulty heater, motor winding বা filter capacitor-এর কারণে leakage current হতে পারে। RCCB/RCD trip করতে পারে।",
      formula: "Leakage current flows through unintended earth path",
      test: "RCCB test, insulation tester, clamp leakage measurement ও appliance isolation qualified person দিয়ে করুন।",
      fault: "RCCB বারবার trip, tingling metal body, wet equipment বা insulation low reading leakage-এর লক্ষণ।",
      action: "Equipment isolate করুন, water source বন্ধ করুন, insulation fault repair না হওয়া পর্যন্ত ব্যবহার করবেন না।",
      viva: "RCCB কী detect করে? উত্তর: Residual বা earth leakage current।",
    },
    {
      id: "no-power",
      category: "Troubleshooting",
      title: "Device একদম চালু হচ্ছে না",
      icon: "power-off",
      summary: "Dead device-এর systematic diagnosis।",
      full: "Device dead হলে আগে source, plug, fuse, switch, adapter output, input protection, regulator ও ground path ধাপে ধাপে পরীক্ষা করুন।",
      formula: "Source → Protection → Conversion → Control → Load",
      test: "Known-good supply, input voltage, fuse continuity, DC rail ও current draw পরীক্ষা করুন।",
      fault: "Open fuse, broken cord, dead adapter, reverse polarity, shorted regulator বা PCB track break হতে পারে।",
      action: "Power off tests থেকে শুরু করুন; component replace করার আগে root cause খুঁজুন।",
      viva: "Dead device-এ প্রথমে কী পরীক্ষা? উত্তর: Supply ও input path।",
    },
    {
      id: "tripping",
      category: "Troubleshooting",
      title: "MCB/RCCB বারবার Trip",
      icon: "shield-alert-outline",
      summary: "Protection trip-এর কারণ খোঁজা।",
      full: "Trip হওয়া protection কাজ করছে—এটি fault-এর signal। Overload, short circuit, leakage, faulty appliance বা wrong rating কারণ হতে পারে।",
      formula: "Trip cause must be found before reset",
      test: "সব load off করে reset, তারপর একে একে load connect করে observe করুন; leakage test qualified person দিয়ে করুন।",
      fault: "একটি appliance connect করলেই trip হলে appliance বা cord suspect; সব off থাকলেও trip হলে wiring/protection issue হতে পারে।",
      action: "Breaker বড় rating-এরটি দিয়ে বদলাবেন না; fault isolate করে repair করুন।",
      viva: "Trip হলে বারবার reset করা যায়? উত্তর: কারণ না জেনে নয়।",
    },
    {
      id: "flicker",
      category: "Troubleshooting",
      title: "Light Flicker বা Voltage Fluctuation",
      icon: "lightbulb-alert-outline",
      summary: "আলো কাঁপা বা brightness বদলানো।",
      full: "Flicker loose connection, neutral fault, overloaded circuit, LED driver issue, voltage fluctuation বা generator/inverter switching থেকে হতে পারে।",
      formula: "Stable supply + secure connection = stable light",
      test: "Different circuit-এ light check, source/load voltage record, terminal inspection ও known-good lamp test করুন।",
      fault: "একটি lamp-এ হলে lamp/driver; পুরো বাড়িতে হলে supply/neutral/connection issue সন্দেহ করুন।",
      action: "Burning smell বা hot terminal থাকলে supply isolate করুন; neutral fault বিশেষভাবে গুরুতর।",
      viva: "Flicker-এর একটি কারণ কী? উত্তর: Loose connection বা voltage fluctuation।",
    },
    {
      id: "heating",
      category: "Troubleshooting",
      title: "Cable, Plug বা Board গরম হওয়া",
      icon: "fire-alert",
      summary: "অস্বাভাবিক heating-এর root cause।",
      full: "Heating হতে পারে overload, loose terminal, undersized cable, high contact resistance, blocked ventilation বা component failure থেকে।",
      formula: "Heat loss ≈ I²R",
      test: "Load current, terminal tightness, voltage drop, thermal image/temperature এবং connector condition পরীক্ষা করুন।",
      fault: "এক জায়গায় বেশি গরম হলে loose/high-resistance joint; পুরো cable গরম হলে overload suspect করুন।",
      action: "Power isolate করুন, damaged connector replace করুন, correct cable/protection দিন।",
      viva: "I²R-এ current দ্বিগুণ হলে heat কীভাবে বদলায়? উত্তর: একই resistance-এ প্রায় চারগুণ হতে পারে।",
    },
    {
      id: "burning-smell",
      category: "Troubleshooting",
      title: "Burning Smell বা Smoke",
      icon: "smoke-detector-alert",
      summary: "আগুনের আগের warning sign।",
      full: "Burning plastic smell, smoke, blackened terminal বা crackling sound serious fault-এর লক্ষণ। Electrical fire হওয়ার আগেই ব্যবস্থা নিতে হবে।",
      formula: "Smoke/smell = Stop, Isolate, Inspect",
      test: "Safe হলে supply isolate করুন; power on রেখে visual inspection বা sniff test করবেন না।",
      fault: "Overload, short, loose contact, failed capacitor, motor winding বা PCB track burn হতে পারে।",
      action: "Equipment ব্যবহার বন্ধ, area নিরাপদ, appropriate emergency response এবং qualified repair।",
      viva: "Smoke দেখলে প্রথম কাজ কী? উত্তর: নিরাপদে supply isolate ও মানুষকে দূরে রাখা।",
    },
    {
      id: "motor-not-start",
      category: "Motor Fault",
      title: "Motor Start না হওয়া",
      icon: "engine-off-outline",
      summary: "Motor starting fault-এর ধাপ।",
      full: "Motor start না হলে supply phase, fuse/MCB, overload relay, starter, capacitor, winding, shaft jam ও control signal পরীক্ষা করতে হয়।",
      formula: "Start circuit → Protection → Winding → Mechanical load",
      test: "Isolated visual check, supply voltage, continuity, winding balance, capacitor ও shaft condition পরীক্ষা করুন।",
      fault: "Single phasing, weak capacitor, overload trip, seized bearing বা winding open/short হতে পারে।",
      action: "Repeated start attempt করবেন না; motor nameplate ও manufacturer procedure অনুসরণ করুন।",
      viva: "Motor start না হওয়ার একটি কারণ? উত্তর: Supply fault, capacitor fault বা mechanical jam।",
    },
    {
      id: "motor-overheat",
      category: "Motor Fault",
      title: "Motor Overheating",
      icon: "engine-outline",
      summary: "Motor বেশি গরম হওয়ার কারণ।",
      full: "Motor overheating হতে পারে overload, low/high voltage, single phasing, poor ventilation, bearing friction, frequent start বা winding fault থেকে।",
      formula: "Motor heat rises with overload and current",
      test: "Running current per phase, voltage balance, temperature, ventilation, vibration ও mechanical load পরীক্ষা করুন।",
      fault: "Current বেশি হলে overload বা winding; current imbalance হলে phase/connection/winding issue suspect করুন।",
      action: "Motor বন্ধ করে cool down দিন এবং cause না ঠিক করে আবার চালাবেন না।",
      viva: "Motor overheating-এর একটি কারণ কী? উত্তর: Overload বা ventilation সমস্যা।",
    },
    {
      id: "adapter-fault",
      category: "Electronics Fault",
      title: "Adapter Output নেই বা কম",
      icon: "power-plug-off",
      summary: "Adapter/charger fault finding।",
      full: "Adapter fault-এ input fuse, cable, rectifier, switching section, capacitor, regulator, connector ও shorted load পরীক্ষা করতে হয়।",
      formula: "Input → Rectifier/Switching → Transformer/Inductor → Rectifier → Regulator → Output",
      test: "Label পড়ে output polarity check, no-load voltage, known-good load ও cable continuity test করুন।",
      fault: "No output, pulsing output, high ripple, heating বা smell component failure-এর লক্ষণ হতে পারে।",
      action: "Mains SMPS খুলে repair করবেন না যদি trained না হন; safe replacement rating মেলান।",
      viva: "Adapter label-এ polarity কেন? উত্তর: Center-positive/negative ভুল হলে device damage হতে পারে।",
    },
    {
      id: "inverter-ups",
      category: "Power Electronics Fault",
      title: "Inverter/UPS Backup Fault",
      icon: "battery-sync-outline",
      summary: "Backup কম, alarm বা output নেই।",
      full: "UPS/inverter fault-এ battery age, charging voltage, load, fan, fuse, relay, inverter MOSFET, output waveform ও overload check করতে হয়।",
      formula: "Backup time ≈ Battery Wh × efficiency ÷ Load W",
      test: "Battery voltage under load, charging current, output voltage/frequency, alarm code ও load current record করুন।",
      fault: "Weak battery, overload, charging failure, thermal trip, relay fault বা output short হতে পারে।",
      action: "Battery short করবেন না; manufacturer service procedure ও correct replacement ব্যবহার করুন।",
      viva: "Backup time কমার একটি কারণ? উত্তর: Battery capacity কমে যাওয়া বা load বেড়ে যাওয়া।",
    },
    {
      id: "pcb-fault",
      category: "Electronics Fault",
      title: "PCB Fault Finding",
      icon: "developer-board",
      summary: "Board-এর track, component ও supply diagnosis।",
      full: "PCB troubleshooting-এ visual inspection, smell/heat check, power rail, ground short, regulator output, clock/signal এবং component isolation ধাপে ধাপে করা হয়।",
      formula: "Observe → Power → Ground → Signal → Component → Retest",
      test: "Power off resistance-to-ground, continuity, diode mode; power on হলে current limit supply ও rail voltage ব্যবহার করুন।",
      fault: "Cracked solder, broken track, shorted capacitor, failed regulator, reverse-polarity damage বা corrosion হতে পারে।",
      action: "Current-limited bench supply ব্যবহার করুন এবং powered board-এ probe slip থেকে short এড়ান।",
      viva: "PCB troubleshooting-এর প্রথম ধাপ? উত্তর: Visual inspection ও supply/ground check।",
    },
    {
      id: "diagnosis-flow",
      category: "Deep Troubleshooting",
      title: "Complete Fault Diagnosis Flow",
      icon: "map-marker-path",
      summary: "Symptom থেকে root cause পর্যন্ত।",
      full: "ভালো troubleshooting অনুমান করে component বদলানো নয়। Symptom লিখে, safe state তৈরি করে, block-by-block test করে root cause confirm করতে হয়।",
      formula: "Symptom → Hypothesis → Test → Evidence → Repair → Verify",
      test: "একবারে একটি variable পরিবর্তন করুন এবং প্রতিটি reading record করুন।",
      fault: "Guess করে parts change করলে fault লুকিয়ে থাকতে পারে এবং নতুন damage হতে পারে।",
      action: "Repair-এর পর একই load-এ retest, temperature/current observe এবং final safety inspection করুন।",
      viva: "Troubleshooting-এ evidence কেন? উত্তর: অনুমান নয়, measurement দিয়ে cause নিশ্চিত করার জন্য।",
    },
    {
      id: "power-quality",
      category: "Deep Troubleshooting",
      title: "Power Quality ও Harmonics",
      icon: "chart-bell-curve-cumulative",
      summary: "Noise, sag, surge, transient ও harmonic।",
      full: "Sensitive electronics-এ voltage sag, swell, surge, transient, frequency variation, noise ও harmonic সমস্যা করতে পারে। Power analyzer বা oscilloscope দিয়ে advanced diagnosis করা হয়।",
      formula: "Power quality issue must be correlated with time and load",
      test: "Event logger, voltage waveform, frequency, THD, neutral current ও load switching record করুন।",
      fault: "UPS alarm, LED flicker, overheating neutral, random reset বা communication error power quality issue-এর লক্ষণ হতে পারে।",
      action: "Surge protection, filtering বা correction design qualified engineer দিয়ে করুন; random capacitor ব্যবহার করবেন না।",
      viva: "Voltage sag কী? উত্তর: অল্প সময়ের জন্য voltage কমে যাওয়া।",
    },
    {
      id: "final-checklist",
      category: "Repair ও Verification",
      title: "Fault Repair-এর পর Final Checklist",
      icon: "clipboard-check-outline",
      summary: "Repair সত্যিই সফল কি না যাচাই।",
      full: "Repair শেষ মানেই কাজ শেষ নয়। Correct component, polarity, insulation, earth, protection, load current, temperature ও functional test যাচাই করতে হবে।",
      formula: "Repair + Safety test + Functional test + Record = Complete job",
      test: "Visual inspection, continuity/insulation as needed, no-load test, controlled load test এবং observation করুন।",
      fault: "Immediate success হলেও delayed heating, intermittent fault বা loose connection পরে সমস্যা করতে পারে।",
      action: "Test result লিখুন, cover/guard লাগান এবং user-কে safe operating instruction দিন।",
      viva: "Repair-এর পর retest কেন? উত্তর: Fault ফিরে আসেনি ও system safe আছে নিশ্চিত করতে।",
    },
  ];

  const GROUPS = [
    { id: "all", title: "সব বিষয়", icon: "view-grid-outline", color: "#D97706" },
    { id: "Power Basics", title: "Power Basics", icon: "flash-outline", color: "#2563EB" },
    { id: "Power ও Unit", title: "Power ও Unit", icon: "counter", color: "#D97706" },
    { id: "Load Analysis", title: "Load Analysis", icon: "format-list-bulleted", color: "#16A34A" },
    { id: "Energy Saving", title: "Energy Saving", icon: "power-sleep", color: "#059669" },
    { id: "AC Power", title: "AC Power", icon: "sine-wave", color: "#7C3AED" },
    { id: "Power Fault", title: "Power Fault", icon: "flash-alert", color: "#DC2626" },
    { id: "Troubleshooting", title: "Troubleshooting", icon: "tools", color: "#DB2777" },
    { id: "Motor Fault", title: "Motor Fault", icon: "engine-outline", color: "#B45309" },
    { id: "Electronics Fault", title: "Electronics Fault", icon: "developer-board", color: "#9333EA" },
    { id: "Power Electronics Fault", title: "Power Electronics", icon: "battery-sync-outline", color: "#0891B2" },
    { id: "Deep Troubleshooting", title: "Deep Troubleshooting", icon: "map-marker-path", color: "#7C3AED" },
    { id: "Repair ও Verification", title: "Repair Check", icon: "clipboard-check-outline", color: "#16A34A" },
  ];

  function App() {
    const [page, setPage] = useState("home");
    const [group, setGroup] = useState("all");
    const [search, setSearch] = useState("");
    const [topic, setTopic] = useState(null);
    const filtered = useMemo(() => {
      const q = search.trim().toLowerCase();
      return POWER_FAULT_TOPICS.filter((item) => {
        const byGroup = group === "all" || item.category === group;
        const text = `${item.title} ${item.summary} ${item.category}`.toLowerCase();
        return byGroup && (!q || text.includes(q));
      });
    }, [group, search]);

    if (page === "detail" && topic) return <TopicDetail topic={topic} onBack={() => { setTopic(null); setPage("topics"); }} />;
    if (page === "topics") return <Topics group={group} setGroup={setGroup} search={search} setSearch={setSearch} topics={filtered} onBack={() => setPage("home")} onOpen={(item) => { setTopic(item); setPage("detail"); }} />;
    return <Home onOpen={() => setPage("topics")} />;
  }

  function Home({ onOpen }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}><NavRow light={false} />
      <View style={styles.hero}><View style={styles.heroIcon}><MaterialCommunityIcons name="flash-outline" size={36} color="#FED7AA" /></View><Text style={styles.kicker}>POWER & DIAGNOSIS</Text><Text style={styles.heroTitle}>Power & Unit</Text><Text style={styles.heroText}>Watt, Unit, bill, load এবং deep troubleshooting—fault-এর মূল কারণ খুঁজুন।</Text></View>
      <Text style={styles.heading}>Power & Unit Troubleshooting</Text><Text style={styles.muted}>Power হিসাব থেকে device dead, trip, heating, flicker, motor ও PCB fault পর্যন্ত বিস্তারিত guide।</Text>
      <TouchableOpacity style={styles.startCard} onPress={onOpen} activeOpacity={0.85}><View style={styles.startIcon}><MaterialCommunityIcons name="tools" size={30} color="#FFFFFF" /></View><View style={{ flex: 1 }}><Text style={styles.startTitle}>Power & Fault Topics শুরু করুন</Text><Text style={styles.startText}>{POWER_FAULT_TOPICS.length}টি deep topic ও diagnosis guide</Text></View><MaterialCommunityIcons name="arrow-right" size={25} color="#FFFFFF" /></TouchableOpacity>
      <View style={styles.flow}><Text style={styles.flowTitle}>Fault Finding Flow</Text><View style={styles.flowRow}><Flow icon="eye-outline" text="Observe" /><MaterialCommunityIcons name="arrow-right" size={17} color="#D97706" /><Flow icon="flash-outline" text="Power" /><MaterialCommunityIcons name="arrow-right" size={17} color="#D97706" /><Flow icon="magnify" text="Test" /><MaterialCommunityIcons name="arrow-right" size={17} color="#D97706" /><Flow icon="check-circle" text="Verify" /></View></View>
      <View style={styles.info}><MaterialCommunityIcons name="shield-alert-outline" size={24} color="#9A3412" /><Text style={styles.infoText}>Power, mains, panel, motor ও PCB fault-এর live testing qualified person এবং proper instrument ছাড়া করবেন না।</Text></View>
    </ScrollView>;
  }
  function Flow({ icon, text }) { return <View style={styles.flowItem}><MaterialCommunityIcons name={icon} size={19} color="#B45309" /><Text style={styles.flowText}>{text}</Text></View>; }

  function Topics({ group, setGroup, search, setSearch, topics, onBack, onOpen }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}><Header title="Power & Fault" icon="tools" color="#D97706" onBack={onBack} /><View style={styles.search}><MaterialCommunityIcons name="magnify" size={21} color="#64748B" /><TextInput value={search} onChangeText={setSearch} placeholder="Power বা fault খুঁজুন..." placeholderTextColor="#94A3B8" style={styles.input} /></View><ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupScroll}>{GROUPS.map((item) => <TouchableOpacity key={item.id} onPress={() => setGroup(item.id)} style={[styles.groupChip, group === item.id && { backgroundColor: item.color, borderColor: item.color }]}><MaterialCommunityIcons name={item.icon} size={17} color={group === item.id ? "#FFFFFF" : item.color} /><Text style={[styles.chipText, group === item.id && { color: "#FFFFFF" }]}>{item.title}</Text></TouchableOpacity>)}</ScrollView><Text style={styles.heading}>Topic List ({topics.length})</Text>{topics.map((item, index) => <TouchableOpacity key={item.id} style={styles.topicCard} onPress={() => onOpen(item)} activeOpacity={0.8}><View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View><View style={styles.topicIcon}><MaterialCommunityIcons name={item.icon} size={23} color="#D97706" /></View><View style={{ flex: 1 }}><Text style={styles.topicTitle}>{item.title}</Text><Text style={styles.topicSummary}>{item.category} • {item.summary}</Text></View><MaterialCommunityIcons name="chevron-right" size={23} color="#D97706" /></TouchableOpacity>)}{!topics.length && <Text style={styles.empty}>কোনো topic পাওয়া যায়নি।</Text>}</ScrollView>;
  }

  function TopicDetail({ topic, onBack }) {
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}><Header title={topic.title} icon={topic.icon} color="#D97706" onBack={onBack} /><Text style={styles.badge}>{topic.category}</Text><Card title="Deep Explanation" icon="book-open-variant" color="#D97706"><Text style={styles.body}>{topic.full}</Text></Card><Card title="Formula / Flow" icon="function-variant" color="#2563EB" blue><Text style={styles.formula}>{topic.formula}</Text></Card><Card title="কীভাবে Test করবেন" icon="gauge" color="#0891B2" cyan><Text style={styles.body}>{topic.test}</Text></Card><Card title="সম্ভাব্য Fault" icon="alert-octagon" color="#DC2626" red><Text style={styles.body}>{topic.fault}</Text></Card><Card title="করণীয় / Diagnosis Direction" icon="tools" color="#16A34A" green><Text style={styles.body}>{topic.action}</Text></Card><Card title="Viva প্রশ্ন" icon="help-circle-outline" color="#7C3AED" purple><Text style={styles.body}>{topic.viva}</Text></Card><TouchableOpacity style={styles.backButtonLarge} onPress={onBack}><MaterialCommunityIcons name="arrow-left" size={20} color="#FFFFFF" /><Text style={styles.backLargeText}>Power & Fault List-এ ফিরে যান</Text></TouchableOpacity></ScrollView>;
  }
  function Header({ title, icon, color, onBack }) { return <View style={[styles.header, { backgroundColor: color }]}><NavRow onBack={onBack} /><View style={styles.headerRow}><MaterialCommunityIcons name={icon} size={31} color="#FFFFFF" /><Text style={styles.headerTitle}>{title}</Text></View></View>; }
  function Card({ title, icon, color, children, blue, cyan, red, green, purple }) { const backgroundColor = blue ? "#E0F2FE" : cyan ? "#CFFAFE" : red ? "#FEE2E2" : green ? "#F0FDF4" : purple ? "#F3E8FF" : "#FEF3C7"; return <View style={[styles.card, { backgroundColor, borderLeftColor: color }]}><View style={styles.cardTitleRow}><MaterialCommunityIcons name={icon} size={22} color={color} /><Text style={[styles.cardTitle, { color }]}>{title}</Text></View>{children}</View>; }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFCF5" }, content: { padding: 16, paddingBottom: 35 }, hero: { backgroundColor: "#451A03", borderRadius: 16, padding: 14, marginBottom: 10 }, heroIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#78350F", alignItems: "center", justifyContent: "center", marginBottom: 8 }, kicker: { color: "#FED7AA", fontSize: 11, fontWeight: "bold", letterSpacing: 1 }, heroTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginTop: 3 }, heroText: { color: "#FFEDD5", fontSize: 12, lineHeight: 18, marginTop: 6 }, heading: { color: "#0F172A", fontSize: 21, fontWeight: "bold", marginTop: 6, marginBottom: 6 }, muted: { color: "#64748B", fontSize: 14, lineHeight: 21, marginBottom: 16 }, startCard: { backgroundColor: "#D97706", borderRadius: 17, padding: 12, flexDirection: "row", alignItems: "center", marginBottom: 11 }, startIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#F59E0B", alignItems: "center", justifyContent: "center", marginRight: 13 }, startTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" }, startText: { color: "#FEF3C7", fontSize: 11, marginTop: 2 }, flow: { backgroundColor: "#FEF3C7", borderRadius: 15, padding: 15, marginBottom: 15 }, flowTitle: { color: "#92400E", fontWeight: "bold", fontSize: 15, marginBottom: 12 }, flowRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, flowItem: { alignItems: "center", flex: 1 }, flowText: { color: "#92400E", fontSize: 10, fontWeight: "bold", marginTop: 4 }, info: { backgroundColor: "#FFEDD5", borderRadius: 14, padding: 15, flexDirection: "row", alignItems: "flex-start" }, infoText: { color: "#9A3412", flex: 1, fontSize: 13, lineHeight: 20, marginLeft: 9 }, header: { borderRadius: 16, padding: 14, marginBottom: 10 }, back: { flexDirection: "row", alignItems: "center", marginBottom: 20 }, backText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold", marginLeft: 7 }, headerRow: { flexDirection: "row", alignItems: "center" }, headerTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginLeft: 9, flex: 1 }, search: { height: 50, backgroundColor: "#FFFFFF", borderRadius: 13, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 12 }, input: { flex: 1, color: "#1E293B", fontSize: 15, marginLeft: 8 }, groupScroll: { marginBottom: 14 }, groupChip: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 20, paddingVertical: 9, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", marginRight: 8 }, chipText: { color: "#334155", fontSize: 12, marginLeft: 5 }, topicCard: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 12, marginBottom: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0" }, number: { width: 29, height: 29, borderRadius: 15, backgroundColor: "#D97706", alignItems: "center", justifyContent: "center", marginRight: 9 }, numberText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 }, topicIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center", marginRight: 10 }, topicTitle: { color: "#0F172A", fontSize: 15, fontWeight: "bold" }, topicSummary: { color: "#64748B", fontSize: 11, lineHeight: 17, marginTop: 3 }, empty: { color: "#64748B", textAlign: "center", marginTop: 30 }, badge: { alignSelf: "flex-start", color: "#92400E", backgroundColor: "#FEF3C7", borderRadius: 15, paddingVertical: 6, paddingHorizontal: 11, fontSize: 12, fontWeight: "bold", marginBottom: 12 }, card: { borderRadius: 15, padding: 16, marginBottom: 12, borderLeftWidth: 5 }, cardTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 9 }, cardTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 8 }, body: { color: "#334155", fontSize: 14, lineHeight: 22 }, formula: { color: "#1D4ED8", fontSize: 15, lineHeight: 24, fontWeight: "bold" }, backButtonLarge: { backgroundColor: "#D97706", borderRadius: 11, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4 }, backLargeText: { color: "#FFFFFF", fontWeight: "bold", marginLeft: 7 },
  });

  return App;
})();

/*
==================================================
MODULE: quiz_progress_integrated_app.js
==================================================
*/
const QuizProgressModule = (() => {
  /* =====================================================
     RANDOM QUIZ + MY PROGRESS REAL DATA INTEGRATION
     Quiz শেষ হলে ফলাফল AsyncStorage-এ save হয় এবং Progress
     screen সেই real data থেকে automatic update হয়।
     ===================================================== */
  const STORAGE_KEY = "electrical_learning_progress_v1";
  const QUIZ_LENGTH = 10;
  const TIME_LIMIT = 20;

  const QUESTION_BANK = [
    { id: 1, category: "Electrical", q: "Ohm’s Law-এর সঠিক সূত্র কোনটি?", options: ["P = V × I","V = I × R","Q = C × V","E = P × t"], answer: 1, explain: "Ohm’s Law হলো V = I × R।" },
    { id: 2, category: "Electrical", q: "Series circuit-এ কোনটি সাধারণত একই থাকে?", options: ["Voltage","Current","Resistance","Power"], answer: 1, explain: "Series path-এ একই current প্রবাহিত হয়।" },
    { id: 3, category: "Electronics", q: "LED-এর পূর্ণরূপ কী?", options: ["Light Energy Device","Light Emitting Diode","Low Electrical Diode","Linear Emitting Display"], answer: 1, explain: "LED = Light Emitting Diode।" },
    { id: 4, category: "Electronics", q: "Capacitance-এর unit কী?", options: ["Farad","Ohm","Tesla","Watt"], answer: 0, explain: "Capacitance Farad (F)-এ মাপা হয়।" },
    { id: 5, category: "Calculation", q: "1 Unit বিদ্যুৎ কত?", options: ["1 Watt","1 Volt","1 kWh","1 Ampere"], answer: 2, explain: "বিদ্যুৎ বিলের 1 Unit সাধারণত 1 kWh।" },
    { id: 6, category: "Calculation", q: "Power-এর basic formula কোনটি?", options: ["P = V × I","P = R ÷ I","P = C × V","P = f × L"], answer: 0, explain: "Basic electrical power P = V × I।" },
    { id: 7, category: "Safety", q: "Electric shock victim-কে touch করার আগে কী করবেন?", options: ["সরাসরি টানবেন","Supply isolate করবেন","পানি ঢালবেন","দৌড়ে যাবেন"], answer: 1, explain: "প্রথমে electrical source isolate করে নিজের safety নিশ্চিত করতে হয়।" },
    { id: 8, category: "Safety", q: "Electrical fire-এ কোনটি ব্যবহার করা উচিত নয়?", options: ["সঠিক extinguisher","Emergency service","পানি","Supply isolation"], answer: 2, explain: "Energized electrical fire-এ পানি ব্যবহার করবেন না।" },
    { id: 9, category: "Measurement", q: "Black multimeter lead সাধারণত কোথায় থাকে?", options: ["10A port","COM port","V-only port","Fuse port"], answer: 1, explain: "Black lead সাধারণত COM port-এ থাকে।" },
    { id: 10, category: "Measurement", q: "Voltage মাপার সময় probes কীভাবে যুক্ত হয়?", options: ["Series","Parallel","শুধু earth-এ","Open circuit"], answer: 1, explain: "Voltage source-এর across parallel-এ measure করা হয়।" },
    { id: 11, category: "Power/Fault", q: "Overload-এর একটি সাধারণ লক্ষণ কোনটি?", options: ["Cable heating","Zero current","Brightness বাড়া","No temperature"], answer: 0, explain: "Overload-এ cable heating, voltage drop বা trip হতে পারে।" },
    { id: 12, category: "Power/Fault", q: "MCB বারবার trip করলে কী করা উচিত?", options: ["বড় MCB লাগানো","Wire bypass","Fault-এর কারণ খোঁজা","বারবার reset"], answer: 2, explain: "Trip fault-এর signal; কারণ না জেনে reset করা unsafe।" },
    { id: 13, category: "Power/Fault", q: "Troubleshooting-এর সঠিক flow কোনটি?", options: ["Guess → Replace all","Observe → Test → Repair → Verify","Reset → Ignore","Open → Touch → Guess"], answer: 1, explain: "Evidence-based troubleshooting জরুরি।" },
    { id: 14, category: "Electrical", q: "Fuse-এর প্রধান কাজ কী?", options: ["Voltage বাড়ানো","অতিরিক্ত current-এ circuit বিচ্ছিন্ন করা","Frequency কমানো","Battery charge করা"], answer: 1, explain: "Fuse overcurrent হলে circuit open করে।" },
    { id: 15, category: "Electronics", q: "Diode সাধারণত current কীভাবে যেতে দেয়?", options: ["দুই দিকেই","একদিকে","কোনো দিকেই নয়","শুধু AC-তে"], answer: 1, explain: "সাধারণ diode forward direction-এ conduct করে।" },
    { id: 16, category: "Electrical", q: "Voltage-এর একক কী?", options: ["Ampere","Ohm","Volt","Watt"], answer: 2, explain: "Voltage-এর SI unit হলো Volt (V)।" },
    { id: 17, category: "Electrical", q: "Current মাপার একক কোনটি?", options: ["Ampere","Volt","Farad","Henry"], answer: 0, explain: "Electric current Ampere (A)-এ মাপা হয়।" },
    { id: 18, category: "Electrical", q: "Parallel circuit-এ প্রতিটি branch-এ কোনটি সাধারণত সমান থাকে?", options: ["Voltage","Current","Resistance","Power factor"], answer: 0, explain: "Parallel branch-গুলোর across voltage সমান থাকে।" },
    { id: 19, category: "Electronics", q: "Capacitor-এর capacitance-এর unit কী?", options: ["Farad","Ohm","Tesla","Watt"], answer: 0, explain: "Capacitance Farad (F)-এ মাপা হয়।" },
    { id: 20, category: "Electronics", q: "MOSFET মূলত কী দিয়ে control হয়?", options: ["Gate-source voltage","শুধু temperature","Mechanical pressure","Water pressure"], answer: 0, explain: "MOSFET-এর conduction Gate-source voltage দিয়ে control হয়।" },
    { id: 21, category: "Electronics", q: "Relay-এর NO-এর অর্থ কী?", options: ["New Output","Normally Open","Neutral Output","No Operation"], answer: 1, explain: "NO = Normally Open।" },
    { id: 22, category: "Electronics", q: "PCB-এর পূর্ণরূপ কী?", options: ["Power Control Box","Printed Circuit Board","Primary Current Bus","Program Circuit Battery"], answer: 1, explain: "PCB = Printed Circuit Board।" },
    { id: 23, category: "Calculation", q: "100W device 10 ঘণ্টা চললে energy কত?", options: ["0.1 kWh","1 kWh","10 kWh","100 kWh"], answer: 1, explain: "100W = 0.1kW; 0.1 × 10 = 1kWh।" },
    { id: 24, category: "Calculation", q: "Voltage divider-এর formula কোনটি?", options: ["Vout = Vin × R2/(R1+R2)","Vout = I × C","Vout = P × t","Vout = f × L"], answer: 0, explain: "দুই resistor divider-এ Vout = Vin × R2/(R1+R2)।" },
    { id: 25, category: "Calculation", q: "Efficiency-এর formula কী?", options: ["Input/Output × 100","Output/Input × 100","V × I × R","R/I × 100"], answer: 1, explain: "Efficiency(%) = Output power ÷ Input power × 100।" },
    { id: 26, category: "Safety", q: "Resistance মাপার আগে কী করতে হয়?", options: ["Power on করতে হয়","Power off ও capacitor discharge","Fuse bypass","Voltage বাড়ানো"], answer: 1, explain: "Resistance test সবসময় de-energized circuit-এ করতে হয়।" },
    { id: 27, category: "Safety", q: "RCCB সাধারণত কী detect করে?", options: ["Leakage current","শুধু frequency","শুধু temperature","শুধু light"], answer: 0, explain: "RCCB residual বা earth leakage current detect করে।" },
    { id: 28, category: "Measurement", q: "Current মাপার সবচেয়ে নিরাপদ সহজ পদ্ধতিগুলোর একটি কোনটি?", options: ["Clamp meter","Resistance mode","Capacitance mode","Diode mode"], answer: 0, explain: "Clamp meter circuit না খুলে current measure করতে পারে।" },
    { id: 29, category: "Measurement", q: "Continuity beep সাধারণত কী বোঝায়?", options: ["High voltage","Low-resistance path","Battery empty","Overheating"], answer: 1, explain: "Continuity beep low-resistance conductive path নির্দেশ করে।" },
    { id: 30, category: "Measurement", q: "Megger কী মাপে?", options: ["Insulation resistance","Sound level","Light intensity","Humidity"], answer: 0, explain: "Megger insulation resistance test-এর জন্য ব্যবহৃত হয়।" },
    { id: 31, category: "Power/Fault", q: "Heat loss-এর সঙ্গে কোন সম্পর্কটি সঠিক?", options: ["I²R","V/I²","C/f","P−t"], answer: 0, explain: "Resistive heating প্রায় I²R-এর সঙ্গে সম্পর্কিত।" },
    { id: 32, category: "Power/Fault", q: "Device একদম চালু না হলে প্রথমে কী check করা উচিত?", options: ["Case color","Supply ও input path","শুধু speaker","শুধু display"], answer: 1, explain: "Dead device diagnosis supply থেকে শুরু করা হয়।" },
    { id: 33, category: "Power/Fault", q: "Motor overheating-এর কারণ কোনটি হতে পারে?", options: ["Overload","সঠিক ventilation সবসময়","Zero current","শুধু clean label"], answer: 0, explain: "Overload, low voltage, single phasing ও poor ventilation motor গরম করতে পারে।" },
    { id: 34, category: "Calculation", q: "এই diagram-এ 1kΩ resistor-এর দুই পাশে 5V দিলে current কত?", options: ["0.5mA","5mA","50mA","500mA"], answer: 1, explain: "I = V/R = 5V/1000Ω = 0.005A = 5mA।" },
  ];
  const CATEGORIES = ["সব বিষয়", "Electrical", "Electronics", "Calculation", "Safety", "Measurement", "Power/Fault"];
  const emptyProgress = { quizzes: [], totalQuestions: 0, correctAnswers: 0, currentStreak: 0, bestStreak: 0, lastQuizDate: null };

  function App({ initialScreen = "home" } = {}) {
    const [screen, setScreen] = useState(initialScreen);
    const goHome = React.useContext(HomeContext);
    const [progress, setProgress] = useState(emptyProgress);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("সব বিষয়");
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(TIME_LIMIT);
    const [lastResult, setLastResult] = useState(null);

    useEffect(() => { loadProgress(); }, []);
    async function loadProgress() {
      try { const saved = await AsyncStorage.getItem(STORAGE_KEY); if (saved) setProgress({ ...emptyProgress, ...JSON.parse(saved) }); }
      catch (error) { console.log("Progress load error", error); }
      finally { setLoading(false); }
    }
    async function saveProgress(next) {
      setProgress(next);
      try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
      catch (error) { console.log("Progress save error", error); }
    }
    function shuffle(list) { return [...list].sort(() => Math.random() - 0.5); }
    function startQuiz() {
      const pool = category === "সব বিষয়" ? QUESTION_BANK : QUESTION_BANK.filter((q) => q.category === category);
      setQuestions(shuffle(pool).slice(0, Math.min(QUIZ_LENGTH, pool.length)));
      setIndex(0); setSelected(null); setAnswered(false); setAnswers([]); setScore(0); setTime(TIME_LIMIT); setScreen("quiz");
    }
    function answerQuestion(choice, timedOut = false) {
      if (answered) return;
      const question = questions[index];
      const correct = !timedOut && choice === question.answer;
      setSelected(timedOut ? null : choice); setAnswered(true); setAnswers((old) => [...old, { questionId: question.id, category: question.category, correct, choice }]);
      if (correct) setScore((value) => value + 1);
    }
    async function finishQuiz() {
      const finalScore = score;
      const total = questions.length;
      const result = { id: Date.now(), date: today(), score: finalScore, total, accuracy: total ? Math.round((finalScore / total) * 100) : 0, category, answers };
      const nextProgress = updateProgress(progress, result);
      await saveProgress(nextProgress); setLastResult(result); setScreen("result");
    }
    function nextQuestion() { if (index >= questions.length - 1) finishQuiz(); else { setIndex((value) => value + 1); setSelected(null); setAnswered(false); setTime(TIME_LIMIT); } }
    function resetData() { const next = { ...emptyProgress }; saveProgress(next); }

    useEffect(() => { if (screen !== "quiz" || answered) return undefined; const timer = setInterval(() => setTime((value) => { if (value <= 1) { clearInterval(timer); answerQuestion(-1, true); return 0; } return value - 1; }), 1000); return () => clearInterval(timer); }, [screen, index, answered]);
    if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color="#7C3AED" /><Text style={styles.loadingText}>Progress loading...</Text></View>;
    if (screen === "quiz" && questions.length) return <QuizScreen question={questions[index]} index={index} total={questions.length} time={time} selected={selected} answered={answered} score={score} onAnswer={answerQuestion} onNext={nextQuestion} onBack={() => setScreen("home")} />;
    if (screen === "result" && lastResult) return <ResultScreen result={lastResult} onProgress={() => setScreen("progress")} onHome={() => setScreen("home")} />;
    if (screen === "progress") return <ProgressScreen progress={progress} onBack={() => (initialScreen === "progress" ? goHome() : setScreen("home"))} onReset={resetData} />;
    return <Home progress={progress} category={category} setCategory={setCategory} onStart={startQuiz} onProgress={() => setScreen("progress")} />;
  }

  function updateProgress(old, result) {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); const yesterdayKey = formatDate(yesterday); const todayKey = result.date;
    const streak = old.lastQuizDate === yesterdayKey ? old.currentStreak + 1 : old.lastQuizDate === todayKey ? old.currentStreak : 1;
    return { totalQuestions: old.totalQuestions + result.total, correctAnswers: old.correctAnswers + result.score, currentStreak: streak, bestStreak: Math.max(old.bestStreak, streak), lastQuizDate: todayKey, quizzes: [result, ...(old.quizzes || [])].slice(0, 20) };
  }
  function today() { return formatDate(new Date()); }
  function formatDate(date) { return date.toISOString().slice(0, 10); }
  function accuracy(progress) { return progress.totalQuestions ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100) : 0; }

  function Home({ progress, category, setCategory, onStart, onProgress }) {
    const acc = accuracy(progress); return <ScrollView style={styles.container} contentContainerStyle={styles.content}><NavRow light={false} /><View style={styles.hero}><MaterialCommunityIcons name="school-outline" size={38} color="#FDE68A" /><Text style={styles.kicker}>ELECTRICAL LEARNING APP</Text><Text style={styles.heroTitle}>Quiz + Progress</Text><Text style={styles.heroText}>Quiz দিন, result save হবে এবং My Progress automatic update হবে।</Text></View><View style={styles.quickStats}><Quick title="Quiz" value={progress.quizzes.length} icon="help-circle-outline" /><Quick title="Accuracy" value={`${acc}%`} icon="target" /><Quick title="Streak" value={progress.currentStreak} icon="fire" /></View><Text style={styles.sectionTitle}>Quiz Topic নির্বাচন করুন</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>{CATEGORIES.map((item) => <TouchableOpacity key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.activeChip]}><Text style={[styles.chipText, category === item && styles.activeText]}>{item}</Text></TouchableOpacity>)}</ScrollView><TouchableOpacity style={styles.start} onPress={onStart}><MaterialCommunityIcons name="play-circle" size={25} color="#FFFFFF" /><Text style={styles.startText}>Random Quiz শুরু করুন</Text></TouchableOpacity><TouchableOpacity style={styles.progressButton} onPress={onProgress}><MaterialCommunityIcons name="chart-line" size={24} color="#2563EB" /><View style={{ flex: 1 }}><Text style={styles.progressTitle}>My Progress</Text><Text style={styles.progressSub}>Score, accuracy, streak ও recent result</Text></View><MaterialCommunityIcons name="arrow-right" size={22} color="#2563EB" /></TouchableOpacity><View style={styles.note}><MaterialCommunityIcons name="database-check-outline" size={23} color="#166534" /><Text style={styles.noteText}>Real data AsyncStorage-এ save হচ্ছে। App বন্ধ করে আবার খুললেও progress থাকবে।</Text></View></ScrollView>;
  }
  function Quick({ title, value, icon }) { return <View style={styles.quick}><MaterialCommunityIcons name={icon} size={23} color="#7C3AED" /><Text style={styles.quickValue}>{value}</Text><Text style={styles.quickTitle}>{title}</Text></View>; }

  function QuizScreen({ onBack, question, index, total, time, selected, answered, score, onAnswer, onNext }) { return <ScrollView style={styles.container} contentContainerStyle={styles.content}><NavRow light={false} onBack={onBack} /><View style={styles.quizTop}><View><Text style={styles.category}>{question.category}</Text><Text style={styles.questionNo}>প্রশ্ন {index + 1}/{total}</Text></View><View style={[styles.timer, time <= 5 && styles.timerDanger]}><MaterialCommunityIcons name="timer-outline" size={18} color={time <= 5 ? "#FFFFFF" : "#7C3AED"} /><Text style={[styles.timerText, time <= 5 && styles.white]}>{answered ? "Done" : `${time}s`}</Text></View></View><View style={styles.progressBg}><View style={[styles.progressFill, { width: `${((index + 1) / total) * 100}%` }]} /></View><Text style={styles.scoreLive}>Current score: {score}</Text><View style={styles.questionCard}><Text style={styles.question}>{question.q}</Text></View>{question.options.map((option, i) => { const correct = i === question.answer; const chosen = i === selected; return <TouchableOpacity key={option} disabled={answered} onPress={() => onAnswer(i)} style={[styles.option, answered && correct && styles.correct, answered && chosen && !correct && styles.wrong]}><View style={styles.optionLetter}><Text style={styles.letter}>{String.fromCharCode(65 + i)}</Text></View><Text style={styles.optionText}>{option}</Text>{answered && correct && <MaterialCommunityIcons name="check-circle" size={21} color="#16A34A" />}</TouchableOpacity>; })}{answered && <View style={styles.explain}><MaterialCommunityIcons name={selected === question.answer ? "check-circle" : "information"} size={22} color={selected === question.answer ? "#16A34A" : "#B45309"} /><Text style={styles.explainText}>{selected === question.answer ? "সঠিক! " : selected === null ? "সময় শেষ। " : "ভুল। "}{question.explain}</Text></View>}{answered && <TouchableOpacity style={styles.next} onPress={onNext}><Text style={styles.nextText}>{index === total - 1 ? "Result Save করুন" : "পরের প্রশ্ন"}</Text><MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" /></TouchableOpacity>}</ScrollView>; }

  function ResultScreen({ result, onProgress, onHome }) { return <ScrollView style={styles.container} contentContainerStyle={styles.content}><NavRow light={false} onBack={onHome} /><View style={styles.resultHero}><MaterialCommunityIcons name={result.accuracy >= 80 ? "trophy" : "medal-outline"} size={57} color="#FFFFFF" /><Text style={styles.resultTitle}>Result Saved!</Text><Text style={styles.resultScore}>{result.score}/{result.total}</Text><Text style={styles.resultAccuracy}>{result.accuracy}% Accuracy</Text></View><View style={styles.saved}><MaterialCommunityIcons name="database-check" size={25} color="#16A34A" /><Text style={styles.savedText}>এই result My Progress-এ save হয়েছে।</Text></View><TouchableOpacity style={styles.progressButton} onPress={onProgress}><MaterialCommunityIcons name="chart-line" size={24} color="#2563EB" /><View style={{ flex: 1 }}><Text style={styles.progressTitle}>My Progress দেখুন</Text><Text style={styles.progressSub}>এই Quiz-এর real score ও accuracy update হয়েছে</Text></View><MaterialCommunityIcons name="arrow-right" size={22} color="#2563EB" /></TouchableOpacity><TouchableOpacity style={styles.homeOutline} onPress={onHome}><Text style={styles.homeText}>Quiz-এর শুরুতে ফিরে যান</Text></TouchableOpacity></ScrollView>; }

  function ProgressScreen({ progress, onBack, onReset }) { const acc = accuracy(progress); const sectionStats = sectionData(progress); return <ScrollView style={styles.container} contentContainerStyle={styles.content}><NavRow light={false} onBack={onBack} /><View style={styles.progressHeader}><Text style={styles.progressHeaderTitle}>My Progress</Text></View><View style={styles.profile}><View style={styles.avatar}><MaterialCommunityIcons name="account-school-outline" size={32} color="#FFFFFF" /></View><View style={{ flex: 1 }}><Text style={styles.profileTitle}>Your Learning Dashboard</Text><Text style={styles.profileSub}>Quiz-এর real data থেকে update হয়েছে</Text></View><View style={styles.level}><Text style={styles.levelSmall}>LEVEL</Text><Text style={styles.levelBig}>{Math.min(99, Math.floor(progress.quizzes.length / 3) + 1).toString().padStart(2, "0")}</Text></View></View><View style={styles.statGrid}><Stat title="মোট Quiz" value={progress.quizzes.length} icon="help-circle-outline" color="#7C3AED" /><Stat title="Accuracy" value={`${acc}%`} icon="target" color="#16A34A" /><Stat title="Questions" value={progress.totalQuestions} icon="format-list-numbered" color="#0284C7" /><Stat title="Best Streak" value={progress.bestStreak} icon="fire" color="#EA580C" /></View><View style={styles.streak}><MaterialCommunityIcons name="fire" size={29} color="#EA580C" /><View style={{ flex: 1, marginLeft: 10 }}><Text style={styles.streakTitle}>{progress.currentStreak} দিনের current streak</Text><Text style={styles.streakSub}>Best streak: {progress.bestStreak} দিন</Text></View></View><Text style={styles.heading}>Section-wise Real Progress</Text>{sectionStats.map((item) => <View key={item.name} style={styles.section}><View style={[styles.sectionIcon, { backgroundColor: `${item.color}20` }]}><MaterialCommunityIcons name={item.icon} size={22} color={item.color} /></View><View style={{ flex: 1 }}><View style={styles.sectionTop}><Text style={styles.sectionName}>{item.name}</Text><Text style={[styles.sectionScore, { color: item.color }]}>{item.total ? Math.round(item.correct / item.total * 100) : 0}%</Text></View><Text style={styles.sectionSub}>{item.total} questions • {item.correct} correct</Text><View style={styles.progressBg}><View style={[styles.progressFill, { backgroundColor: item.color, width: `${item.total ? (item.correct / item.total) * 100 : 0}%` }]} /></View></View></View>)}<Text style={styles.heading}>Recent Quiz Results</Text>{(progress.quizzes.length ? progress.quizzes : []).slice(0, 8).map((item) => <View key={item.id} style={styles.recent}><MaterialCommunityIcons name="clipboard-check-outline" size={24} color="#7C3AED" /><View style={{ flex: 1, marginLeft: 10 }}><Text style={styles.recentTitle}>{item.category} Quiz</Text><Text style={styles.recentSub}>{item.date} • {item.total} questions</Text></View><Text style={styles.recentScore}>{item.score}/{item.total}</Text></View>)}{!progress.quizzes.length && <Text style={styles.empty}>এখনও কোনো Quiz result নেই।</Text>}<View style={styles.badges}><Text style={styles.heading}>Badges</Text><Badge unlocked={progress.quizzes.length >= 1} icon="flag-checkered" title="First Quiz" /><Badge unlocked={acc >= 80} icon="trophy" title="Score Master" /><Badge unlocked={progress.bestStreak >= 7} icon="fire" title="7 Day Streak" /></View><TouchableOpacity style={styles.reset} onPress={onReset}><MaterialCommunityIcons name="delete-outline" size={19} color="#DC2626" /><Text style={styles.resetText}>Demo progress reset করুন</Text></TouchableOpacity></ScrollView>; }
  function sectionData(progress) { const names = [{ name: "Electrical", icon: "flash-outline", color: "#0284C7" }, { name: "Electronics", icon: "chip", color: "#9333EA" }, { name: "Calculation", icon: "calculator-variant", color: "#16A34A" }, { name: "Safety", icon: "shield-check", color: "#EA580C" }, { name: "Measurement", icon: "gauge", color: "#0891B2" }, { name: "Power/Fault", icon: "tools", color: "#D97706" }]; return names.map((item) => { const rows = progress.quizzes.flatMap((q) => q.answers || []).filter((a) => a.category === item.name); return { ...item, total: rows.length, correct: rows.filter((a) => a.correct).length }; }); }
  function Stat({ title, value, icon, color }) { return <View style={styles.stat}><MaterialCommunityIcons name={icon} size={22} color={color} /><Text style={[styles.statValue, { color }]}>{value}</Text><Text style={styles.statTitle}>{title}</Text></View>; }
  function Badge({ unlocked, icon, title }) { return <View style={[styles.badge, !unlocked && styles.locked]}><MaterialCommunityIcons name={unlocked ? icon : "lock-outline"} size={23} color={unlocked ? "#D97706" : "#94A3B8"} /><Text style={[styles.badgeTextSmall, !unlocked && styles.lockedText]}>{title}</Text></View>; }

  const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#FBFAFF" }, content: { padding: 16, paddingBottom: 35 }, loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FBFAFF" }, loadingText: { color: "#64748B", marginTop: 10 }, hero: { backgroundColor: "#2E1065", borderRadius: 16, padding: 14, marginBottom: 10 }, kicker: { color: "#FDE68A", fontSize: 11, fontWeight: "bold", letterSpacing: 1, marginTop: 12 }, heroTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginTop: 3 }, heroText: { color: "#EDE9FE", lineHeight: 21, marginTop: 9 }, quickStats: { backgroundColor: "#FFFFFF", borderRadius: 15, padding: 13, flexDirection: "row", justifyContent: "space-around", marginBottom: 18 }, quick: { alignItems: "center" }, quickValue: { color: "#0F172A", fontSize: 21, fontWeight: "bold", marginTop: 3 }, quickTitle: { color: "#64748B", fontSize: 11 }, sectionTitle: { color: "#0F172A", fontSize: 17, fontWeight: "bold", marginBottom: 10 }, chips: { marginBottom: 15 }, chip: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 20, paddingVertical: 10, paddingHorizontal: 13, marginRight: 8 }, activeChip: { backgroundColor: "#7C3AED", borderColor: "#7C3AED" }, chipText: { color: "#475569", fontSize: 12 }, activeText: { color: "#FFFFFF", fontWeight: "bold" }, start: { backgroundColor: "#7C3AED", borderRadius: 12, padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 12 }, startText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold", marginLeft: 8 }, progressButton: { backgroundColor: "#DBEAFE", borderRadius: 14, padding: 15, flexDirection: "row", alignItems: "center", marginBottom: 12 }, progressTitle: { color: "#1D4ED8", fontSize: 15, fontWeight: "bold" }, progressSub: { color: "#2563EB", fontSize: 11, marginTop: 3 }, note: { backgroundColor: "#DCFCE7", borderRadius: 13, padding: 14, flexDirection: "row" }, noteText: { color: "#166534", flex: 1, fontSize: 12, lineHeight: 18, marginLeft: 8 }, quizTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, category: { color: "#7C3AED", fontWeight: "bold", fontSize: 12 }, questionNo: { color: "#0F172A", fontSize: 22, fontWeight: "bold", marginTop: 4 }, timer: { backgroundColor: "#EDE9FE", borderRadius: 20, padding: 9, flexDirection: "row", alignItems: "center" }, timerDanger: { backgroundColor: "#DC2626" }, timerText: { color: "#7C3AED", fontWeight: "bold", marginLeft: 4 }, white: { color: "#FFFFFF" }, progressBg: { height: 7, backgroundColor: "#E2E8F0", borderRadius: 7, overflow: "hidden", marginVertical: 14 }, progressFill: { height: 7, borderRadius: 7 }, scoreLive: { color: "#64748B", fontWeight: "bold", marginBottom: 11 }, questionCard: { backgroundColor: "#7C3AED", borderRadius: 17, padding: 20, marginBottom: 15 }, question: { color: "#FFFFFF", fontSize: 19, lineHeight: 28, fontWeight: "bold" }, option: { backgroundColor: "#FFFFFF", borderRadius: 13, padding: 13, flexDirection: "row", alignItems: "center", marginBottom: 9, borderWidth: 1, borderColor: "#E2E8F0" }, correct: { backgroundColor: "#DCFCE7", borderColor: "#86EFAC" }, wrong: { backgroundColor: "#FEE2E2", borderColor: "#FCA5A5" }, optionLetter: { width: 31, height: 31, borderRadius: 16, backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center", marginRight: 9 }, letter: { color: "#5B21B6", fontWeight: "bold" }, optionText: { flex: 1, color: "#334155", fontSize: 14 }, explain: { backgroundColor: "#FEF3C7", borderRadius: 12, padding: 13, flexDirection: "row", marginTop: 4 }, explainText: { color: "#92400E", flex: 1, fontSize: 13, lineHeight: 19, marginLeft: 8 }, next: { backgroundColor: "#7C3AED", borderRadius: 11, padding: 15, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 12 }, nextText: { color: "#FFFFFF", fontWeight: "bold", marginRight: 7 }, resultHero: { backgroundColor: "#7C3AED", borderRadius: 22, padding: 25, alignItems: "center", marginBottom: 15 }, resultTitle: { color: "#FFFFFF", fontSize: 25, fontWeight: "bold", marginTop: 8 }, resultScore: { color: "#FFFFFF", fontSize: 48, fontWeight: "bold", marginTop: 17 }, resultAccuracy: { color: "#EDE9FE", fontWeight: "bold" }, saved: { backgroundColor: "#DCFCE7", borderRadius: 13, padding: 14, flexDirection: "row", alignItems: "center", marginBottom: 14 }, savedText: { color: "#166534", fontWeight: "bold", marginLeft: 8 }, homeOutline: { borderWidth: 1, borderColor: "#C4B5FD", borderRadius: 12, padding: 14, alignItems: "center" }, homeText: { color: "#7C3AED", fontWeight: "bold" }, progressHeader: { backgroundColor: "#2563EB", borderRadius: 20, padding: 20, flexDirection: "row", alignItems: "center", marginBottom: 16 }, progressHeaderTitle: { color: "#FFFFFF", fontSize: 25, fontWeight: "bold", marginLeft: 13 }, profile: { backgroundColor: "#FFFFFF", borderRadius: 15, padding: 14, flexDirection: "row", alignItems: "center", marginBottom: 13 }, avatar: { width: 55, height: 55, borderRadius: 28, backgroundColor: "#2563EB", alignItems: "center", justifyContent: "center", marginRight: 11 }, profileTitle: { color: "#0F172A", fontWeight: "bold", fontSize: 15 }, profileSub: { color: "#64748B", fontSize: 11, marginTop: 4 }, level: { backgroundColor: "#DBEAFE", borderRadius: 10, padding: 8, alignItems: "center" }, levelSmall: { color: "#2563EB", fontSize: 8, fontWeight: "bold" }, levelBig: { color: "#1D4ED8", fontSize: 19, fontWeight: "bold" }, statGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }, stat: { backgroundColor: "#FFFFFF", width: "48%", borderRadius: 13, padding: 13, marginBottom: 10 }, statValue: { fontSize: 23, fontWeight: "bold", marginTop: 5 }, statTitle: { color: "#64748B", fontSize: 11, marginTop: 2 }, streak: { backgroundColor: "#FFF7ED", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", marginBottom: 17 }, streakTitle: { color: "#9A3412", fontWeight: "bold" }, streakSub: { color: "#C2410C", fontSize: 11, marginTop: 3 }, heading: { color: "#0F172A", fontSize: 19, fontWeight: "bold", marginTop: 5, marginBottom: 10 }, section: { backgroundColor: "#FFFFFF", borderRadius: 13, padding: 12, flexDirection: "row", alignItems: "center", marginBottom: 9 }, sectionIcon: { width: 40, height: 40, borderRadius: 11, alignItems: "center", justifyContent: "center", marginRight: 9 }, sectionTop: { flexDirection: "row", justifyContent: "space-between" }, sectionName: { color: "#0F172A", fontWeight: "bold", fontSize: 13 }, sectionScore: { fontWeight: "bold" }, sectionSub: { color: "#64748B", fontSize: 10, marginVertical: 4 }, recent: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", marginBottom: 8 }, recentTitle: { color: "#0F172A", fontWeight: "bold", fontSize: 13 }, recentSub: { color: "#64748B", fontSize: 10, marginTop: 3 }, recentScore: { color: "#7C3AED", fontWeight: "bold", fontSize: 17 }, empty: { color: "#64748B", textAlign: "center", marginVertical: 15 }, badges: { marginTop: 7 }, badge: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 13, flexDirection: "row", alignItems: "center", marginBottom: 8 }, locked: { opacity: 0.55 }, badgeTextSmall: { color: "#92400E", fontWeight: "bold", marginLeft: 9 }, lockedText: { color: "#94A3B8" }, reset: { marginTop: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 12 }, resetText: { color: "#DC2626", fontSize: 12, marginLeft: 5 },
  });

  return App;
})();

/*
==================================================
MODULE: saved_topics_app.js
==================================================
*/
const SavedTopicsModule = (() => {
  /* =====================================================
     SAVED TOPICS SECTION
     পরে AsyncStorage ব্যবহার করে savedIds স্থায়ীভাবে save করা যাবে।
     ===================================================== */
  const TOPICS = [
    { id: "ohm", category: "Electrical", title: "Ohm’s Law", icon: "flash-outline", color: "#0284C7", summary: "Voltage, Current ও Resistance-এর সম্পর্ক।", detail: "Ohm’s Law: V = I × R। যেকোনো দুটি মান জানা থাকলে তৃতীয় মান বের করা যায়।" },
    { id: "power", category: "Calculation", title: "Power Calculation", icon: "calculator-variant", color: "#16A34A", summary: "Watt, Volt ও Ampere দিয়ে Power।", detail: "Power-এর basic formula P = V × I। Resistive load-এর ক্ষেত্রে P = I²R অথবা P = V²/R ব্যবহার করা যায়।" },
    { id: "multimeter", category: "Measurement", title: "Multimeter Safety", icon: "multimeter", color: "#0891B2", summary: "Meter, range, port ও probe ব্যবহারের নিয়ম।", detail: "Voltage, current ও resistance মাপার আগে function, range, lead port ও CAT rating check করতে হবে।" },
    { id: "diode", category: "Electronics", title: "Diode Test", icon: "arrow-right-bold", color: "#9333EA", summary: "Forward ও reverse direction পরীক্ষা।", detail: "Diode mode-এ forward direction-এ voltage drop এবং reverse direction-এ high/OL reading দেখা যায়।" },
    { id: "capacitor", category: "Electronics", title: "Capacitor Safety", icon: "capacitor", color: "#9333EA", summary: "Charge, discharge ও capacitance।", detail: "Power off করার পরও capacitor charge ধরে রাখতে পারে। Test করার আগে safe discharge করতে হবে।" },
    { id: "shock", category: "Safety", title: "Electric Shock Prevention", icon: "flash-alert", color: "#EA580C", summary: "Shock থেকে নিজেকে ও অন্যকে রক্ষা।", detail: "Shock victim-কে touch করার আগে supply isolate করতে হবে। Wet condition ও damaged insulation এড়িয়ে চলুন।" },
    { id: "earth", category: "Safety", title: "Earthing ও RCCB", icon: "earth", color: "#EA580C", summary: "Fault current ও leakage protection।", detail: "Earthing fault current-এর নিরাপদ path তৈরি করে এবং RCCB leakage current detect করতে সাহায্য করে।" },
    { id: "unit", category: "Power/Fault", title: "Electricity Unit", icon: "counter", color: "#D97706", summary: "kWh, daily use ও monthly bill।", detail: "Unit = Power(kW) × Time(hour)। Bill estimate-এ tariff, slab ও additional charge থাকতে পারে।" },
    { id: "overload", category: "Power/Fault", title: "Overload Fault", icon: "thermometer-alert", color: "#D97706", summary: "Heating, voltage drop ও trip-এর কারণ।", detail: "Cable capacity-এর বেশি load হলে current ও I²R heating বেড়ে যায়। Load ভাগ ও correct protection দরকার।" },
    { id: "troubleshoot", category: "Power/Fault", title: "Fault Diagnosis Flow", icon: "tools", color: "#D97706", summary: "Observe থেকে Verify পর্যন্ত।", detail: "সঠিক flow হলো: Symptom → Hypothesis → Test → Evidence → Repair → Verify।" },
    { id: "led", category: "Electronics", title: "LED Resistor", icon: "led-on", color: "#9333EA", summary: "LED-এর current-limiting resistor।", detail: "R = (Vs − Vf) ÷ I সূত্র দিয়ে LED-এর series resistor হিসাব করা যায়।" },
    { id: "battery", category: "Power/Fault", title: "Battery Backup", icon: "battery-clock-outline", color: "#D97706", summary: "Battery capacity ও backup time।", detail: "Approximate backup time = Battery Wh × efficiency ÷ Load W।" },
  ];
  const CATEGORIES = ["সব বিষয়", "Electrical", "Electronics", "Calculation", "Safety", "Measurement", "Power/Fault"];

  function App() {
    const [savedIds, setSavedIds] = useState(["ohm", "multimeter", "shock"]);
    const [category, setCategory] = useState("সব বিষয়");
    const [search, setSearch] = useState("");
    const [showSavedOnly, setShowSavedOnly] = useState(true);
    const [selected, setSelected] = useState(null);

    const savedTopics = useMemo(() => TOPICS.filter((item) => {
      const text = `${item.title} ${item.summary} ${item.category}`.toLowerCase();
      return savedIds.includes(item.id) && (category === "সব বিষয়" || item.category === category) && (!search.trim() || text.includes(search.toLowerCase()));
    }), [savedIds, category, search]);
    const allTopics = useMemo(() => TOPICS.filter((item) => category === "সব বিষয়" || item.category === category).filter((item) => !search.trim() || `${item.title} ${item.summary}`.toLowerCase().includes(search.toLowerCase())), [category, search]);
    const list = showSavedOnly ? savedTopics : allTopics;

    function toggleSaved(id) { setSavedIds((old) => old.includes(id) ? old.filter((value) => value !== id) : [...old, id]); }
    if (selected) return <TopicDetail topic={selected} saved={savedIds.includes(selected.id)} onToggle={() => toggleSaved(selected.id)} onBack={() => setSelected(null)} />;
    return <ScrollView style={styles.container} contentContainerStyle={styles.content}><NavRow light={false} /><View style={styles.header}><MaterialCommunityIcons name="bookmark-multiple" size={31} color="#FFFFFF" /><Text style={styles.headerTitle}>Saved Topics</Text></View><View style={styles.hero}><View style={styles.bookmark}><MaterialCommunityIcons name="bookmark" size={30} color="#FFFFFF" /></View><View style={{ flex: 1 }}><Text style={styles.heroTitle}>{savedIds.length}টি Topic Saved</Text><Text style={styles.heroText}>গুরুত্বপূর্ণ lesson পরে দ্রুত পড়ুন।</Text></View></View><View style={styles.search}><MaterialCommunityIcons name="magnify" size={21} color="#64748B" /><TextInput value={search} onChangeText={setSearch} placeholder="Saved topic খুঁজুন..." placeholderTextColor="#94A3B8" style={styles.input} /></View><ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>{CATEGORIES.map((item) => <TouchableOpacity key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.activeChip]}><Text style={[styles.chipText, category === item && styles.activeText]}>{item}</Text></TouchableOpacity>)}</ScrollView><View style={styles.toggleRow}><Text style={styles.heading}>Topic List ({list.length})</Text><TouchableOpacity style={[styles.toggle, showSavedOnly && styles.toggleActive]} onPress={() => setShowSavedOnly((value) => !value)}><MaterialCommunityIcons name={showSavedOnly ? "bookmark" : "view-grid-outline"} size={17} color={showSavedOnly ? "#FFFFFF" : "#64748B"} /><Text style={[styles.toggleText, showSavedOnly && styles.activeText]}>{showSavedOnly ? "Saved only" : "সব Topic"}</Text></TouchableOpacity></View>{list.map((item) => <TopicCard key={item.id} topic={item} saved={savedIds.includes(item.id)} onSave={() => toggleSaved(item.id)} onOpen={() => setSelected(item)} />)}{!list.length && <Empty showSavedOnly={showSavedOnly} onShowAll={() => setShowSavedOnly(false)} />}</ScrollView>;
  }

  function TopicCard({ topic, saved, onSave, onOpen }) { return <View style={styles.card}><TouchableOpacity style={styles.cardMain} onPress={onOpen} activeOpacity={0.8}><View style={[styles.topicIcon, { backgroundColor: `${topic.color}20` }]}><MaterialCommunityIcons name={topic.icon} size={24} color={topic.color} /></View><View style={{ flex: 1 }}><Text style={styles.topicTitle}>{topic.title}</Text><Text style={[styles.category, { color: topic.color }]}>{topic.category}</Text><Text style={styles.summary}>{topic.summary}</Text></View><MaterialCommunityIcons name="chevron-right" size={22} color="#94A3B8" /></TouchableOpacity><View style={styles.cardBottom}><Text style={styles.readText}>পড়ার জন্য খুলুন</Text><TouchableOpacity onPress={onSave} style={styles.saveButton}><MaterialCommunityIcons name={saved ? "bookmark" : "bookmark-outline"} size={20} color={saved ? "#7C3AED" : "#64748B"} /><Text style={[styles.saveText, saved && { color: "#7C3AED" }]}>{saved ? "Saved" : "Save"}</Text></TouchableOpacity></View></View>; }
  function TopicDetail({ topic, saved, onToggle, onBack }) { return <ScrollView style={styles.container} contentContainerStyle={styles.content}><View style={[styles.detailHeader, { backgroundColor: topic.color }]}><NavRow onBack={onBack} /><MaterialCommunityIcons name={topic.icon} size={45} color="#FFFFFF" /><Text style={styles.detailTitle}>{topic.title}</Text><Text style={styles.detailCategory}>{topic.category}</Text></View><View style={styles.detailCard}><Text style={styles.detailHeading}>সহজ ভাষায় জানুন</Text><Text style={styles.detailText}>{topic.detail}</Text></View><View style={styles.detailCard}><Text style={styles.detailHeading}>Quick Revision</Text><Text style={styles.detailText}>{topic.summary}</Text></View><TouchableOpacity style={[styles.saveLarge, saved && styles.unsave]} onPress={onToggle}><MaterialCommunityIcons name={saved ? "bookmark-remove" : "bookmark-plus"} size={22} color="#FFFFFF" /><Text style={styles.saveLargeText}>{saved ? "Saved থেকে Remove করুন" : "এই Topic Save করুন"}</Text></TouchableOpacity><TouchableOpacity style={styles.backButton} onPress={onBack}><Text style={styles.backButtonText}>Saved Topics-এ ফিরে যান</Text></TouchableOpacity></ScrollView>; }
  function Empty({ showSavedOnly, onShowAll }) { return <View style={styles.empty}><MaterialCommunityIcons name="bookmark-off-outline" size={46} color="#94A3B8" /><Text style={styles.emptyTitle}>{showSavedOnly ? "এখনও কোনো Saved Topic নেই" : "কোনো Topic পাওয়া যায়নি"}</Text><Text style={styles.emptyText}>{showSavedOnly ? "Topic-এর পাশে Save চাপলে এখানে দেখা যাবে।" : "Search বা category পরিবর্তন করে দেখুন।"}</Text>{showSavedOnly && <TouchableOpacity style={styles.showAll} onPress={onShowAll}><Text style={styles.showAllText}>সব Topic দেখুন</Text></TouchableOpacity>}</View>; }

  const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#FBFAFF" }, content: { padding: 16, paddingBottom: 35 }, header: { backgroundColor: "#7C3AED", borderRadius: 20, padding: 21, flexDirection: "row", alignItems: "center", marginBottom: 16 }, headerTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginLeft: 9 }, hero: { backgroundColor: "#EDE9FE", borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 15 }, bookmark: { width: 55, height: 55, borderRadius: 16, backgroundColor: "#7C3AED", alignItems: "center", justifyContent: "center", marginRight: 12 }, heroTitle: { color: "#4C1D95", fontSize: 18, fontWeight: "bold" }, heroText: { color: "#6D28D9", fontSize: 12, marginTop: 4 }, search: { height: 49, backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 13, flexDirection: "row", alignItems: "center", marginBottom: 12 }, input: { flex: 1, color: "#1E293B", marginLeft: 8, fontSize: 14 }, chips: { marginBottom: 13 }, chip: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 20, paddingVertical: 9, paddingHorizontal: 10, marginRight: 8 }, activeChip: { backgroundColor: "#7C3AED", borderColor: "#7C3AED" }, chipText: { color: "#475569", fontSize: 12 }, activeText: { color: "#FFFFFF", fontWeight: "bold" }, toggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }, heading: { color: "#0F172A", fontSize: 20, fontWeight: "bold" }, toggle: { borderRadius: 18, borderWidth: 1, borderColor: "#CBD5E1", paddingVertical: 5, paddingHorizontal: 10, flexDirection: "row", alignItems: "center" }, toggleActive: { backgroundColor: "#7C3AED", borderColor: "#7C3AED" }, toggleText: { color: "#64748B", fontSize: 11, marginLeft: 4 }, card: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#E2E8F0" }, cardMain: { flexDirection: "row", alignItems: "center" }, topicIcon: { width: 46, height: 46, borderRadius: 13, alignItems: "center", justifyContent: "center", marginRight: 10 }, topicTitle: { color: "#0F172A", fontSize: 15, fontWeight: "bold" }, category: { fontSize: 11, fontWeight: "bold", marginTop: 3 }, summary: { color: "#64748B", fontSize: 11, marginTop: 3 }, cardBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#F1F5F9", marginTop: 10, paddingTop: 9 }, readText: { color: "#94A3B8", fontSize: 11 }, saveButton: { flexDirection: "row", alignItems: "center", padding: 3 }, saveText: { color: "#64748B", fontSize: 12, fontWeight: "bold", marginLeft: 4 }, empty: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 28, alignItems: "center", marginTop: 10 }, emptyTitle: { color: "#334155", fontSize: 16, fontWeight: "bold", marginTop: 10 }, emptyText: { color: "#64748B", fontSize: 12, textAlign: "center", marginTop: 5 }, showAll: { backgroundColor: "#7C3AED", borderRadius: 9, paddingVertical: 10, paddingHorizontal: 14, marginTop: 14 }, showAllText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 12 }, detailHeader: { borderRadius: 20, padding: 21, marginBottom: 16 }, back: { flexDirection: "row", alignItems: "center", marginBottom: 20 }, backText: { color: "#FFFFFF", fontWeight: "bold", marginLeft: 7 }, detailTitle: { color: "#FFFFFF", fontSize: 26, fontWeight: "bold", marginTop: 12 }, detailCategory: { color: "#F3E8FF", marginTop: 5 }, detailCard: { backgroundColor: "#FFFFFF", borderRadius: 15, padding: 17, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: "#7C3AED" }, detailHeading: { color: "#7C3AED", fontSize: 16, fontWeight: "bold", marginBottom: 8 }, detailText: { color: "#334155", fontSize: 14, lineHeight: 22 }, saveLarge: { backgroundColor: "#7C3AED", borderRadius: 12, padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 10 }, unsave: { backgroundColor: "#DC2626" }, saveLargeText: { color: "#FFFFFF", fontWeight: "bold", marginLeft: 8 }, backButton: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#C4B5FD", borderRadius: 12, padding: 14, alignItems: "center" }, backButtonText: { color: "#7C3AED", fontWeight: "bold" },
  });

  return App;
})();

/*
==================================================
MODULE: plc_module.js
==================================================
*/
const PLCModule = (() => {
  /* PLC MASTER COURSE — plc-course.js-এর data হুবহু রাখা হয়েছে (Bengali Edition) */
  const lessons = [
    {
      id: 1, module: "PLC Fundamentals", title: "PLC কী?",
      level: "Beginner",
      theory: `PLC (Programmable Logic Controller) হলো একটি industrial controller, যা Input signal গ্রহণ করে programmed logic অনুযায়ী Output নিয়ন্ত্রণ করে। এটি machine automation, conveyor, pump, motor, packaging, filling, production line ইত্যাদিতে ব্যাপকভাবে ব্যবহৃত হয়।`,
      points: [
        "PLC = Programmable Logic Controller",
        "Input: Push Button, Sensor, Limit Switch ইত্যাদি",
        "CPU: Program execute করে",
        "Output: Contactor, Solenoid, Lamp, Relay ইত্যাদি",
        "PLC-এর মূল কাজ হলো নির্দিষ্ট sequence অনুযায়ী machine control করা"
      ],
      diagram: `INPUT\n  │\n  ▼\n┌─────────────────┐\n│       PLC       │\n│ CPU + Memory    │\n└────────┬────────┘\n         │\n         ▼\n      OUTPUT`,
      practical: "একটি Start button চাপলে Motor ON এবং Stop button চাপলে Motor OFF করার sequence তৈরি করুন।"
    },
    {
      id: 2, module: "PLC Fundamentals", title: "PLC-এর প্রধান অংশ",
      theory: "PLC system সাধারণত CPU, Power Supply, Digital/Analog Input, Digital/Analog Output এবং Communication interface নিয়ে গঠিত।",
      points: ["CPU", "Power Supply", "Digital Input (DI)", "Digital Output (DO)", "Analog Input (AI)", "Analog Output (AO)", "Communication Port"],
      practical: "একটি PLC-এর প্রতিটি terminal-এর নাম দেখে Input/Output আলাদা করুন।"
    },
    {
      id: 3, module: "PLC Fundamentals", title: "PLC Scan Cycle",
      theory: "PLC সাধারণত Input read করে, program execute করে, Output update করে এবং diagnostic/communication কাজ সম্পন্ন করে। এই cycle বারবার দ্রুত পুনরাবৃত্তি হয়।",
      diagram: "Read Inputs → Execute Program → Update Outputs → Diagnostics/Communication → Repeat",
      practical: "কেন PLC input পরিবর্তনের সঙ্গে সঙ্গে output logic update করে—scan cycle দিয়ে ব্যাখ্যা করুন।"
    },
    {
      id: 4, module: "Electrical & PLC Wiring", title: "24V DC PLC Wiring",
      theory: "Industrial control circuit-এ 24V DC খুব প্রচলিত। SMPS/Power Supply থেকে +24V এবং 0V পাওয়া যায়। PLC input/output wiring করার আগে PLC manual-এর terminal diagram অবশ্যই অনুসরণ করতে হবে।",
      diagram: "+24V ── Fuse ──► Sensor / Push Button ──► PLC Input\n0V  ───────────────────────────────────────► PLC 0V",
      practical: "একটি push button দিয়ে PLC-এর একটি digital input চালু করার wiring আঁকুন।"
    },
    {
      id: 5, module: "Electrical & PLC Wiring", title: "Digital Input Wiring",
      theory: "Digital input সাধারণত ON/OFF signal গ্রহণ করে। Push button, selector switch, proximity sensor, photo sensor এবং limit switch digital input হিসেবে ব্যবহৃত হতে পারে।",
      points: ["NO/NC contact বুঝতে হবে", "Input common/0V বা +24V arrangement PLC model অনুযায়ী হয়", "PNP/NPN sensor-এর compatibility যাচাই করতে হবে"],
      practical: "Start, Stop এবং Proximity Sensor-এর জন্য I/O list তৈরি করুন।"
    },
    {
      id: 6, module: "Electrical & PLC Wiring", title: "Digital Output Wiring",
      theory: "PLC output দিয়ে relay, contactor, solenoid valve, lamp বা অন্য control device চালানো যায়। Output type relay/transistor/triac হতে পারে। Load-এর voltage/current rating যাচাই করতে হবে।",
      diagram: "PLC Q0.0 ──► Contactor Coil / Relay ──► Motor Control Circuit",
      practical: "PLC output দিয়ে contactor coil control করার block diagram আঁকুন।"
    },
    {
      id: 7, module: "PLC Programming", title: "Ladder Diagram (LD) কী?",
      theory: "Ladder Diagram হলো PLC programming-এর একটি graphical language। এতে contact, coil, timer, counter ইত্যাদি ব্যবহার করে control logic তৈরি করা হয়।",
      ladder: `Start: I0.0     Stop: I0.1       Motor: Q0.0

  |----| |----+----|/|----------------( )----|
  |   I0.0    |    I0.1              Q0.0   |
  |           |                              |
  |           +----| |-----------------------|
  |               Q0.0                       |`,
      practical: "Self-holding motor start/stop ladder logic নিজের হাতে আঁকুন।"
    },
    {
      id: 8, module: "PLC Programming", title: "NO, NC এবং Coil",
      theory: "NO (Normally Open) contact condition true হলে conductive logic দেয়; NC (Normally Closed) contact সাধারণভাবে true এবং signal/condition অনুযায়ী false হতে পারে। Coil একটি output bit/device control করে। বাস্তব electrical NO/NC এবং ladder instruction-এর behaviour context অনুযায়ী বুঝতে হবে।",
      points: ["NO Contact: | |", "NC Contact: |/|", "Coil: ( )", "SET/RESET আলাদা instruction হতে পারে"],
      practical: "একটি NO Start এবং একটি NC Stop দিয়ে Motor coil control করুন।"
    },
    {
      id: 9, module: "PLC Programming", title: "Self-Holding / Latching",
      theory: "Start button ছেড়ে দেওয়ার পরও output চালু রাখার জন্য output-এর auxiliary contact ব্যবহার করে self-holding circuit তৈরি করা হয়।",
      ladder: `|----|/| Stop ----+----| | Start ----+----( ) Motor
  |                 |                   |
  |                 +----| | Motor ----+
  |                                      |`,
      practical: "Start চাপলে Motor ON, Stop চাপলে OFF—এই ladder তৈরি করুন।"
    },
    {
      id: 10, module: "PLC Programming", title: "Timer",
      theory: "Timer নির্দিষ্ট সময় গণনা করে তারপর output বা bit পরিবর্তন করতে সাহায্য করে। TON, TOF, TP ইত্যাদি timer type বিভিন্ন PLC platform-এ পাওয়া যায়; নাম ও parameter model অনুযায়ী আলাদা হতে পারে।",
      example: "Start → 5 seconds delay → Motor/Valve ON",
      practical: "একটি sensor ON হওয়ার 5 seconds পরে output ON করার logic তৈরি করুন।"
    },
    {
      id: 11, module: "PLC Programming", title: "Counter",
      theory: "Counter pulse/event গণনা করে। Production counting, bottle counting, package counting ইত্যাদিতে counter ব্যবহৃত হয়।",
      example: "Sensor pulse 10 বার হলে Conveyor Stop.",
      practical: "একটি proximity sensor দিয়ে 10টি product count করার sequence তৈরি করুন।"
    },
    {
      id: 12, module: "PLC Programming", title: "SET / RESET",
      theory: "SET কোনো bit/output-কে latch করতে এবং RESET সেটি বন্ধ করতে ব্যবহার করা যায়। PLC brand অনুযায়ী instruction-এর নাম ও behaviour যাচাই করতে হবে।",
      practical: "Start input দিয়ে Motor bit SET এবং Stop input দিয়ে RESET করুন।"
    },
    {
      id: 13, module: "PLC Programming", title: "Interlock",
      theory: "দুটি বিপরীত বা conflicting operation একই সময়ে চলতে না দেওয়ার logic হলো interlock। Forward/Reverse motor control-এ এটি অত্যন্ত গুরুত্বপূর্ণ।",
      ladder: `Forward command ──[ Forward ]──[/ Reverse ]──( FWD )
  Reverse command ──[ Reverse ]──[/ Forward ]──( REV )`,
      practical: "Forward ও Reverse output-এর electrical এবং PLC interlock আলাদা করে পরিকল্পনা করুন।"
    },
    {
      id: 14, module: "Motor Control", title: "PLC দিয়ে DOL Motor Control",
      theory: "DOL starter-এ contactor motor-কে সরাসরি line voltage-এ connect করে। PLC সাধারণত contactor coil control করবে; motor-এর power circuit এবং safety protection আলাদা থাকবে।",
      diagram: "PLC Output → Contactor Coil → Main Contactor → Overload → Motor",
      practical: "Start/Stop + overload feedback সহ DOL control sequence তৈরি করুন।"
    },
    {
      id: 15, module: "Motor Control", title: "Forward / Reverse",
      theory: "Motor direction control-এ দুই contactor-এর electrical এবং PLC interlock প্রয়োজন। একই সময়ে দুই contactor ON হওয়া ঠেকাতে safety logic ব্যবহার করতে হবে।",
      practical: "Forward button, Reverse button এবং Stop button-এর I/O list ও interlock logic তৈরি করুন।"
    },
    {
      id: 16, module: "Industrial Automation", title: "Conveyor Control",
      theory: "Conveyor automation-এ motor, proximity/photoelectric sensor, emergency stop এবং product detection logic ব্যবহার করা হয়।",
      sequence: "Start → Conveyor ON → Product detected → Count/Delay → Stop বা Continue",
      practical: "Sensor-based conveyor-এর complete sequence লিখুন।"
    },
    {
      id: 17, module: "Industrial Automation", title: "Water Tank Level Control",
      theory: "Low-level এবং High-level sensor ব্যবহার করে pump automatic ON/OFF করা যায়। বাস্তবে dry-run protection, overload এবং manual mode যুক্ত করা উচিত।",
      practical: "Low level হলে Pump ON এবং High level হলে Pump OFF—logic তৈরি করুন।"
    },
    {
      id: 18, module: "Industrial Automation", title: "Analog Input 4–20mA",
      theory: "Pressure, temperature, flow, level ইত্যাদি process variable measurement-এর জন্য 4–20mA industrial signal ব্যবহৃত হয়। PLC analog module raw value গ্রহণ করে engineering unit-এ scale করতে পারে।",
      practical: "4–20mA signal থেকে 0–100% process value scaling-এর ধারণা লিখুন।"
    },
    {
      id: 19, module: "Industrial Automation", title: "HMI ও PLC",
      theory: "HMI operator-কে machine status, start/stop command, setpoint, alarm এবং process value দেখাতে সাহায্য করে। HMI PLC-এর সঙ্গে industrial communication-এর মাধ্যমে data exchange করে।",
      practical: "একটি Motor HMI screen-এর জন্য Start, Stop, Running এবং Fault tag পরিকল্পনা করুন।"
    },
    {
      id: 20, module: "Industrial Automation", title: "VFD ও PLC",
      theory: "VFD motor speed/frequency control করতে ব্যবহৃত হয়। PLC digital signal, analog signal অথবা industrial communication দিয়ে VFD command দিতে পারে।",
      practical: "PLC → VFD → Motor control-এর block diagram তৈরি করুন।"
    },
    {
      id: 21, module: "Advanced PLC", title: "PID Control",
      theory: "PID process variable-কে setpoint-এর কাছাকাছি রাখতে proportional, integral এবং derivative action ব্যবহার করে। Temperature, pressure, flow control-এ এটি ব্যবহৃত হয়।",
      practical: "Temperature setpoint ও sensor feedback-এর PID block diagram তৈরি করুন।"
    },
    {
      id: 22, module: "Advanced PLC", title: "Encoder / High-Speed Counter",
      theory: "Encoder rotational position/speed বা pulse information দিতে পারে। High-speed counter দ্রুত pulse গণনার জন্য ব্যবহৃত হয়; standard scan-based counter সব ক্ষেত্রে উপযুক্ত নয়।",
      practical: "Conveyor speed measurement-এর জন্য encoder ব্যবহার করার পরিকল্পনা করুন।"
    },
    {
      id: 23, module: "Troubleshooting", title: "PLC Input না এলে কী পরীক্ষা করবেন?",
      points: [
        "24V DC supply পরীক্ষা",
        "Fuse/MCB পরীক্ষা",
        "Sensor supply পরীক্ষা",
        "Sensor output পরীক্ষা",
        "Terminal/wiring continuity পরীক্ষা",
        "PLC input LED/status monitor পরীক্ষা",
        "PNP/NPN compatibility পরীক্ষা"
      ],
      practical: "একটি sensor কাজ না করলে step-by-step troubleshooting checklist তৈরি করুন।"
    },
    {
      id: 24, module: "Troubleshooting", title: "PLC Output কাজ না করলে",
      points: [
        "Program condition true হচ্ছে কি না",
        "PLC RUN/STOP status",
        "Output LED/status",
        "Output module type",
        "Load voltage",
        "Fuse/protection",
        "Contactor/relay coil",
        "Common terminal এবং wiring"
      ],
      practical: "PLC output ON দেখাচ্ছে কিন্তু contactor ON হচ্ছে না—সম্ভাব্য কারণগুলো লিখুন।"
    },
    {
      id: 25, module: "Industrial Practice", title: "PLC Panel Reading",
      theory: "Industrial control panel-এ PLC ছাড়াও MCB, fuse, SMPS, relay, contactor, overload, terminal block, VFD, HMI, safety relay ইত্যাদি থাকতে পারে। Electrical drawing ও terminal numbering বুঝতে পারা জরুরি।",
      practical: "একটি panel-এর component list এবং I/O list তৈরি করুন।"
    }
  ];

  const software = [
    ["Siemens", "TIA Portal", "S7-1200 / S7-1500"],
    ["Mitsubishi", "GX Works2 / GX Works3", "FX এবং বিভিন্ন Mitsubishi PLC"],
    ["Omron", "CX-Programmer / Sysmac Studio", "CP/CJ এবং নতুন NJ/NX platform"],
    ["Delta", "WPLSoft / ISPSoft", "Delta PLC series অনুযায়ী"],
    ["Allen-Bradley", "Studio 5000 / RSLogix 500", "ControlLogix / CompactLogix / MicroLogix"],
    ["Schneider Electric", "EcoStruxure Machine Expert / Control Expert", "PLC model অনুযায়ী"],
    ["CODESYS ecosystem", "CODESYS", "CODESYS-supported controllers"]
  ];

  const ioExample = [
    ["I0.0", "Start Push Button", "Digital Input"],
    ["I0.1", "Stop Push Button", "Digital Input"],
    ["I0.2", "Motor Overload Feedback", "Digital Input"],
    ["I0.3", "Proximity Sensor", "Digital Input"],
    ["Q0.0", "Motor Contactor", "Digital Output"],
    ["Q0.1", "Solenoid Valve", "Digital Output"],
    ["Q0.2", "Running Lamp", "Digital Output"]
  ];

  const MODULE_COLORS = {
    "PLC Fundamentals": "#2563EB",
    "Electrical & PLC Wiring": "#0891B2",
    "PLC Programming": "#7C3AED",
    "Motor Control": "#D97706",
    "Industrial Automation": "#16A34A",
    "Advanced PLC": "#DB2777",
    "Troubleshooting": "#DC2626",
    "Industrial Practice": "#475569",
  };
  const PLC_COLOR = "#1E3A8A";
  const MODULES = [...new Set(lessons.map((l) => l.module))];
  const MONO = Platform.OS === "ios" ? "Courier" : "monospace";
  const colorOf = (m) => MODULE_COLORS[m] || PLC_COLOR;

  function App() {
    const [page, setPage] = useState("home");
    const [module, setModule] = useState("");
    const [search, setSearch] = useState("");
    const [lesson, setLesson] = useState(null);

    const filtered = useMemo(() => {
      const q = search.trim().toLowerCase();
      return lessons.filter((l) => {
        const hay = `${l.title} ${l.module} ${l.theory || ""} ${(l.points || []).join(" ")}`.toLowerCase();
        return (!q || hay.includes(q)) && (!module || l.module === module);
      });
    }, [search, module]);

    if (page === "detail" && lesson) {
      return <LessonDetail lesson={lesson} onBack={() => { setLesson(null); setPage("topics"); }} />;
    }
    if (page === "topics") {
      return (
        <Topics
          module={module} setModule={setModule} search={search} setSearch={setSearch}
          items={filtered} onBack={() => setPage("home")}
          onOpen={(item) => { setLesson(item); setPage("detail"); }}
        />
      );
    }
    return <Home onOpen={() => setPage("topics")} />;
  }

  function Home({ onOpen }) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}><NavRow light={false} />
        <View style={styles.hero}>
          <MaterialCommunityIcons name="cog-box" size={40} color="#FACC15" />
          <Text style={styles.kicker}>LEARNING MODULE</Text>
          <Text style={styles.heroTitle}>PLC Master Course</Text>
          <Text style={styles.heroText}>Beginner → Industrial Automation → Ladder → Wiring → Troubleshooting</Text>
          <Text style={styles.heroSub}>বাংলা ভাষায় structured PLC learning module</Text>
        </View>

        <View style={styles.statRow}>
          <Stat value={String(lessons.length)} label="Core Lessons" />
          <Stat value={`${software.length}+`} label="PLC Software" />
          <Stat value="LD" label="Ladder Logic" />
          <Stat value="I/O" label="Wiring Practice" />
        </View>

        <TouchableOpacity style={styles.startCard} onPress={onOpen} activeOpacity={0.85}>
          <View style={styles.startIcon}><MaterialCommunityIcons name="book-open-variant" size={28} color="#FFFFFF" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.startTitle}>PLC Lessons শুরু করুন</Text>
            <Text style={styles.startText}>{lessons.length}টি lesson, {MODULES.length}টি module</Text>
          </View>
          <MaterialCommunityIcons name="arrow-right" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>কোন Software দিয়ে PLC Program করতে হয়?</Text>
          <Text style={styles.panelText}>PLC brand ও model অনুযায়ী programming software আলাদা। একই software সব PLC-তে ব্যবহার করা যায় না।</Text>
          <TableHead cols={["Brand", "Programming Software", "Common Platform"]} />
          {software.map((row, i) => <TableRow key={i} cols={row} />)}
          <Text style={styles.note}>নোট: software version, PLC CPU এবং communication cable/driver আগে model manual দেখে নির্বাচন করবেন।</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Sample PLC I/O List</Text>
          <TableHead cols={["Address", "Device", "Type"]} />
          {ioExample.map((row, i) => <TableRow key={i} cols={row} />)}
        </View>
      </ScrollView>
    );
  }

  function Stat({ value, label }) {
    return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
  }
  function TableHead({ cols }) {
    return <View style={[styles.tr, styles.th]}>{cols.map((c, i) => <Text key={i} style={[styles.td, styles.thText]}>{c}</Text>)}</View>;
  }
  function TableRow({ cols }) {
    return <View style={styles.tr}>{cols.map((c, i) => <Text key={i} style={styles.td}>{c}</Text>)}</View>;
  }

  function Topics({ module, setModule, search, setSearch, items, onBack, onOpen }) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Header title="PLC Lessons" icon="cog-box" color={PLC_COLOR} onBack={onBack} />
        <View style={styles.search}>
          <MaterialCommunityIcons name="magnify" size={21} color="#64748B" />
          <TextInput value={search} onChangeText={setSearch} placeholder="Lesson খুঁজুন..." placeholderTextColor="#94A3B8" style={styles.input} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {["", ...MODULES].map((m) => (
            <TouchableOpacity key={m || "all"} onPress={() => setModule(m)} style={[styles.chip, module === m && { backgroundColor: colorOf(m), borderColor: colorOf(m) }]}>
              <Text style={[styles.chipText, module === m && styles.chipTextActive]}>{m || "সব Module"}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.heading}>Lesson List ({items.length})</Text>
        {items.map((l) => (
          <TouchableOpacity key={l.id} style={styles.lessonCard} onPress={() => onOpen(l)} activeOpacity={0.8}>
            <View style={[styles.num, { backgroundColor: colorOf(l.module) }]}><Text style={styles.numText}>{l.id}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>{l.title}</Text>
              <Text style={[styles.lessonModule, { color: colorOf(l.module) }]}>{l.module}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colorOf(l.module)} />
          </TouchableOpacity>
        ))}
        {!items.length && <Text style={styles.empty}>কোনো lesson পাওয়া যায়নি।</Text>}
      </ScrollView>
    );
  }

  function LessonDetail({ lesson, onBack }) {
    const color = colorOf(lesson.module);
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Header title={lesson.title} icon="cog-box" color={color} onBack={onBack} />
        <Text style={[styles.badge, { color }]}>LESSON {String(lesson.id).padStart(2, "0")} · {lesson.module}{lesson.level ? ` · ${lesson.level}` : ""}</Text>
        {!!lesson.theory && <Block title="Theory" icon="book-open-variant" color={color}><Text style={styles.body}>{lesson.theory}</Text></Block>}
        {!!lesson.points && (
          <Block title="Key Points" icon="format-list-bulleted" color="#0284C7">
            {lesson.points.map((p, i) => <Text key={i} style={styles.bullet}>• {p}</Text>)}
          </Block>
        )}
        {!!lesson.diagram && <Code title="Wiring / Block Diagram" icon="sitemap" text={lesson.diagram} />}
        {!!lesson.ladder && <Code title="Ladder Diagram" icon="ladder" text={lesson.ladder} />}
        {!!lesson.example && <Block title="Example" icon="cog-outline" color="#A16207" bg="#FEF3C7"><Text style={styles.body}>{lesson.example}</Text></Block>}
        {!!lesson.sequence && <Block title="Sequence" icon="sync" color="#16A34A" bg="#F0FDF4"><Text style={styles.body}>{lesson.sequence}</Text></Block>}
        {!!lesson.practical && <Block title="Practical Task" icon="tools" color="#7C3AED" bg="#F3E8FF"><Text style={styles.body}>{lesson.practical}</Text></Block>}
        <TouchableOpacity style={[styles.backLarge, { backgroundColor: color }]} onPress={onBack}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#FFFFFF" />
          <Text style={styles.backLargeText}>Lesson List-এ ফিরে যান</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  function Block({ title, icon, color, bg = "#FFFFFF", children }) {
    return (
      <View style={[styles.block, { backgroundColor: bg, borderLeftColor: color }]}>
        <View style={styles.blockTitleRow}>
          <MaterialCommunityIcons name={icon} size={21} color={color} />
          <Text style={[styles.blockTitle, { color }]}>{title}</Text>
        </View>
        {children}
      </View>
    );
  }
  function Code({ title, icon, text }) {
    return (
      <Block title={title} icon={icon} color="#0F172A">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text style={styles.code}>{text}</Text>
        </ScrollView>
      </Block>
    );
  }
  function Header({ title, icon, color, onBack }) {
    return (
      <View style={[styles.header, { backgroundColor: color }]}>
        <NavRow onBack={onBack} />
        <View style={styles.headerRow}>
          <MaterialCommunityIcons name={icon} size={28} color="#FFFFFF" />
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FB" },
    content: { padding: 16, paddingBottom: 35 },
    hero: { backgroundColor: "#0F172A", borderRadius: 16, padding: 14, marginBottom: 10 },
    kicker: { color: "#93C5FD", fontSize: 11, fontWeight: "bold", letterSpacing: 1.5, marginTop: 12 },
    heroTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginTop: 3 },
    heroText: { color: "#DBEAFE", fontSize: 13, marginTop: 8, lineHeight: 20 },
    heroSub: { color: "#93C5FD", fontSize: 12, marginTop: 6 },
    statRow: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -5, marginBottom: 6 },
    stat: { width: "50%", padding: 5 },
    statValue: { backgroundColor: "#FFFFFF", color: "#1E3A8A", fontSize: 24, fontWeight: "bold", paddingTop: 14, paddingHorizontal: 14, borderTopLeftRadius: 14, borderTopRightRadius: 14, borderWidth: 1, borderBottomWidth: 0, borderColor: "#E2E6EF", overflow: "hidden" },
    statLabel: { backgroundColor: "#FFFFFF", color: "#64748B", fontSize: 12, paddingBottom: 14, paddingHorizontal: 14, borderBottomLeftRadius: 14, borderBottomRightRadius: 14, borderWidth: 1, borderTopWidth: 0, borderColor: "#E2E6EF", overflow: "hidden" },
    startCard: { backgroundColor: "#1D4ED8", borderRadius: 16, padding: 12, flexDirection: "row", alignItems: "center", marginVertical: 6 },
    startIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginRight: 12 },
    startTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
    startText: { color: "#DBEAFE", fontSize: 11, marginTop: 2 },
    panel: { backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#E2E6EF", padding: 16, marginTop: 12 },
    panelTitle: { color: "#0F172A", fontSize: 16, fontWeight: "bold", marginBottom: 6 },
    panelText: { color: "#475569", fontSize: 13, lineHeight: 20, marginBottom: 10 },
    note: { color: "#637083", fontSize: 12, marginTop: 10, lineHeight: 18 },
    tr: { flexDirection: "row", borderWidth: 1, borderColor: "#DFE4ED", marginTop: -1 },
    th: { backgroundColor: "#EEF2F8" },
    td: { flex: 1, padding: 8, fontSize: 12, color: "#172033" },
    thText: { fontWeight: "bold" },
    header: { borderRadius: 16, padding: 14, marginBottom: 10 },
    back: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
    backText: { color: "#FFFFFF", fontWeight: "bold", marginLeft: 7 },
    headerRow: { flexDirection: "row", alignItems: "center" },
    headerTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "bold", marginLeft: 10, flex: 1 },
    search: { height: 49, backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 13, flexDirection: "row", alignItems: "center", marginBottom: 12 },
    input: { flex: 1, color: "#1E293B", marginLeft: 8, fontSize: 14 },
    chips: { marginBottom: 12 },
    chip: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 20, paddingVertical: 9, paddingHorizontal: 10, marginRight: 8 },
    chipText: { color: "#475569", fontSize: 12 },
    chipTextActive: { color: "#FFFFFF", fontWeight: "bold" },
    heading: { color: "#0F172A", fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    lessonCard: { backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#E2E8F0", padding: 12, marginBottom: 10, flexDirection: "row", alignItems: "center" },
    num: { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center", marginRight: 11 },
    numText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
    lessonTitle: { color: "#0F172A", fontSize: 15, fontWeight: "bold" },
    lessonModule: { fontSize: 11, fontWeight: "bold", marginTop: 3 },
    empty: { color: "#64748B", textAlign: "center", marginTop: 20 },
    badge: { fontSize: 11, fontWeight: "bold", marginBottom: 10 },
    block: { borderRadius: 15, padding: 16, marginBottom: 12, borderLeftWidth: 4 },
    blockTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    blockTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 8 },
    body: { color: "#334155", fontSize: 14, lineHeight: 23 },
    bullet: { color: "#334155", fontSize: 14, lineHeight: 23, marginBottom: 4 },
    code: { backgroundColor: "#101827", color: "#E8EEFC", fontFamily: MONO, fontSize: 12, lineHeight: 19, padding: 14, borderRadius: 12 },
    backLarge: { borderRadius: 12, padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4 },
    backLargeText: { color: "#FFFFFF", fontWeight: "bold", marginLeft: 8 },
  });

  return App;
})();

/*
==================================================
MODULE: job_prep_module.js
==================================================
*/
const JobPrepModule = (() => {
  /* JOB PREPARATION — CV, Interview, Technical Q&A, Practical test ও Career */
  const COLOR = "#BE123C";
  const GROUPS = ["সব বিষয়", "CV ও Application", "Interview", "Technical Q&A", "Practical ও Career"];

  const TOPICS = [
    { id: "cv", group: "CV ও Application", icon: "file-account-outline", title: "Electrical Job-এর CV", summary: "ছোট, পরিষ্কার ও কাজের প্রমাণসহ CV বানান।",
      points: ["এক বা দুই পাতার মধ্যে রাখুন; নাম, ফোন, ইমেইল ও ঠিকানা উপরে দিন।", "শিক্ষাগত যোগ্যতা ও training-এর নাম এবং সাল লিখুন।", "কোন কাজ করেছেন তা নির্দিষ্ট করে লিখুন, যেমন: DOL starter wiring বা PLC দিয়ে conveyor control।", "যে tool, meter ও software চালাতে পারেন তার তালিকা দিন, যেমন Multimeter, Megger, Clamp meter, TIA Portal।", "যা পারেন না তা লিখবেন না। Interview-এ CV-র প্রতিটি লাইন সম্পর্কে প্রশ্ন আসতে পারে।"],
      tip: "প্রতিটি আবেদনের আগে job circular পড়ে CV-র প্রথম অংশ সেই কাজের সাথে মিলিয়ে নিন।" },
    { id: "letter", group: "CV ও Application", icon: "email-edit-outline", title: "Application / Cover Letter", summary: "পদের নাম ও যোগ্যতা সংক্ষেপে জানান।",
      points: ["প্রথম লাইনে কোন পদে আবেদন করছেন তা লিখুন।", "কেন আপনি উপযুক্ত, তা দুই-তিন লাইনে বলুন।", "সংযুক্ত কাগজপত্রের তালিকা দিন।", "ভদ্র ভাষায় শেষ করুন এবং ফোন নম্বর আবার উল্লেখ করুন।"],
      tip: "Letter ছোট রাখুন। এক পাতার বেশি হলে কেউ পুরো পড়ে না।" },
    { id: "papers", group: "CV ও Application", icon: "certificate-outline", title: "Certificate ও কাগজপত্র", summary: "Interview-এর দিন কী কী সঙ্গে রাখবেন।",
      points: ["NID, শিক্ষাগত সনদ ও training certificate-এর মূল কপি এবং ফটোকপি আলাদা ফাইলে রাখুন।", "অভিজ্ঞতার সনদ বা আগের কর্মস্থলের পরিচয়পত্র থাকলে সঙ্গে নিন।", "বিদ্যুৎ-সংক্রান্ত কাজের জন্য কোন license বা অনুমোদন লাগে, তা সরকারি সংস্থার সর্বশেষ নিয়মে যাচাই করে নিন।", "সাম্প্রতিক ছবি ও CV-র কয়েকটি কপি রাখুন।"],
      tip: "কাগজপত্র আগের রাতেই গুছিয়ে রাখুন।" },
    { id: "prep", group: "Interview", icon: "account-tie-outline", title: "Interview-এর আগের প্রস্তুতি", summary: "কোম্পানি জানুন ও basic বিষয় revise করুন।",
      points: ["কোম্পানি কী কাজ করে বা কী তৈরি করে, তা আগে জেনে নিন।", "Ohm’s Law, Power, Series ও Parallel, Fuse ও MCB, Earthing আবার দেখে নিন।", "সময়ের আগে পৌঁছান এবং পরিষ্কার পোশাক পরুন।", "প্রশ্ন বুঝে ধীরে ও স্পষ্টভাবে উত্তর দিন।"],
      tip: "না জানলে অনুমান করে বলবেন না। সৎভাবে বলুন, শিখে নেবেন।" },
    { id: "hr", group: "Interview", icon: "message-question-outline", title: "Common HR প্রশ্ন", summary: "প্রায় সব interview-এ আসা প্রশ্ন।",
      qa: [["নিজের সম্পর্কে বলুন।", "নাম, পড়াশোনা, কী কাজ জানেন ও কোন কাজে আগ্রহী, তা এক মিনিটে বলুন। অপ্রাসঙ্গিক ব্যক্তিগত কথা এড়িয়ে চলুন।"], ["কেন এই চাকরি চান?", "কোম্পানির কাজের সাথে আপনার দক্ষতা কীভাবে মেলে তা বলুন। শুধু বেতনের কথা বলবেন না।"], ["আপনার দুর্বলতা কী?", "একটি বাস্তব দুর্বলতা বলুন এবং তা কাটাতে কী করছেন তা জানান।"], ["উত্তর না জানলে কী করবেন?", "জানা অংশটুকু বলুন এবং স্বীকার করুন যে বাকিটা শিখে নেবেন।"]],
      tip: "উত্তর মুখস্থ না করে নিজের কথায় বলার অভ্যাস করুন।" },
    { id: "tech", group: "Technical Q&A", icon: "flash-outline", title: "Electrical Technical প্রশ্ন", summary: "Electrical interview-এর সাধারণ প্রশ্ন ও উত্তর।",
      qa: [["Ohm’s Law কী?", "V = I × R। এটি Voltage, Current ও Resistance-এর সম্পর্ক।"], ["AC ও DC-র পার্থক্য কী?", "DC-তে current একদিকে চলে। AC-তে দিক সময়ের সাথে বদলায়।"], ["Fuse ও MCB-র পার্থক্য কী?", "Fuse গলে গেলে বদলাতে হয়। MCB trip করলে reset করা যায়।"], ["Earthing কেন দরকার?", "Fault current নিরাপদ পথে মাটিতে পাঠিয়ে shock ও আগুনের ঝুঁকি কমাতে।"], ["Star-Delta starter কেন ব্যবহার হয়?", "বড় motor চালু হওয়ার সময় starting current কমাতে।"], ["Megger দিয়ে কী মাপা হয়?", "Insulation resistance। মাপার আগে supply বন্ধ করতে হয়।"], ["Power factor কী?", "Real power ও apparent power-এর অনুপাত (cos φ)। এটি কম হলে একই load-এ বেশি current লাগে।"], ["3-phase motor না ঘুরলে কী দেখবেন?", "Supply ও phase, overload relay, contactor ও control circuit, তারপর motor winding ও insulation পরীক্ষা করবেন।"]],
      tip: "উত্তরের সাথে একটি ছোট বাস্তব উদাহরণ দিলে প্রভাব বেশি পড়ে।" },
    { id: "plc", group: "Technical Q&A", icon: "cog-box", title: "PLC Interview প্রশ্ন", summary: "PLC পদের জন্য সাধারণ প্রশ্ন।",
      qa: [["PLC কী?", "Industrial controller, যা input signal নিয়ে program অনুযায়ী output নিয়ন্ত্রণ করে।"], ["Scan cycle কী?", "Input read, program execute, output update, তারপর আবার একই চক্র।"], ["Self-holding কীভাবে হয়?", "Start-এর সাথে output-এর contact parallel করে এবং Stop series-এ রেখে।"], ["PNP ও NPN sensor-এর পার্থক্য কী?", "PNP ON হলে +24V দেয়। NPN ON হলে 0V-এর দিকে টানে। PLC input-এর ধরন অনুযায়ী বাছাই করতে হয়।"], ["Timer কেন লাগে?", "নির্দিষ্ট সময় পরে output ON বা OFF করতে, যেমন Star-Delta changeover।"]],
      tip: "যে brand-এর PLC জানেন, শুধু সেটাই বলুন এবং software-এর নাম উল্লেখ করুন।" },
    { id: "safetyq", group: "Technical Q&A", icon: "shield-check", title: "Job Site Safety প্রশ্ন", summary: "Safety সম্পর্কে আপনার সচেতনতা যাচাই।",
      qa: [["কাজ শুরুর আগে প্রথম কাজ কী?", "Supply বন্ধ করা, lock ও tag দেওয়া এবং meter দিয়ে voltage নেই তা যাচাই করা।"], ["কেউ shock খেলে কী করবেন?", "আগে supply বন্ধ করুন। না পারলে শুকনো অপরিবাহী জিনিস দিয়ে আলাদা করুন এবং জরুরি সাহায্য ডাকুন।"], ["PPE কী কী?", "Insulated gloves, safety shoes, helmet ও safety glasses।"], ["Capacitor ধরার আগে কী করবেন?", "Safe পদ্ধতিতে discharge করবেন।"]],
      tip: "Safety নিয়ে উত্তরে কোম্পানি আপনার দায়িত্ববোধ দেখে।" },
    { id: "practical", group: "Practical ও Career", icon: "tools", title: "Practical / Trade Test", summary: "হাতে-কলমে পরীক্ষায় কী খেয়াল রাখবেন।",
      points: ["কাজ শুরুর আগে supply বন্ধ আছে কি না যাচাই করুন।", "Diagram ভালো করে পড়ে তারপর wiring শুরু করুন।", "সঠিক tool ও meter ব্যবহার করুন।", "Power দেওয়ার আগে continuity ও insulation পরীক্ষা করুন।", "কাজ পরিষ্কার রাখুন এবং সময়ের মধ্যে শেষ করুন।"],
      tip: "তাড়াহুড়োর চেয়ে নিরাপদ ও সঠিক কাজ বেশি নম্বর পায়।" },
    { id: "career", group: "Practical ও Career", icon: "trending-up", title: "Career ও বেতন আলোচনা", summary: "শুরু থেকে পরের ধাপে যাওয়ার পথ।",
      points: ["শুরুতে হাতে-কলমে অভিজ্ঞতা সবচেয়ে গুরুত্বপূর্ণ।", "Helper বা technician থেকে senior technician, supervisor ও engineer পদের দিকে যাওয়া যায়।", "PLC, VFD ও panel wiring-এর মতো দক্ষতা যোগ করলে সুযোগ বাড়ে।", "বেতন নিয়ে কথা বলার সময় নিজের দক্ষতা ও কাজের প্রমাণ দেখান।"],
      tip: "প্রতি বছর অন্তত একটি নতুন দক্ষতা শেখার লক্ষ্য রাখুন।" },
  ];

  function App() {
    const [group, setGroup] = useState("সব বিষয়");
    const [search, setSearch] = useState("");
    const [topic, setTopic] = useState(null);

    const list = useMemo(() => {
      const q = search.trim().toLowerCase();
      return TOPICS.filter((t) => (group === "সব বিষয়" || t.group === group) && (!q || `${t.title} ${t.summary} ${t.group}`.toLowerCase().includes(q)));
    }, [group, search]);

    if (topic) return <Detail topic={topic} onBack={() => setTopic(null)} />;
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TopHeader title="Job Preparation" icon="briefcase-account" subtitle="CV, interview, technical প্রশ্ন ও practical test-এর প্রস্তুতি।" />
        <View style={styles.search}>
          <MaterialCommunityIcons name="magnify" size={21} color="#64748B" />
          <TextInput value={search} onChangeText={setSearch} placeholder="Topic খুঁজুন..." placeholderTextColor="#94A3B8" style={styles.input} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {GROUPS.map((g) => (
            <TouchableOpacity key={g} onPress={() => setGroup(g)} style={[styles.chip, group === g && styles.chipActive]}>
              <Text style={[styles.chipText, group === g && styles.chipTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.heading}>Topic List ({list.length})</Text>
        {list.map((t, i) => (
          <TouchableOpacity key={t.id} style={styles.card} onPress={() => setTopic(t)} activeOpacity={0.8}>
            <View style={styles.cardIcon}><MaterialCommunityIcons name={t.icon} size={24} color={COLOR} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{t.title}</Text>
              <Text style={styles.cardGroup}>{t.group}</Text>
              <Text style={styles.cardSummary}>{t.summary}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLOR} />
          </TouchableOpacity>
        ))}
        {!list.length && <Text style={styles.empty}>কোনো topic পাওয়া যায়নি।</Text>}
      </ScrollView>
    );
  }

  function TopHeader({ title, icon, subtitle, onBack }) {
    return (
      <View style={styles.header}>
        <NavRow onBack={onBack} />
        <View style={styles.headerRow}>
          <MaterialCommunityIcons name={icon} size={30} color="#FFFFFF" />
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        {!!subtitle && <Text style={styles.headerSub}>{subtitle}</Text>}
      </View>
    );
  }

  function Detail({ topic, onBack }) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TopHeader title={topic.title} icon={topic.icon} onBack={onBack} />
        <Text style={styles.badge}>{topic.group}</Text>
        <Block title="সংক্ষেপে" icon="text-box-outline"><Text style={styles.body}>{topic.summary}</Text></Block>
        {!!topic.points && (
          <Block title="মূল বিষয়" icon="format-list-checks">
            {topic.points.map((p, i) => <Text key={i} style={styles.bullet}>• {p}</Text>)}
          </Block>
        )}
        {!!topic.qa && topic.qa.map(([q, a], i) => (
          <View key={i} style={styles.qa}>
            <Text style={styles.q}>প্রশ্ন {i + 1}: {q}</Text>
            <Text style={styles.a}>{a}</Text>
          </View>
        ))}
        <Block title="Tip" icon="lightbulb-on-outline" bg="#FEF3C7" color="#A16207"><Text style={styles.body}>{topic.tip}</Text></Block>
      </ScrollView>
    );
  }

  function Block({ title, icon, children, bg = "#FFFFFF", color = COLOR }) {
    return (
      <View style={[styles.block, { backgroundColor: bg, borderLeftColor: color }]}>
        <View style={styles.blockTitleRow}>
          <MaterialCommunityIcons name={icon} size={21} color={color} />
          <Text style={[styles.blockTitle, { color }]}>{title}</Text>
        </View>
        {children}
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF7F8" },
    content: { padding: 16, paddingBottom: 35 },
    header: { backgroundColor: COLOR, borderRadius: 20, padding: 20, marginBottom: 14 },
    headerRow: { flexDirection: "row", alignItems: "center" },
    headerTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold", marginLeft: 9, flex: 1 },
    headerSub: { color: "#FFE4E6", fontSize: 13, lineHeight: 20, marginTop: 8 },
    search: { height: 49, backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 13, flexDirection: "row", alignItems: "center", marginBottom: 12 },
    input: { flex: 1, color: "#1E293B", marginLeft: 8, fontSize: 14 },
    chips: { marginBottom: 12 },
    chip: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 20, paddingVertical: 9, paddingHorizontal: 10, marginRight: 8 },
    chipActive: { backgroundColor: COLOR, borderColor: COLOR },
    chipText: { color: "#475569", fontSize: 12 },
    chipTextActive: { color: "#FFFFFF", fontWeight: "bold" },
    heading: { color: "#0F172A", fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    card: { backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#E2E8F0", padding: 12, marginBottom: 10, flexDirection: "row", alignItems: "center" },
    cardIcon: { width: 46, height: 46, borderRadius: 13, backgroundColor: "#FFE4E6", alignItems: "center", justifyContent: "center", marginRight: 11 },
    cardTitle: { color: "#0F172A", fontSize: 15, fontWeight: "bold" },
    cardGroup: { color: COLOR, fontSize: 11, fontWeight: "bold", marginTop: 3 },
    cardSummary: { color: "#64748B", fontSize: 12, marginTop: 3 },
    empty: { color: "#64748B", textAlign: "center", marginTop: 20 },
    badge: { color: COLOR, fontSize: 11, fontWeight: "bold", marginBottom: 10 },
    block: { borderRadius: 15, padding: 16, marginBottom: 12, borderLeftWidth: 4 },
    blockTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    blockTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 8 },
    body: { color: "#334155", fontSize: 14, lineHeight: 23 },
    bullet: { color: "#334155", fontSize: 14, lineHeight: 23, marginBottom: 6 },
    qa: { backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#FECDD3", padding: 14, marginBottom: 10 },
    q: { color: COLOR, fontSize: 14, fontWeight: "bold", marginBottom: 6 },
    a: { color: "#334155", fontSize: 14, lineHeight: 22 },
  });

  return App;
})();

/*
==================================================
SECTION MODULES
কোন section id খুললে কোন module দেখাবে, তা এখানে ঠিক করা আছে।
নতুন module যোগ করলে এখানে একটি লাইন যোগ করবে।
==================================================
*/

const SECTION_MODULES = {
  electrical: { Component: ElectricalModule },
  electronics: { Component: ElectronicsModule },
  calculation: { Component: CalculationModule },
  safety: { Component: SafetyModule },
  measurement: { Component: MeasurementModule },
  power: { Component: PowerFaultModule },
  quiz: { Component: QuizProgressModule },
  progress: { Component: QuizProgressModule, props: { initialScreen: "progress" } },
  saved: { Component: SavedTopicsModule },
  plc: { Component: PLCModule },
  job: { Component: JobPrepModule },
};

function ModuleHost({ onBack, children }) {
  return (
    <HomeContext.Provider value={onBack}>
      <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>{children}</View>
    </HomeContext.Provider>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("home");

  if (currentScreen === "home") {
    return (
      <HomeScreen
        onOpenSection={(sectionId) => setCurrentScreen(sectionId)}
      />
    );
  }

  const entry = SECTION_MODULES[currentScreen];

  if (entry) {
    const { Component, props } = entry;
    return (
      <ModuleHost onBack={() => setCurrentScreen("home")}>
        <Component key={currentScreen} {...props} />
      </ModuleHost>
    );
  }

  return (
    <SectionScreen
      sectionId={currentScreen}
      onBack={() => setCurrentScreen("home")}
    />
  );
}

/*
==================================================
HOME SCREEN
এখানে Home Screen-এর design রাখা হয়েছে।
==================================================
*/

function HomeScreen({ onOpenSection }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER START */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTextBox}>
            <Text style={styles.welcomeText}>WELCOME TO</Text>

            <Text style={styles.appTitle}>
              Electrical & Electronics
            </Text>

            <Text style={styles.appTitleBangla}>বাংলা</Text>
          </View>

          <View style={styles.headerIconBox}>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={35}
              color="#FACC15"
            />
          </View>
        </View>

        <Text style={styles.headerDescription}>
          শিখুন, হিসাব করুন, পরীক্ষা করুন এবং Viva-এর প্রস্তুতি নিন
        </Text>
      </View>
      {/* HEADER END */}

      {/* SEARCH START */}
      <View style={styles.searchBox}>
        <MaterialCommunityIcons
          name="magnify"
          size={23}
          color="#64748B"
        />

        <TextInput
          style={styles.searchInput}
          placeholder="কোন বিষয় খুঁজছেন?"
          placeholderTextColor="#94A3B8"
        />
      </View>
      {/* SEARCH END */}

      <Text style={styles.sectionHeading}>
        শেখার জন্য একটি বিষয় নির্বাচন করুন
      </Text>

      {/* VIVA FEATURED CARD START */}
      <TouchableOpacity
        style={styles.vivaCard}
        onPress={() => onOpenSection("viva")}
        activeOpacity={0.85}
      >
        <View style={styles.vivaIconBox}>
          <MaterialCommunityIcons
            name="school"
            size={30}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.vivaTextBox}>
          <Text style={styles.vivaLabel}>FEATURED SECTION</Text>

          <Text style={styles.vivaTitle}>
            Viva Preparation
          </Text>

          <Text style={styles.vivaSubtitle}>
            চাকরি ও interview-এর জন্য প্রস্তুতি নিন
          </Text>
        </View>

        <MaterialCommunityIcons
          name="arrow-right"
          size={25}
          color="#FFFFFF"
        />
      </TouchableOpacity>
      {/* VIVA FEATURED CARD END */}

      {/* MAIN SECTIONS START
      SECTION_REGISTRY-এর সব section এখানে নিজে নিজে দেখাবে।
      নতুন section যোগ করলে এই অংশে আলাদা code লাগবে না।
      */}
      <View style={styles.sectionList}>
        {SECTION_REGISTRY.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            onPress={() => onOpenSection(section.id)}
          />
        ))}
      </View>
      {/* MAIN SECTIONS END */}

      {/* QUIZ CARD START */}
      <TouchableOpacity
        style={styles.quizCard}
        onPress={() => onOpenSection("quiz")}
        activeOpacity={0.85}
      >
        <View style={styles.quizIconBox}>
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={28}
            color="#92400E"
          />
        </View>

        <View style={styles.quizTextBox}>
          <Text style={styles.quizTitle}>Random Quiz</Text>

          <Text style={styles.quizSubtitle}>
            Electrical & Electronics বিষয়ে নিজের জ্ঞান যাচাই করুন
          </Text>
        </View>

        <MaterialCommunityIcons
          name="arrow-right"
          size={24}
          color="#92400E"
        />
      </TouchableOpacity>
      {/* QUIZ CARD END */}

      {/* EXTRA HOME FEATURES START */}
      <View style={styles.twoColumnRow}>
        <SmallHomeCard
          icon="chart-line"
          title="My Progress"
          subtitle="শেখার অগ্রগতি"
          color="#2563EB"
          onPress={() => onOpenSection("progress")}
        />

        <SmallHomeCard
          icon="bookmark-outline"
          title="Saved Topics"
          subtitle="সংরক্ষিত বিষয়"
          color="#9333EA"
          onPress={() => onOpenSection("saved")}
        />
      </View>
      {/* EXTRA HOME FEATURES END */}

      {/* SAFETY TIP START */}
      <View style={styles.tipCard}>
        <View style={styles.tipTitleRow}>
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={23}
            color="#0369A1"
          />

          <Text style={styles.tipTitle}>
            আজকের Safety Tip
          </Text>
        </View>

        <Text style={styles.tipText}>
          বিদ্যুৎ নিয়ে কাজ করার আগে Main switch বন্ধ করুন। ভেজা হাতে
          কখনো electrical equipment স্পর্শ করবেন না।
        </Text>
      </View>
      {/* SAFETY TIP END */}

      <Text style={styles.footer}>
        শিক্ষামূলক app — High-voltage কাজের আগে প্রশিক্ষিত electrician-এর
        সাহায্য নিন।
      </Text>
    </ScrollView>
  );
}

/*
==================================================
MAIN SECTION CARD
Electrical, Electronics, Calculation ইত্যাদি card
এই component-এর মাধ্যমে তৈরি হচ্ছে।
==================================================
*/

function SectionCard({ section, onPress }) {
  return (
    <TouchableOpacity
      style={styles.sectionCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.sectionIconBox,
          { backgroundColor: section.color },
        ]}
      >
        <MaterialCommunityIcons
          name={section.icon}
          size={25}
          color="#FFFFFF"
        />
      </View>

      <View style={styles.sectionTextBox}>
        <Text style={styles.sectionTitle}>
          {section.title}
        </Text>

        <Text style={styles.sectionSubtitle}>
          {section.subtitle}
        </Text>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={section.color}
      />
    </TouchableOpacity>
  );
}

/*
==================================================
SMALL HOME CARD
My Progress এবং Saved Topics-এর জন্য।
==================================================
*/

function SmallHomeCard({
  icon,
  title,
  subtitle,
  color,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.smallCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.smallIconBox,
          { backgroundColor: color },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color="#FFFFFF"
        />
      </View>

      <Text style={styles.smallCardTitle}>{title}</Text>
      <Text style={styles.smallCardSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

/*
==================================================
SECTION SCREEN
প্রতিটি section-এর ভিতরের content এখানে পরে যোগ করবে।
==================================================
*/
function SectionScreen({ sectionId, onBack }) {
  const [selectedLesson, setSelectedLesson] = useState(null);

  const section = SECTION_REGISTRY.find(
    (item) => item.id === sectionId
  );

  const specialSections = {
    viva: {
      title: "Viva Preparation",
      icon: "school",
      color: "#2563EB",
      description:
        "Electrical ও Electronics-এর গুরুত্বপূর্ণ Viva প্রশ্ন অনুশীলন করুন।",
    },
    quiz: {
      title: "Random Quiz",
      icon: "help-circle-outline",
      color: "#CA8A04",
      description: "প্রশ্নের উত্তর দিয়ে আপনার জ্ঞান যাচাই করুন।",
    },
    progress: {
      title: "My Progress",
      icon: "chart-line",
      color: "#2563EB",
      description: "আপনার শেখার অগ্রগতি এখানে দেখা যাবে।",
    },
    saved: {
      title: "Saved Topics",
      icon: "bookmark-outline",
      color: "#9333EA",
      description: "আপনার সংরক্ষিত বিষয়গুলো এখানে থাকবে।",
    },
  };

  const activeSection = section || specialSections[sectionId];
  const isElectrical = sectionId === "electrical";

  if (!activeSection) {
    return (
      <View style={styles.container}>
        <Text>Section পাওয়া যায়নি</Text>
      </View>
    );
  }

  // Lesson detail screen
  if (selectedLesson) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.innerHeader,
            { backgroundColor: selectedLesson.color },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedLesson(null)}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={22}
              color="#FFFFFF"
            />

            <Text style={styles.backText}>
              Electrical Topics
            </Text>
          </TouchableOpacity>

          <View style={styles.innerTitleRow}>
            <MaterialCommunityIcons
              name={selectedLesson.icon}
              size={30}
              color="#FFFFFF"
            />

            <Text style={styles.innerTitle}>
              {selectedLesson.title}
            </Text>
          </View>

          <Text style={styles.innerDescription}>
            {selectedLesson.subtitle}
          </Text>
        </View>

        <View style={styles.lessonCard}>
          <Text style={styles.lessonHeading}>
            সহজ ভাষায় জানুন
          </Text>

          {selectedLesson.lesson.map((paragraph, index) => (
            <View style={styles.lessonRow} key={index}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={21}
                color={selectedLesson.color}
              />

              <Text style={styles.lessonText}>
                {paragraph}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.formulaCard,
            { borderLeftColor: selectedLesson.color },
          ]}
        >
          <View style={styles.formulaTitleRow}>
            <MaterialCommunityIcons
              name="function-variant"
              size={23}
              color={selectedLesson.color}
            />

            <Text
              style={[
                styles.formulaTitle,
                { color: selectedLesson.color },
              ]}
            >
              Formula / মূল ধারণা
            </Text>
          </View>

          <Text style={styles.formulaText}>
            {selectedLesson.formula}
          </Text>
        </View>

        <View style={styles.exampleCard}>
          <View style={styles.formulaTitleRow}>
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={23}
              color="#A16207"
            />

            <Text style={styles.exampleTitle}>
              উদাহরণ
            </Text>
          </View>

          <Text style={styles.exampleText}>
            {selectedLesson.example}
          </Text>
        </View>

        <View style={styles.lessonSafetyCard}>
          <View style={styles.formulaTitleRow}>
            <MaterialCommunityIcons
              name="shield-alert-outline"
              size={23}
              color="#C2410C"
            />

            <Text style={styles.safetyTitle}>
              Safety Note
            </Text>
          </View>

          <Text style={styles.safetyText}>
            {selectedLesson.safety}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.backHomeButton,
            { backgroundColor: selectedLesson.color },
          ]}
          onPress={() => setSelectedLesson(null)}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.backHomeText}>
            Topic List-এ ফিরে যান
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.innerHeader,
          { backgroundColor: activeSection.color },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>

        <View style={styles.innerTitleRow}>
          <MaterialCommunityIcons
            name={activeSection.icon}
            size={32}
            color="#FFFFFF"
          />

          <Text style={styles.innerTitle}>
            {activeSection.title}
          </Text>
        </View>

        <Text style={styles.innerDescription}>
          {activeSection.description}
        </Text>
      </View>

      {isElectrical ? (
        <>
          <Text style={styles.topicListHeading}>
            Electrical-এর বিষয়সমূহ
          </Text>

          <Text style={styles.topicListDescription}>
            নিচের যেকোনো একটি topic নির্বাচন করে lesson পড়ুন।
          </Text>

          {ELECTRICAL_LESSONS.map((lesson, index) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.topicCard}
              onPress={() => setSelectedLesson(lesson)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.topicNumber,
                  { backgroundColor: lesson.color },
                ]}
              >
                <Text style={styles.topicNumberText}>
                  {index + 1}
                </Text>
              </View>

              <View style={styles.topicIconBox}>
                <MaterialCommunityIcons
                  name={lesson.icon}
                  size={23}
                  color={lesson.color}
                />
              </View>

              <View style={styles.topicTextBox}>
                <Text style={styles.topicTitle}>
                  {lesson.title}
                </Text>

                <Text style={styles.topicSubtitle}>
                  {lesson.subtitle}
                </Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={lesson.color}
              />
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <View style={styles.comingCard}>
          <MaterialCommunityIcons
            name="tools"
            size={42}
            color={activeSection.color}
          />

          <Text style={styles.comingTitle}>
            এই section-এর lesson পরে যোগ করা হবে
          </Text>

          <Text style={styles.comingText}>
            এখানে topic list, lesson, calculator, animation ও quiz
            যোগ করা হবে।
          </Text>
        </View>
      )}
    </ScrollView>
  );
}


/*
==================================================
STYLES
==================================================
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },


  content: {
    padding: 16,
    paddingBottom: 35,
  },
  topicListHeading: {
    color: "#0F172A",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 5,
  },

  topicListDescription: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 15,
  },

  topicCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 13,
    marginBottom: 11,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  topicNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  topicNumberText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },

  topicIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  topicTextBox: {
    flex: 1,
  },

  topicTitle: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "bold",
  },

  topicSubtitle: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 3,
  },

  lessonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 17,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  lessonHeading: {
    color: "#0F172A",
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 13,
  },

  lessonRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 11,
  },

  lessonText: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
    marginLeft: 9,
  },

  formulaCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    padding: 16,
    marginBottom: 13,
    borderLeftWidth: 5,
  },

  formulaTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  formulaTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  formulaText: {
    color: "#14532D",
    fontSize: 16,
    lineHeight: 25,
    fontWeight: "bold",
  },

  exampleCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 14,
    padding: 16,
    marginBottom: 13,
  },

  exampleTitle: {
    color: "#A16207",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  exampleText: {
    color: "#713F12",
    fontSize: 14,
    lineHeight: 21,
  },

  lessonSafetyCard: {
    backgroundColor: "#FFEDD5",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  safetyTitle: {
    color: "#C2410C",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  safetyText: {
    color: "#9A3412",
    fontSize: 13,
    lineHeight: 20,
  },

  header: {
    backgroundColor: "#0F172A",
    borderRadius: 22,
    padding: 22,
    marginBottom: 16,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTextBox: {
    flex: 1,
  },

  welcomeText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  appTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },

  appTitleBangla: {
    color: "#38BDF8",
    fontSize: 21,
    fontWeight: "bold",
    marginTop: 2,
  },

  headerIconBox: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },

  headerDescription: {
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 18,
  },

  searchBox: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
    marginLeft: 9,
  },

  sectionHeading: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 13,
  },

  vivaCard: {
    backgroundColor: "#2563EB",
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  vivaIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  vivaTextBox: {
    flex: 1,
  },

  vivaLabel: {
    color: "#BFDBFE",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  vivaTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 3,
  },

  vivaSubtitle: {
    color: "#DBEAFE",
    fontSize: 12,
    marginTop: 4,
  },

  sectionList: {
    marginBottom: 5,
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 14,
    marginBottom: 11,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  sectionIconBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  sectionTextBox: {
    flex: 1,
  },

  sectionTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "bold",
  },

  sectionSubtitle: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 3,
  },

  quizCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCD34D",
    marginTop: 5,
  },

  quizIconBox: {
    marginRight: 13,
  },

  quizTextBox: {
    flex: 1,
  },

  quizTitle: {
    color: "#92400E",
    fontSize: 17,
    fontWeight: "bold",
  },

  quizSubtitle: {
    color: "#A16207",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  twoColumnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  smallCard: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  smallIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  smallCardTitle: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "bold",
  },

  smallCardSubtitle: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 4,
  },

  tipCard: {
    backgroundColor: "#E0F2FE",
    borderRadius: 15,
    padding: 16,
    marginTop: 18,
  },

  tipTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  tipTitle: {
    color: "#0369A1",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  tipText: {
    color: "#0C4A6E",
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    color: "#64748B",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 20,
  },

  innerHeader: {
    borderRadius: 20,
    padding: 21,
    marginBottom: 20,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 6,
  },

  innerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  innerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 11,
    flex: 1,
  },

  innerDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
  },

  comingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  comingTitle: {
    color: "#0F172A",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
  },

  comingText: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 9,
  },

  backHomeButton: {
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
  },

  backHomeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 7,
  },
});