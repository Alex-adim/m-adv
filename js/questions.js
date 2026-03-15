// ========== QUESTIONS MODULE ==========
// Question generation, CSV parsing, and template engine.

const QUESTIONS_PER_ROUND = 5;

let questionBank = { 1: [], 2: [], 3: [] };

const wordProblemNames = ['Liz', 'Sam', 'Mia', 'Ben', 'Zoe', 'Leo', 'Ava', 'Max', 'Lily', 'Jake'];

const EMBEDDED_CSV = `level,type,template,operation,Number1,Number2,Name
1,equation,{Number1} + {Number2} =,Number1 + Number2,Random(1;9),Random(1;10-Number1),
1,equation,{Number1} - {Number2} =,Number1 - Number2,Random(2;10),Random(1;Number1-1),
1,word,"{Name} has {Number1} apples and finds {Number2} more. How many apples does {Name} have now?",Number1 + Number2,Random(1;9),Random(1;10-Number1),RandomName
1,word,"There are {Number1} birds in a tree. {Number2} more birds fly in. How many birds are there now?",Number1 + Number2,Random(1;9),Random(1;10-Number1),RandomName
1,word,"{Name} has {Number1} stickers. A friend gives {Name} {Number2} more. How many stickers does {Name} have?",Number1 + Number2,Random(1;9),Random(1;10-Number1),RandomName
1,word,"{Name} sees {Number1} butterflies. Then {Number2} more butterflies come. How many butterflies are there?",Number1 + Number2,Random(1;9),Random(1;10-Number1),RandomName
1,word,"There are {Number1} cookies on a plate. Mom puts {Number2} more cookies. How many cookies are on the plate?",Number1 + Number2,Random(1;9),Random(1;10-Number1),RandomName
1,word,"{Name} picks {Number1} flowers. Then {Name} picks {Number2} more. How many flowers does {Name} have?",Number1 + Number2,Random(1;9),Random(1;10-Number1),RandomName
1,word,"{Name} has {Number1} crayons in a box. {Name} gets {Number2} new ones. How many crayons does {Name} have now?",Number1 + Number2,Random(1;9),Random(1;10-Number1),RandomName
1,word,"There are {Number1} ducks in the pond. {Number2} more ducks jump in. How many ducks are in the pond?",Number1 + Number2,Random(1;9),Random(1;10-Number1),RandomName
1,word,"{Name} has {Number1} apples and eats {Number2}. How many apples are left?",Number1 - Number2,Random(2;10),Random(1;Number1-1),RandomName
1,word,"There are {Number1} fish in a pond. {Number2} swim away. How many fish are left?",Number1 - Number2,Random(2;10),Random(1;Number1-1),RandomName
1,word,"{Name} has {Number1} balloons. {Number2} balloons pop. How many balloons are left?",Number1 - Number2,Random(2;10),Random(1;Number1-1),RandomName
1,word,"{Name} has {Number1} candies and gives {Number2} to a friend. How many candies does {Name} have now?",Number1 - Number2,Random(2;10),Random(1;Number1-1),RandomName
1,word,"There are {Number1} dogs in the park. {Number2} dogs go home. How many dogs are still in the park?",Number1 - Number2,Random(2;10),Random(1;Number1-1),RandomName
1,word,"{Name} bakes {Number1} cupcakes. The family eats {Number2}. How many cupcakes are left?",Number1 - Number2,Random(2;10),Random(1;Number1-1),RandomName
1,word,"{Name} has {Number1} stars on a chart. {Number2} stars fall off. How many stars are left?",Number1 - Number2,Random(2;10),Random(1;Number1-1),RandomName
1,word,"There are {Number1} books on the shelf. {Name} takes {Number2} books. How many books are on the shelf now?",Number1 - Number2,Random(2;10),Random(1;Number1-1),RandomName
2,equation,{Number1} + {Number2} =,Number1 + Number2,Random(1;19),Random(1;20-Number1),
2,equation,{Number1} - {Number2} =,Number1 - Number2,Random(2;20),Random(1;Number1-1),
2,equation,{Number1} x {Number2} =,Number1 * Number2,Random(1;10),RandomChoice(2;3),
3,word,"{Name} has {Number1} apples and finds {Number2} more. How many apples does {Name} have now?",Number1 + Number2,Random(1;19),Random(1;20-Number1),RandomName
3,word,"There are {Number1} birds in a tree. {Number2} more birds fly in. How many birds are there now?",Number1 + Number2,Random(1;19),Random(1;20-Number1),RandomName
3,word,"{Name} has {Number1} stickers. A friend gives {Name} {Number2} more. How many stickers does {Name} have?",Number1 + Number2,Random(1;19),Random(1;20-Number1),RandomName
3,word,"{Name} sees {Number1} butterflies. Then {Number2} more butterflies come. How many butterflies are there?",Number1 + Number2,Random(1;19),Random(1;20-Number1),RandomName
3,word,"There are {Number1} cookies on a plate. Mom puts {Number2} more cookies. How many cookies are on the plate?",Number1 + Number2,Random(1;19),Random(1;20-Number1),RandomName
3,word,"{Name} picks {Number1} flowers. Then {Name} picks {Number2} more. How many flowers does {Name} have?",Number1 + Number2,Random(1;19),Random(1;20-Number1),RandomName
3,word,"{Name} has {Number1} crayons in a box. {Name} gets {Number2} new ones. How many crayons does {Name} have now?",Number1 + Number2,Random(1;19),Random(1;20-Number1),RandomName
3,word,"There are {Number1} ducks in the pond. {Number2} more ducks jump in. How many ducks are in the pond?",Number1 + Number2,Random(1;19),Random(1;20-Number1),RandomName
3,word,"{Name} has {Number1} apples and eats {Number2}. How many apples are left?",Number1 - Number2,Random(2;20),Random(1;Number1-1),RandomName
3,word,"There are {Number1} fish in a pond. {Number2} swim away. How many fish are left?",Number1 - Number2,Random(2;20),Random(1;Number1-1),RandomName
3,word,"{Name} has {Number1} balloons. {Number2} balloons pop. How many balloons are left?",Number1 - Number2,Random(2;20),Random(1;Number1-1),RandomName
3,word,"{Name} has {Number1} candies and gives {Number2} to a friend. How many candies does {Name} have now?",Number1 - Number2,Random(2;20),Random(1;Number1-1),RandomName
3,word,"There are {Number1} dogs in the park. {Number2} dogs go home. How many dogs are still in the park?",Number1 - Number2,Random(2;20),Random(1;Number1-1),RandomName
3,word,"{Name} bakes {Number1} cupcakes. The family eats {Number2}. How many cupcakes are left?",Number1 - Number2,Random(2;20),Random(1;Number1-1),RandomName
3,word,"{Name} has {Number1} stars on a chart. {Number2} stars fall off. How many stars are left?",Number1 - Number2,Random(2;20),Random(1;Number1-1),RandomName
3,word,"There are {Number1} books on the shelf. {Name} takes {Number2} books. How many books are on the shelf now?",Number1 - Number2,Random(2;20),Random(1;Number1-1),RandomName`;

