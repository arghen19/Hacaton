import React, { useState } from "react";
import { Language } from "../types";

interface FormulaSheetModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaSheetModal: React.FC<FormulaSheetModalProps> = ({
  language,
  isOpen,
  onClose,
}) => {
  const [activeSubj, setActiveSubj] = useState<"algebra" | "geometry" | "physics">("algebra");

  if (!isOpen) return null;

  const content = {
    kz: {
      title: "VIP Формулалар Справочнигі 📖",
      subtitle: "Барлық маңызды формулалар мен қасиеттер бір жерде",
      tabs: {
        algebra: "Алгебра",
        geometry: "Геометрия",
        physics: "Физика",
      },
      close: "Жабу",
    },
    ru: {
      title: "VIP Справочник Формул 📖",
      subtitle: "Все ключевые формулы, теоремы и законы в одном месте",
      tabs: {
        algebra: "Алгебра",
        geometry: "Геометрия",
        physics: "Физика",
      },
      close: "Закрыть",
    },
    en: {
      title: "VIP Formula Sheet 📖",
      subtitle: "All key formulas, theorems, and laws in one place",
      tabs: {
        algebra: "Algebra",
        geometry: "Geometry",
        physics: "Physics",
      },
      close: "Close",
    },
  }[language];

  const formulas = {
    algebra: [
      {
        name: { kz: "Қысқаша көбейту: Квадраттар айырымы", ru: "Разность квадратов", en: "Difference of Squares" },
        formula: "a² - b² = (a - b)(a + b)",
        note: { kz: "Мысал: x² - 9 = (x - 3)(x + 3)", ru: "Пример: x² - 9 = (x - 3)(x + 3)", en: "Example: x² - 9 = (x - 3)(x + 3)" },
      },
      {
        name: { kz: "Қосындының квадраты", ru: "Квадрат суммы", en: "Square of a Sum" },
        formula: "(a + b)² = a² + 2ab + b²",
        note: { kz: "Мысал: (x + 5)² = x² + 10x + 25", ru: "Пример: (x + 5)² = x² + 10x + 25", en: "Example: (x + 5)² = x² + 10x + 25" },
      },
      {
        name: { kz: "Квадраттық теңдеу: Дискриминант", ru: "Дискриминант и корни", en: "Quadratic Formula" },
        formula: "D = b² - 4ac,  x₁,₂ = (-b ± √D) / (2a)",
        note: { kz: "D > 0: 2 түбір; D = 0: 1 түбір; D < 0: түбірі жоқ", ru: "D > 0: 2 корня; D = 0: 1 корень; D < 0: нет корней", en: "D > 0: 2 roots; D = 0: 1 root; D < 0: no real roots" },
      },
      {
        name: { kz: "Виет теоремасы", ru: "Теорема Виета", en: "Vieta's Formulas" },
        formula: "x₁ + x₂ = -b/a,   x₁ · x₂ = c/a",
        note: { kz: "Келтірілген теңдеулерді ауызша шешуге өте ыңғайлы", ru: "Идеально для быстрого устного нахождения корней", en: "Ideal for fast mental calculation of roots" },
      },
      {
        name: { kz: "Дәрежелердің қасиеттері", ru: "Свойства степеней", en: "Exponent Rules" },
        formula: "aⁿ · aᵐ = aⁿ⁺ᵐ,   (aⁿ)ᵐ = aⁿᵐ,   a⁰ = 1",
        note: { kz: "Көбейткенде дәрежелер қосылады, бөлгенде азаяды", ru: "При умножении показатели складываются", en: "Multiply: add powers; divide: subtract powers" },
      },
    ],
    geometry: [
      {
        name: { kz: "Пифагор теоремасы", ru: "Теорема Пифагора", en: "Pythagorean Theorem" },
        formula: "c² = a² + b²   (c = √(a² + b²))",
        note: { kz: "Тікбұрышты үшбұрыш гипотенузасы мен катеттері", ru: "Для любого прямоугольного треугольника", en: "For right-angled triangles" },
      },
      {
        name: { kz: "Үшбұрыштың ауданы", ru: "Площадь треугольника", en: "Triangle Area" },
        formula: "S = (1/2) · a · h = (1/2)ab · sin(γ)",
        note: { kz: "Герон формуласы: S = √(p(p-a)(p-b)(p-c))", ru: "Формула Герона: S = √(p(p-a)(p-b)(p-c))", en: "Heron: S = √(p(p-a)(p-b)(p-c))" },
      },
      {
        name: { kz: "Шеңбердің ұзындығы мен дөңгелек ауданы", ru: "Длина окружности и площадь круга", en: "Circle Perimeter and Area" },
        formula: "C = 2πr = πd,   S = πr²",
        note: { kz: "π ≈ 3.14159", ru: "π ≈ 3.14159", en: "π ≈ 3.14159" },
      },
      {
        name: { kz: "Трапеция ауданы", ru: "Площадь трапеции", en: "Trapezoid Area" },
        formula: "S = ((a + b) / 2) · h",
        note: { kz: "Орта сызық пен биіктіктің көбейтіндісі", ru: "Произведение средней линии на высоту", en: "Midline multiplied by height" },
      },
    ],
    physics: [
      {
        name: { kz: "Ньютонның 2-заңы (Динамика)", ru: "Второй закон Ньютона", en: "Newton's Second Law" },
        formula: "F = m · a   =>   a = F / m",
        note: { kz: "F — күш (Н), m — масса (кг), a — үдеу (м/с²)", ru: "F — сила (Н), m — масса (кг), a — ускорение (м/с²)", en: "F — force (N), m — mass (kg), a — accel (m/s²)" },
      },
      {
        name: { kz: "Жылдамдық пен жүрілген жол", ru: "Скорость и равномерное движение", en: "Speed and Distance" },
        formula: "v = s / t,   s = v · t",
        note: { kz: "Теңайнымалы қозғалыста: s = v₀t + (at²)/2", ru: "При равноускоренном: s = v₀t + (at²)/2", en: "With acceleration: s = v₀t + (at²)/2" },
      },
      {
        name: { kz: "Тығыздық формуласы", ru: "Плотность вещества", en: "Density Formula" },
        formula: "ρ = m / V",
        note: { kz: "ρ — кг/м³, m — масса (кг), V — көлем (м³)", ru: "ρ — кг/м³, m — масса, V — объём", en: "ρ — kg/m³, m — mass, V — volume" },
      },
      {
        name: { kz: "Кинетикалық және Потенциалдық энергия", ru: "Энергия (Кинетическая и Потенциальная)", en: "Kinetic & Potential Energy" },
        formula: "Eк = (m · v²) / 2,   Eп = m · g · h",
        note: { kz: "g ≈ 9.8 м/с² (еркін түсу үдеуі)", ru: "g ≈ 9.8 м/с² (ускорение своб. падения)", en: "g ≈ 9.8 m/s²" },
      },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-5 border border-[#004ac6]/20 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#c3c6d7]/30">
          <div>
            <h3 className="text-base font-extrabold text-[#131b2e] flex items-center gap-1.5">
              <span>{content.title}</span>
            </h3>
            <p className="text-[11px] text-[#737686]">{content.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-[#eaedff] text-[#434655] hover:text-[#131b2e] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1.5 mt-3 p-1 rounded-xl bg-[#eaedff]">
          {(["algebra", "geometry", "physics"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubj(s)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubj === s
                  ? "bg-[#004ac6] text-white shadow-xs"
                  : "text-[#434655] hover:text-[#131b2e]"
              }`}
            >
              {content.tabs[s]}
            </button>
          ))}
        </div>

        {/* Formula Cards List */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-1">
          {formulas[activeSubj].map((f, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-[#faf8ff] border border-[#004ac6]/15 hover:border-[#004ac6]/40 transition-all shadow-2xs"
            >
              <span className="text-[11px] font-bold text-[#434655] block">
                {f.name[language]}
              </span>
              <div className="my-1.5 py-1.5 px-3 rounded-xl bg-white border border-[#004ac6]/25 font-mono text-xs font-extrabold text-[#004ac6] text-center tracking-wider shadow-2xs">
                {f.formula}
              </div>
              <span className="text-[10px] text-[#737686] leading-tight block">
                💡 {f.note[language]}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-2 border-t border-[#c3c6d7]/30 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#eaedff] hover:bg-[#dbe1ff] text-[#004ac6] text-xs font-bold transition-colors cursor-pointer"
          >
            {content.close}
          </button>
        </div>
      </div>
    </div>
  );
};
