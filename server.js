import express from "express";
import { encodeText, decodeToken } from "./main.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Custom Tokenizer" });
});

app.post("/encode", (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const tokens = encodeText(text);
    res.json({
      success: true,
      tokens: tokens,
      tokensString: tokens.join(", "),
    });
  } catch (error) {
    res.status(500).json({ error: "Encoding failed: " + error.message });
  }
});

app.post("/decode", (req, res) => {
  try {
    const { tokens } = req.body;
    if (!tokens) {
      return res.status(400).json({ error: "Tokens are required" });
    }

    let tokenArray;
    if (typeof tokens === "string") {
      tokenArray = tokens
        .split(",")
        .map((t) => parseInt(t.trim()))
        .filter((t) => !isNaN(t));
    } else if (Array.isArray(tokens)) {
      tokenArray = tokens.map((t) => parseInt(t)).filter((t) => !isNaN(t));
    } else {
      return res.status(400).json({ error: "Invalid tokens format" });
    }

    const text = decodeToken(tokenArray);
    res.json({
      success: true,
      text: text,
    });
  } catch (error) {
    res.status(500).json({ error: "Decoding failed: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
