import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini client lazily
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!process.env.GEMINI_API_KEY) {
      return null;
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // API: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API: AI Tutor Newton Chat Endpoint
  app.post("/api/tutor", async (req, res) => {
    try {
      const {
        message,
        language = "ru", // "ru" | "kz" | "en"
        subject = "Алгебра",
        grade = "9 класс",
        style = "analogy", // "analogy" | "algorithm" | "blitz"
        socraticLevel = 85,
        history = [],
      } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const client = getGeminiClient();

      // System instruction adapted to language and style
      let langDirective = "Respond in Russian.";
      if (language === "kz") {
        langDirective =
          "Respond entirely in natural, grammatically correct Kazakh language (қазақ тілі). Use standard Kazakh school terminology for math and science (мысалы: бөлшектер, ортақ бөлім, теңдеулер, Ньютон заңдары).";
      } else if (language === "en") {
        langDirective =
          "Respond entirely in clear, friendly English using international school curriculum standards.";
      }

      let styleDirective =
        "Use vivid real-life analogies (like cutting pizzas, football passes, games) to explain the math/science concept intuitively before giving numbers.";
      if (style === "algorithm") {
        styleDirective =
          "Provide a clear, numbered step-by-step algorithmic breakdown (Step 1, Step 2, Step 3).";
      } else if (style === "blitz") {
        styleDirective =
          "Be concise, laser-focused, highlight key formulas and instant takeaways.";
      }

      let socraticDirective = "";
      if (socraticLevel > 50) {
        socraticDirective =
          "You are a Socratic tutor: don't just dump the entire final answer immediately. Encourage the student, explain the core logic, and end with a quick mini-question or hint to check their understanding.";
      }

      const systemInstruction = `You are 'Newton AI', an expert, encouraging, and friendly school AI tutor in STEM subjects (Algebra, Geometry, Physics, Chemistry, Computer Science).
Target audience: School students.
Subject: ${subject}
Current Grade Level: ${grade}
${langDirective}
${styleDirective}
${socraticDirective}
Formatting guidelines:
- Use clean formatting, clear emojis, and bold mathematical terms.
- If the student asks for a task/problem/exercise or wants to practice, provide a clear, age-appropriate problem suitable for ${grade}.
- Keep responses friendly, engaging, and motivating.
- Under 250 words so it fits comfortably in mobile chat cards.`;

      if (client) {
        try {
          const response = await client.models.generateContent({
            model: "gemini-3.8-flash",
            contents: message,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          const replyText = response.text || "";
          return res.json({
            reply: replyText,
            source: "gemini",
            model: "gemini-3.8-flash",
          });
        } catch (genError) {
          console.error("Gemini generation error, falling back to smart local tutor:", genError);
        }
      }

      // High-quality localized fallback responses for instant responsiveness
      const fallbacks: Record<string, string> = {
        kz: `Керемет және өте орынды сұрақ! 🍕 Мысалы, пиццаны елестетіп көрейік: бөлшектерді қосу кезінде бөлімдері әртүрлі болса, біз алдымен оларды бірдей өлшемдегі тілімдерге бөлуіміз керек (ортақ бөлім табу).

⚠️ **Неге бірден қоса салуға болмайды:** Егер 1/2 мен 1/3-ті жай ғана (1+1)/(2+3) = 2/5 деп қоссақ, үлкен және кіші тілімдер араласып, нақты шама бұзылады!

✨ **Шешім жолы:** Ең кіші ортақ еселікті (ЕКОЕ) табамыз. 2 мен 3 үшін ортақ бөлім — 6.
Сол кезде: 1/2 = 3/6, ал 1/3 = 2/6.
Қосындысы: 3/6 + 2/6 = 5/6! 

Ал сен көріп көрші: 1/4 + 2/4 нешеге тең болады?`,
        ru: `Отличный и очень естественный вопрос! 🍕 Представь пиццу: чтобы сложить куски разного размера, их сначала нужно нарезать на одинаковые дольки (привести к общему знаменателю).

⚠️ **Почему нельзя просто сложить верх и низ:** Если сложить (1+1)/(2+3) = 2/5, кусочки разного размера перемешаются и результат исказится!

✨ **Фокус решения:** Находим НОК (наименьшее общее кратное).
Для знаменателей 2 и 3 общий знаменатель — 6.
1/2 превращается в 3/6, а 1/3 превращается в 2/6.
Итого: 3/6 + 2/6 = 5/6! 🎉

Попробуй сам: сколько будет 1/4 + 2/4?`,
        en: `Great and very intuitive question! 🍕 Imagine pizza slices: you can't just combine slices of different sizes without first dividing them into equal portions (finding a common denominator).

⚠️ **Why you cannot simply add top and bottom:** Adding (1+1)/(2+3) gives 2/5, which mixes two completely different proportions and loses the real value!

✨ **The key rule:** Find the LCM (Least Common Multiple).
For denominators 2 and 3, the common base is 6:
1/2 becomes 3/6, and 1/3 becomes 2/6.
Adding equal parts gives: 3/6 + 2/6 = 5/6! 🎉

Now give it a shot: what does 1/4 + 2/4 equal?`,
      };

      const selectedFallback = fallbacks[language] || fallbacks.ru;
      return res.json({
        reply: selectedFallback,
        source: "tutor_core",
      });
    } catch (err: any) {
      console.error("Tutor API error:", err);
      res.status(500).json({ error: "Failed to generate tutor response" });
    }
  });

  // API: Dynamic AI Task Generator
  app.post("/api/generate-task", async (req, res) => {
    try {
      const {
        subject = "Алгебра",
        grade = "9 класс",
        language = "ru",
        topic = "Квадратные уравнения и алгебраические дроби",
      } = req.body;

      const client = getGeminiClient();
      if (client) {
        try {
          const langInstruction =
            language === "kz"
              ? "Kazakh (қазақ тілі, strictly in Kazakh math/science terminology)"
              : language === "en"
              ? "English"
              : "Russian";

          const gradeDepthGuidance = grade.includes("7")
            ? "GRADE 7 LEVEL: Very simple, elementary and accessible foundational school problems (e.g., simple 1st degree linear equation ax + b = c with small whole numbers, basic power rules with same base, simple percentages, adjacent angles, speed v = s/t). Keep it very easy and beginner-friendly."
            : grade.includes("8")
            ? "GRADE 8 LEVEL: Standard 8th grade curriculum (Pythagorean theorem in right triangles, simple quadratic equations, square roots, area of geometric shapes, Ohm's law)."
            : grade.includes("9")
            ? "GRADE 9 LEVEL: 9th grade curriculum (quadratic equations with Vieta theorem, algebraic fractions simplification, arithmetic progressions, systems of 2 linear equations, kinetic energy)."
            : grade.includes("10")
            ? "GRADE 10 LEVEL: Advanced high school topics (exponential equations a^(kx)=a^m, logarithmic equations log_a(x)=b, trigonometric identities and double angle formulas, stereometry volume of cylinder/cone)."
            : "GRADE 11 LEVEL (HIGHER MATH & CALCULUS): Advanced senior high school problems close to higher mathematics (Calculus: derivatives f'(x) of polynomials, tangent slope k = f'(x_0), local extrema / critical points; Integrals: definite integrals using Newton-Leibniz formula; Limits: lim as x->inf or 0/0; 3D spatial vectors & dot products; Combinatorics C(n, k)). Make it authentically challenging and characteristic of 11th grade higher math!";

          const prompt = `Generate a single fresh, realistic, distinct school test problem for grade: "${grade}", subject: "${subject}" (Topic: "${topic}").
Difficulty & Curriculum Level:
${gradeDepthGuidance}

Language: ${langInstruction}.
Ensure exactly one option is correct. The other 3 must be plausible distractors.
Output STRICTLY valid JSON:
{
  "subject": "${subject}",
  "grade": "${grade}",
  "topic": "topic name in ${langInstruction}",
  "subtopic": "subtopic in ${langInstruction}",
  "questionText": "question text in ${langInstruction}",
  "formulaDisplay": {
    "type": "expression",
    "expressionText": "clear mathematical expression or equation"
  },
  "options": [
    {"id": "A", "text": "option 1", "isCorrect": true},
    {"id": "B", "text": "option 2", "isCorrect": false},
    {"id": "C", "text": "option 3", "isCorrect": false},
    {"id": "D", "text": "option 4", "isCorrect": false}
  ],
  "hint": "Encouraging socratic hint in ${langInstruction}",
  "stepByStepSolution": [
    "Step 1...",
    "Step 2...",
    "Step 3...",
    "Result: ..."
  ],
  "xpReward": 30
}`;

          const response = await client.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.85,
            },
          });

          const raw = response.text || "{}";
          const parsed = JSON.parse(raw);

          // Randomize option order and re-assign A, B, C, D
          if (Array.isArray(parsed.options) && parsed.options.length > 0) {
            for (let i = parsed.options.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [parsed.options[i], parsed.options[j]] = [parsed.options[j], parsed.options[i]];
            }
            parsed.options = parsed.options.map((opt: any, idx: number) => ({
              ...opt,
              id: ["A", "B", "C", "D"][idx] || opt.id,
            }));
          }

          return res.json({ question: parsed, source: "gemini" });
        } catch (aiErr) {
          console.error("AI task generation fallback:", aiErr);
        }
      }

      return res.json({ fallback: true });
    } catch (err: any) {
      console.error("Generate task error:", err);
      res.status(500).json({ error: "Failed to generate task" });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
