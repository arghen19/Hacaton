import { Language } from "../types";

export interface LocalizedQuestion {
  id: string;
  subject: Record<Language, string>;
  grade: Record<Language, string>;
  topic: Record<Language, string>;
  subtopic: Record<Language, string>;
  questionText: Record<Language, string>;
  formulaDisplay: {
    type?: "fraction" | "expression";
    expressionText?: string;
    numeratorLeft?: string;
    denominatorLeft?: string;
    operator?: string;
    numeratorRight?: string;
    denominatorRight?: string;
  };
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  hint: Record<Language, string>;
  stepByStepSolution: Record<Language, string[]>;
  xpReward: number;
}

export const sampleQuestions: LocalizedQuestion[] = [
  // 1. Algebra - Algebraic Fractions
  {
    id: "q1",
    subject: {
      kz: "Алгебра",
      ru: "Алгебра",
      en: "Algebra",
    },
    grade: {
      kz: "9-сынып",
      ru: "9 класс",
      en: "Grade 9",
    },
    topic: {
      kz: "Алгебралық бөлшектер",
      ru: "Алгебраические дроби",
      en: "Algebraic Fractions",
    },
    subtopic: {
      kz: "Рационализация",
      ru: "Рационализация",
      en: "Rationalization",
    },
    questionText: {
      kz: "x ≠ 2 болғанда өрнектің мәні нешеге тең? Өрнекті ықшамдаңыз:",
      ru: "Чему равно значение выражения при x ≠ 2? Упростите выражение:",
      en: "What is the value of the expression when x ≠ 2? Simplify the expression:",
    },
    formulaDisplay: {
      type: "fraction",
      numeratorLeft: "3x",
      denominatorLeft: "x — 2",
      operator: "—",
      numeratorRight: "6",
      denominatorRight: "x — 2",
    },
    options: [
      { id: "A", text: "(3x — 6) / 2", isCorrect: false },
      { id: "B", text: "3 / (x — 2)", isCorrect: false },
      { id: "C", text: "3", isCorrect: true },
      { id: "D", text: "x + 3", isCorrect: false },
    ],
    hint: {
      kz: "Ортақ бөлімге (x - 2) назар аударыңыз. Өрнекті ортақ сызық астына жазыңыз: (3x - 6) / (x - 2). Алымынан 3 санын жақша сыртына шығарыңыз: 3(x - 2) / (x - 2).",
      ru: "Обрати внимание на общий знаменатель (x - 2). Запиши выражение под одну черту: (3x - 6) / (x - 2). Вынеси множитель 3 за скобки в числителе: 3(x - 2) / (x - 2).",
      en: "Notice the common denominator (x - 2). Write under a single fraction bar: (3x - 6) / (x - 2). Factor out 3 in the numerator to get 3(x - 2) / (x - 2).",
    },
    stepByStepSolution: {
      kz: [
        "1-қадам: Бөлшектердің бөлімі бірдей: (x - 2).",
        "2-қадам: Алымдарын біріктіреміз: (3x - 6) / (x - 2).",
        "3-қадам: Алымынан 3-ті жақша сыртына шығарамыз: 3 · (x - 2) / (x - 2).",
        "4-қадам: (x - 2) өрнегін қысқартамыз (себебі x ≠ 2).",
        "Жауабы: 3.",
      ],
      ru: [
        "Шаг 1: Знаменатели одинаковые: (x - 2).",
        "Шаг 2: Объединяем числители под одну черту: (3x - 6) / (x - 2).",
        "Шаг 3: Выносим общий множитель 3 за скобки: 3 · (x - 2) / (x - 2).",
        "Шаг 4: Сокращаем одинаковую скобку (x - 2), так как x ≠ 2.",
        "Итог: 3.",
      ],
      en: [
        "Step 1: Denominators are identical: (x - 2).",
        "Step 2: Combine numerators: (3x - 6) / (x - 2).",
        "Step 3: Factor out 3 in the numerator: 3(x - 2) / (x - 2).",
        "Step 4: Cancel the common binomial (x - 2) since x ≠ 2.",
        "Result: 3.",
      ],
    },
    xpReward: 25,
  },

  // 2. Geometry - Pythagorean Theorem
  {
    id: "q2",
    subject: {
      kz: "Геометрия",
      ru: "Геометрия",
      en: "Geometry",
    },
    grade: {
      kz: "8-сынып",
      ru: "8 класс",
      en: "Grade 8",
    },
    topic: {
      kz: "Пифагор теоремасы",
      ru: "Теорема Пифагора",
      en: "Pythagorean Theorem",
    },
    subtopic: {
      kz: "Тікбұрышты үшбұрыш",
      ru: "Прямоугольный треугольник",
      en: "Right-angled triangle",
    },
    questionText: {
      kz: "Тікбұрышты үшбұрыштың катеттері a = 6 см және b = 8 см. Гипотенузаның ұзындығы с нешеге тең?",
      ru: "В прямоугольном треугольнике катеты равны a = 6 см и b = 8 см. Чему равна гипотенуза c?",
      en: "In a right-angled triangle, the legs are a = 6 cm and b = 8 cm. What is the length of hypotenuse c?",
    },
    formulaDisplay: {
      type: "expression",
      expressionText: "c = √(a² + b²) = √(6² + 8²)",
    },
    options: [
      { id: "A", text: "14 см", isCorrect: false },
      { id: "B", text: "10 см", isCorrect: true },
      { id: "C", text: "12 см", isCorrect: false },
      { id: "D", text: "48 см", isCorrect: false },
    ],
    hint: {
      kz: "Пифагор теоремасын қолданыңыз: c² = a² + b². 6² = 36, 8² = 64. Қосындысынан квадрат түбір табыңыз!",
      ru: "Используй теорему Пифагора: c² = a² + b². 6² = 36, 8² = 64. 36 + 64 = 100. Извлеки квадратный корень!",
      en: "Apply the Pythagorean theorem: c² = a² + b². 6² = 36, 8² = 64. 36 + 64 = 100. Find the square root!",
    },
    stepByStepSolution: {
      kz: [
        "1-қадам: Пифагор теоремасы: c² = a² + b².",
        "2-қадам: Катеттердің квадраттары: 6² = 36 және 8² = 64.",
        "3-қадам: Оларды қосамыз: c² = 36 + 64 = 100.",
        "4-қадам: Түбірден шығарамыз: c = √100 = 10 см.",
        "Жауабы: 10 см.",
      ],
      ru: [
        "Шаг 1: Формула теоремы Пифагора: c² = a² + b².",
        "Шаг 2: Возводим катеты в квадрат: 6² = 36, 8² = 64.",
        "Шаг 3: Складываем: c² = 36 + 64 = 100.",
        "Шаг 4: Извлекаем корень: c = √100 = 10 см.",
        "Итог: 10 см.",
      ],
      en: [
        "Step 1: Pythagorean theorem formula: c² = a² + b².",
        "Step 2: Square both legs: 6² = 36, 8² = 64.",
        "Step 3: Sum the squares: c² = 36 + 64 = 100.",
        "Step 4: Take the square root: c = √100 = 10 cm.",
        "Result: 10 cm.",
      ],
    },
    xpReward: 30,
  },

  // 3. Physics - Newton's Second Law
  {
    id: "q3",
    subject: {
      kz: "Физика",
      ru: "Физика",
      en: "Physics",
    },
    grade: {
      kz: "9-сынып",
      ru: "9 класс",
      en: "Grade 9",
    },
    topic: {
      kz: "Ньютонның екінші заңы",
      ru: "Второй закон Ньютона",
      en: "Newton's Second Law",
    },
    subtopic: {
      kz: "Күш пен үдеу",
      ru: "Сила и ускорение",
      en: "Force and Acceleration",
    },
    questionText: {
      kz: "Массасы 4 кг дене 3 м/с² үдеумен қозғалады. Денеге әсер етуші теңәрекетті күш F нешеге тең?",
      ru: "Тело массой 4 кг движется с ускорением 3 м/с². Чему равна действующая сила F?",
      en: "A body of mass 4 kg moves with acceleration 3 m/s². What is the net force F?",
    },
    formulaDisplay: {
      type: "expression",
      expressionText: "F = m · a = 4 кг · 3 м/с²",
    },
    options: [
      { id: "A", text: "7 Н (N)", isCorrect: false },
      { id: "B", text: "1.33 Н (N)", isCorrect: false },
      { id: "C", text: "24 Н (N)", isCorrect: false },
      { id: "D", text: "12 Н (N)", isCorrect: true },
    ],
    hint: {
      kz: "Формула: F = m · a. m = 4 кг, a = 3 м/с². Көбейтіңіз: 4 · 3 = 12 Н.",
      ru: "Формула: F = m · a. Масса 4 кг, ускорение 3 м/с². Умножаем: 4 · 3 = 12 Н.",
      en: "Formula: F = m · a. Mass = 4 kg, acceleration = 3 m/s². Multiply: 4 · 3 = 12 N.",
    },
    stepByStepSolution: {
      kz: [
        "1-қадам: Ньютонның 2-заңының формуласын жазамыз: F = m · a.",
        "2-қадам: Мәндерін қоямыз: m = 4 кг, a = 3 м/с².",
        "3-қадам: F = 4 · 3 = 12 Ньютон.",
        "Жауабы: 12 Н.",
      ],
      ru: [
        "Шаг 1: Формула второго закона Ньютона: F = m · a.",
        "Шаг 2: Подставляем данные: m = 4 кг, a = 3 м/с².",
        "Шаг 3: F = 4 · 3 = 12 Ньютонов (Н).",
        "Итог: 12 Н.",
      ],
      en: [
        "Step 1: Newton's second law formula: F = m · a.",
        "Step 2: Plug in values: m = 4 kg, a = 3 m/s².",
        "Step 3: F = 4 · 3 = 12 Newtons (N).",
        "Result: 12 N.",
      ],
    },
    xpReward: 30,
  },

  // 4. Chemistry - Molecular Molar Mass
  {
    id: "q4",
    subject: {
      kz: "Химия",
      ru: "Химия",
      en: "Chemistry",
    },
    grade: {
      kz: "8-сынып",
      ru: "8 класс",
      en: "Grade 8",
    },
    topic: {
      kz: "Молярлық масса",
      ru: "Молярная масса",
      en: "Molar Mass",
    },
    subtopic: {
      kz: "Су молекуласы (H₂O)",
      ru: "Молекула воды (H₂O)",
      en: "Water molecule (H₂O)",
    },
    questionText: {
      kz: "Су молекуласының (H₂O) молярлық массасын табыңыз, егер Ar(H) = 1 г/моль, ал Ar(O) = 16 г/моль болса:",
      ru: "Найдите молярную массу воды (H₂O), если Ar(H) = 1 г/моль, а Ar(O) = 16 г/моль:",
      en: "Find the molar mass of water (H₂O), given Ar(H) = 1 g/mol and Ar(O) = 16 g/mol:",
    },
    formulaDisplay: {
      type: "expression",
      expressionText: "M(H₂O) = 2 · Ar(H) + Ar(O)",
    },
    options: [
      { id: "A", text: "17 г/моль", isCorrect: false },
      { id: "B", text: "34 г/моль", isCorrect: false },
      { id: "C", text: "18 г/моль", isCorrect: true },
      { id: "D", text: "20 г/моль", isCorrect: false },
    ],
    hint: {
      kz: "Су молекуласында 2 сутек (H) атомы және 1 оттек (O) атомы бар: M = 2 · 1 + 16.",
      ru: "В молекуле воды 2 атома водорода и 1 атом кислорода: M = 2 · 1 + 16 = 18 г/моль.",
      en: "Water contains 2 hydrogen atoms and 1 oxygen atom: M = 2 · 1 + 16 = 18 g/mol.",
    },
    stepByStepSolution: {
      kz: [
        "1-қадам: H₂O формуласында 2 сутек және 1 оттек бар.",
        "2-қадам: Сутектің салыстырмалы атомдық массасы: 2 · 1 = 2 г/моль.",
        "3-қадам: Оттектің салыстырмалы атомдық массасы: 16 г/моль.",
        "4-қадам: Қосамыз: 2 + 16 = 18 г/моль.",
        "Жауабы: 18 г/моль.",
      ],
      ru: [
        "Шаг 1: Молекула воды состоит из 2 атомов H и 1 атома O.",
        "Шаг 2: Масса двух водородов: 2 · 1 = 2 г/моль.",
        "Шаг 3: Масса одного кислорода: 16 г/моль.",
        "Шаг 4: Суммируем: 2 + 16 = 18 г/моль.",
        "Итог: 18 г/моль.",
      ],
      en: [
        "Step 1: Water molecule has 2 Hydrogen atoms and 1 Oxygen atom.",
        "Step 2: Mass of 2 Hydrogens: 2 · 1 = 2 g/mol.",
        "Step 3: Mass of 1 Oxygen: 16 g/mol.",
        "Step 4: Sum together: 2 + 16 = 18 g/mol.",
        "Result: 18 g/mol.",
      ],
    },
    xpReward: 25,
  },

  // 5. Algebra - Quadratic Equation (Vieta's Theorem)
  {
    id: "q5",
    subject: {
      kz: "Алгебра",
      ru: "Алгебра",
      en: "Algebra",
    },
    grade: {
      kz: "8-сынып",
      ru: "8 класс",
      en: "Grade 8",
    },
    topic: {
      kz: "Квадрат теңдеулер",
      ru: "Квадратные уравнения",
      en: "Quadratic Equations",
    },
    subtopic: {
      kz: "Виет теоремасы",
      ru: "Теорема Виета",
      en: "Vieta's Theorem",
    },
    questionText: {
      kz: "x² - 5x + 6 = 0 квадрат теңдеуінің түбірлерін табыңыз:",
      ru: "Найдите корни квадратного уравнения x² - 5x + 6 = 0:",
      en: "Find the roots of the quadratic equation x² - 5x + 6 = 0:",
    },
    formulaDisplay: {
      type: "expression",
      expressionText: "x² — 5x + 6 = 0  ⇒  (x — 2)(x — 3) = 0",
    },
    options: [
      { id: "A", text: "x₁ = -2,  x₂ = -3", isCorrect: false },
      { id: "B", text: "x₁ = 2,  x₂ = 3", isCorrect: true },
      { id: "C", text: "x₁ = 1,  x₂ = 6", isCorrect: false },
      { id: "D", text: "x₁ = -1,  x₂ = 5", isCorrect: false },
    ],
    hint: {
      kz: "Виет теоремасы бойынша түбірлердің қосындысы 5-ке, ал көбейтіндісі 6-ға тең: 2 + 3 = 5 және 2 · 3 = 6.",
      ru: "По теореме Виета сумма корней равна 5, а произведение 6: 2 + 3 = 5 и 2 · 3 = 6.",
      en: "By Vieta's theorem, sum of roots is 5 and product is 6: 2 + 3 = 5 and 2 · 3 = 6.",
    },
    stepByStepSolution: {
      kz: [
        "1-қадам: Келтірілген квадрат теңдеу үшін Виет теоремасы: x₁ + x₂ = 5, x₁ · x₂ = 6.",
        "2-қадам: Көбейтіндісі 6 беретін сандар: (1, 6) немесе (2, 3).",
        "3-қадам: Қосындысы 5 беретін жұп: 2 + 3 = 5.",
        "4-қадам: Демек, түбірлері: x₁ = 2, x₂ = 3.",
        "Жауабы: x₁ = 2, x₂ = 3.",
      ],
      ru: [
        "Шаг 1: По теореме Виета для x² - px + q = 0: x₁ + x₂ = 5, x₁ · x₂ = 6.",
        "Шаг 2: Множители числа 6: 1 и 6, либо 2 и 3.",
        "Шаг 3: Проверяем сумму: 2 + 3 = 5 (верно!).",
        "Шаг 4: Корни уравнения: x₁ = 2, x₂ = 3.",
        "Итог: x₁ = 2, x₂ = 3.",
      ],
      en: [
        "Step 1: Vieta's theorem: x₁ + x₂ = 5 and x₁ · x₂ = 6.",
        "Step 2: Factors of 6: (1, 6) or (2, 3).",
        "Step 3: Check sum: 2 + 3 = 5 matches the linear coefficient.",
        "Step 4: Therefore, the roots are x₁ = 2 and x₂ = 3.",
        "Result: x₁ = 2, x₂ = 3.",
      ],
    },
    xpReward: 30,
  },

  // 6. Physics - Kinematics & Velocity
  {
    id: "q6",
    subject: {
      kz: "Физика",
      ru: "Физика",
      en: "Physics",
    },
    grade: {
      kz: "7-сынып",
      ru: "7 класс",
      en: "Grade 7",
    },
    topic: {
      kz: "Кинематика",
      ru: "Кинематика",
      en: "Kinematics",
    },
    subtopic: {
      kz: "Орташа жылдамдық",
      ru: "Средняя скорость",
      en: "Average Velocity",
    },
    questionText: {
      kz: "Автомобиль 180 км жолды 2.5 сағатта жүріп өтті. Оның орташа жылдамдығы v неше км/сағ?",
      ru: "Автомобиль проехал путь S = 180 км за время t = 2.5 часа. Какова его средняя скорость v?",
      en: "A car travels distance S = 180 km in time t = 2.5 hours. What is its average speed v?",
    },
    formulaDisplay: {
      type: "fraction",
      numeratorLeft: "v",
      denominatorLeft: "1",
      operator: "=",
      numeratorRight: "180 км",
      denominatorRight: "2.5 сағ (h)",
    },
    options: [
      { id: "A", text: "65 км/сағ", isCorrect: false },
      { id: "B", text: "80 км/сағ", isCorrect: false },
      { id: "C", text: "90 км/сағ", isCorrect: false },
      { id: "D", text: "72 км/сағ", isCorrect: true },
    ],
    hint: {
      kz: "Орташа жылдамдық формуласы: v = S / t. 180-ді 2.5-ке бөліңіз (немесе 180 · 2 / 5 = 72).",
      ru: "Формула средней скорости: v = S / t. Раздели 180 на 2.5 (180 : 2.5 = 72 км/ч).",
      en: "Average speed formula: v = S / t. Divide 180 by 2.5 (180 / 2.5 = 72 km/h).",
    },
    stepByStepSolution: {
      kz: [
        "1-қадам: Жылдамдық формуласы: v = S / t.",
        "2-қадам: Мәндері: S = 180 км, t = 2.5 сағ.",
        "3-қадам: 180 / 2.5 = 1800 / 25 = 72 км/сағ.",
        "Жауабы: 72 км/сағ.",
      ],
      ru: [
        "Шаг 1: Формула прямолинейного движения: v = S / t.",
        "Шаг 2: Подставляем значения: S = 180 км, t = 2.5 ч.",
        "Шаг 3: Вычисляем: 180 / 2.5 = 72 км/ч.",
        "Итог: 72 км/ч.",
      ],
      en: [
        "Step 1: Speed formula: v = S / t.",
        "Step 2: Substitute values: S = 180 km, t = 2.5 h.",
        "Step 3: Calculate: 180 / 2.5 = 72 km/h.",
        "Result: 72 km/h.",
      ],
    },
    xpReward: 25,
  },

  // 7. Geometry - Triangle Angles
  {
    id: "q7",
    subject: {
      kz: "Геометрия",
      ru: "Геометрия",
      en: "Geometry",
    },
    grade: {
      kz: "7-сынып",
      ru: "7 класс",
      en: "Grade 7",
    },
    topic: {
      kz: "Үшбұрыштың бұрыштары",
      ru: "Углы треугольника",
      en: "Triangle Angles",
    },
    subtopic: {
      kz: "Бұрыштар қосындысы",
      ru: "Сумма углов",
      en: "Sum of angles",
    },
    questionText: {
      kz: "Үшбұрыштың екі бұрышы 45° және 70°-қа тең. Осы үшбұрыштың үшінші бұрышы неше градус?",
      ru: "В треугольнике два угла равны 45° и 70°. Чему равен третий угол этого треугольника?",
      en: "In a triangle, two angles measure 45° and 70°. What is the measure of the third angle?",
    },
    formulaDisplay: {
      type: "expression",
      expressionText: "∠C = 180° — (45° + 70°)",
    },
    options: [
      { id: "A", text: "75°", isCorrect: false },
      { id: "B", text: "55°", isCorrect: false },
      { id: "C", text: "65°", isCorrect: true },
      { id: "D", text: "85°", isCorrect: false },
    ],
    hint: {
      kz: "Кез келген үшбұрыштың ішкі бұрыштарының қосындысы әрдайым 180°-қа тең. 180 - (45 + 70) есептеңіз.",
      ru: "Сумма всех внутренних углов треугольника всегда равна 180°. Вычти известные углы: 180 - (45 + 70).",
      en: "The sum of interior angles in any triangle is always 180°. Subtract known angles: 180 - (45 + 70).",
    },
    stepByStepSolution: {
      kz: [
        "1-қадам: Үшбұрыштың ішкі бұрыштарының қосындысы = 180°.",
        "2-қадам: Белгілі бұрыштардың қосындысы: 45° + 70° = 115°.",
        "3-қадам: Үшінші бұрыш: 180° - 115° = 65°.",
        "Жауабы: 65°.",
      ],
      ru: [
        "Шаг 1: Теорема: сумма углов треугольника равна 180°.",
        "Шаг 2: Сумма двух известных углов: 45° + 70° = 115°.",
        "Шаг 3: Находим третий угол: 180° - 115° = 65°.",
        "Итог: 65°.",
      ],
      en: [
        "Step 1: Theorem: Sum of angles in a triangle is 180°.",
        "Step 2: Sum the two known angles: 45° + 70° = 115°.",
        "Step 3: Subtract from 180°: 180° - 115° = 65°.",
        "Result: 65°.",
      ],
    },
    xpReward: 25,
  },

  // 8. Computer Science - Binary to Decimal
  {
    id: "q8",
    subject: {
      kz: "Информатика",
      ru: "Информатика",
      en: "Computer Science",
    },
    grade: {
      kz: "8-сынып",
      ru: "8 класс",
      en: "Grade 8",
    },
    topic: {
      kz: "Санау жүйелері",
      ru: "Системы счисления",
      en: "Number Systems",
    },
    subtopic: {
      kz: "Екілік жүйеден ондыққа",
      ru: "Двоичная в десятичную",
      en: "Binary to Decimal",
    },
    questionText: {
      kz: "1011₂ екілік санын ондық санау жүйесіне көшіріңіз:",
      ru: "Переведите двоичное число 1011₂ в десятичную систему счисления:",
      en: "Convert the binary number 1011₂ into decimal system:",
    },
    formulaDisplay: {
      type: "expression",
      expressionText: "1011₂ = 1·2³ + 0·2² + 1·2¹ + 1·2⁰",
    },
    options: [
      { id: "A", text: "13", isCorrect: false },
      { id: "B", text: "11", isCorrect: true },
      { id: "C", text: "9", isCorrect: false },
      { id: "D", text: "7", isCorrect: false },
    ],
    hint: {
      kz: "Разрядтар бойынша 2-нің дәрежелеріне көбейтіңіз: 1·8 + 0·4 + 1·2 + 1·1.",
      ru: "Разложи по степеням двойки справа налево: 1·8 + 0·4 + 1·2 + 1·1 = 8 + 0 + 2 + 1.",
      en: "Expand into powers of two from right to left: 1·8 + 0·4 + 1·2 + 1·1 = 8 + 0 + 2 + 1.",
    },
    stepByStepSolution: {
      kz: [
        "1-қадам: Санның разрядтарын оңнан солға қарай нөмірлейміз: 3, 2, 1, 0.",
        "2-қадам: 1 · 2³ = 1 · 8 = 8.",
        "3-қадам: 0 · 2² = 0 · 4 = 0.",
        "4-қадам: 1 · 2¹ = 1 · 2 = 2.",
        "5-қадам: 1 · 2⁰ = 1 · 1 = 1.",
        "6-қадам: Қосындысы: 8 + 0 + 2 + 1 = 11.",
        "Жауабы: 11.",
      ],
      ru: [
        "Шаг 1: Расставляем степени двойки справа налево (0, 1, 2, 3).",
        "Шаг 2: 1 · 2³ = 8.",
        "Шаг 3: 0 · 2² = 0.",
        "Шаг 4: 1 · 2¹ = 2.",
        "Шаг 5: 1 · 2⁰ = 1.",
        "Шаг 6: Суммируем: 8 + 0 + 2 + 1 = 11.",
        "Итог: 11.",
      ],
      en: [
        "Step 1: Assign binary power weights (0, 1, 2, 3) from right to left.",
        "Step 2: 1 · 2³ = 8.",
        "Step 3: 0 · 2² = 0.",
        "Step 4: 1 · 2¹ = 2.",
        "Step 5: 1 · 2⁰ = 1.",
        "Step 6: Sum all terms: 8 + 0 + 2 + 1 = 11.",
        "Result: 11.",
      ],
    },
    xpReward: 30,
  },

  // 9. Algebra - Exponents & Powers
  {
    id: "q9",
    subject: {
      kz: "Алгебра",
      ru: "Алгебра",
      en: "Algebra",
    },
    grade: {
      kz: "7-сынып",
      ru: "7 класс",
      en: "Grade 7",
    },
    topic: {
      kz: "Дәрежелер қасиеттері",
      ru: "Свойства степеней",
      en: "Exponent Rules",
    },
    subtopic: {
      kz: "Бірдей негізді дәрежелер",
      ru: "Степени с одинаковым основанием",
      en: "Powers with same base",
    },
    questionText: {
      kz: "Дәрежелер қасиетін қолданып, өрнектің мәнін есептеңіз:",
      ru: "Используя свойства степеней, найдите значение выражения:",
      en: "Using the laws of exponents, calculate the value of the expression:",
    },
    formulaDisplay: {
      type: "fraction",
      numeratorLeft: "2³ · 2⁴",
      denominatorLeft: "2⁵",
      operator: "=",
      numeratorRight: "2⁷",
      denominatorRight: "2⁵",
    },
    options: [
      { id: "A", text: "8", isCorrect: false },
      { id: "B", text: "2", isCorrect: false },
      { id: "C", text: "16", isCorrect: false },
      { id: "D", text: "4", isCorrect: true },
    ],
    hint: {
      kz: "Көбейту кезінде дәреже көрсеткіштері қосылады: 3 + 4 = 7. Бөлу кезінде азайтылады: 7 - 5 = 2. 2² = 4.",
      ru: "При умножении показателей с одинаковым основанием степени складываются: 3 + 4 = 7. При делении вычитаются: 7 - 5 = 2. 2² = 4.",
      en: "When multiplying like bases, add exponents: 3 + 4 = 7. When dividing, subtract: 7 - 5 = 2. 2² = 4.",
    },
    stepByStepSolution: {
      kz: [
        "1-қадам: Алымындағы көбейтінді: 2³ · 2⁴ = 2^(3+4) = 2⁷.",
        "2-қадам: Бөлімге бөлу: 2⁷ / 2⁵ = 2^(7-5) = 2².",
        "3-қадам: Мәні: 2² = 4.",
        "Жауабы: 4.",
      ],
      ru: [
        "Шаг 1: В числителе складываем степени: 2³ · 2⁴ = 2^(3+4) = 2⁷.",
        "Шаг 2: Делим на знаменатель: 2⁷ / 2⁵ = 2^(7-5) = 2².",
        "Шаг 3: Возводим в степень: 2² = 4.",
        "Итог: 4.",
      ],
      en: [
        "Step 1: Multiply numerator powers: 2³ · 2⁴ = 2^(3+4) = 2⁷.",
        "Step 2: Divide by denominator: 2⁷ / 2⁵ = 2^(7-5) = 2².",
        "Step 3: Evaluate: 2² = 4.",
        "Result: 4.",
      ],
    },
    xpReward: 25,
  },

  // 10. Physics - Mechanical Work
  {
    id: "q10",
    subject: {
      kz: "Физика",
      ru: "Физика",
      en: "Physics",
    },
    grade: {
      kz: "8-сынып",
      ru: "8 класс",
      en: "Grade 8",
    },
    topic: {
      kz: "Механикалық жұмыс",
      ru: "Механическая работа",
      en: "Mechanical Work",
    },
    subtopic: {
      kz: "Жұмыс пен орын ауыстыру",
      ru: "Работа и перемещение",
      en: "Work and Displacement",
    },
    questionText: {
      kz: "25 Н күш денені өз бағытымен s = 4 метрге жылжытты. Атқарылған механикалық жұмыс A нешеге тең?",
      ru: "Сила F = 25 Н переместила груз в направлении своего действия на расстояние s = 4 метра. Чему равна совершенная работа A?",
      en: "A force of F = 25 N moves an object in its direction over a distance of s = 4 meters. What is the mechanical work A done?",
    },
    formulaDisplay: {
      type: "expression",
      expressionText: "A = F · s = 25 Н · 4 м",
    },
    options: [
      { id: "A", text: "29 Дж (J)", isCorrect: false },
      { id: "B", text: "100 Дж (J)", isCorrect: true },
      { id: "C", text: "6.25 Дж (J)", isCorrect: false },
      { id: "D", text: "200 Дж (J)", isCorrect: false },
    ],
    hint: {
      kz: "Механикалық жұмыс формуласы: A = F · s. 25-ті 4-ке көбейтіңіз: 25 · 4 = 100 Джоуль.",
      ru: "Формула работы: A = F · s. Умножь силу на перемещение: 25 · 4 = 100 Джоулей.",
      en: "Mechanical work formula: A = F · s. Multiply force by displacement: 25 · 4 = 100 Joules.",
    },
    stepByStepSolution: {
      kz: [
        "1-қадам: Механикалық жұмыс формуласы: A = F · s.",
        "2-қадам: Берілгені: F = 25 Н, s = 4 м.",
        "3-қадам: Есептейміз: A = 25 · 4 = 100 Дж (Джоуль).",
        "Жауабы: 100 Дж.",
      ],
      ru: [
        "Шаг 1: Формула механической работы: A = F · s.",
        "Шаг 2: Подставляем данные задачи: F = 25 Н, s = 4 м.",
        "Шаг 3: Вычисляем: A = 25 · 4 = 100 Дж (Джоулей).",
        "Итог: 100 Дж.",
      ],
      en: [
        "Step 1: Formula for mechanical work: A = F · s.",
        "Step 2: Plug in values: F = 25 N, s = 4 m.",
        "Step 3: Calculate: A = 25 · 4 = 100 Joules (J).",
        "Result: 100 J.",
      ],
    },
    xpReward: 30,
  },
];
