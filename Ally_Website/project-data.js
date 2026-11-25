let english_adjective, english_noun, english_verb, english_adverb;
let english_prepositionsconnectors, english_interjectionsexclamation, latin_idioms;
let abstractconcept_idioms_english, english_presence_tangible, english_presence_being;
let english_mythical_places_realms, english_mythical_beings_creatures_entities;
let english_mystical_objects_artefacts;
let spanish_adjective, spanish_noun, spanish_verb, spanish_adverb;
let spanish_preposition_sconnectors, spanish_interjections_exclamation, spanish_latin_idioms;
let abstractconcept_idioms_spanish, spanish_presence_tangible, spanish_presence_being;
let spanish_mythical_places_realms, spanish_mythical_beings_creatures_entities;
let spanish_mystical_objects_artefacts;
let projectReferenceData;

const vocabularySources = [
  { language: "English", src: "../05. Heat vocabulary/English/heat_english_adjectives.json" },
  { language: "English", src: "../05. Heat vocabulary/English/heat_english_adverbs.json" },
  { language: "English", src: "../05. Heat vocabulary/English/heat_english_interjections_exclamations.json" },
  { language: "English", src: "../05. Heat vocabulary/English/heat_english_nouns.json" },
  { language: "English", src: "../05. Heat vocabulary/English/heat_english_verbs.json" },
  { language: "Spanish", src: "../05. Heat vocabulary/Spanish/calor_espanol_adjetivos.json" },
  { language: "Spanish", src: "../05. Heat vocabulary/Spanish/calor_espanol_adverbios.json" },
  { language: "Spanish", src: "../05. Heat vocabulary/Spanish/calor_espanol_interjecciones_exclamaciones.json" },
  { language: "Spanish", src: "../05. Heat vocabulary/Spanish/calor_espanol_sustantivos.json" },
  { language: "Spanish", src: "../05. Heat vocabulary/Spanish/calor_espanol_verbos.json" }
];

const poetryBankKeys = [
  "english_adjective", "english_noun", "english_verb", "english_adverb",
  "english_prepositionsconnectors", "english_interjectionsexclamation",
  "spanish_adjective", "spanish_noun", "spanish_verb", "spanish_adverb",
  "spanish_preposition_sconnectors", "spanish_interjections_exclamation",
  "latin_idioms", "abstractconcept_idioms_english", "english_presence_tangible",
  "english_presence_being", "english_mythical_places_realms",
  "english_mythical_beings_creatures_entities", "english_mystical_objects_artefacts",
  "abstractconcept_idioms_spanish", "spanish_presence_tangible",
  "spanish_presence_being", "spanish_mythical_places_realms",
  "spanish_mythical_beings_creatures_entities", "spanish_mystical_objects_artefacts",
  "spanish_latin_idioms"
];

function requireWordBank(bank) {
  for (const key of poetryBankKeys) {
    if (!Array.isArray(bank[key]) || !bank[key].length ||
        !bank[key].every(word => typeof word === "string")) {
      throw new Error("Ally's poetry data is incomplete.");
    }
  }
  english_adjective = bank.english_adjective;
  english_noun = bank.english_noun;
  english_verb = bank.english_verb;
  english_adverb = bank.english_adverb;
  english_prepositionsconnectors = bank.english_prepositionsconnectors;
  english_interjectionsexclamation = bank.english_interjectionsexclamation;
  latin_idioms = bank.latin_idioms;
  abstractconcept_idioms_english = bank.abstractconcept_idioms_english;
  english_presence_tangible = bank.english_presence_tangible;
  english_presence_being = bank.english_presence_being;
  english_mythical_places_realms = bank.english_mythical_places_realms;
  english_mythical_beings_creatures_entities = bank.english_mythical_beings_creatures_entities;
  english_mystical_objects_artefacts = bank.english_mystical_objects_artefacts;
  spanish_adjective = bank.spanish_adjective;
  spanish_noun = bank.spanish_noun;
  spanish_verb = bank.spanish_verb;
  spanish_adverb = bank.spanish_adverb;
  spanish_preposition_sconnectors = bank.spanish_preposition_sconnectors;
  spanish_interjections_exclamation = bank.spanish_interjections_exclamation;
  spanish_latin_idioms = bank.spanish_latin_idioms;
  abstractconcept_idioms_spanish = bank.abstractconcept_idioms_spanish;
  spanish_presence_tangible = bank.spanish_presence_tangible;
  spanish_presence_being = bank.spanish_presence_being;
  spanish_mythical_places_realms = bank.spanish_mythical_places_realms;
  spanish_mythical_beings_creatures_entities = bank.spanish_mythical_beings_creatures_entities;
  spanish_mystical_objects_artefacts = bank.spanish_mystical_objects_artefacts;
}

