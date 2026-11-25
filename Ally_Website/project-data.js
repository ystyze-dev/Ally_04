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

const sourceVocabularyPaths = [
  "../05. Heat vocabulary/English/heat_english_adjectives.json",
  "../05. Heat vocabulary/English/heat_english_adverbs.json",
  "../05. Heat vocabulary/English/heat_english_interjections_exclamations.json",
  "../05. Heat vocabulary/English/heat_english_nouns.json",
  "../05. Heat vocabulary/English/heat_english_verbs.json",
  "../05. Heat vocabulary/Spanish/calor_espanol_adjetivos.json",
  "../05. Heat vocabulary/Spanish/calor_espanol_adverbios.json",
  "../05. Heat vocabulary/Spanish/calor_espanol_interjecciones_exclamaciones.json",
  "../05. Heat vocabulary/Spanish/calor_espanol_sustantivos.json",
  "../05. Heat vocabulary/Spanish/calor_espanol_verbos.json"
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
    if (!Array.isArray(bank[key]) || !bank[key].every(word => typeof word === "string")) {
      throw new Error(`Poetry word bank is missing a valid "${key}" list.`);
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
  if (position < 0) throw new Error(`Behavior source is missing "${label}".`);
  const value = documentText.slice(position + label.length, position + label.length + 140)
    .match(/Value:\s*(\d+)\s*(seconds?|milliseconds?)/i);
  if (!value) throw new Error(`Behavior source has no value for "${label}".`);
  return Number(value[1]) * (/^seconds?$/i.test(value[2]) ? 1000 : 1);
}

function readHeatThresholds(documentText) {
  const ranges = [...documentText.matchAll(/Heat references:\s*(\d+)\s*[-–]\s*\d+/gi)];
  const high = documentText.match(/Heat references:\s*(\d+)\s+or more/i);
  if (ranges.length < 2 || !high) throw new Error("Behavior source is missing one or more heat-speed thresholds.");
  return { low: Number(ranges[0][1]), medium: Number(ranges[1][1]), high: Number(high[1]) };
}

function sourceElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderSources(sources) {
  const folders = [...new Set(sources.map(source => source.folder))].sort();
  for (const folder of folders) {
    const option = sourceElement("option", "", folder);
    option.value = folder;
    $("sourceFolder").append(option);
  }

  const render = () => {
    const query = $("sourceSearch").value.trim().toLocaleLowerCase();
    const folder = $("sourceFolder").value;
    const matches = sources.filter(source => {
      const matchesFolder = !folder || source.folder === folder;
      const matchesQuery = `${source.title} ${source.folder}`.toLocaleLowerCase().includes(query);
      return matchesFolder && matchesQuery;
    });
    const grid = $("sourceGrid");
    grid.replaceChildren();
    for (const source of matches) {
      const card = sourceElement("button", "source-card");
      card.type = "button";
      card.append(
        sourceElement("span", "source-card-title", source.title),
        sourceElement("span", "source-card-folder", source.folder)
      );
      card.addEventListener("click", () => previewSource(source));
      grid.append(card);
    }
    if (!matches.length) grid.append(sourceElement("p", "source-empty", "No sources match that search."));
  };

  $("sourceSearch").addEventListener("input", render);
  $("sourceFolder").addEventListener("change", render);
  $("closeSourcePreview").addEventListener("click", () => { $("sourcePreview").hidden = true; });
  render();
}

async function previewSource(source) {
  const preview = $("sourcePreview");
  const content = $("sourcePreviewContent");
  $("sourcePreviewTitle").textContent = source.title;
  content.replaceChildren();
  preview.hidden = false;

  if (source.kind === "image") {
    const image = sourceElement("img");
    image.alt = source.title;
    image.src = source.src;
    image.addEventListener("error", () => {
      content.replaceChildren(sourceElement("p", "", `Could not load ${source.title}.`));
    }, { once: true });
    content.append(image);
    preview.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const loading = sourceElement("p", "", "Loading source file…");
  content.append(loading);
  preview.scrollIntoView({ behavior: "smooth", block: "start" });
  try {
    const response = await fetch(source.src);
    if (!response.ok) throw new Error(`Request failed (${response.status}).`);
    const raw = await response.text();
    let text = raw;
    content.replaceChildren();
    if (source.kind === "json") {
      try {
        text = JSON.stringify(JSON.parse(raw), null, 2);
      } catch {
        content.replaceChildren(sourceElement("p", "", "This file is labeled JSON but is not valid JSON; showing its original text."));
      }
    }
    const pre = sourceElement("pre", "", text || "This source file is empty.");
    content.append(pre);
  } catch (error) {
    content.replaceChildren(sourceElement("p", "", `Could not load ${source.title}: ${error.message}`));
  }
}

async function loadProjectData() {
  const sourceStatus = $("sourceStatus");
  try {
    if (location.protocol === "file:") {
      throw new Error("Serve Ally_04 from localhost or HTTPS to load the project folders. From the repository root, run: python3 -m http.server --bind 127.0.0.1 8000");
    }

    const [manifestResponse, behaviorResponse, poetryResponse, ...vocabularyResponses] = await Promise.all([
      fetch("./data/project-sources.json"),
      fetch("../01. Instructions/System_Instructions.md"),
      fetch("../06. Code/heat_poetry_word_banks.json"),
      ...sourceVocabularyPaths.map(path => fetch(path))
    ]);

    const responses = [manifestResponse, behaviorResponse, poetryResponse, ...vocabularyResponses];
    const failed = responses.find(response => !response.ok);
    if (failed) throw new Error(`A project data request failed (${failed.status} ${failed.url}).`);

    const manifest = await manifestResponse.json();
    if (!Array.isArray(manifest.sources) || !manifest.sources.length) {
      throw new Error("The project source index is empty or invalid.");
    }
    const behaviorText = await behaviorResponse.text();
    const poetryBank = await poetryResponse.json();
    const categoryLists = await Promise.all(vocabularyResponses.map(response => response.json()));
    if (!categoryLists.every(list => Array.isArray(list) && list.every(word => typeof word === "string"))) {
      throw new Error("A bilingual heat vocabulary file must contain an array of words and expressions.");
    }

    requireWordBank(poetryBank);
    const terms = [...new Set(categoryLists.flat().map(norm).filter(Boolean))]
      .sort((a, b) => b.length - a.length);
    if (!terms.length) throw new Error("The bilingual heat vocabulary contains no usable terms.");
    lex.splice(0, lex.length, ...terms);

    heatThresholds = readHeatThresholds(behaviorText);
    C.window = readDuration(behaviorText, "Vocabulary accumulation window");
    C.decay = readDuration(behaviorText, "Silence before target speed becomes zero");
    C.silence = readDuration(behaviorText, "Silence before poetic invitation");
    C.hold = readDuration(behaviorText, "Minimum breath detection duration");

    renderSources(manifest.sources);
    sourceStatus.textContent = `${manifest.sources.length} project files connected · ${foldersCount(manifest.sources)} source folders · ${terms.length.toLocaleString()} bilingual heat references loaded from 10 vocabulary files. Connectors and prepositions are excluded from heat counting.`;
    $("start").disabled = false;
    $("invite").disabled = false;
    $("detail").textContent = "Project vocabulary and behavior settings are ready. Enable the microphone and speak about heat.";
  } catch (error) {
    sourceStatus.textContent = error.message;
    $("detail").textContent = "Live interaction is unavailable until project sources load.";
    $("start").disabled = true;
    $("invite").disabled = true;
  }
}

function foldersCount(sources) {
  return new Set(sources.map(source => source.folder)).size;
}

loadProjectData();