function parseCSV(text) {
  const rows = [];
  const lines = text.split('\n');
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const fields = [];
    let field = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (inQuotes) {
        if (ch === '"' && line[c + 1] === '"') { field += '"'; c++; }
        else if (ch === '"') { inQuotes = false; }
        else { field += ch; }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === ',') { fields.push(field); field = ''; }
        else { field += ch; }
      }
    }
    fields.push(field);
    if (fields.length >= 6) {
      rows.push({
        level: parseInt(fields[0]),
        type: fields[1],
        template: fields[2],
        operation: fields[3],
        Number1: fields[4],
        Number2: fields[5],
        Name: fields[6] || ''
      });
    }
  }
  return rows;
}

function evaluateExpr(expr, context) {
  let result = expr;
  for (const [key, val] of Object.entries(context)) {
    result = result.replace(new RegExp('\\b' + key + '\\b', 'g'), val);
  }
  return Function('"use strict"; return (' + result + ')')();
}

function evaluateRange(spec, context) {
  spec = spec.trim();
  if (!spec) return undefined;

  if (spec === 'RandomName') {
    return wordProblemNames[Math.floor(Math.random() * wordProblemNames.length)];
  }

  const choiceMatch = spec.match(/^RandomChoice\((.+)\)$/);
  if (choiceMatch) {
    const options = choiceMatch[1].split(';').map(s => evaluateExpr(s.trim(), context));
    return options[Math.floor(Math.random() * options.length)];
  }

  const randMatch = spec.match(/^Random\((.+);(.+)\)$/);
  if (randMatch) {
    const min = evaluateExpr(randMatch[1].trim(), context);
    const max = evaluateExpr(randMatch[2].trim(), context);
    return randInt(min, max);
  }

  return evaluateExpr(spec, context);
}

function populateBank(text) {
  const rows = parseCSV(text);
  questionBank = { 1: [], 2: [], 3: [] };
  rows.forEach(row => {
    if (questionBank[row.level]) {
      questionBank[row.level].push(row);
    }
  });
}

async function loadQuestions() {
  try {
    const response = await fetch('questions.csv');
    const text = await response.text();
    populateBank(text);
  } catch (e) {
    console.warn('Could not fetch questions.csv, using embedded data.');
    populateBank(EMBEDDED_CSV);
  }
}

function generateQuestion(level) {
  const templates = questionBank[level];
  const row = templates[Math.floor(Math.random() * templates.length)];
  const context = {};

  context.Number1 = evaluateRange(row.Number1, context);
  context.Number2 = evaluateRange(row.Number2, context);
  if (row.Name) {
    context.Name = evaluateRange(row.Name, context);
  }

  const answer = evaluateExpr(row.operation, context);

  let wordText = null;
  let opSymbol = '+';

  if (row.type === 'word') {
    wordText = row.template.replace(/\{(\w+)\}/g, (_, key) => context[key]);
  } else {
    const display = row.template.replace(/\{(\w+)\}/g, (_, key) => context[key]);
    if (display.includes(' x ')) opSymbol = '\u00D7';
    else if (display.includes(' - ')) opSymbol = '\u2212';
    else opSymbol = '+';
  }

  return { a: context.Number1, b: context.Number2, answer, opSymbol, wordText };
}

function generateChoices(correctAnswer, level) {
  const choices = new Set([correctAnswer]);
  const maxNum = level === 1 ? 10 : 20;
  while (choices.size < 4) {
    const delta = randInt(1, level === 1 ? 5 : 12);
    const sign = Math.random() > 0.5 ? 1 : -1;
    const distractor = correctAnswer + sign * delta;
    if (distractor >= 0 && distractor <= maxNum + 10 && distractor !== correctAnswer) {
      choices.add(distractor);
    }
  }
  return shuffle([...choices]);
}