function readDuration(documentText, label) {
  const position = documentText.indexOf(label);
  if (position < 0) throw new Error("Ally's timing data is incomplete.");
  const value = documentText.slice(position + label.length, position + label.length + 140)
    .match(/Value:\s*(\d+)\s*(seconds?|milliseconds?)/i);
  if (!value) throw new Error("Ally's timing data is incomplete.");
  return Number(value[1]) * (/^seconds?$/i.test(value[2]) ? 1000 : 1);
}

function readHeatThresholds(documentText) {
  const ranges = [...documentText.matchAll(/Heat references:\s*(\d+)\s*[-–]\s*\d+/gi)];
  const high = documentText.match(/Heat references:\s*(\d+)\s+or more/i);
  if (ranges.length < 2 || !high) throw new Error("Ally's speed data is incomplete.");
  return { low: Number(ranges[0][1]), medium: Number(ranges[1][1]), high: Number(high[1]) };
}

async function loadProjectFile(source) {
  const url = new URL(source.src, location.href);
  if (url.origin !== location.origin) throw new Error("Project data must be served from one origin.");
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Project data request failed (${response.status}).`);

  if (source.kind === "image") return [source.src, await response.blob()];
  if (source.kind === "json") return [source.src, await response.json()];
  return [source.src, await response.text()];
}

function getProjectText(files, path) {
  const value = files.get(path);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("A required project reference is unavailable.");
  }
  return value;
}

async function loadProjectData() {
  try {
    if (location.protocol === "file:") {
      throw new Error("Open Ally through localhost or HTTPS to connect its project data.");
    }

    const manifestResponse = await fetch("./data/project-sources.json");
    if (!manifestResponse.ok) throw new Error("Ally's project data index is unavailable.");
    const manifest = await manifestResponse.json();
    if (!Array.isArray(manifest.sources) || !manifest.sources.length ||
        manifest.sources.some(source => !source.src || !source.kind)) {
      throw new Error("Ally's project data index is invalid.");
    }

    const projectFiles = new Map(await Promise.all(manifest.sources.map(loadProjectFile)));
    const getText = path => getProjectText(projectFiles, path);
    const vocabularyByLanguage = {
      English: vocabularySources.filter(source => source.language === "English")
        .flatMap(source => projectFiles.get(source.src) || []),
      Spanish: vocabularySources.filter(source => source.language === "Spanish")
        .flatMap(source => projectFiles.get(source.src) || [])
    };
    if (Object.values(vocabularyByLanguage).some(words =>
      !words.length || !words.every(word => typeof word === "string"))) {
      throw new Error("Ally's bilingual vocabulary is unavailable.");
    }

    const poetryBank = projectFiles.get("../06. Code/heat_poetry_word_banks.json");
    requireWordBank(poetryBank);
    const heatTerms = [...new Set(Object.values(vocabularyByLanguage).flat().map(norm).filter(Boolean))]
      .sort((a, b) => b.length - a.length);
    if (!heatTerms.length) throw new Error("Ally's bilingual vocabulary is empty.");
    lex.splice(0, lex.length, ...heatTerms);

    const systemInstructions = getText("../01. Instructions/System_Instructions.md");
    heatThresholds = readHeatThresholds(systemInstructions);
    C.window = readDuration(systemInstructions, "Vocabulary accumulation window");
    C.decay = readDuration(systemInstructions, "Silence before target speed becomes zero");
    C.silence = readDuration(systemInstructions, "Silence before poetic invitation");
    C.hold = readDuration(systemInstructions, "Minimum breath detection duration");

    projectReferenceData = Object.freeze({
      index: manifest.sources,
      files: projectFiles,
      vocabulary: vocabularyByLanguage,
      poetry: poetryBank,
      behavior: Object.freeze({
        instructions: systemInstructions,
        matrix: getText("../03. Behavioral chart/Behavioral_Matrix.md"),
        timing: getText("../03. Behavioral chart/Temporal_Behaviour.md"),
        flow: getText("../03. Behavioral chart/interaction_flowchart.md"),
        conceptual: getText("../04. Behavior/Conceptual_Behaviour.md"),
        linguistic: getText("../04. Behavior/Linguistic_Behavior.md"),
        physical: getText("../04. Behavior/Physical_behaviour.md"),
        poetic: getText("../04. Behavior/Poetic_Behavior.md"),
        reciprocity: getText("../04. Behavior/Reciprocity.md"),
        thresholds: heatThresholds,
        parameters: { vocabularyWindow: C.window, decay: C.decay, silence: C.silence, breathHold: C.hold }
      })
    });

    $("start").disabled = false;
    $("invite").disabled = false;
    $("detail").textContent = "The listening system is ready. Enable the microphone and speak about heat.";
  } catch (error) {
    console.error("Ally's internal project data could not be loaded.", error);
    status("Data unavailable", location.protocol === "file:"
      ? "Open this page through localhost or HTTPS to connect Ally's project data."
      : "Ally's data is unavailable. Check the connection and reload.");
    $("start").disabled = true;
    $("invite").disabled = true;
  }
}

loadProjectData();
