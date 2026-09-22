import React, { useState } from "react";
import { Language, NavTab } from "../types";
import { translations } from "../i18n/translations";
import { sampleQuestions, LocalizedQuestion } from "../data/practiceQuestions";
import { generateRandomQuestion } from "../utils/taskGenerator";

interface PracticeScreenProps {
  language: Language;
  onNavigate: (tab: NavTab) => void;
  onAddXP: (amount: number) => void;
  onAddCoins: (amount: number) => void;
}

interface UserAnswerState {
  selectedOption: string | null;
  isConfirmed: boolean;
  isCorrect?: boolean;
}

// Helper to shuffle options so correct answers are unpredictably distributed across A, B, C, D
function shuffleQuestionOptions(q: LocalizedQuestion): LocalizedQuestion {
  if (!q.options || q.options.length <= 1) return q;
  const arr = [...q.options];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const letters = ["A", "B", "C", "D", "E"];
  return {
    ...q,
    options: arr.map((opt, idx) => ({
      ...opt,
      id: letters[idx] || `${idx + 1}`,
    })),
  };
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  language,
  onNavigate,
  onAddXP,
  onAddCoins,
}) => {
  const t = translations[language].practice;

  // Grade & Subject filters
  // User explicitly highlighted 9th grade math format
  const [selectedGrade, setSelectedGrade] = useState<number>(9);
  const [selectedSubject, setSelectedSubject] = useState<string>("math"); // "math" | "geometry" | "physics" | "all"

  // Questions queue (starts with sample questions with shuffled options, dynamically expands)
  const [questionsList, setQuestionsList] = useState<LocalizedQuestion[]>(() =>
    sampleQuestions.map(shuffleQuestionOptions)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersState, setAnswersState] = useState<Record<string, UserAnswerState>>({});
  const [showHint, setShowHint] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const totalQuestions = questionsList.length;
  const currentQ: LocalizedQuestion = questionsList[currentIndex] || questionsList[0];

  const currentAnswer = answersState[currentQ?.id] || {
    selectedOption: null,
    isConfirmed: false,
  };

  const selectedOption = currentAnswer.selectedOption;
  const isConfirmed = currentAnswer.isConfirmed;

  const handleSelectOption = (optionId: string) => {
    if (isConfirmed) return;
    setAnswersState((prev) => ({
      ...prev,
      [currentQ.id]: {
        selectedOption: optionId,
        isConfirmed: false,
      },
    }));
  };

  const handleConfirm = () => {
    if (!selectedOption || isConfirmed) return;

    const chosen = currentQ.options.find((o) => o.id === selectedOption);
    const correct = !!chosen?.isCorrect;

    setAnswersState((prev) => ({
      ...prev,
      [currentQ.id]: {
        selectedOption,
        isConfirmed: true,
        isCorrect: correct,
      },
    }));

    if (correct) {
      onAddXP(currentQ.xpReward || 30);
      onAddCoins(15);
    }
  };

  const handleNext = () => {
    setShowHint(false);
    setShowStepModal(false);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Generate a fresh random task seamlessly when reaching the end!
      handleGenerateRandom();
    }
  };

  const handlePrev = () => {
    setShowHint(false);
    setShowStepModal(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSelectQuestionIndex = (index: number) => {
    setShowHint(false);
    setShowStepModal(false);
    setCurrentIndex(index);
  };

  // Helper to generate a question that doesn't duplicate existing ones
  const generateUniqueQuestion = (
    subj: string,
    grade: number,
    existingList: LocalizedQuestion[]
  ): LocalizedQuestion => {
    let attempts = 0;
    let q = shuffleQuestionOptions(generateRandomQuestion(subj, grade));
    while (attempts < 6) {
      const isDuplicate = existingList.some(
        (existing) =>
          existing.questionText.ru === q.questionText.ru ||
          (existing.formulaDisplay?.expressionText &&
            existing.formulaDisplay.expressionText === q.formulaDisplay?.expressionText)
      );
      if (!isDuplicate) break;
      q = shuffleQuestionOptions(generateRandomQuestion(subj, grade));
      attempts++;
    }
    return q;
  };

  // 1. Procedural instant random task generator (never duplicates)
  const handleGenerateRandom = () => {
    setShowHint(false);
    setShowStepModal(false);
    const newQuestion = generateUniqueQuestion(
      selectedSubject,
      selectedGrade,
      questionsList
    );

    setQuestionsList((prev) => [...prev, newQuestion]);
    setCurrentIndex(questionsList.length);
  };

  // 2. AI dynamic task generation via backend Gemini API
  const handleGenerateWithAI = async () => {
    setIsAiGenerating(true);
    setShowHint(false);
    setShowStepModal(false);

    const subjectName =
      selectedSubject === "math"
        ? "Алгебра"
        : selectedSubject === "geometry"
        ? "Геометрия"
        : selectedSubject === "physics"
        ? "Физика"
        : "Математика";

    const gradeName = `${selectedGrade} класс`;

    try {
      const res = await fetch("/api/generate-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjectName,
          grade: gradeName,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.question && data.question.questionText) {
          const aiQ = data.question;
          const formattedQ: LocalizedQuestion = {
            id: `ai_${Date.now()}`,
            subject: {
              kz: aiQ.subject || "Алгебра",
              ru: aiQ.subject || "Алгебра",
              en: aiQ.subject || "Algebra",
            },
            grade: {
              kz: `${selectedGrade}-сынып`,
              ru: `${selectedGrade} класс`,
              en: `Grade ${selectedGrade}`,
            },
            topic: {
              kz: aiQ.topic || "Практика",
              ru: aiQ.topic || "Практика",
              en: aiQ.topic || "Practice",
            },
            subtopic: {
              kz: aiQ.subtopic || "Есептер",
              ru: aiQ.subtopic || "Задачи",
              en: aiQ.subtopic || "Tasks",
            },
            questionText: {
              kz: aiQ.questionText,
              ru: aiQ.questionText,
              en: aiQ.questionText,
            },
            formulaDisplay: aiQ.formulaDisplay || {
              type: "expression",
              expressionText: "",
            },
            options: Array.isArray(aiQ.options) ? aiQ.options : [],
            hint: {
              kz: aiQ.hint || "Ойланып көріңіз",
              ru: aiQ.hint || "Подумай о формуле",
              en: aiQ.hint || "Think about the formula",
            },
            stepByStepSolution: {
              kz: Array.isArray(aiQ.stepByStepSolution)
                ? aiQ.stepByStepSolution
                : ["Шешу жолы"],
              ru: Array.isArray(aiQ.stepByStepSolution)
                ? aiQ.stepByStepSolution
                : ["Пошаговое решение"],
              en: Array.isArray(aiQ.stepByStepSolution)
                ? aiQ.stepByStepSolution
                : ["Step-by-step solution"],
            },
            xpReward: aiQ.xpReward || 35,
          };

          const prepared = shuffleQuestionOptions(formattedQ);
          setQuestionsList((prev) => [...prev, prepared]);
          setCurrentIndex(questionsList.length);
          setIsAiGenerating(false);
          return;
        }
      }
    } catch (e) {
      console.warn("AI generation network fallback:", e);
    }

    // Fallback to instant procedural generator
    const newQuestion = shuffleQuestionOptions(
      generateRandomQuestion(selectedSubject, selectedGrade)
    );
    setQuestionsList((prev) => [...prev, newQuestion]);
    setCurrentIndex(questionsList.length);
    setIsAiGenerating(false);
  };

  const solvedCount = Object.values(answersState).filter(
    (a) => a.isConfirmed && a.isCorrect
  ).length;

  const selectedObj = currentQ?.options?.find((o) => o.id === selectedOption);
  const isCorrect = selectedObj?.isCorrect;

  // Icon selector
  const getSubjectIcon = (subj: string) => {
    if (subj.includes("Физик") || subj.includes("Physic")) return "bolt";
    if (subj.includes("Хим") || subj.includes("Chem")) return "science";
    if (subj.includes("Информ") || subj.includes("Comp")) return "terminal";
    if (subj.includes("Геомет") || subj.includes("Geom")) return "square_foot";
    return "functions";
  };

  // Grade labels
  const gradeLabels: Record<number, Record<Language, string>> = {
    7: { kz: "7-сынып", ru: "7 класс", en: "Grade 7" },
    8: { kz: "8-сынып", ru: "8 класс", en: "Grade 8" },
    9: { kz: "9-сынып", ru: "9 класс", en: "Grade 9" },
    10: { kz: "10-сынып", ru: "10 класс", en: "Grade 10" },
    11: { kz: "11-сынып", ru: "11 класс", en: "Grade 11" },
  };

  // Subject labels
  const subjectList: { id: string; label: Record<Language, string>; icon: string }[] = [
    {
      id: "math",
      label: { kz: "Алгебра / Мат.", ru: "Алгебра / Мат.", en: "Algebra / Math" },
      icon: "functions",
    },
    {
      id: "geometry",
      label: { kz: "Геометрия", ru: "Геометрия", en: "Geometry" },
      icon: "square_foot",
    },
    {
      id: "physics",
      label: { kz: "Физика", ru: "Физика", en: "Physics" },
      icon: "bolt",
    },
    {
      id: "all",
      label: { kz: "Барлық пәндер", ru: "Все предметы", en: "All Subjects" },
      icon: "category",
    },
  ];

  return (
    <div className="flex flex-col gap-3.5 pb-24 pt-2 px-4 max-w-md mx-auto">
      {/* Header Info & Solved Counter */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#004ac6]">
              <span className="material-symbols-outlined text-[18px]">
                {getSubjectIcon(currentQ?.subject?.[language] || "")}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#004ac6] uppercase tracking-wider">
                {currentQ?.subject?.[language] || "Математика"} •{" "}
                {currentQ?.grade?.[language] || `${selectedGrade} класс`}
              </span>
              <h2 className="text-xl font-extrabold text-[#131b2e] tracking-tight">
                {t.headerTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#eaedff] px-2.5 py-1 rounded-xl text-xs font-bold text-[#004ac6]">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>
              {solvedCount}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* Grade Selector Strip (Highlighted 9th grade) */}
        <div className="rounded-2xl bg-white p-2.5 border border-[#c3c6d7]/40 shadow-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">
              {language === "kz" ? "Сыныпты таңдау" : language === "en" ? "Select Grade" : "Выбор класса"}
            </span>
            <span className="text-[10px] font-extrabold text-[#004ac6] bg-[#eaedff] px-2 py-0.5 rounded-full">
              {gradeLabels[selectedGrade][language]}
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {[7, 8, 9, 10, 11].map((gr) => {
              const isGradeActive = selectedGrade === gr;
              return (
                <button
                  key={gr}
                  onClick={() => {
                    setSelectedGrade(gr);
                    setShowHint(false);
                    setShowStepModal(false);
                    // Generate a new matching task right away for this grade without duplicates
                    const newQ = generateUniqueQuestion(selectedSubject, gr, questionsList);
                    setQuestionsList((prev) => [...prev, newQ]);
                    setCurrentIndex(questionsList.length);
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center ${
                    isGradeActive
                      ? "bg-[#004ac6] text-white shadow-xs scale-102"
                      : "bg-[#f2f3ff] text-[#434655] hover:bg-[#eaedff]"
                  }`}
                >
                  {gr} {language === "kz" ? "сын." : language === "en" ? "gr." : "кл."}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {subjectList.map((subj) => {
            const isSubjActive = selectedSubject === subj.id;
            return (
              <button
                key={subj.id}
                onClick={() => {
                  setSelectedSubject(subj.id);
                  setShowHint(false);
                  setShowStepModal(false);
                  const newQ = generateUniqueQuestion(subj.id, selectedGrade, questionsList);
                  setQuestionsList((prev) => [...prev, newQ]);
                  setCurrentIndex(questionsList.length);
                }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isSubjActive
                    ? "bg-[#004ac6] border-[#004ac6] text-white shadow-xs"
                    : "bg-white border-[#c3c6d7]/40 text-[#434655] hover:bg-[#f2f3ff]"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{subj.icon}</span>
                <span>{subj.label[language]}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Task Generator Action Buttons (Never Repeating Tasks!) */}
        <div className="grid grid-cols-2 gap-2 mt-0.5">
          <button
            onClick={handleGenerateRandom}
            className="p-2.5 rounded-xl bg-linear-to-r from-[#004ac6] to-[#2563eb] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:opacity-95 transition-all cursor-pointer active:scale-98"
          >
            <span className="material-symbols-outlined text-[17px]">casino</span>
            <span>
              {language === "kz"
                ? "🎲 Кездейсоқ есеп"
                : language === "en"
                ? "🎲 New Random Task"
                : "🎲 Случайная задача"}
            </span>
          </button>

          <button
            onClick={handleGenerateWithAI}
            disabled={isAiGenerating}
            className="p-2.5 rounded-xl bg-white border-2 border-[#004ac6] text-[#004ac6] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#eaedff] transition-all cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <span
              className={`material-symbols-outlined text-[17px] ${
                isAiGenerating ? "animate-spin" : ""
              }`}
            >
              {isAiGenerating ? "refresh" : "auto_awesome"}
            </span>
            <span>
              {isAiGenerating
                ? language === "kz"
                  ? "Құрастыруда..."
                  : language === "en"
                  ? "Generating..."
                  : "Генерация..."
                : language === "kz"
                ? "🤖 ИИ Генератор"
                : language === "en"
                ? "🤖 AI Generator"
                : "🤖 ИИ Генератор"}
            </span>
          </button>
        </div>

        {/* Question Selector List (Dynamic length) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {questionsList.map((q, idx) => {
            const qState = answersState[q.id];
            const isActive = idx === currentIndex;
            let pillClass = "bg-white border-[#c3c6d7]/40 text-[#434655]";

            if (isActive) {
              pillClass =
                "bg-[#004ac6] border-[#004ac6] text-white font-extrabold ring-2 ring-[#004ac6]/30 shadow-xs";
            } else if (qState?.isConfirmed) {
              if (qState.isCorrect) {
                pillClass = "bg-emerald-50 border-emerald-400 text-emerald-700 font-bold";
              } else {
                pillClass = "bg-red-50 border-red-300 text-red-600 font-bold";
              }
            }

            return (
              <button
                key={q.id}
                onClick={() => handleSelectQuestionIndex(idx)}
                className={`flex-shrink-0 size-8 rounded-xl border text-xs flex items-center justify-center transition-all cursor-pointer ${pillClass}`}
                title={`${q.subject[language]}: ${q.topic[language]}`}
              >
                {qState?.isConfirmed && qState.isCorrect ? "✓" : idx + 1}
              </button>
            );
          })}

          {/* Append task button at the end of strip */}
          <button
            onClick={handleGenerateRandom}
            className="flex-shrink-0 size-8 rounded-xl border-2 border-dashed border-[#004ac6]/40 text-[#004ac6] hover:bg-[#eaedff] flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
            title={language === "kz" ? "Жаңа есеп қосу" : "Добавить задачу"}
          >
            +
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#434655]">
            <span>
              {language === "kz"
                ? `${currentIndex + 1} / ${totalQuestions} сұрақ`
                : language === "en"
                ? `Question ${currentIndex + 1} of ${totalQuestions}`
                : `Вопрос ${currentIndex + 1} из ${totalQuestions}`}
            </span>
            <span className="text-[#004ac6] font-extrabold">
              {Math.round(((currentIndex + 1) / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#e2e7ff] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#2563eb] h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Dynamic Topic Card */}
        <div className="rounded-xl bg-white p-2.5 border border-[#c3c6d7]/30 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#131b2e]">
              {currentQ.topic[language] || "Практика"}
            </span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-[#dbe1ff] text-[#004ac6] rounded">
              {currentQ.grade[language]}
            </span>
          </div>
          <p className="text-[11px] text-[#737686] leading-snug">
            {currentQ.subtopic[language] || t.adaptiveDesc}
          </p>
        </div>
      </section>

      {/* Main Problem Card */}
      <section className="rounded-2xl bg-white border border-[#c3c6d7]/40 p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-[#737686]">
          <span className="font-bold text-[#131b2e]">{t.taskHeader}</span>
          <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
            +{currentQ.xpReward || 30} XP
          </span>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-[#131b2e] leading-relaxed">
          {currentQ.questionText[language]}
        </p>

        {/* Visual Formula / Equation Display Box */}
        {currentQ.formulaDisplay?.type === "expression" || currentQ.formulaDisplay?.expressionText ? (
          <div className="my-1 rounded-2xl bg-[#f2f3ff] p-4 border border-[#c3c6d7]/50 flex items-center justify-center text-center text-base sm:text-lg font-extrabold text-[#131b2e] tracking-wide select-all">
            <span>{currentQ.formulaDisplay.expressionText}</span>
          </div>
        ) : currentQ.formulaDisplay ? (
          <div className="my-1 rounded-2xl bg-[#f2f3ff] p-4 border border-[#c3c6d7]/50 flex items-center justify-center gap-4 text-base sm:text-lg font-extrabold text-[#131b2e]">
            {/* Left Fraction */}
            <div className="inline-flex flex-col items-center">
              <span className="pb-1 border-b-2 border-[#131b2e] text-center w-full px-2">
                {currentQ.formulaDisplay.numeratorLeft}
              </span>
              <span className="pt-1 text-center w-full px-2 text-xs sm:text-sm text-[#434655]">
                {currentQ.formulaDisplay.denominatorLeft}
              </span>
            </div>

            <span className="text-xl font-black text-[#004ac6]">
              {currentQ.formulaDisplay.operator || "="}
            </span>

            {/* Right Fraction */}
            <div className="inline-flex flex-col items-center">
              <span className="pb-1 border-b-2 border-[#131b2e] text-center w-full px-2">
                {currentQ.formulaDisplay.numeratorRight}
              </span>
              <span className="pt-1 text-center w-full px-2 text-xs sm:text-sm text-[#434655]">
                {currentQ.formulaDisplay.denominatorRight}
              </span>
            </div>
          </div>
        ) : null}

        {/* Options List */}
        <div className="flex flex-col gap-2 mt-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#737686]">
            {t.chooseAnswerHeader}
          </span>

          {currentQ.options.map((option) => {
            const isSelected = selectedOption === option.id;
            let btnStyle = "border-[#c3c6d7]/50 bg-white hover:border-[#004ac6]/40 text-[#131b2e]";

            if (isConfirmed) {
              if (option.isCorrect) {
                btnStyle =
                  "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20";
              } else if (isSelected) {
                btnStyle = "border-red-500 bg-red-50 text-red-800";
              } else {
                btnStyle = "border-[#c3c6d7]/30 bg-white opacity-50";
              }
            } else if (isSelected) {
              btnStyle =
                "border-[#004ac6] bg-[#eaedff] text-[#004ac6] ring-2 ring-[#004ac6]/20 font-bold";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={isConfirmed}
                className={`w-full p-3 rounded-xl border-2 text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-lg bg-[#eaedff] text-[#004ac6] font-extrabold text-xs">
                    {option.id}
                  </span>
                  <span>{option.text}</span>
                </div>

                {isConfirmed && option.isCorrect && (
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                    check_circle
                  </span>
                )}
                {isConfirmed && isSelected && !option.isCorrect && (
                  <span className="material-symbols-outlined text-red-600 text-[18px]">
                    cancel
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Alert After Confirmation */}
        {isConfirmed && (
          <div
            className={`p-3 rounded-xl text-xs font-bold ${
              isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}
          >
            {isCorrect ? t.correctAlert : t.wrongAlert}
          </div>
        )}

        {/* Collapsible AI Hint */}
        <div className="mt-1 flex flex-col gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center justify-between p-2 rounded-xl bg-[#f2f3ff] text-[#004ac6] text-xs font-bold hover:bg-[#eaedff] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              <span>{t.hintTitle}</span>
            </div>
            <span className="material-symbols-outlined text-[16px]">
              {showHint ? "expand_less" : "expand_more"}
            </span>
          </button>

          {showHint && (
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-[#735100] leading-relaxed">
              {currentQ.hint[language]}
            </div>
          )}
        </div>

        {/* Step-by-Step AI Helper Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStepModal(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#c3c6d7] text-[#004ac6] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#f2f3ff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>{t.stepByStepBtn}</span>
          </button>
          <button
            onClick={() => onNavigate("chat")}
            className="py-2 px-3 rounded-xl bg-white border border-[#c3c6d7] text-[#737686] hover:text-[#004ac6] text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">forum</span>
            <span>{t.aiHelpBtn}</span>
          </button>
        </div>
      </section>

      {/* Confirmation / Next Bottom Controls */}
      <div className="flex items-center gap-2 mt-1">
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="px-3.5 py-3 rounded-xl bg-white border border-[#c3c6d7] text-[#434655] hover:bg-[#f2f3ff] font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
        )}

        <div className="flex-1">
          {!isConfirmed ? (
            <button
              onClick={handleConfirm}
              disabled={!selectedOption}
              className="w-full py-3 rounded-xl bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-xs sm:text-sm shadow-md disabled:opacity-40 transition-all cursor-pointer"
            >
              {t.confirmBtn}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>
                {currentIndex === totalQuestions - 1
                  ? language === "kz"
                    ? "Келесі жаңа есеп ➔"
                    : language === "en"
                    ? "Next Random Task ➔"
                    : "Следующая случайная задача ➔"
                  : t.nextQuestionBtn}
              </span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>

      {/* Step-by-Step Solution Modal */}
      {showStepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl flex flex-col gap-3 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#c3c6d7]/30 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004ac6]">psychology</span>
                <h4 className="font-bold text-sm text-[#131b2e]">{t.modalTitle}</h4>
              </div>
              <button
                onClick={() => setShowStepModal(false)}
                className="text-[#737686] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 my-2">
              {currentQ.stepByStepSolution[language]?.map((step, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#f2f3ff] text-xs font-medium text-[#131b2e]"
                >
                  {step}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowStepModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#004ac6] text-white font-bold text-xs cursor-pointer"
            >
              {language === "kz" ? "Түсінікті!" : language === "en" ? "Got it!" : "Всё понятно!"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
