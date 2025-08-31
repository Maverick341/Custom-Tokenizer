import jsonData from './vocab.json' with { type: 'json' };

let id_to_words = {};

for (const [key, value] of Object.entries(jsonData)) {
    id_to_words[value] = key;
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function encodeText(string) {

    let stringArray = string.toLowerCase().replace(/[^A-Za-z0-9_'-\s]+/g, function ($1) { return ' ' + $1 + ' '; }).match(/\S+/g);

    if (!stringArray) {
        stringArray = [];
    }

    let encodedOutput = [];
    encodedOutput.push(jsonData['<BOS>']);

    for (const word of stringArray) {
        if (jsonData.hasOwnProperty(word)) {
            encodedOutput.push(jsonData[`${word}`])
        } else {
            // encodedOutput.push(jsonData['<UNK>'])

            const newId = Object.keys(jsonData).length;

            jsonData[word] = newId;
            id_to_words[newId] = word;

            encodedOutput.push(newId);
        }
    }

    encodedOutput.push(jsonData['<EOS>']);

    return encodedOutput
}

export function decodeToken(tokens) {
    let decodedWords = [];

    for (const token of tokens) {
        const word = id_to_words[token];
        if (word === "<BOS>" || word === "<EOS>") continue;
        decodedWords.push(word)
    }

    if (decodedWords.length > 0) {
        const firstWord = decodedWords[0];
        if (typeof firstWord === "string") {
            decodedWords[0] = capitalizeFirstLetter(decodedWords[0]);
        }
    }

    let resultParts = [];
    let isPunctuationRegex = /[^\w'-]/;

    for (let i = 0; i < decodedWords.length; i++) {
        resultParts.push(decodedWords[i]);
        if (i < decodedWords.length - 1) {
            const nextToken = decodedWords[i + 1];

            if (!isPunctuationRegex.test(nextToken)) {
                resultParts.push(" ");
            }
        }
    }

    return resultParts.join("");
}

// let encodedOutput = encodeText("The old man will find it.");

// console.log(encodedOutput);

// let decodedString = decodeToken(encodedOutput);

// console.log(decodedString);

